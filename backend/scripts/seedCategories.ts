import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import connectDatabase from "../src/config/database/database";
import "../src/models/user.model";
import "../src/models/media.model";
import Category from "../src/models/category.model";
import { createCategory } from "../src/services/category.service";


const envPath = [
  path.resolve(process.cwd(), ".env"),
  path.resolve(process.cwd(), "..", ".env"),
].find((filePath) => fs.existsSync(filePath));

dotenv.config(envPath ? { path: envPath } : {});

const defaultPharmaCategories = [
  {
    name: "Tablets",
    description: "Oral solid dosage forms including uncoated, film-coated, enteric-coated, and effervescent tablets.",
    sortOrder: 1,
    isFeatured: true,
  },
  {
    name: "Capsules",
    description: "Hard gelatin and soft gelatin capsules containing pellets, powder, or liquid formulations.",
    sortOrder: 2,
    isFeatured: true,
  },
  {
    name: "Syrups & Suspensions",
    description: "Oral liquid formulations, pediatric syrups, cough expectorants, and dry syrups for reconstitution.",
    sortOrder: 3,
    isFeatured: true,
  },
  {
    name: "Injectables",
    description: "Sterile liquid injections and lyophilized powders for intravenous and intramuscular administration.",
    sortOrder: 4,
    isFeatured: true,
  },
  {
    name: "Ointments & Creams",
    description: "Topical pharmaceutical preparations including antifungal, antibacterial creams, and pain relief gels.",
    sortOrder: 5,
    isFeatured: false,
  },
  {
    name: "Ayurvedic & Herbal",
    description: "Traditional herbal remedies, botanical healthcare extracts, and natural immunity boosters.",
    sortOrder: 6,
    isFeatured: true,
  },
];

const seedCategories = async (): Promise<void> => {
  try {
    await connectDatabase();
    console.log("Seeding Pharmaceutical Categories...");

    for (const cat of defaultPharmaCategories) {
      const existing = await Category.findOne({ name: cat.name, isDeleted: false });
      if (existing) {
        console.log(`[EXISTS] ${existing.name} (Slug: ${existing.slug})`);
      } else {
        const created = await createCategory(cat);
        console.log(`[CREATED] ${created?.name} (Slug: ${created?.slug})`);
      }
    }

    console.log("All Pharmaceutical Categories seeded successfully!");
    process.exit(0);
  } catch (error: unknown) {
    console.error("Category seeding failed:", error);
    process.exit(1);
  }
};

seedCategories();
