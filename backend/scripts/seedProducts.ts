import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import connectDatabase from "../src/config/database/database";
import "../src/models/user.model";
import "../src/models/media.model";
import Category from "../src/models/category.model";
import Product from "../src/models/product.model";
import Review from "../src/models/review.model";
import { createProduct, updateProduct } from "../src/services/product.service";
import { recalculateProductRating } from "../src/services/review.service";

const envPath = [
  path.resolve(process.cwd(), ".env"),
  path.resolve(process.cwd(), "..", ".env"),
].find((filePath) => fs.existsSync(filePath));

dotenv.config(envPath ? { path: envPath } : {});

interface ISeedProductItem {
  categorySlug: string;
  name: string;
  genericName: string;
  composition: string;
  dosageForm: string;
  packaging: string;
  subCategory: string;
  indications: string[];
  sideEffects: string;
  howToUse: string;
  precautions: string;
  prescriptionType: "Rx" | "OTC" | "Schedule H" | "Schedule H1" | "General";
  isFeatured: boolean;
  isNewLaunch: boolean;
}

const samplePharmaProducts: ISeedProductItem[] = [
  {
    categorySlug: "tablets",
    name: "CAL-ZEAL 500",
    genericName: "Calcium Carbonate with Vitamin D3 Tablets IP",
    composition:
      "Each film-coated tablet contains: Calcium Carbonate IP 1250mg equivalent to elemental Calcium 500mg, Vitamin D3 IP 250 IU",
    dosageForm: "Tablet",
    packaging: "10x15 Blister Pack",
    subCategory: "Ortho",
    indications: [
      "Osteoarthritis",
      "Calcium Deficiency",
      "Joint Pain",
      "Bone Fractures",
      "Post-Menopausal Osteoporosis",
    ],
    sideEffects: "Mild constipation, nausea, abdominal discomfort in rare cases.",
    howToUse: "1 tablet daily after meal with water or as directed by the Physician.",
    precautions:
      "Store below 25°C in a dry place. Protect from direct sunlight. Keep out of reach of children.",
    prescriptionType: "OTC",
    isFeatured: true,
    isNewLaunch: false,
  },
  {
    categorySlug: "ointments-creams",
    name: "ZEAL-ORTHO GEL",
    genericName: "Diclofenac Diethylamine, Virgin Linseed Oil, Methyl Salicylate and Menthol Gel",
    composition:
      "Diclofenac Diethylamine BP 1.16% w/w eq. to Diclofenac Sodium 1.0% w/w, Virgin Linseed Oil BP 3.0% w/w, Methyl Salicylate IP 10.0% w/w, Menthol IP 5.0% w/w, Benzyl Alcohol IP 1.0% w/w",
    dosageForm: "Gel",
    packaging: "30gm Lami Tube with Mono Carton",
    subCategory: "Ortho",
    indications: [
      "Joint Pain",
      "Back Pain",
      "Cervical Spondylosis",
      "Osteoarthritis",
      "Muscle Sprains",
    ],
    sideEffects: "Local skin irritation, tingling sensation, mild redness.",
    howToUse: "Apply 3 to 4 times a day gently on the affected area. Do not rub vigorously.",
    precautions: "For external use only. Do not apply on broken skin or open wounds.",
    prescriptionType: "OTC",
    isFeatured: true,
    isNewLaunch: true,
  },
  {
    categorySlug: "ayurvedic-herbal",
    name: "ZEAL-ORTHO OIL",
    genericName: "Ayurvedic Pain Relief Oil with Gandhapura, Mahanarayan & Nilgiri Oil",
    composition:
      "Each 100ml contains: Gandhapura Tel 20%, Mahanarayan Tel 30%, Nilgiri Tel 10%, Kapur 5%, Pudina Satva 5%, Til Tel base q.s.",
    dosageForm: "Oil",
    packaging: "100ml PET Bottle with Carton & Flip-top Cap",
    subCategory: "Ortho",
    indications: [
      "Joint Pain",
      "Rheumatoid Arthritis",
      "Knee Pain",
      "Back Pain",
      "Morning Stiffness",
    ],
    sideEffects: "Ayurvedic formulation with no known adverse side effects.",
    howToUse: "Gently massage 5-10ml oil onto the affected joints twice daily followed by warm fomentation.",
    precautions: "For external application only. Do not apply over cuts or wounds.",
    prescriptionType: "General",
    isFeatured: true,
    isNewLaunch: true,
  },
  {
    categorySlug: "tablets",
    name: "ZEAL-MOX CV 625",
    genericName: "Amoxicillin and Potassium Clavulanate Tablets IP",
    composition:
      "Each film coated tablet contains: Amoxicillin Trihydrate IP equivalent to Amoxicillin 500mg, Potassium Clavulanate Diluted IP equivalent to Clavulanic Acid 125mg",
    dosageForm: "Tablet",
    packaging: "10x1x10 Alu-Alu Strip",
    subCategory: "Antibiotics",
    indications: [
      "Respiratory Tract Infection",
      "Sinusitis",
      "Urinary Tract Infection",
      "Dental Infection",
    ],
    sideEffects: "Diarrhea, mild nausea, stomach upset, skin rash. Discontinue if allergic reaction occurs.",
    howToUse: "1 tablet twice daily after meals for 5-7 days or as prescribed by the Registered Medical Practitioner.",
    precautions:
      "Schedule H1 Prescription Drug - Warning: To be sold by retail on the prescription of a Registered Medical Practitioner only.",
    prescriptionType: "Schedule H1",
    isFeatured: true,
    isNewLaunch: true,
  },
  {
    categorySlug: "capsules",
    name: "ZEAL-DSR",
    genericName: "Rabeprazole Sodium (EC) and Domperidone (SR) Capsules",
    composition:
      "Each hard gelatin capsule contains: Rabeprazole Sodium IP 20mg (as enteric coated pellets), Domperidone IP 30mg (as sustained release pellets)",
    dosageForm: "Capsule",
    packaging: "10x10 Alu-Alu Strip",
    subCategory: "Gastro",
    indications: [
      "GERD / Acid Reflux",
      "Peptic Ulcer",
      "Heartburn",
      "Nausea & Vomiting",
      "Hyperacidity",
    ],
    sideEffects: "Dry mouth, headache, mild abdominal pain, dizziness.",
    howToUse: "1 capsule once daily in the morning before breakfast with plain water.",
    precautions: "Do not chew or crush the capsule pellets. Swallow whole.",
    prescriptionType: "Rx",
    isFeatured: true,
    isNewLaunch: false,
  },
  {
    categorySlug: "syrups-suspensions",
    name: "ZEAL-COFF LS",
    genericName: "Levosalbutamol Sulphate, Ambroxol Hydrochloride and Guaiphenesin Syrup",
    composition:
      "Each 5ml contains: Levosalbutamol Sulphate IP eq. to Levosalbutamol 1mg, Ambroxol Hydrochloride IP 30mg, Guaiphenesin IP 50mg in a palatable syrup base q.s.",
    dosageForm: "Syrup",
    packaging: "100ml PET Bottle with Measuring Cap",
    subCategory: "Pediatric",
    indications: [
      "Pediatric Cough & Cold",
      "Bronchospasm",
      "Asthmatic Cough",
      "Chest Congestion",
    ],
    sideEffects: "Tremor, palpitations, nausea, throat irritation.",
    howToUse: "Adults: 10ml thrice daily. Children (6-12 years): 5ml twice or thrice daily or as directed by Physician.",
    precautions: "Shake well before use. Keep bottle tightly closed.",
    prescriptionType: "Rx",
    isFeatured: false,
    isNewLaunch: true,
  },
  {
    categorySlug: "ointments-creams",
    name: "ZEAL-CLOB GM",
    genericName: "Clobetasol Propionate, Neomycin Sulphate and Miconazole Nitrate Cream",
    composition:
      "Clobetasol Propionate IP 0.05% w/w, Neomycin Sulphate IP 0.5% w/w, Miconazole Nitrate IP 2.0% w/w, Chlorocresol IP 0.1% w/w in non-greasy cream base",
    dosageForm: "Ointment",
    packaging: "15gm Lami Tube",
    subCategory: "Derma",
    indications: [
      "Fungal Infections",
      "Eczema",
      "Psoriasis",
      "Ringworm",
      "Skin Allergies",
    ],
    sideEffects: "Skin thinning on excessive use, burning sensation, dryness.",
    howToUse: "Apply a thin film to the cleansed affected skin area twice daily.",
    precautions: "Schedule H Prescription Drug. External use only. Avoid contact with eyes and mucous membranes.",
    prescriptionType: "Schedule H",
    isFeatured: false,
    isNewLaunch: false,
  },
  {
    categorySlug: "injectables",
    name: "ZEAL-CEF 1GM",
    genericName: "Ceftriaxone Injection IP 1000mg",
    composition:
      "Each vial contains: Sterile Ceftriaxone Sodium IP equivalent to anhydrous Ceftriaxone 1000mg with Sterile Water for Injection IP 10ml",
    dosageForm: "Injection",
    packaging: "10ml Vial with WFI in Mono Carton",
    subCategory: "Antibiotics",
    indications: [
      "Severe Bacterial Infections",
      "Septicemia",
      "Surgical Prophylaxis",
      "Meningitis",
    ],
    sideEffects: "Injection site pain, mild diarrhea, temporary rash.",
    howToUse: "For IV / IM use only. Administration strictly under medical supervision.",
    precautions: "Schedule H1 Prescription Drug. Perform hypersensitivity skin test prior to full administration.",
    prescriptionType: "Schedule H1",
    isFeatured: false,
    isNewLaunch: false,
  },
  {
    categorySlug: "ayurvedic-herbal",
    name: "ZEAL-LIV DS SYRUP",
    genericName: "Double Strength Ayurvedic Liver Corrective Tonic",
    composition:
      "Each 10ml contains herbal extracts: Bhringraj 400mg, Kalmegh 200mg, Punarnava 300mg, Kasni 250mg, Giloy 150mg, Kutki 100mg in palatable flavored syrup base",
    dosageForm: "Syrup",
    packaging: "200ml Amber PET Bottle with Carton",
    subCategory: "Gastro",
    indications: [
      "Fatty Liver",
      "Indigestion",
      "Loss of Appetite",
      "Sluggish Liver",
      "Liver Care",
    ],
    sideEffects: "Ayurvedic herbal formulation with no known adverse side effects.",
    howToUse: "Adults: 2 teaspoonfuls (10ml) twice a day after meals. Children: 1 teaspoonful (5ml) twice a day.",
    precautions: "Ayurvedic Proprietary Medicine. Store in a cool, dry place away from direct light.",
    prescriptionType: "General",
    isFeatured: true,
    isNewLaunch: true,
  },
];

