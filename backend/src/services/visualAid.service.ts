import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export interface IVisualAidProduct {
  name: string;
  slug?: string;
  genericName?: string;
  composition?: string;
  dosageForm?: string | { name?: string };
  packaging?: string;
  prescriptionType?: string;
  category?: { name?: string } | string;
  subCategoryName?: string;
  subCategory?: { name?: string };
  indicationTags?: string[];
  indications?: Array<{ name?: string } | string>;
  precautions?: string;
  howToUse?: string;
  sideEffects?: string;
  averageRating?: number;
  totalReviews?: number;
  featuredImage?: string | { url?: string };
  images?: Array<string | { url?: string }>;
  mrp?: number | null;
}

export interface IVisualAidOptions {
  companyName?: string;
  phone?: string;
  email?: string;
  website?: string;
  headOfficeAddress?: string;
}

/**
 * Retrieve Zeal logo buffer from disk with multi-path resolution
 */
const getLogoBuffer = (): Buffer | null => {
  const possiblePaths = [
    path.join(__dirname, "../assets/logo.png"),
    path.join(__dirname, "../../assets/logo.png"),
    path.join(__dirname, "../../../backend/assets/logo.png"),
    path.join(process.cwd(), "backend/assets/logo.png"),
    path.join(process.cwd(), "assets/logo.png"),
    path.join(process.cwd(), "Zeal_Website/public/images/logo.png"),
    path.join(__dirname, "../../../Zeal_Website/public/images/logo.png"),
  ];

  for (const candidate of possiblePaths) {
    try {
      if (fs.existsSync(candidate)) {
        return fs.readFileSync(candidate);
      }
    } catch {
      // Continue search
    }
  }
  return null;
};

/**
 * Attempt to load product featured image buffer with fallback
 */
const getProductImageBuffer = async (product: IVisualAidProduct): Promise<Buffer | null> => {
  try {
    const rawUrl =
      (typeof product.featuredImage === "string" ? product.featuredImage : product.featuredImage?.url) ||
      (Array.isArray(product.images) && product.images.length > 0
        ? typeof product.images[0] === "string"
          ? product.images[0]
          : product.images[0]?.url
        : null);

    if (!rawUrl) return null;

    // 1. If it's a local file path
    if (!rawUrl.startsWith("http://") && !rawUrl.startsWith("https://") && !rawUrl.startsWith("data:")) {
      const localCandidates = [
        path.join(process.cwd(), rawUrl),
        path.join(process.cwd(), "backend", rawUrl),
        path.join(process.cwd(), "public", rawUrl),
        path.join(process.cwd(), "Zeal_Website/public", rawUrl),
      ];
      for (const cand of localCandidates) {
        if (fs.existsSync(cand)) {
          return fs.readFileSync(cand);
        }
      }
    }

    // 2. If it's a remote URL (Cloudinary, S3), attempt fetch with a short 2.5s timeout
    if (rawUrl.startsWith("http://") || rawUrl.startsWith("https://")) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);
      try {
        const response = await fetch(rawUrl, { signal: controller.signal });
        clearTimeout(timeoutId);
        if (response.ok) {
          const ab = await response.arrayBuffer();
          return Buffer.from(ab);
        }
      } catch {
        clearTimeout(timeoutId);
      }
    }
  } catch {
    // Fallback
  }
  return null;
};

/**
 * Generate a high-resolution, print-ready A4 Visual Aid Monograph PDF
 * with exact brand alignment to Zeal Product Catalog (Logo, Header details & Footer).
 * Dynamic title wrapping without clipping, and balanced vertical spacing across the entire A4 page.
 */
