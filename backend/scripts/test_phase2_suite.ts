import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const BASE_URL = "http://localhost:5000/api";

const logHeader = (title: string) => {
  console.log("\n================================================================================");
  console.log(`  ${title}`);
  console.log("================================================================================");
};

const runPhase2Suite = async () => {
  const report: {
    categoryModule: boolean;
    productModule: boolean;
    reviewsAndRatings: boolean;
    enquiryModule: boolean;
    franchiseEngine: boolean;
    dlValidation: boolean;
    visualAidEngine: boolean;
    errors: string[];
  } = {
    categoryModule: false,
    productModule: false,
    reviewsAndRatings: false,
    enquiryModule: false,
    franchiseEngine: false,
    dlValidation: false,
    visualAidEngine: false,
    errors: [],
  };

  try {
    // -------------------------------------------------------------------------
    // 1. CATEGORY MODULE VERIFICATION
    // -------------------------------------------------------------------------
    logHeader("1. TESTING CATEGORY MODULE (Tablets, Capsules, Syrups, Injectables...)");
    const catRes = await fetch(`${BASE_URL}/categories`);
    const catData = await catRes.json();
    console.log(`HTTP Status: ${catRes.status}`);
    console.log(`Categories count: ${catData.data?.categories?.length || catData.data?.length || 0}`);

    const categoriesList = catData.data?.categories || (Array.isArray(catData.data) ? catData.data : []);
    const categoryNames = categoriesList.map((c: any) => c.name);
    console.log("Existing Categories:", categoryNames.join(", "));

    if (categoriesList.length > 0) {
      const sampleCat = categoriesList[0];
      const singleCatRes = await fetch(`${BASE_URL}/categories/${sampleCat.slug || sampleCat._id}`);
      const singleCatData = await singleCatRes.json();
      console.log(`Single Category Fetch (${sampleCat.name}): HTTP ${singleCatRes.status} (Success: ${singleCatData.success})`);
      report.categoryModule = singleCatRes.status === 200 && singleCatData.success === true;
    } else {
      report.errors.push("No categories found in database");
    }

    // -------------------------------------------------------------------------
    // 2. PRODUCT MODULE VERIFICATION (Catalog, Filters, Clinical fields)
    // -------------------------------------------------------------------------
    logHeader("2. TESTING PRODUCT MODULE (Public Catalog, Clinical Specs & Filters)");
    const prodRes = await fetch(`${BASE_URL}/products?limit=10`);
    const prodData = await prodRes.json();
    console.log(`Products List Status: HTTP ${prodRes.status}`);
    console.log(`Total Products Available: ${prodData.data?.total || 0}`);

    const products = prodData.data?.products || [];
    if (products.length === 0) {
      report.errors.push("No products found in catalog. Run npm run seed:products.");
    } else {
      const sampleProduct = products[0];
      console.log(`Sample Product Found: "${sampleProduct.name}" (Slug: ${sampleProduct.slug})`);
      console.log(`- Generic Name: ${sampleProduct.genericName || "N/A"}`);
      console.log(`- Composition: ${sampleProduct.composition || "N/A"}`);
      console.log(`- Dosage Form: ${sampleProduct.dosageForm || "N/A"}`);
      console.log(`- Packaging: ${sampleProduct.packaging || "N/A"}`);
      console.log(`- Category: ${sampleProduct.category?.name || "Ref Linked"}`);
      console.log(`- Indications: ${Array.isArray(sampleProduct.indications) ? sampleProduct.indications.map((i: any) => i.name || i).join(", ") : "N/A"}`);
      console.log(`- Prescription Class: ${sampleProduct.prescriptionType || "N/A"}`);

      // Test Single Product Fetch
      const singleProdRes = await fetch(`${BASE_URL}/products/${sampleProduct.slug}`);
      const singleProdData = await singleProdRes.json();
      console.log(`Single Product Details Fetch: HTTP ${singleProdRes.status} (Success: ${singleProdData.success})`);

      // Test Related Products
      const relatedRes = await fetch(`${BASE_URL}/products/related/${sampleProduct.slug}`);
      const relatedData = await relatedRes.json();
      console.log(`Related Products API: HTTP ${relatedRes.status} (Found: ${relatedData.data?.length || 0})`);

      // Test Cascading Filters
      const filtersRes = await fetch(`${BASE_URL}/products/filters`);
      const filtersData = await filtersRes.json();
      console.log(`Taxonomy Filters API: HTTP ${filtersRes.status}`);
      const dosageFormsStr = (filtersData.data?.dosageForms || [])
        .map((df: any) => `${df.name} (${df.count})`)
        .join(", ");
      console.log(`- Available Dosage Forms: ${dosageFormsStr}`);
      const divisionsStr = (filtersData.data?.divisions || [])
        .map((d: any) => `${d.name} (${d.count})`)
        .join(", ");
      console.log(`- Available Divisions: ${divisionsStr}`);

      report.productModule =
        prodRes.status === 200 &&
        singleProdRes.status === 200 &&
        relatedRes.status === 200 &&
        filtersRes.status === 200;
    }

    // -------------------------------------------------------------------------
    // 3. ONE-CLICK VISUAL AID (LBL A4 PDF) VERIFICATION
    // -------------------------------------------------------------------------
    logHeader("3. TESTING ONE-CLICK VISUAL AID / LBL A4 PDF GENERATOR");
    if (products.length > 0) {
      const sampleProduct = products[0];
      const pdfRes = await fetch(`${BASE_URL}/products/${sampleProduct.slug}/visual-aid`);
      const contentType = pdfRes.headers.get("content-type");
      const disposition = pdfRes.headers.get("content-disposition");
      const pdfBuffer = await pdfRes.arrayBuffer();
      console.log(`Visual Aid PDF Status: HTTP ${pdfRes.status}`);
      console.log(`Content-Type: ${contentType}`);
      console.log(`Content-Disposition: ${disposition}`);
      console.log(`Generated PDF Size: ${pdfBuffer.byteLength} bytes`);

      report.visualAidEngine = Boolean(
        pdfRes.status === 200 &&
        contentType?.includes("application/pdf") &&
        pdfBuffer.byteLength > 1000
      );
    }

    // -------------------------------------------------------------------------
    // 4. DOCTOR RATINGS & REVIEWS MODULE VERIFICATION
    // -------------------------------------------------------------------------
    logHeader("4. TESTING PRODUCT REVIEWS & DOCTOR RATINGS MODULE");
    if (products.length > 0) {
      const sampleProduct = products[0];
      console.log(`Submitting Doctor Review for Product: ${sampleProduct.name} (${sampleProduct._id})...`);

      const reviewPayload = {
        name: "Dr. Vikram Sethi",
        email: "dr.vikram.sethi@gmail.com",
        phone: "9876543210",
        rating: 5,
        review: "Excellent clinical efficacy and high gastric tolerance observed in clinical trials.",
        doctorSpeciality: "Senior Orthopaedic Surgeon",
        hospitalClinicName: "Sethi Ortho & Joint Clinic",
        city: "Surat",
      };

      const reviewSubmitRes = await fetch(`${BASE_URL}/products/${sampleProduct._id}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewPayload),
      });
      const reviewSubmitData = await reviewSubmitRes.json();
      console.log(`Review Submit Status: HTTP ${reviewSubmitRes.status}`);
      console.log(`Review Submit Message: ${reviewSubmitData.message}`);

      // Fetch public reviews for this product
      const reviewGetRes = await fetch(`${BASE_URL}/products/${sampleProduct._id}/reviews`);
      const reviewGetData = await reviewGetRes.json();
      console.log(`Reviews Listing Status: HTTP ${reviewGetRes.status}`);
      console.log(`Average Rating: ${reviewGetData.data?.averageRating || 0} (Total Reviews: ${reviewGetData.data?.total || 0})`);

      report.reviewsAndRatings =
        (reviewSubmitRes.status === 201 || reviewSubmitRes.status === 200) &&
        reviewGetRes.status === 200;
    }

    // -------------------------------------------------------------------------
    // 5. DRUG LICENSE VALIDATOR VERIFICATION
    // -------------------------------------------------------------------------
    logHeader("5. TESTING INDIAN DRUG LICENSE (DL FORM 20B/21B) AUTO-VALIDATOR");
    const validDlRes = await fetch(`${BASE_URL}/enquiries/validate-dl`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ drugLicenseNumber: "20B/GJ-SUR-88491", state: "Gujarat" }),
    });
    const validDlData = await validDlRes.json();
    console.log(`Valid DL Check (20B/GJ-SUR-88491): HTTP ${validDlRes.status}`);
    console.log(`- Valid Flag: ${validDlData.data?.isValid}`);
    console.log(`- Detected State: ${validDlData.data?.detectedState}`);
    console.log(`- License Form Type: ${validDlData.data?.formType}`);

    const invalidDlRes = await fetch(`${BASE_URL}/enquiries/validate-dl`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ drugLicenseNumber: "XYZ" }),
    });
    const invalidDlData = await invalidDlRes.json();
    console.log(`Invalid DL Rejection (XYZ): HTTP ${invalidDlRes.status} (Valid: ${invalidDlData.data?.isValid})`);

    report.dlValidation =
      validDlData.data?.isValid === true && invalidDlData.data?.isValid === false;

    // -------------------------------------------------------------------------
    // 6. PRODUCT & SALES B2B ENQUIRY MODULE VERIFICATION
    // -------------------------------------------------------------------------
    logHeader("6. TESTING B2B DIRECT PRODUCT ENQUIRY & SALES NOTIFICATION");
    if (products.length > 0) {
      const sampleProduct = products[0];
      const productEnquiryPayload = {
        name: "Dr. Ananya Roy",
        email: "ananya.roy@healthclinic.org",
        phone: "9876543210",
        city: "Vadodara",
        state: "Gujarat",
        pincode: "390001",
        companyName: "Roy Healthcare & Chemists",
        drugLicenseNumber: "20B-112233 / 21B-112233",
        gstNumber: "24AABCR1234E1Z1",
        productId: sampleProduct._id,
        quantity: "1,000 Boxes (Bulk Wholesaler Order)",
        message: "Need bulk quotation and sample visual aids for hospital formulary.",
        isConfirmed: true,
      };

      const enquiryRes = await fetch(`${BASE_URL}/enquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productEnquiryPayload),
      });
      const enquiryData = await enquiryRes.json();
      console.log(`Product Enquiry Submission: HTTP ${enquiryRes.status}`);
      console.log(`Enquiry Created ID: ${enquiryData.data?._id}`);
      console.log(`WhatsApp Alert Delivered: ${enquiryData.data?.whatsAppAlertSent}`);
      console.log(`1-Tap Client Chat URL: ${enquiryData.data?.instantWhatsAppChatUrl}`);

      report.enquiryModule = enquiryRes.status === 201 && enquiryData.success === true;
    }

    // -------------------------------------------------------------------------
    // 7. DEDICATED PCD PHARMA FRANCHISE MONOPOLY ENGINE VERIFICATION
    // -------------------------------------------------------------------------
    logHeader("7. TESTING DEDICATED PCD FRANCHISE MONOPOLY ENGINE (TERRITORY & BUDGET)");
    const franchisePayload = {
      name: "Suresh Gupta",
      phone: "8849166766",
      email: "suresh.gupta.pharma@gmail.com",
      companyName: "Gupta Pharma Distributors",
      city: "Rajkot",
      state: "Gujarat",
      pincode: "360001",
      territoryDistrict: "Rajkot & Saurashtra District Monopoly",
      investmentBudget: "₹10 Lakh - ₹15 Lakh",
      pharmaExperience: "10+ Years in C&F Distribution",
      interestedDivisions: ["General PCD Range", "Cardiac-Diabetic", "Derma & Cosmeceuticals"],
      hasGodownFacility: true,
      hasTransportFacility: true,
      drugLicenseNumber: "20B-998877 / 21B-998877",
      gstNumber: "24AAACG9988H1Z4",
      message: "Requesting exclusive monopoly PCD franchise agreement for Rajkot district.",
      isConfirmed: true,
    };

    const franchiseRes = await fetch(`${BASE_URL}/enquiries/franchise`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(franchisePayload),
    });
    const franchiseData = await franchiseRes.json();
    console.log(`PCD Franchise Submission: HTTP ${franchiseRes.status}`);
    console.log(`Franchise Territory: ${franchiseData.data?.territoryDistrict}`);
    console.log(`Investment Budget: ${franchiseData.data?.investmentBudget}`);
    console.log(`WhatsApp Alert Delivered: ${franchiseData.data?.whatsAppAlertSent}`);
    console.log(`Status: ${franchiseData.data?.status}`);

    report.franchiseEngine = franchiseRes.status === 201 && franchiseData.success === true;

    // -------------------------------------------------------------------------
    // FINAL COMPREHENSIVE SCORECARD
    // -------------------------------------------------------------------------
    logHeader("PHASE 2 COMPREHENSIVE VERIFICATION SCORECARD");
    console.log(`1. Category Module (Tablets, Capsules, Syrups, etc.):  [${report.categoryModule ? "PASS ✓" : "FAIL ✗"}]`);
    console.log(`2. Product Module (Clinical specs, catalog & filters):   [${report.productModule ? "PASS ✓" : "FAIL ✗"}]`);
    console.log(`3. One-Click Visual Aid (LBL A4 PDF Engine):             [${report.visualAidEngine ? "PASS ✓" : "FAIL ✗"}]`);
    console.log(`4. Doctor Reviews & Ratings Engine:                      [${report.reviewsAndRatings ? "PASS ✓" : "FAIL ✗"}]`);
    console.log(`5. Indian Drug License (Form 20B/21B) Validator:         [${report.dlValidation ? "PASS ✓" : "FAIL ✗"}]`);
    console.log(`6. B2B Product Enquiry Engine:                           [${report.enquiryModule ? "PASS ✓" : "FAIL ✗"}]`);
    console.log(`7. Dedicated PCD Franchise Monopoly Engine:              [${report.franchiseEngine ? "PASS ✓" : "FAIL ✗"}]`);

    const passedCount = Object.values(report).filter((val) => val === true).length;
    const totalCount = 7;
    const scorePercentage = Math.round((passedCount / totalCount) * 100);

    console.log("\n================================================================================");
    console.log(`  OVERALL PHASE 2 RATING: ${scorePercentage}% (${passedCount}/${totalCount} MODULES PERFECT)`);
    console.log("================================================================================");

    process.exit(scorePercentage === 100 ? 0 : 1);
  } catch (err) {
    console.error("Test execution failed:", err);
    process.exit(1);
  }
};

runPhase2Suite();
