import path from "path";
import fs from "fs";
import dotenv from "dotenv";

// Load .env
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import mongoose from "mongoose";
import Media from "../src/models/media.model";
import Product from "../src/models/product.model";
import { uploadImageToCloudinary, isCloudinaryConfigured } from "../src/services/cloudinary.service";

async function migrate() {
  console.log("Connecting to MongoDB Atlas...");
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) throw new Error("MONGO_URI not found");

  await mongoose.connect(mongoUri);
  console.log("MongoDB connected!");

  if (!isCloudinaryConfigured()) {
    throw new Error("Cloudinary credentials missing in .env");
  }
  console.log("Cloudinary configured!");

  const localMedia = await Media.find({
    $or: [
      { storageProvider: "LOCAL" },
      { url: { $regex: "^(/uploads|http://localhost)" } },
    ],
  });

  console.log(`Found ${localMedia.length} local media files in database.`);

  const urlMap = new Map<string, string>(); // oldUrl -> newCloudinaryUrl

  let successCount = 0;
  for (const item of localMedia) {
    const filename = item.filename;
    const localFilePath = path.resolve(__dirname, "../uploads/gallery", filename);

    if (fs.existsSync(localFilePath)) {
      try {
        console.log(`Uploading ${filename} to Cloudinary...`);
        const result = await uploadImageToCloudinary(localFilePath, {
          folder: item.folder || "gallery",
        });

        const oldUrl = item.url;
        item.url = result.url;
        item.storageKey = result.publicId;
        item.storageProvider = "CLOUDINARY" as any;
        if (result.width) item.width = result.width;
        if (result.height) item.height = result.height;
        await item.save();

        urlMap.set(oldUrl, result.url);
        urlMap.set(`/uploads/gallery/${filename}`, result.url);
        urlMap.set(`http://localhost:5000/uploads/gallery/${filename}`, result.url);

        successCount++;
        console.log(`✓ Uploaded & updated: ${result.url}`);
      } catch (err: any) {
        console.error(`Failed to upload ${filename}:`, err?.message || err);
      }
    } else {
      console.warn(`File not found on disk: ${localFilePath}`);
    }
  }

  console.log(`Successfully migrated ${successCount} media files!`);

  // Now update products referencing local URLs
  console.log("Updating products with new Cloudinary URLs...");
  const products = await Product.find({});
  let updatedProducts = 0;

  for (const prod of products) {
    let modified = false;

    // Check featuredImage
    if (prod.featuredImage) {
      for (const [oldUrl, newUrl] of urlMap.entries()) {
        if (prod.featuredImage.includes(oldUrl) || prod.featuredImage.endsWith(oldUrl.split("/").pop()!)) {
          prod.featuredImage = newUrl;
          modified = true;
          break;
        }
      }
    }

    // Check mediaGallery
    if (Array.isArray(prod.mediaGallery)) {
      for (const item of prod.mediaGallery as any[]) {
        if (item && item.url) {
          for (const [oldUrl, newUrl] of urlMap.entries()) {
            if (item.url.includes(oldUrl) || item.url.endsWith(oldUrl.split("/").pop()!)) {
              item.url = newUrl;
              modified = true;
              break;
            }
          }
        }
      }
    }

    if (modified) {
      await prod.save();
      updatedProducts++;
    }
  }

  console.log(`Updated ${updatedProducts} products in database.`);
  console.log("Migration complete!");
  process.exit(0);
}

migrate().catch((err) => {
  console.error("Migration error:", err);
  process.exit(1);
});