const sampleDoctorReviews = [
  {
    productName: "CAL-ZEAL 500",
    reviewerName: "Dr. Arvind Mehta",
    reviewerRole: "Consultant Orthopedic Surgeon (MS Ortho)",
    rating: 5,
    title: "Excellent formulation & patient compliance",
    comment:
      "I have been prescribing CAL-ZEAL 500 to my post-menopausal and fracture recovery patients. The blister packing is high quality and gastrointestinal tolerance is superior.",
    city: "Jaipur",
    state: "Rajasthan",
  },
  {
    productName: "CAL-ZEAL 500",
    reviewerName: "Shree Ganesh Pharma Agencies",
    reviewerRole: "PCD Franchise Distributor",
    rating: 5,
    title: "Very fast moving product in Ortho segment",
    comment:
      "CAL-ZEAL 500 has high demand among local orthopedic doctors. Quality packaging and timely delivery from Zeal Pharma.",
    city: "Kota",
    state: "Rajasthan",
  },
  {
    productName: "ZEAL-ORTHO GEL",
    reviewerName: "Dr. Naveen Goel",
    reviewerRole: "Orthopedic & Sports Injury Specialist",
    rating: 5,
    title: "Quick pain relief in osteoarthritis & joint sprains",
    comment:
      "Deep penetrating micro-emulsion formula. My patients report noticeable pain relief within 15 minutes of gentle application.",
    city: "Ahmedabad",
    state: "Gujarat",
  },
  {
    productName: "ZEAL-ORTHO OIL",
    reviewerName: "Kailash Healthcare Agency",
    reviewerRole: "PCD Franchise Partner",
    rating: 5,
    title: "Highest repeat order rate in winter season",
    comment:
      "The herbal aroma and non-sticky feel make it a favorite for elderly joint pain patients. The carton design is very attractive.",
    city: "Indore",
    state: "Madhya Pradesh",
  },
  {
    productName: "ZEAL-DSR",
    reviewerName: "Dr. Pradeep Gupta",
    reviewerRole: "Consultant Gastroenterologist",
    rating: 5,
    title: "Reliable 24-hour acid suppression",
    comment:
      "The sustained-release enteric coated pellets ensure complete acid control in severe GERD and reflux esophagitis cases.",
    city: "Lucknow",
    state: "Uttar Pradesh",
  },
];

