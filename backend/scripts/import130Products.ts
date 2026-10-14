import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDatabase from "../src/config/database/database";
import User from "../src/models/user.model";
import Category from "../src/models/category.model";
import SubCategory from "../src/models/subCategory.model";
import DosageForm from "../src/models/dosageForm.model";
import Product from "../src/models/product.model";
import { createSlug } from "../src/utils/slug";

const envPath = [
  path.resolve(process.cwd(), ".env"),
  path.resolve(process.cwd(), "..", ".env"),
].find((filePath) => fs.existsSync(filePath));

dotenv.config(envPath ? { path: envPath } : {});

interface IJsonData {
  categories: Array<{ name: string; slug: string }>;
  subcategories: Array<{ categoryName: string; categorySlug: string; name: string; slug: string }>;
  products: Array<{
    srNo: number;
    name: string;
    composition: string;
    mrp: number;
    category: string;
    subcategory: string;
    dosageForm: string;
    packaging: string;
    categorySlug: string;
    subcategorySlug: string;
  }>;
}

const import130Products = async (): Promise<void> => {
  try {
    console.log("=== STARTING IMPORT OF 130 PRODUCTS ===");
    await connectDatabase();

    // 1. Identify Super Admin user
    const superAdmin = await User.findOne({
      email: { $regex: /^info@zealpharmacure\.com$/i },
    });
    if (superAdmin) {
      console.log(`[AUTH] Super Admin found: ${superAdmin.name} (${superAdmin.email}) - ID: ${superAdmin._id}`);
    } else {
      console.warn("[AUTH] Super Admin info@zealpharmacure.com not found, continuing without createdBy override");
    }
    const adminId = superAdmin ? superAdmin._id : null;

    // 2. Load JSON data
    const jsonPath = path.resolve(__dirname, "130_products.json");
    if (!fs.existsSync(jsonPath)) {
      throw new Error(`Data file not found at: ${jsonPath}`);
    }
    const rawData = fs.readFileSync(jsonPath, "utf-8");
    const data: IJsonData = JSON.parse(rawData);

    console.log(`[DATA] Loaded: ${data.categories.length} categories, ${data.subcategories.length} subcategories, ${data.products.length} products`);

    // 3. Ensure Dosage Forms exist
    const distinctDosageForms = ["Capsule", "Cream", "Gel", "Lotion", "Sachet", "Tablet"];
    console.log("\n--- Checking Dosage Forms ---");
    for (const dfName of distinctDosageForms) {
      const dfSlug = createSlug(dfName);
      const existing = await (DosageForm as any).findOne({
        $or: [{ slug: dfSlug }, { name: { $regex: new RegExp(`^${dfName}$`, "i") } }],
      });
      if (!existing) {
        await DosageForm.create({
          name: dfName,
          slug: dfSlug,
          description: `${dfName} formulation`,
          isActive: true,
        });
        console.log(`[DOSAGE FORM CREATED] ${dfName}`);
      }
    }

    // 4. Ensure Categories exist
    console.log("\n--- Syncing Categories ---");
    const categoryMapByName = new Map<string, any>();
    const categoryMapBySlug = new Map<string, any>();

    for (const cat of data.categories) {
      let existingCat: any = await Category.findOne({
        $or: [
          { slug: cat.slug },
          { name: { $regex: new RegExp(`^${cat.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") } },
        ],
      } as any);

      if (!existingCat) {
        existingCat = await Category.create({
          name: cat.name,
          slug: cat.slug,
          isActive: true,
          showInMenu: true,
          showOnHome: true,
          createdBy: adminId,
        });
        console.log(`[CATEGORY CREATED] ${cat.name} (${cat.slug})`);
      } else {
        if (existingCat.isDeleted) {
          existingCat.isDeleted = false;
          existingCat.deletedAt = null;
          await existingCat.save();
          console.log(`[CATEGORY RESTORED] ${cat.name}`);
        }
      }

      categoryMapByName.set(cat.name.toLowerCase().trim(), existingCat);
      categoryMapBySlug.set(cat.slug.toLowerCase().trim(), existingCat);
    }

    // 5. Ensure Subcategories exist
    console.log("\n--- Syncing Subcategories ---");
    const subCategoryMap = new Map<string, any>();

    for (const sub of data.subcategories) {
      const parentCat =
        categoryMapBySlug.get(sub.categorySlug.toLowerCase().trim()) ||
        categoryMapByName.get(sub.categoryName.toLowerCase().trim());

      if (!parentCat) {
        console.warn(`[WARNING] Parent category not found for subcategory: ${sub.name}`);
        continue;
      }

      let existingSub: any = await SubCategory.findOne({
        category: parentCat._id,
        $or: [
          { slug: sub.slug },
          { name: { $regex: new RegExp(`^${sub.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") } },
        ],
      } as any);

      if (!existingSub) {
        existingSub = await SubCategory.create({
          name: sub.name,
          slug: sub.slug,
          category: parentCat._id,
          isActive: true,
          showInMenu: true,
          createdBy: adminId,
        });
        console.log(`[SUBCATEGORY CREATED] ${sub.name} -> under ${parentCat.name}`);
      } else {
        if (existingSub.isDeleted) {
          existingSub.isDeleted = false;
          existingSub.deletedAt = null;
          await existingSub.save();
        }
      }

      const key = `${String(parentCat._id)}_${sub.name.toLowerCase().trim()}`;
      const slugKey = `${String(parentCat._id)}_${sub.slug.toLowerCase().trim()}`;
      subCategoryMap.set(key, existingSub);
      subCategoryMap.set(slugKey, existingSub);
    }

    // 6. Import 130 Products
    console.log("\n--- Importing Products ---");
    let createdCount = 0;
    let updatedCount = 0;

    for (const [index, p] of data.products.entries()) {
      const catDoc =
        categoryMapBySlug.get(p.categorySlug.toLowerCase().trim()) ||
        categoryMapByName.get(p.category.toLowerCase().trim());

      if (!catDoc) {
        console.error(`[ERROR] Category not found for product ${p.name}: ${p.category}`);
        continue;
      }

      const subKey = `${String(catDoc._id)}_${p.subcategory.toLowerCase().trim()}`;
      const subSlugKey = `${String(catDoc._id)}_${p.subcategorySlug.toLowerCase().trim()}`;
      const subCatDoc = subCategoryMap.get(subKey) || subCategoryMap.get(subSlugKey);

      const baseSlug = createSlug(p.name);
      let uniqueSlug = baseSlug;
      let counter = 1;

      // Check existing product by name
      const existingProduct = await Product.findOne({
        name: { $regex: new RegExp(`^${p.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") },
      } as any);

      if (existingProduct) {
        existingProduct.composition = p.composition;
        existingProduct.mrp = p.mrp;
        existingProduct.category = catDoc._id;
        existingProduct.subCategory = subCatDoc ? subCatDoc._id : null;
        existingProduct.subCategoryName = subCatDoc ? subCatDoc.name : p.subcategory;
        existingProduct.dosageForm = p.dosageForm;
        existingProduct.packaging = p.packaging;
        existingProduct.status = "PUBLISHED";
        existingProduct.isActive = true;
        existingProduct.isDeleted = false;
        existingProduct.deletedAt = null;
        existingProduct.updatedBy = adminId;

        await existingProduct.save();
        updatedCount++;
        console.log(`[${index + 1}/130 UPDATED] ${p.name} | Cat: ${catDoc.name} | Sub: ${p.subcategory} | MRP: ${p.mrp} | Form: ${p.dosageForm}`);
      } else {
        // Ensure slug uniqueness
        while (await Product.findOne({ slug: uniqueSlug } as any)) {
          uniqueSlug = `${baseSlug}-${counter}`;
          counter++;
        }

        await Product.create({
          name: p.name,
          slug: uniqueSlug,
          brandName: "ZEAL",
          genericName: "",
          manufacturer: "Zeal Pharmacure",
          composition: p.composition,
          strength: "",
          dosageForm: p.dosageForm,
          packaging: p.packaging,
          packSize: { value: null, unit: "" },
          category: catDoc._id,
          subCategory: subCatDoc ? subCatDoc._id : null,
          subCategoryName: subCatDoc ? subCatDoc.name : p.subcategory,
          indications: [],
          indicationTags: [],
          therapeuticClass: "",
          tags: [],
          searchKeywords: [],
          shortDescription: "",
          description: "",
          sideEffects: "",
          howToUse: "",
          precautions: "",
          contraindications: "",
          warnings: "",
          storage: "Store in a cool, dry place away from direct sunlight.",
          pregnancyInfo: "",
          lactationInfo: "",
          prescriptionType: "Rx",
          regulatoryInfo: "",
          licenseNumber: "",
          countryOfOrigin: "India",
          mrp: p.mrp,
          availabilityStatus: "AVAILABLE",
          featuredImage: null,
          featuredImageId: null,
          mediaGallery: [],
          brochureUrl: null,
          brochureName: "",
          averageRating: 5.0,
          totalReviews: 0,
          isFeatured: false,
          featuredOrder: 0,
          isNewLaunch: false,
          launchDate: null,
          allowEnquiry: true,
          seo: {
            metaTitle: `${p.name} - Zeal Pharmacure`,
            metaDescription: `${p.name} (${p.composition}) supplied by Zeal Pharmacure.`,
            keywords: [],
            canonicalUrl: "",
            ogTitle: "",
            ogDescription: "",
            ogImage: null,
          },
          status: "PUBLISHED",
          publishedAt: new Date(),
          isActive: true,
          isDeleted: false,
          deletedAt: null,
          createdBy: adminId,
          updatedBy: adminId,
          deletedBy: null,
        });

        createdCount++;
        console.log(`[${index + 1}/130 CREATED] ${p.name} | Cat: ${catDoc.name} | Sub: ${p.subcategory} | MRP: ${p.mrp} | Form: ${p.dosageForm}`);
      }
    }

    console.log("\n==========================================");
    console.log("       IMPORT COMPLETED SUCCESSFULLY      ");
    console.log("==========================================");
    console.log(`- Categories processed: ${data.categories.length}`);
    console.log(`- Subcategories processed: ${data.subcategories.length}`);
    console.log(`- Products Created: ${createdCount}`);
    console.log(`- Products Updated: ${updatedCount}`);
    console.log(`- Total Products in Catalog: ${await Product.countDocuments({ isDeleted: false })}`);
    console.log("==========================================\n");

    process.exit(0);
  } catch (error) {
    console.error("FATAL: Product import failed:", error);
    process.exit(1);
  }
};

import130Products();