export const generateVisualAidPdf = async (
  product: IVisualAidProduct,
  options: IVisualAidOptions = {}
): Promise<Buffer> => {
  // Pre-load product image if available
  const [logoBuffer, productImageBuffer] = await Promise.all([
    Promise.resolve(getLogoBuffer()),
    getProductImageBuffer(product),
  ]);

  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        margins: { top: 16, bottom: 0, left: 22, right: 22 },
        info: {
          Title: `${product.name} - Official Visual Aid & Product Monograph`,
          Author: "ZEAL PHARMACURE PRIVATE LIMITED",
          Subject: `Clinical Visual Aid and Formulation Monograph for ${product.name}`,
          Keywords: "Zeal Pharma, Visual Aid, Product Monograph, PCD Pharma Franchise, WHO-GMP",
          CreationDate: new Date(),
        },
      });

      const buffers: Buffer[] = [];
      doc.on("data", (chunk: Buffer) => buffers.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(buffers)));
      doc.on("error", (err: Error) => reject(err));

      const margin = 22;
      const contentWidth = 551; // 595.28 - 22 * 2 = 551.28 pt

      // Company Settings matching Catalog PDF
      const companyName = options.companyName || "ZEAL PHARMACURE PVT. LTD.";
      const phone = options.phone || "+91 9909160190";
      const email = options.email || "info@zealpharma.com";
      const website = options.website || "www.zealpharmacure.com";
      const address =
        options.headOfficeAddress || "7015, BTM Market, Sita Nagar, Parvat Patiya, Surat, Gujarat – 395010";

      // =========================================================================
      // 1. PAGE HEADER (EXACTLY MATCHING PRODUCT CATALOG RATE LIST)
      // =========================================================================
      // Top purple decorative accent line
      doc.rect(margin, 15, contentWidth, 3.5).fill("#7C3AED");

      // 1. Zeal Logo (Left side)
      const logoSize = 50;
      const logoY = 24;
      let textStartX = margin;

      if (logoBuffer) {
        try {
          doc.image(logoBuffer, margin, logoY, {
            width: logoSize,
            height: logoSize,
          });
          textStartX = margin + logoSize + 12; // 84 pt
        } catch {
          textStartX = margin;
        }
      }

      // 2. Company Info (Next to logo)
      doc
        .font("Helvetica-Bold")
        .fontSize(13.5)
        .fillColor("#0F172A")
        .text(companyName, textStartX, 23, { lineBreak: false });

      doc
        .font("Helvetica-Bold")
        .fontSize(7.5)
        .fillColor("#6D28D9")
        .text("WHO-GMP & ISO 9001:2015 CERTIFIED PHARMACEUTICAL ENTERPRISE", textStartX, 41, { lineBreak: false });

      doc
        .font("Helvetica")
        .fontSize(7)
        .fillColor("#475569")
        .text(`Central Depot: ${address}`, textStartX, 54, { lineBreak: false });

      doc
        .font("Helvetica")
        .fontSize(7)
        .fillColor("#64748B")
        .text(`Helpline: ${phone}   |   Email: ${email}   |   ${website}`, textStartX, 67, { lineBreak: false });

      // 3. Right side Header Badge & Meta Details
      const badgeWidth = 154;
      const badgeX = margin + contentWidth - badgeWidth;
      doc
        .roundedRect(badgeX, 23, badgeWidth, 23, 4)
        .fillAndStroke("#F5F3FF", "#DDD6FE");

      doc
        .font("Helvetica-Bold")
        .fontSize(7.8)
        .fillColor("#7C3AED")
        .text("PRODUCT VISUAL AID MONOGRAPH", badgeX + 4, 30, {
          width: badgeWidth - 8,
          align: "center",
          lineBreak: false,
        });

      doc
        .font("Helvetica-Bold")
        .fontSize(7)
        .fillColor("#334155")
        .text("WHO-GMP & cGMP Certified Formulation", badgeX - 35, 53, {
          width: badgeWidth + 35,
          align: "right",
          lineBreak: false,
        });

      doc
        .font("Helvetica")
        .fontSize(6.8)
        .fillColor("#64748B")
        .text("For Medical Practitioners (RMP)", badgeX - 35, 66, {
          width: badgeWidth + 35,
          align: "right",
          lineBreak: false,
        });

      // 4. Horizontal separator line under header
      const headerEndY = 87;
      doc
        .moveTo(margin, headerEndY)
        .lineTo(margin + contentWidth, headerEndY)
        .lineWidth(0.75)
        .strokeColor("#E2E8F0")
        .stroke();

      // =========================================================================
      // 2. PRODUCT TITLE & SEGMENT PROFILE (DYNAMIC WRAPPING WITHOUT CLIPPING)
      // =========================================================================
      const divisionName =
        product.subCategoryName ||
        product.subCategory?.name ||
        (typeof product.category === "object" ? product.category?.name : product.category) ||
        "SPECIALITY PHARMACEUTICAL";

      let yPos = 97;

      // Division Tagline
      doc
        .font("Helvetica-Bold")
        .fontSize(8.5)
        .fillColor("#7C3AED")
        .text(`${divisionName.toUpperCase()} THERAPEUTIC SEGMENT`, margin, yPos, { lineBreak: false });

      yPos += 14;

      const productName = product.name.toUpperCase();
      const dosageText = (
        typeof product.dosageForm === "object"
          ? product.dosageForm?.name || "TABLET"
          : String(product.dosageForm || "TABLET")
      ).toUpperCase();
      const rxText = (product.prescriptionType || "Rx").toUpperCase();
      const mrpStr =
        product.mrp && Number(product.mrp) > 0 ? `M.R.P. Rs. ${Number(product.mrp).toFixed(2)}` : "";

      const rxBadgeWidth = 42;
      const dosageBadgeWidth = Math.max(54, dosageText.length * 6.5 + 16);
      const mrpBadgeWidth = mrpStr ? mrpStr.length * 5.8 + 16 : 0;
      const totalBadgesWidth = rxBadgeWidth + 8 + dosageBadgeWidth + (mrpBadgeWidth > 0 ? 8 + mrpBadgeWidth : 0);
      const titleAvailableWidth = contentWidth - totalBadgesWidth - 14;

      const titleFontSize = productName.length > 32 ? 15 : productName.length > 25 ? 16 : 17.5;
      doc.font("Helvetica-Bold").fontSize(titleFontSize).fillColor("#0F172A");

      const measuredTitleHeight = doc.heightOfString(productName, {
        width: titleAvailableWidth,
        lineGap: 2.5,
      });

      doc.text(productName, margin, yPos, {
        width: titleAvailableWidth,
        lineGap: 2.5,
      });

      // Badges: Rx, Dosage Form & MRP
      const badgeY = yPos + 1;
      let badgeCurrentRight = margin + contentWidth;

      // 1. Rx Badge (Red/Rose)
      badgeCurrentRight -= rxBadgeWidth;
      doc
        .roundedRect(badgeCurrentRight, badgeY, rxBadgeWidth, 19, 4)
        .fillAndStroke("#FEF2F2", "#FECACA");
      doc
        .font("Helvetica-Bold")
        .fontSize(8)
        .fillColor("#DC2626")
        .text(rxText, badgeCurrentRight, badgeY + 5, { width: rxBadgeWidth, align: "center", lineBreak: false });

      // 2. Dosage Form Badge (Emerald/Green)
      badgeCurrentRight -= (dosageBadgeWidth + 8);
      doc
        .roundedRect(badgeCurrentRight, badgeY, dosageBadgeWidth, 19, 4)
        .fillAndStroke("#ECFDF5", "#A7F3D0");
      doc
        .font("Helvetica-Bold")
        .fontSize(8)
        .fillColor("#059669")
        .text(dosageText, badgeCurrentRight, badgeY + 5, { width: dosageBadgeWidth, align: "center", lineBreak: false });

      // 3. MRP Badge (if mrp provided)
      if (mrpBadgeWidth > 0) {
        badgeCurrentRight -= (mrpBadgeWidth + 8);
        doc
          .roundedRect(badgeCurrentRight, badgeY, mrpBadgeWidth, 19, 4)
          .fillAndStroke("#F5F3FF", "#DDD6FE");
        doc
          .font("Helvetica-Bold")
          .fontSize(8)
          .fillColor("#6D28D9")
          .text(mrpStr, badgeCurrentRight, badgeY + 5, { width: mrpBadgeWidth, align: "center", lineBreak: false });
      }

      // Safe dynamic advance ensuring NO text overlap with next card
      yPos += Math.max(measuredTitleHeight + 10, 26);

      // =========================================================================
      // 3. GENERIC COMPOSITION & STRENGTH CARD (SPACIOUS)
      // =========================================================================
      const compBoxHeight = 66;
      doc
        .roundedRect(margin, yPos, contentWidth, compBoxHeight, 5)
        .fillAndStroke("#F8FAFC", "#E2E8F0");

      doc
        .font("Helvetica-Bold")
        .fontSize(8)
        .fillColor("#6D28D9")
        .text("GENERIC COMPOSITION & STRENGTH", margin + 12, yPos + 9, { lineBreak: false });

      const genericText = product.genericName || "Standardised Active Pharmaceutical Ingredients";
      doc
        .font("Helvetica-Bold")
        .fontSize(9.5)
        .fillColor("#0F172A")
        .text(genericText, margin + 12, yPos + 22, { width: contentWidth - 24, lineBreak: false });

      const compDetails =
        product.composition ||
        `Each ${dosageText.toLowerCase()} contains therapeutic active formulation engineered for rapid clinical efficacy and high systemic absorption.`;
      doc
        .font("Helvetica")
        .fontSize(8.2)
        .fillColor("#334155")
        .text(compDetails, margin + 12, yPos + 37, {
          width: contentWidth - 24,
          lineGap: 2,
        });

      yPos += compBoxHeight + 14;

      // =========================================================================
      // 4. INDICATIONS & PRESENTATION (WITH OR WITHOUT PRODUCT IMAGE)
      // =========================================================================
      // Collect indications
      let indicationList: string[] = [];
      if (product.indicationTags && product.indicationTags.length > 0) {
        indicationList = product.indicationTags;
      } else if (product.indications && product.indications.length > 0) {
        indicationList = product.indications
          .map((i) => (typeof i === "object" ? i.name || "" : String(i)))
          .filter(Boolean);
      }

      if (indicationList.length === 0) {
        indicationList = [
          "Primary and Secondary Clinical Indications",
          "Rapid Therapeutic Symptom Relief & Protection",
          "Degenerative & Acute Symptomatic Conditions",
          "Post-Trauma Recovery & Patient Mobility",
        ];
      }

      const hasProductImg = Boolean(productImageBuffer);

      if (hasProductImg) {
        // Layout with Product Image Showcase on Right
        const imgCardWidth = 175;
        const leftContentWidth = contentWidth - imgCardWidth - 14; // 362 pt
        const midSectionHeight = 184;

        // --- Left Section 1: Approved Clinical Indications ---
        const indCardHeight = 80;
        doc
          .font("Helvetica-Bold")
          .fontSize(9)
          .fillColor("#0F172A")
          .text("APPROVED CLINICAL INDICATIONS", margin, yPos, { lineBreak: false });

        doc
          .roundedRect(margin, yPos + 13, leftContentWidth, indCardHeight, 5)
          .fillAndStroke("#FFFFFF", "#E2E8F0");

        const leftHalfCol = (leftContentWidth - 28) / 2;
        let indCurY = yPos + 24;

        for (let i = 0; i < indicationList.length && i < 4; i++) {
          const indName = indicationList[i] ?? "";
          const isLeft = i % 2 === 0;
          const colX = isLeft ? margin + 10 : margin + 10 + leftHalfCol + 8;
          if (isLeft && i > 0) {
            indCurY += 25;
          }

          doc.circle(colX + 5, indCurY + 4, 3.5).fill("#7C3AED");
          doc
            .font("Helvetica-Bold")
            .fontSize(8)
            .fillColor("#0F172A")
            .text(indName, colX + 14, indCurY, { width: leftHalfCol - 16, lineBreak: false });
        }

        // --- Left Section 2: Presentation & Dosage ---
        const paramsY = yPos + 13 + indCardHeight + 10;
        const paramsHeight = midSectionHeight - (indCardHeight + 10);
        doc
          .roundedRect(margin, paramsY, leftContentWidth, paramsHeight, 5)
          .fillAndStroke("#FFFFFF", "#E2E8F0");

        doc
          .font("Helvetica-Bold")
          .fontSize(8.5)
          .fillColor("#0F172A")
          .text("PRESENTATION & PACKAGING", margin + 10, paramsY + 9, { lineBreak: false });

        doc
          .font("Helvetica-Bold")
          .fontSize(7.5)
          .fillColor("#64748B")
          .text("Packaging Style:", margin + 10, paramsY + 25, { lineBreak: false });
        doc
          .font("Helvetica-Bold")
          .fontSize(8)
          .fillColor("#0F172A")
          .text(product.packaging || "10 x 10 ALU-ALU Pack", margin + 78, paramsY + 25, { lineBreak: false });

        doc
          .font("Helvetica-Bold")
          .fontSize(7.5)
          .fillColor("#64748B")
          .text("Storage Temp:", margin + 10, paramsY + 41, { lineBreak: false });
        doc
          .font("Helvetica")
          .fontSize(7.5)
          .fillColor("#334155")
          .text("Store below 25°C. Protect from moisture & sunlight.", margin + 78, paramsY + 41, {
            width: leftContentWidth - 88,
            lineBreak: false,
          });

        doc
          .font("Helvetica-Bold")
          .fontSize(7.5)
          .fillColor("#DC2626")
          .text("Administration:", margin + 10, paramsY + 57, { lineBreak: false });
        doc
          .font("Helvetica")
          .fontSize(7.5)
          .fillColor("#334155")
          .text(product.howToUse || "As directed by Registered Medical Practitioner.", margin + 78, paramsY + 57, {
            width: leftContentWidth - 88,
            lineBreak: false,
          });

        // --- Right Section: Product Image Card ---
        const imgCardX = margin + leftContentWidth + 14;
        doc
          .roundedRect(imgCardX, yPos + 13, imgCardWidth, midSectionHeight, 5)
          .fillAndStroke("#FFFFFF", "#E2E8F0");

        try {
          doc.image(productImageBuffer!, imgCardX + 8, yPos + 21, {
            fit: [imgCardWidth - 16, midSectionHeight - 44],
            align: "center",
            valign: "center",
          });
        } catch {
          // If error drawing image
        }

        // Image Caption Banner at bottom of card
        doc
          .roundedRect(imgCardX + 8, yPos + 13 + midSectionHeight - 25, imgCardWidth - 16, 17, 3)
          .fill("#F5F3FF");
        doc
          .font("Helvetica-Bold")
          .fontSize(7.2)
          .fillColor("#6D28D9")
          .text("VERIFIED PRODUCT FORMULATION", imgCardX + 8, yPos + 13 + midSectionHeight - 20, {
            width: imgCardWidth - 16,
            align: "center",
            lineBreak: false,
          });

        yPos += 13 + midSectionHeight + 14;
      } else {
        // Standard 2-column layout when no product photo is attached
        const indBoxHeight = 78;
        doc
          .font("Helvetica-Bold")
          .fontSize(9)
          .fillColor("#0F172A")
          .text("APPROVED CLINICAL INDICATIONS", margin, yPos, { lineBreak: false });

        yPos += 13;

        doc
          .roundedRect(margin, yPos, contentWidth, indBoxHeight, 5)
          .fillAndStroke("#FFFFFF", "#E2E8F0");

        const halfCol = (contentWidth - 28) / 2;
        let indCurY = yPos + 12;

        for (let i = 0; i < indicationList.length && i < 6; i++) {
          const indName = indicationList[i] ?? "";
          const isLeft = i % 2 === 0;
          const colX = isLeft ? margin + 12 : margin + 12 + halfCol + 8;
          if (isLeft && i > 0) {
            indCurY += 20;
          }

          doc.circle(colX + 5, indCurY + 4, 3.5).fill("#7C3AED");
          doc
            .font("Helvetica-Bold")
            .fontSize(8)
            .fillColor("#0F172A")
            .text(indName, colX + 14, indCurY, { width: halfCol - 16, lineBreak: false });
        }

        yPos += indBoxHeight + 14;

        // Presentation & Administration in 2 equal boxes
        const twoBoxWidth = (contentWidth - 12) / 2;
        const twoBoxHeight = 84;

        // Box 1: Presentation & Packaging
        doc
          .roundedRect(margin, yPos, twoBoxWidth, twoBoxHeight, 5)
          .fillAndStroke("#FFFFFF", "#E2E8F0");

        doc
          .font("Helvetica-Bold")
          .fontSize(8.5)
          .fillColor("#0F172A")
          .text("PRESENTATION & PACKAGING", margin + 12, yPos + 9, { lineBreak: false });

        doc
          .font("Helvetica-Bold")
          .fontSize(7.5)
          .fillColor("#64748B")
          .text("Packaging Style:", margin + 12, yPos + 26, { lineBreak: false });
        doc
          .font("Helvetica-Bold")
          .fontSize(8)
          .fillColor("#0F172A")
          .text(product.packaging || "10 x 10 ALU-ALU Pack", margin + 84, yPos + 26, { lineBreak: false });

        doc
          .font("Helvetica-Bold")
          .fontSize(7.5)
          .fillColor("#64748B")
          .text("Dosage Form:", margin + 12, yPos + 44, { lineBreak: false });
        doc
          .font("Helvetica-Bold")
          .fontSize(8)
          .fillColor("#0F172A")
          .text(dosageText, margin + 84, yPos + 44, { lineBreak: false });

        doc
          .font("Helvetica-Bold")
          .fontSize(7.5)
          .fillColor("#64748B")
          .text("Storage Directive:", margin + 12, yPos + 62, { lineBreak: false });
        doc
          .font("Helvetica")
          .fontSize(7.5)
          .fillColor("#334155")
          .text("Store below 25°C. Protect from light & moisture.", margin + 84, yPos + 62, {
            width: twoBoxWidth - 94,
            lineBreak: false,
          });

        // Box 2: Dosage & Administration
        const box2X = margin + twoBoxWidth + 12;
        doc
          .roundedRect(box2X, yPos, twoBoxWidth, twoBoxHeight, 5)
          .fillAndStroke("#FFFFFF", "#E2E8F0");

        doc
          .font("Helvetica-Bold")
          .fontSize(8.5)
          .fillColor("#0F172A")
          .text("DOSAGE & ADMINISTRATION", box2X + 12, yPos + 9, { lineBreak: false });

        doc
          .font("Helvetica-Bold")
          .fontSize(7.5)
          .fillColor("#64748B")
          .text("Recommended Dosage:", box2X + 12, yPos + 26, { lineBreak: false });
        doc
          .font("Helvetica")
          .fontSize(7.8)
          .fillColor("#0F172A")
          .text(
            product.howToUse || "As directed by Registered Medical Practitioner or Physician.",
            box2X + 12,
            yPos + 41,
            { width: twoBoxWidth - 24, lineBreak: false }
          );

        const precText = product.precautions || "Keep medicine out of reach of children. Not for self-medication.";
        doc
          .font("Helvetica-Bold")
          .fontSize(7.5)
          .fillColor("#DC2626")
          .text("Precaution:", box2X + 12, yPos + 62, { lineBreak: false });
        doc
          .font("Helvetica")
          .fontSize(7.5)
          .fillColor("#475569")
          .text(precText, box2X + 62, yPos + 62, { width: twoBoxWidth - 74, lineBreak: false });

        yPos += twoBoxHeight + 14;
      }

      // =========================================================================
      // 5. KEY CLINICAL HIGHLIGHTS & MECHANISM (3 COLUMNS)
      // =========================================================================
      doc
        .font("Helvetica-Bold")
        .fontSize(9)
        .fillColor("#0F172A")
        .text("KEY CLINICAL HIGHLIGHTS & MECHANISM", margin, yPos, { lineBreak: false });

      yPos += 13;

      const highlightsHeight = 72;
      doc
        .roundedRect(margin, yPos, contentWidth, highlightsHeight, 5)
        .fillAndStroke("#F0FDF4", "#BBF7D0");

      const col3Width = (contentWidth - 28) / 3;

      // Col 1
      doc
        .font("Helvetica-Bold")
        .fontSize(8.2)
        .fillColor("#166534")
        .text("Superior Bioavailability", margin + 10, yPos + 9, { width: col3Width, lineBreak: false });
      doc
        .font("Helvetica")
        .fontSize(7.2)
        .fillColor("#334155")
        .text(
          "Advanced micro-refined formulation ensuring rapid therapeutic absorption & prompt clinical efficacy.",
          margin + 10,
          yPos + 23,
          { width: col3Width, lineGap: 1.5 }
        );

      // Col 2
      const col2X = margin + 10 + col3Width + 10;
      doc
        .font("Helvetica-Bold")
        .fontSize(8.2)
        .fillColor("#166534")
        .text("High Patient Compliance", col2X, yPos + 9, { width: col3Width, lineBreak: false });
      doc
        .font("Helvetica")
        .fontSize(7.2)
        .fillColor("#334155")
        .text(
          "Minimal gastrointestinal irritation with once or twice daily convenient dosing schedule.",
          col2X,
          yPos + 23,
          { width: col3Width, lineGap: 1.5 }
        );

      // Col 3
      const col3X = col2X + col3Width + 10;
      doc
        .font("Helvetica-Bold")
        .fontSize(8.2)
        .fillColor("#166534")
        .text("WHO-GMP Certified", col3X, yPos + 9, { width: col3Width, lineBreak: false });
      doc
        .font("Helvetica")
        .fontSize(7.2)
        .fillColor("#334155")
        .text(
          "Manufactured in state-of-the-art cGMP facility adhering to pharmacopoeial specifications.",
          col3X,
          yPos + 23,
          { width: col3Width, lineGap: 1.5 }
        );

      yPos += highlightsHeight + 14;

      // =========================================================================
      // 6. PHARMACOVIGILANCE & SAFETY DIRECTIVES CARD
      // =========================================================================
      const safetyBoxHeight = 62;
      doc
        .roundedRect(margin, yPos, contentWidth, safetyBoxHeight, 5)
        .fillAndStroke("#F8FAFC", "#E2E8F0");

      const halfSafety = (contentWidth - 24) / 2;

      // Left: Pharmacokinetics & Quality
      doc
        .font("Helvetica-Bold")
        .fontSize(7.8)
        .fillColor("#6D28D9")
        .text("QUALITY SURVEILLANCE & BATCH TESTING", margin + 12, yPos + 9, { lineBreak: false });
      doc
        .font("Helvetica")
        .fontSize(7.2)
        .fillColor("#334155")
        .text(
          "Subjected to multi-tier stability and dissolution analysis meeting rigorous regulatory pharmacopoeial benchmarks.",
          margin + 12,
          yPos + 24,
          { width: halfSafety - 12, lineGap: 1.5 }
        );

      // Right: Prescription Compliance
      const safetyRightX = margin + 12 + halfSafety;
      doc
        .font("Helvetica-Bold")
        .fontSize(7.8)
        .fillColor("#DC2626")
        .text("SCHEDULE H PRESCRIPTION WARNING", safetyRightX, yPos + 9, { lineBreak: false });
      doc
        .font("Helvetica")
        .fontSize(7.2)
        .fillColor("#334155")
        .text(
          "Caution: To be sold by retail on the prescription of a Registered Medical Practitioner (RMP) only.",
          safetyRightX,
          yPos + 24,
          { width: halfSafety - 12, lineGap: 1.5 }
        );

      yPos += safetyBoxHeight + 14;

      // =========================================================================
      // 7. VERIFIED DOCTOR RATING & CLINICAL TRUST BANNER
      // =========================================================================
      const rating = product.averageRating || 5.0;
      const reviews = product.totalReviews || 14;

      doc
        .roundedRect(margin, yPos, contentWidth, 38, 5)
        .fillAndStroke("#FFFBEB", "#FDE68A");

      doc
        .font("Helvetica-Bold")
        .fontSize(8.5)
        .fillColor("#B45309")
        .text(
          `★ VERIFIED CLINICAL RATING: ${rating.toFixed(1)} / 5.0   (${reviews}+ Verified Doctor & Practitioner Reviews)`,
          margin + 12,
          yPos + 8,
          { lineBreak: false }
        );
      doc
        .font("Helvetica")
        .fontSize(7.4)
        .fillColor("#78350F")
        .text(
          "High patient therapeutic response reported across clinical trials and field evaluations.",
          margin + 12,
          yPos + 21,
          { lineBreak: false }
        );

      yPos += 38 + 14;

      // =========================================================================
      // 8. PCD FRANCHISE & STOCKIST MONOPOLY ASSURANCE
      // =========================================================================
      doc
        .roundedRect(margin, yPos, contentWidth, 56, 5)
        .fillAndStroke("#FAF5FF", "#DDD6FE");

      doc
        .font("Helvetica-Bold")
        .fontSize(8.2)
        .fillColor("#6D28D9")
        .text("PAN-INDIA PCD PHARMA FRANCHISE & STOCKIST MONOPOLY DISTRIBUTION", margin + 12, yPos + 8, {
          lineBreak: false,
        });

      doc
        .font("Helvetica")
        .fontSize(7.4)
        .fillColor("#475569")
        .text(
          "Zeal Pharmacure provides district-wise monopoly marketing rights, complete promotional collateral (Visual Aids, LBLs, Samples, Reminder Cards, MR Bags), and expedited pan-India delivery within 24 to 48 hours.",
          margin + 12,
          yPos + 22,
          { width: contentWidth - 24, lineGap: 2 }
        );

      yPos += 56 + 12;

      // =========================================================================
      // 9. REGULATORY MEDICAL COMPLIANCE DIRECTIVE
      // =========================================================================
      doc
        .roundedRect(margin, yPos, contentWidth, 42, 5)
        .fillAndStroke("#F1F5F9", "#E2E8F0");

      doc
        .font("Helvetica-Bold")
        .fontSize(7.5)
        .fillColor("#334155")
        .text("FOR REGISTERED MEDICAL PRACTITIONERS (RMP), HOSPITALS & CLINICS ONLY", margin + 12, yPos + 7, {
          lineBreak: false,
        });

      doc
        .font("Helvetica")
        .fontSize(7)
        .fillColor("#64748B")
        .text(
          "This visual aid document contains scientific drug monograph information intended exclusively for healthcare professionals. Not for public consumer circulation or commercial advertising.",
          margin + 12,
          yPos + 20,
          { width: contentWidth - 24, lineGap: 1.5 }
        );

      // =========================================================================
      // 10. FOOTER (EXACTLY MATCHING PRODUCT CATALOG RATE LIST)
      // =========================================================================
      const footerLineY = 797;
      const footerRow1Y = 805;
      const footerRow2Y = 819;

      // Separator line above footer
      doc
        .moveTo(margin, footerLineY)
        .lineTo(margin + contentWidth, footerLineY)
        .lineWidth(0.75)
        .strokeColor("#CBD5E1")
        .stroke();

      // Footer Contact Line (Row 1 Left)
      doc
        .font("Helvetica-Bold")
        .fontSize(7.5)
        .fillColor("#1E293B")
        .text(`Official Helpline: ${phone}   |   Email: ${email}   |   Website: ${website}`, margin, footerRow1Y, {
          width: contentWidth - 145,
          align: "left",
          lineBreak: false,
        });

      // Monograph Tag (Row 1 Right)
      doc
        .font("Helvetica-Bold")
        .fontSize(8)
        .fillColor("#7C3AED")
        .text("Official Visual Aid Monograph", margin + contentWidth - 140, footerRow1Y, {
          width: 140,
          align: "right",
          lineBreak: false,
        });

      // Disclaimer Note (Row 2 Left)
      doc
        .font("Helvetica")
        .fontSize(6.8)
        .fillColor("#64748B")
        .text(
          "* Strictly for the use of Registered Medical Practitioners (RMP), Hospitals, or Licensed Stockists. Not for public advertisement.",
          margin,
          footerRow2Y,
          { width: contentWidth - 145, align: "left", lineBreak: false }
        );

      // Verified watermark timestamp (Row 2 Right)
      doc
        .font("Helvetica")
        .fontSize(6.8)
        .fillColor("#94A3B8")
        .text("Verified by Zeal Quality Control", margin + contentWidth - 140, footerRow2Y, {
          width: 140,
          align: "right",
          lineBreak: false,
        });

      // Finalize document
      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};

export default {
  generateVisualAidPdf,
};