const seedProducts = async (): Promise<void> => {
  try {
    await connectDatabase();
    console.log("Seeding Pharmaceutical Products with Universal Divisions & Indications...");

    for (const item of samplePharmaProducts) {
      const category = await Category.findOne({ slug: item.categorySlug, isDeleted: false });
      if (!category) {
        console.warn(`[WARNING] Category slug '${item.categorySlug}' not found. Skipping ${item.name}.`);
        continue;
      }

      const productData = {
        name: item.name,
        genericName: item.genericName,
        composition: item.composition,
        dosageForm: item.dosageForm,
        packaging: item.packaging,
        category: String(category._id),
        subCategory: item.subCategory,
        indications: item.indications,
        sideEffects: item.sideEffects,
        howToUse: item.howToUse,
        precautions: item.precautions,
        prescriptionType: item.prescriptionType,
        isFeatured: item.isFeatured,
        isNewLaunch: item.isNewLaunch,
        isActive: true,
      };

      const existing = await Product.findOne({ name: item.name, isDeleted: false });
      if (existing) {
        const updated = await updateProduct(String(existing._id), productData);
        console.log(`[UPDATED] ${updated?.name} (Division: ${updated?.subCategoryName || item.subCategory}, Tags: ${updated?.indicationTags?.length || item.indications.length})`);
      } else {
        const created = await createProduct(productData);
        console.log(
          `[CREATED] ${created?.name} (Slug: ${created?.slug}, Division: ${created?.subCategoryName || item.subCategory}, Tags: ${created?.indicationTags?.length || item.indications.length})`
        );
      }
    }

    console.log("\nSeeding Verified Doctor & Franchise Reviews...");
    for (const rev of sampleDoctorReviews) {
      const product = await Product.findOne({ name: rev.productName, isDeleted: false });
      if (!product) continue;

      const existingReview = await Review.findOne({
        product: product._id,
        reviewerName: rev.reviewerName,
        isDeleted: false,
      });

      if (existingReview) {
        console.log(`[REVIEW EXISTS] For ${product.name} by ${rev.reviewerName}`);
      } else {
        await Review.create({
          product: product._id,
          reviewerName: rev.reviewerName,
          reviewerRole: rev.reviewerRole,
          rating: rev.rating,
          title: rev.title,
          comment: rev.comment,
          city: rev.city,
          state: rev.state,
          isApproved: true,
          approvedAt: new Date(),
        });
        console.log(`[REVIEW CREATED] For ${product.name} by ${rev.reviewerName} (★ ${rev.rating})`);
      }

      // Recalculate rating stats
      await recalculateProductRating(product._id);
    }

    console.log("\nAll Products, Divisions, Indications, and Verified Reviews seeded successfully!");
    process.exit(0);
  } catch (error: unknown) {
    console.error("Product seeding failed:", error);
    process.exit(1);
  }
};

seedProducts();
