const path = require("path");
const fs = require("fs");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const mongoose = require("mongoose");

const createSlug = (text) => {
  if (!text || typeof text !== "string") return "";
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
};

async function main() {
  try {
    console.log("=== STARTING IMPORT OF 130 PRODUCTS ===");
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) throw new Error("MONGO_URI not found in .env");

    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB Atlas");

    const db = mongoose.connection.db;
    const usersCol = db.collection("users");
    const categoriesCol = db.collection("categories");
    const subCategoriesCol = db.collection("subcategories");
    const dosageFormsCol = db.collection("dosageforms");
    const productsCol = db.collection("products");

    // 1. Identify Super Admin user
    const superAdmin = await usersCol.findOne({
      email: { $regex: /^info@zealpharmacure\.com$/i },
    });
    if (superAdmin) {
      console.log(`[AUTH] Super Admin found: ${superAdmin.name} (${superAdmin.email}) - ID: ${superAdmin._id}`);
    } else {
      console.warn("[AUTH] Super Admin info@zealpharmacure.com not found!");
    }
    const adminId = superAdmin ? superAdmin._id : null;

    // 2. Load JSON data
    const jsonPath = path.resolve(__dirname, "130_products.json");
    if (!fs.existsSync(jsonPath)) {
      throw new Error(`Data file not found at: ${jsonPath}`);
    }
    const data = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
    console.log(`[DATA] Loaded: ${data.categories.length} categories, ${data.subcategories.length} subcategories, ${data.products.length} products`);

    // 3. Ensure Dosage Forms exist
    const distinctDosageForms = ["Capsule", "Cream", "Gel", "Lotion", "Sachet", "Tablet"];
    console.log("\n--- Checking Dosage Forms ---");
    for (const dfName of distinctDosageForms) {
      const dfSlug = createSlug(dfName);
      const existing = await dosageFormsCol.findOne({
        $or: [{ slug: dfSlug }, { name: { $regex: new RegExp(`^${dfName}$`, "i") } }],
      });
      if (!existing) {
        await dosageFormsCol.insertOne({
          name: dfName,
          slug: dfSlug,
          description: `${dfName} formulation`,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        console.log(`[DOSAGE FORM CREATED] ${dfName}`);
      }
    }

    // 4. Ensure Categories exist
    console.log("\n--- Syncing Categories ---");
    const categoryMapByName = new Map();
    const categoryMapBySlug = new Map();

    for (const cat of data.categories) {
      let existingCat = await categoriesCol.findOne({
        $or: [
          { slug: cat.slug },
          { name: { $regex: new RegExp(`^${cat.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") } },
        ],
      });

      if (!existingCat) {
        const insertRes = await categoriesCol.insertOne({
          name: cat.name,
          slug: cat.slug,
          shortDescription: "",
          description: "",
          image: null,
          imageId: null,
          bannerImage: null,
          bannerImageId: null,
          icon: null,
          sortOrder: 0,
          isFeatured: false,
          showOnHome: true,
          showInMenu: true,
          seo: {
            metaTitle: `${cat.name} - Zeal Pharmacure`,
            metaDescription: `${cat.name} pharmaceutical products range by Zeal Pharmacure`,
            keywords: [],
            canonicalUrl: "",
          },
          isActive: true,
          isDeleted: false,
          deletedAt: null,
          createdBy: adminId,
          updatedBy: adminId,
          deletedBy: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        existingCat = await categoriesCol.findOne({ _id: insertRes.insertedId });
        console.log(`[CATEGORY CREATED] ${cat.name} (${cat.slug})`);
      } else {
        if (existingCat.isDeleted) {
          await categoriesCol.updateOne(
            { _id: existingCat._id },
            { $set: { isDeleted: false, deletedAt: null, isActive: true, updatedAt: new Date() } }
          );
          existingCat = await categoriesCol.findOne({ _id: existingCat._id });
          console.log(`[CATEGORY RESTORED] ${cat.name}`);
        }
      }

      categoryMapByName.set(cat.name.toLowerCase().trim(), existingCat);
      categoryMapBySlug.set(cat.slug.toLowerCase().trim(), existingCat);
    }

    // 5. Ensure Subcategories exist
    console.log("\n--- Syncing Subcategories ---");
    const subCategoryMap = new Map();

    for (const sub of data.subcategories) {
      const parentCat =
        categoryMapBySlug.get(sub.categorySlug.toLowerCase().trim()) ||
        categoryMapByName.get(sub.categoryName.toLowerCase().trim());

      if (!parentCat) {
        console.warn(`[WARNING] Parent category not found for subcategory: ${sub.name}`);
        continue;
      }

      let existingSub = await subCategoriesCol.findOne({
        category: parentCat._id,
        $or: [
          { slug: sub.slug },
          { name: { $regex: new RegExp(`^${sub.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") } },
        ],
      });

      if (!existingSub) {
        const insertSubRes = await subCategoriesCol.insertOne({
          name: sub.name,
          slug: sub.slug,
          category: parentCat._id,
          shortDescription: "",
          description: "",
          image: null,
          imageId: null,
          bannerImage: null,
          bannerImageId: null,
          sortOrder: 0,
          isFeatured: false,
          showOnHome: false,
          showInMenu: true,
          seo: {
            metaTitle: `${sub.name} - Zeal Pharmacure`,
            metaDescription: `${sub.name} division by Zeal Pharmacure`,
            keywords: [],
            canonicalUrl: "",
          },
          isActive: true,
          isDeleted: false,
          deletedAt: null,
          createdBy: adminId,
          updatedBy: adminId,
          deletedBy: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        existingSub = await subCategoriesCol.findOne({ _id: insertSubRes.insertedId });
        console.log(`[SUBCATEGORY CREATED] ${sub.name} -> under ${parentCat.name}`);
      } else {
        if (existingSub.isDeleted) {
          await subCategoriesCol.updateOne(
            { _id: existingSub._id },
            { $set: { isDeleted: false, deletedAt: null, isActive: true, updatedAt: new Date() } }
          );
          existingSub = await subCategoriesCol.findOne({ _id: existingSub._id });
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

      // Check existing product by exact or case-insensitive name
      const existingProduct = await productsCol.findOne({
        name: { $regex: new RegExp(`^${p.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") },
      });

      if (existingProduct) {
        await productsCol.updateOne(
          { _id: existingProduct._id },
          {
            $set: {
              composition: p.composition,
              mrp: p.mrp,
              category: catDoc._id,
              subCategory: subCatDoc ? subCatDoc._id : null,
              subCategoryName: subCatDoc ? subCatDoc.name : p.subcategory,
              dosageForm: p.dosageForm,
              packaging: p.packaging,
              status: "PUBLISHED",
              isActive: true,
              isDeleted: false,
              deletedAt: null,
              updatedBy: adminId,
              updatedAt: new Date(),
            },
          }
        );
        updatedCount++;
        console.log(`[${index + 1}/130 UPDATED] ${p.name} | Cat: ${catDoc.name} | Sub: ${p.subcategory} | MRP: ${p.mrp} | Form: ${p.dosageForm}`);
      } else {
        // Ensure slug uniqueness
        while (await productsCol.findOne({ slug: uniqueSlug })) {
          uniqueSlug = `${baseSlug}-${counter}`;
          counter++;
        }

        await productsCol.insertOne({
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
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        createdCount++;
        console.log(`[${index + 1}/130 CREATED] ${p.name} | Cat: ${catDoc.name} | Sub: ${p.subcategory} | MRP: ${p.mrp} | Form: ${p.dosageForm}`);
      }
    }

    const totalActiveProducts = await productsCol.countDocuments({ isDeleted: false });
    const totalActiveCategories = await categoriesCol.countDocuments({ isDeleted: false });
    const totalActiveSubcategories = await subCategoriesCol.countDocuments({ isDeleted: false });

    console.log("\n==========================================");
    console.log("       IMPORT COMPLETED SUCCESSFULLY!     ");
    console.log("==========================================");
    console.log(`- Categories in DB: ${totalActiveCategories}`);
    console.log(`- Subcategories in DB: ${totalActiveSubcategories}`);
    console.log(`- Products Created: ${createdCount}`);
    console.log(`- Products Updated: ${updatedCount}`);
    console.log(`- Total Active Products in DB: ${totalActiveProducts}`);
    console.log("==========================================\n");

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("FATAL ERROR in import script:", err);
    process.exit(1);
  }
}

main();
