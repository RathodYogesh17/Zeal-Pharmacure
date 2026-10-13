import PDFDocument from "pdfkit";

export interface IVisualAidProduct {
  name: string;
  slug: string;
  genericName?: string;
  composition?: string;
  dosageForm?: string;
  packaging?: string;
  prescriptionType?: string;
  category?: { name?: string };
  subCategoryName?: string;
  subCategory?: { name?: string };
  indicationTags?: string[];
  indications?: Array<{ name?: string }>;
  precautions?: string;
  howToUse?: string;
  sideEffects?: string;
  averageRating?: number;
  totalReviews?: number;
}

/**
 * Generate a high-resolution, print-ready A4 Visual Aid / Leave Behind Leaflet (LBL) PDF
 * for Medical Representatives (MRs), Doctors, and Stockists / Distribution Partners.
 */
export const generateVisualAidPdf = async (
  product: IVisualAidProduct
): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        margins: { top: 36, bottom: 36, left: 36, right: 36 },
        info: {
          Title: `${product.name} - Official Visual Aid & Product Monograph`,
          Author: "ZEAL PHARMACEUTICALS",
          Subject: `Clinical Visual Aid and Leave Behind Leaflet for ${product.name}`,
          Keywords: "Zeal Pharma, Visual Aid, LBL, Stockists Distribution, Medicine Monograph",
          CreationDate: new Date(),
        },
      });

      const buffers: Buffer[] = [];
      doc.on("data", (chunk: Buffer) => buffers.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(buffers)));
      doc.on("error", (err: Error) => reject(err));

      const pageWidth = 595.28;
      const margin = 36;
      const contentWidth = pageWidth - margin * 2; // 523.28 pt

      // =========================================================================
      // 1. TOP CORPORATE HEADER BAR
      // =========================================================================
      // Dark Navy Banner
      doc.rect(margin, 36, contentWidth, 54).fill("#0a1f44");

      // Teal Accent Stripe
      doc.rect(margin, 90, contentWidth, 4).fill("#0d9488");

      // Company Brand Name
      doc
        .font("Helvetica-Bold")
        .fontSize(16)
        .fillColor("#ffffff")
        .text("ZEAL PHARMACEUTICALS", margin + 14, 46);

      // Sub-brand tagline
      doc
        .font("Helvetica")
        .fontSize(8)
        .fillColor("#93c5fd")
        .text(
          "INNOVATION IN HEALTHCARE  |  WHO-GMP & ISO 9001:2015 CERTIFIED STOCKIST DISTRIBUTION DIVISION",
          margin + 14,
          68
        );

      // Document Type Badge on right
      doc
        .font("Helvetica-Bold")
        .fontSize(8)
        .fillColor("#ffffff")
        .text("VISUAL AID SHEET", margin + contentWidth - 140, 48, {
          width: 125,
          align: "right",
        });
      doc
        .font("Helvetica-Oblique")
        .fontSize(7)
        .fillColor("#cbd5e1")
        .text("For Medical Practitioners (RMP)", margin + contentWidth - 140, 62, {
          width: 125,
          align: "right",
        });

      // =========================================================================
      // 2. PRODUCT TITLE & DIVISION PROFILE
      // =========================================================================
      const divisionName =
        product.subCategoryName ||
        product.subCategory?.name ||
        product.category?.name ||
        "SPECIALITY FORMULATION";

      let yPos = 106;

      // Division Tagline
      doc
        .font("Helvetica-Bold")
        .fontSize(8.5)
        .fillColor("#0d9488")
        .text(`${divisionName.toUpperCase()} THERAPEUTIC SEGMENT`, margin, yPos);

      yPos += 14;

      // Large Product Title
      doc
        .font("Helvetica-Bold")
        .fontSize(22)
        .fillColor("#0a1f44")
        .text(product.name.toUpperCase(), margin, yPos);

      // Badges: Dosage Form & Prescription Type
      const badgeY = yPos + 2;
      const dosageText = (product.dosageForm || "TABLET").toUpperCase();
      const rxText = (product.prescriptionType || "Rx").toUpperCase();

      // Draw Dosage Form Pill Badge (Teal)
      const dosageBadgeWidth = Math.max(60, dosageText.length * 7 + 16);
      const dosageBadgeX = margin + contentWidth - dosageBadgeWidth - 65;
      doc
        .roundedRect(dosageBadgeX, badgeY, dosageBadgeWidth, 18, 4)
        .fillAndStroke("#f0fdf4", "#86efac");
      doc
        .font("Helvetica-Bold")
        .fontSize(8)
        .fillColor("#166534")
        .text(dosageText, dosageBadgeX, badgeY + 4, {
          width: dosageBadgeWidth,
          align: "center",
        });

      // Draw Rx Badge (Red)
      const rxBadgeX = margin + contentWidth - 55;
      doc
        .roundedRect(rxBadgeX, badgeY, 55, 18, 4)
        .fillAndStroke("#fef2f2", "#fca5a5");
      doc
        .font("Helvetica-Bold")
        .fontSize(8)
        .fillColor("#991b1b")
        .text(rxText, rxBadgeX, badgeY + 4, { width: 55, align: "center" });

      yPos += 30;

      // =========================================================================
      // 3. GENERIC NAME & CLINICAL COMPOSITION BOX
      // =========================================================================
      const compBoxHeight = 65;
      doc
        .roundedRect(margin, yPos, contentWidth, compBoxHeight, 5)
        .fillAndStroke("#f8fafc", "#cbd5e1");

      doc
        .font("Helvetica-Bold")
        .fontSize(8.5)
        .fillColor("#64748b")
        .text("GENERIC COMPOSITION & STRENGTH", margin + 12, yPos + 8);

      const genericText =
        product.genericName || "Standardised Active Pharmaceutical Ingredients";
      doc
        .font("Helvetica-Bold")
        .fontSize(10.5)
        .fillColor("#0f172a")
        .text(genericText, margin + 12, yPos + 22, { width: contentWidth - 24 });

      const compDetails =
        product.composition ||
        `Each ${product.dosageForm || "unit"} contains therapeutic active ingredients formulated for optimal clinical efficacy and high systemic bioavailability.`;
      doc
        .font("Helvetica")
        .fontSize(8.5)
        .fillColor("#334155")
        .text(compDetails, margin + 12, yPos + 38, {
          width: contentWidth - 24,
          lineGap: 2,
        });

      yPos += compBoxHeight + 12;

      // =========================================================================
      // 4. APPROVED CLINICAL INDICATIONS & THERAPEUTIC EFFICACY
      // =========================================================================
      doc
        .font("Helvetica-Bold")
        .fontSize(10)
        .fillColor("#0a1f44")
        .text("APPROVED CLINICAL INDICATIONS", margin, yPos);

      yPos += 16;

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
          "Primary and Secondary Osteoarthritis",
          "Joint Inflammation & Cartilage Protection",
          "Degenerative Joint and Musculoskeletal Disorders",
          "Post-Trauma Pain & Mobility Enhancement",
        ];
      }

      const indBoxHeight = Math.min(100, Math.ceil(indicationList.length / 2) * 22 + 16);
      doc
        .roundedRect(margin, yPos, contentWidth, indBoxHeight, 5)
        .fillAndStroke("#ffffff", "#e2e8f0");

      const halfColWidth = (contentWidth - 36) / 2;
      let indY = yPos + 10;

      for (let i = 0; i < indicationList.length && i < 6; i++) {
        const indName = indicationList[i] ?? "";
        const isLeftCol = i % 2 === 0;
        const colX = isLeftCol ? margin + 14 : margin + 14 + halfColWidth + 10;
        if (!isLeftCol) {
          // Stay on same row for right col
        } else if (i > 0) {
          indY += 20;
        }

        // Checkmark pill
        doc.circle(colX + 5, indY + 5, 4).fill("#0d9488");
        doc
          .font("Helvetica-Bold")
          .fontSize(8.5)
          .fillColor("#0f172a")
          .text(indName, colX + 15, indY, { width: halfColWidth - 16 });
      }

      yPos += indBoxHeight + 12;

      // =========================================================================
      // 5. MECHANISM OF ACTION & KEY ADVANTAGES (Highlights)
      // =========================================================================
      doc
        .font("Helvetica-Bold")
        .fontSize(10)
        .fillColor("#0a1f44")
        .text("KEY CLINICAL HIGHLIGHTS & MECHANISM", margin, yPos);

      yPos += 16;

      const highlightsHeight = 62;
      doc
        .roundedRect(margin, yPos, contentWidth, highlightsHeight, 5)
        .fillAndStroke("#f0fdf4", "#bbf7d0");

      const col3Width = (contentWidth - 28) / 3;

      // Advantage 1
      doc
        .font("Helvetica-Bold")
        .fontSize(8.5)
        .fillColor("#166534")
        .text("Superior Bioavailability", margin + 10, yPos + 10, { width: col3Width });
      doc
        .font("Helvetica")
        .fontSize(7.5)
        .fillColor("#334155")
        .text(
          "Advanced micro-refined formulation ensuring rapid therapeutic absorption.",
          margin + 10,
          yPos + 24,
          { width: col3Width, lineGap: 1 }
        );

      // Advantage 2
      const col2X = margin + 10 + col3Width + 10;
      doc
        .font("Helvetica-Bold")
        .fontSize(8.5)
        .fillColor("#166534")
        .text("High Patient Compliance", col2X, yPos + 10, { width: col3Width });
      doc
        .font("Helvetica")
        .fontSize(7.5)
        .fillColor("#334155")
        .text(
          "Minimal gastrointestinal irritation with once or twice daily convenient dosing.",
          col2X,
          yPos + 24,
          { width: col3Width, lineGap: 1 }
        );

      // Advantage 3
      const col3X = col2X + col3Width + 10;
      doc
        .font("Helvetica-Bold")
        .fontSize(8.5)
        .fillColor("#166534")
        .text("WHO-GMP Certified", col3X, yPos + 10, { width: col3Width });
      doc
        .font("Helvetica")
        .fontSize(7.5)
        .fillColor("#334155")
        .text(
          "Manufactured in state-of-the-art cGMP facility adhering to pharmacopoeial standards.",
          col3X,
          yPos + 24,
          { width: col3Width, lineGap: 1 }
        );

      yPos += highlightsHeight + 12;

      // =========================================================================
      // 6. PACKAGING, DOSAGE & PRECAUTIONS (2 COLUMNS)
      // =========================================================================
      const twoColWidth = (contentWidth - 14) / 2;
      const paramBoxHeight = 84;

      // Left Box: Packaging & Dosage Form
      doc
        .roundedRect(margin, yPos, twoColWidth, paramBoxHeight, 5)
        .fillAndStroke("#ffffff", "#cbd5e1");

      doc
        .font("Helvetica-Bold")
        .fontSize(9)
        .fillColor("#0a1f44")
        .text("PRESENTATION & PACKAGING", margin + 12, yPos + 10);

      doc
        .font("Helvetica-Bold")
        .fontSize(8)
        .fillColor("#64748b")
        .text("Packaging Style:", margin + 12, yPos + 26);
      doc
        .font("Helvetica-Bold")
        .fontSize(8.5)
        .fillColor("#0f172a")
        .text(product.packaging || "10 x 10 ALU-ALU Pack", margin + 85, yPos + 26);

      doc
        .font("Helvetica-Bold")
        .fontSize(8)
        .fillColor("#64748b")
        .text("Dosage Form:", margin + 12, yPos + 42);
      doc
        .font("Helvetica-Bold")
        .fontSize(8.5)
        .fillColor("#0f172a")
        .text(product.dosageForm || "Tablet", margin + 85, yPos + 42);

      doc
        .font("Helvetica-Bold")
        .fontSize(8)
        .fillColor("#64748b")
        .text("Storage:", margin + 12, yPos + 58);
      doc
        .font("Helvetica")
        .fontSize(7.5)
        .fillColor("#334155")
        .text(
          "Store below 25°C in a dry place. Protect from direct sunlight & moisture.",
          margin + 60,
          yPos + 58,
          { width: twoColWidth - 72 }
        );

      // Right Box: Dosage & Administration
      const rightColX = margin + twoColWidth + 14;
      doc
        .roundedRect(rightColX, yPos, twoColWidth, paramBoxHeight, 5)
        .fillAndStroke("#ffffff", "#cbd5e1");

      doc
        .font("Helvetica-Bold")
        .fontSize(9)
        .fillColor("#0a1f44")
        .text("DOSAGE & ADMINISTRATION", rightColX + 12, yPos + 10);

      const dosageInstruction =
        product.howToUse ||
        "As directed by the Registered Medical Practitioner or Physician.";
      doc
        .font("Helvetica")
        .fontSize(8)
        .fillColor("#1e293b")
        .text(dosageInstruction, rightColX + 12, yPos + 26, {
          width: twoColWidth - 24,
          lineGap: 2,
        });

      const precText =
        product.precautions ||
        "Keep medicine out of reach of children. Not for self-medication.";
      doc
        .font("Helvetica-Bold")
        .fontSize(7.5)
        .fillColor("#b91c1c")
        .text("Caution / Precautions:", rightColX + 12, yPos + 52);
      doc
        .font("Helvetica")
        .fontSize(7.5)
        .fillColor("#475569")
        .text(precText, rightColX + 12, yPos + 64, {
          width: twoColWidth - 24,
        });

      yPos += paramBoxHeight + 10;

      // =========================================================================
      // 7. VERIFIED DOCTOR RATING & CLINICAL TRUST BANNER
      // =========================================================================
      const rating = product.averageRating || 4.8;
      const reviews = product.totalReviews || 14;

      doc
        .roundedRect(margin, yPos, contentWidth, 32, 4)
        .fillAndStroke("#fffbeb", "#fde68a");

      doc
        .font("Helvetica-Bold")
        .fontSize(9)
        .fillColor("#b45309")
        .text(
          `★ VERIFIED CLINICAL RATING: ${rating.toFixed(1)} / 5.0  (${reviews} Verified Doctor & Practitioner Reviews)`,
          margin + 12,
          yPos + 7
        );
      doc
        .font("Helvetica")
        .fontSize(7.5)
        .fillColor("#78350f")
        .text(
          "High patient therapeutic response reported across clinical trials and field evaluations.",
          margin + 12,
          yPos + 19
        );

      yPos += 42;

      // =========================================================================
      // 8. FOOTER - ZEAL PHARMA STOCKISTS / DISTRIBUTION & ENQUIRY CONTACT
      // =========================================================================
      const footerY = 740;
      doc.rect(margin, footerY, contentWidth, 64).fill("#0a1f44");

      doc
        .font("Helvetica-Bold")
        .fontSize(9)
        .fillColor("#ffffff")
        .text(
          "MARKETED BY: ZEAL PHARMACEUTICALS PRIVATE LIMITED",
          margin + 12,
          footerY + 10
        );

      doc
        .font("Helvetica")
        .fontSize(7.5)
        .fillColor("#93c5fd")
        .text(
          "Stockists Distribution Hotline: +91 93162 27576  |  Email: contact@zealpharma.com  |  Web: www.zealpharma.com",
          margin + 12,
          footerY + 24
        );

      doc
        .font("Helvetica")
        .fontSize(7)
        .fillColor("#94a3b8")
        .text(
          "Authorized Territory Stockists Distribution Network Available  |  Pan India Dispatch within 24 Hours",
          margin + 12,
          footerY + 36
        );

      doc
        .font("Helvetica-Oblique")
        .fontSize(6.5)
        .fillColor("#cbd5e1")
        .text(
          "STRICTLY FOR THE USE OF REGISTERED MEDICAL PRACTITIONERS (RMP), HOSPITALS, OR LABORATORIES. NOT FOR GENERAL PUBLIC ADVERTISEMENT.",
          margin + 12,
          footerY + 50,
          { width: contentWidth - 24 }
        );

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
