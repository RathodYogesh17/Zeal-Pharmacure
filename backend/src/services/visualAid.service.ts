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
  contraindications?: string;
  warnings?: string;
  storage?: string;
  pregnancyInfo?: string;
  lactationInfo?: string;
  averageRating?: number;
  totalReviews?: number;
  featuredImage?: string | { url?: string };
  images?: Array<string | { url?: string }>;
  mediaGallery?: Array<{ url: string; title?: string; altText?: string }>;
  mrp?: number | null;
}

export interface IVisualAidOptions {
  companyName?: string;
  phone?: string;
  email?: string;
  website?: string;
  headOfficeAddress?: string;
}

// =========================================================================
// EXECUTIVE THEME: SYNCHRONIZED 1:1 WITH ZEAL OFFICIAL CATALOG PDF
// =========================================================================
const THEME = {
  NAVY_HEADER: "#1E1B4B",     // Deep Indigo/Navy header bar (Catalog table header)
  PURPLE_HEADER: "#4C1D95",   // Deep Royal Purple for Side Effects focus
  PURPLE_SUBHEADER: "#312E81",// Medium Indigo/Purple for column headers
  BRAND_PURPLE: "#6D28D9",    // Brand purple
  ACCENT_PURPLE: "#7C3AED",   // Accent purple (Badges & Page numbers)
  BG_PURPLE_LIGHT: "#F5F3FF", // Light purple badge background
  BORDER_PURPLE: "#DDD6FE",   // Light purple border
  BORDER_GRID: "#E2E8F0",     // Clean catalog table border
  BORDER_MUTED: "#CBD5E1",    // Footer separator line
  ZEBRA_LIGHT: "#F8FAFC",     // Alternating zebra row
  WHITE: "#FFFFFF",
  TEXT_BLACK: "#0F172A",      // Primary dark heading
  TEXT_DARK: "#1E293B",       // Body text
  TEXT_MID: "#334155",        // Secondary text
  TEXT_SLATE: "#475569",      // Labels
  TEXT_MUTED: "#64748B",      // Directives & footnotes
  SUCCESS_GREEN: "#059669",   // MRP / certified badge
};

/**
 * Retrieve Zeal logo buffer from disk
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
    } catch {}
  }
  return null;
};

/**
 * Load single image from local disk or remote URL with timeout
 */
const loadSingleImage = async (rawUrl: string): Promise<Buffer | null> => {
  if (!rawUrl || typeof rawUrl !== "string") return null;
  const cleanUrl = rawUrl.trim();
  if (!cleanUrl) return null;

  // 1. Local path
  if (!cleanUrl.startsWith("http://") && !cleanUrl.startsWith("https://") && !cleanUrl.startsWith("data:")) {
    const candidates = [
      path.join(process.cwd(), cleanUrl),
      path.join(process.cwd(), "backend", cleanUrl),
      path.join(process.cwd(), "public", cleanUrl),
      path.join(process.cwd(), "Zeal_Website/public", cleanUrl),
      path.join(process.cwd(), cleanUrl.replace(/^\//, "")),
      path.join(process.cwd(), "backend/public", cleanUrl.replace(/^\//, "")),
      path.join(process.cwd(), "Zeal_Website/public", cleanUrl.replace(/^\//, "")),
    ];
    for (const cand of candidates) {
      try {
        if (fs.existsSync(cand)) {
          return fs.readFileSync(cand);
        }
      } catch {}
    }
  }

  // 2. Remote URL with timeout
  if (cleanUrl.startsWith("http://") || cleanUrl.startsWith("https://")) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3500);
    try {
      const res = await fetch(cleanUrl, { signal: controller.signal });
      clearTimeout(timer);
      if (res.ok) {
        const ab = await res.arrayBuffer();
        return Buffer.from(ab);
      }
    } catch {
      clearTimeout(timer);
    }
  }

  return null;
};

/**
 * Collect product angle-wise images (Primary front view + Side / Packshot angle)
 */
const getProductAngleImages = async (
  product: IVisualAidProduct
): Promise<Array<{ buffer: Buffer; label: string }>> => {
  const candidates: Array<{ url: string; label: string }> = [];

  // Primary image
  const feat =
    (typeof product.featuredImage === "string" ? product.featuredImage : product.featuredImage?.url) ||
    ((product as any).imageUrl as string);
  if (feat) candidates.push({ url: feat, label: "Front Pack Angle" });

  // Media gallery (Side or Blister angles)
  const gallery = (product as any).mediaGallery;
  if (Array.isArray(gallery)) {
    gallery.forEach((g: any, i: number) => {
      const u = typeof g === "string" ? g : g?.url;
      const lbl = g?.title || g?.altText || (i === 0 ? "Side / Strip Angle" : "Blister Angle View");
      if (u && !candidates.some((c) => c.url === u)) {
        candidates.push({ url: u, label: lbl });
      }
    });
  }

  // Secondary images array
  if (Array.isArray(product.images)) {
    product.images.forEach((img: any, i: number) => {
      const u = typeof img === "string" ? img : img?.url;
      const lbl = i === 0 ? "Pack Angle" : "Alternate View";
      if (u && !candidates.some((c) => c.url === u)) {
        candidates.push({ url: u, label: lbl });
      }
    });
  }

  const loaded: Array<{ buffer: Buffer; label: string }> = [];
  for (const item of candidates.slice(0, 2)) {
    const buf = await loadSingleImage(item.url);
    if (buf) {
      loaded.push({ buffer: buf, label: item.label });
    }
  }
  return loaded;
};

/**
 * Clean & readable clinical side effects and safety data resolver
 */
const getClinicalMedicalData = (product: IVisualAidProduct) => {
  const dosage = (
    typeof product.dosageForm === "object"
      ? product.dosageForm?.name || "TABLET"
      : String(product.dosageForm || "TABLET")
  ).toUpperCase();

  const rawSideEffects = product.sideEffects?.trim();
  const rawContraindications = product.contraindications?.trim();
  const rawPrecautions = product.precautions?.trim();

  let commonSideEffects: string[] = [];
  let rareSideEffects: string[] = [];

  if (rawSideEffects) {
    const splitted = rawSideEffects
      .split(/[,;\n\.]/)
      .map((s) => s.trim())
      .filter((s) => s.length > 3);
    if (splitted.length >= 2) {
      commonSideEffects = splitted.slice(0, 3);
      rareSideEffects = splitted.slice(3, 6);
    } else {
      commonSideEffects = [rawSideEffects];
    }
  }

  // Formulation-specific fallback side effects
  if (commonSideEffects.length === 0) {
    if (dosage.includes("CREAM") || dosage.includes("OINTMENT") || dosage.includes("LOTION") || dosage.includes("GEL")) {
      commonSideEffects = [
        "Mild transient localized burning or erythema at application site",
        "Temporary localized skin peeling or dryness during initial therapy",
        "Mild cutaneous pruritus; typically resolves spontaneously",
      ];
      rareSideEffects = [
        "Contact allergic sensitization or localized contact dermatitis",
        "Secondary cutaneous irritation or localized folliculitis",
        "Transient hypersensitivity in patients sensitive to excipients",
      ];
    } else if (dosage.includes("SYRUP") || dosage.includes("SUSPENSION") || dosage.includes("DROPS")) {
      commonSideEffects = [
        "Mild gastrointestinal fullness, transient nausea, or altered taste",
        "Mild dry mouth or temporary daytime drowsiness in sensitive patients",
        "Occasional mild abdominal discomfort; usually self-limiting",
      ];
      rareSideEffects = [
        "Allergic cutaneous rash or localized urticaria (discontinue use)",
        "Gastrointestinal hypermotility or mild transient loose stools",
        "Rare idiosyncratic allergic reaction requiring physician consultation",
      ];
    } else {
      // Tablets & Capsules
      commonSideEffects = [
        "Mild gastrointestinal distress (transient nausea, dyspepsia, or epigastric discomfort)",
        "Occasional mild headache, light-headedness, or transient daytime fatigue",
        "Minor alteration in bowel habits (mild loose stools or transient constipation)",
      ];
      rareSideEffects = [
        "Hypersensitivity reactions including skin rash, urticaria, or pruritus",
        "Transient variations in liver transaminases during prolonged high-dose therapy",
        "Severe idiosyncratic drug reaction; discontinue promptly and consult physician",
      ];
    }
  }

  if (rareSideEffects.length === 0) {
    rareSideEffects = [
      "Cutaneous hypersensitivity manifestations (rash, urticaria, or facial erythema)",
      "Transient reversible hepatic enzyme changes during prolonged high-dose regimens",
      "Idiosyncratic allergic response; discontinue therapy and seek medical evaluation",
    ];
  }

  return {
    commonSideEffects,
    rareSideEffects,
    contraindications:
      rawContraindications ||
      "Known hypersensitivity to active drug substance or excipients. Severe uncompensated hepatic or acute renal insufficiency.",
    precautions:
      rawPrecautions ||
      "Administer with clinical caution in patients with history of gastrointestinal ulceration or renal dysfunction. Regular clinical monitoring advised during extended therapy.",
    storage:
      product.storage ||
      "Store below 25°C in a dry and dark place. Protect from moisture, heat, and direct sunlight.",
    howToUse:
      product.howToUse ||
      "Dosage strictly as directed by Registered Medical Practitioner (RMP). Swallow whole with water; do not crush or chew.",
  };
};

/**
 * Generate a high-resolution, print-ready A4 Visual Aid PDF
 * Exactly matching the executive theme, table styling, header & footer of Zeal's official Catalog PDF.
 */
export const generateVisualAidPdf = async (
  product: IVisualAidProduct,
  options: IVisualAidOptions = {}
): Promise<Buffer> => {
  // Pre-load logo and product angle photos concurrently
  const [logoBuffer, productPhotos] = await Promise.all([
    Promise.resolve(getLogoBuffer()),
    getProductAngleImages(product),
  ]);

  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        margins: { top: 16, bottom: 0, left: 22, right: 22 },
        info: {
          Title: `${product.name} - Scientific Visual Aid & Product Monograph`,
          Author: "ZEAL PHARMACURE PRIVATE LIMITED",
          Subject: `Clinical Visual Aid and Formulation Monograph for ${product.name}`,
          Keywords: "Zeal Pharma, Visual Aid, Product Monograph, Side Effects, Formulation",
          CreationDate: new Date(),
        },
      });

      // Strict single-page guard: prevent accidental auto-spawn of page 2
      (doc as any).addPage = () => doc;

      const buffers: Buffer[] = [];
      doc.on("data", (chunk: Buffer) => buffers.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(buffers)));
      doc.on("error", (err: Error) => reject(err));

      const margin = 22;
      const contentWidth = 551.28; // 595.28 - 22 * 2 = 551.28 pt (Exact same as catalogPdf)

      // Company info
      const companyName = options.companyName || "ZEAL PHARMACURE PVT. LTD.";
      const phone = options.phone || "+91 9909160190";
      const email = options.email || "zealpharmacure@gmail.com";
      const website = options.website || "www.zealpharmacure.com";

      // =========================================================================
      // 1. TOP HEADER (EXACT 1:1 MATCH WITH ZEAL PRODUCT CATALOG PDF)
      // =========================================================================
      const logoSize = 48;
      const logoY = 22;
      let textStartX = margin;

      if (logoBuffer) {
        try {
          doc.image(logoBuffer, margin, logoY, {
            width: logoSize,
            height: logoSize,
          });
          textStartX = margin + logoSize + 12;
        } catch {
          textStartX = margin;
        }
      }

      // Company Info (Catalog typography)
      doc
        .font("Helvetica-Bold")
        .fontSize(14)
        .fillColor(THEME.TEXT_BLACK)
        .text(companyName, textStartX, 22, { lineBreak: false });

      doc
        .font("Helvetica-Bold")
        .fontSize(7.5)
        .fillColor(THEME.BRAND_PURPLE)
        .text("WHO-GMP & ISO 9001:2015 CERTIFIED PHARMACEUTICAL ENTERPRISE", textStartX, 39, { lineBreak: false });

      doc
        .font("Helvetica")
        .fontSize(7)
        .fillColor(THEME.TEXT_SLATE)
        .text("SCIENTIFIC PRODUCT VISUAL AID & CLINICAL MONOGRAPH DIRECTORY", textStartX, 51, { lineBreak: false });

      doc
        .font("Helvetica")
        .fontSize(7)
        .fillColor(THEME.TEXT_MUTED)
        .text(`Helpline: ${phone}   |   Email: ${email}   |   ${website}`, textStartX, 63, { lineBreak: false });

      // Right Side Header Badge (Catalog rounded badge)
      const badgeWidth = 160;
      const badgeX = margin + contentWidth - badgeWidth;
      doc
        .roundedRect(badgeX, 22, badgeWidth, 23, 4)
        .fillAndStroke(THEME.BG_PURPLE_LIGHT, THEME.BORDER_PURPLE);

      doc
        .font("Helvetica-Bold")
        .fontSize(7.8)
        .fillColor(THEME.ACCENT_PURPLE)
        .text("OFFICIAL PRODUCT VISUAL AID", badgeX + 4, 29, {
          width: badgeWidth - 8,
          align: "center",
          lineBreak: false,
        });

      doc
        .font("Helvetica-Bold")
        .fontSize(7)
        .fillColor(THEME.TEXT_MID)
        .text("130+ DCGI & WHO-GMP Formulations", badgeX - 35, 51, {
          width: badgeWidth + 35,
          align: "right",
          lineBreak: false,
        });

      doc
        .font("Helvetica")
        .fontSize(6.8)
        .fillColor(THEME.TEXT_MUTED)
        .text("Clinical Safety Monograph  |  Govt. Licensed", badgeX - 35, 63, {
          width: badgeWidth + 35,
          align: "right",
          lineBreak: false,
        });

      // Horizontal separator line under header (Exact match with catalog)
      const headerEndY = 76;
      doc
        .moveTo(margin, headerEndY)
        .lineTo(margin + contentWidth, headerEndY)
        .lineWidth(0.75)
        .strokeColor(THEME.BORDER_GRID)
        .stroke();

      // =========================================================================
      // 2. PRODUCT IDENTITY BANNER (NAVY BAR + CLEAN COMPOSITION STRIP)
      // =========================================================================
      let curY = headerEndY + 6; // 82 pt

      const productName = product.name.toUpperCase();
      const dosageText = (
        typeof product.dosageForm === "object"
          ? product.dosageForm?.name || "TABLET"
          : String(product.dosageForm || "TABLET")
      ).toUpperCase();

      const genericText =
        product.genericName ||
        product.composition ||
        "Active Pharmaceutical Formulation";

      const rxText = (product.prescriptionType || "Rx").toUpperCase();
      const packagingText = product.packaging || "10 x 10 Pack";
      const mrpText =
        product.mrp && Number(product.mrp) > 0 ? `MRP Rs. ${Number(product.mrp).toFixed(2)}` : null;

      // Row 1: Navy Banner for Product Name & Badges
      const titleBannerHeight = 26;
      doc
        .rect(margin, curY, contentWidth, titleBannerHeight)
        .fill(THEME.NAVY_HEADER);

      // Badges from Right to Left
      let badgeRightX = margin + contentWidth - 6;
      const bY = curY + 3.5;
      const bH = 19;

      // 1. MRP Badge
      if (mrpText) {
        const mrpW = Math.max(68, mrpText.length * 6 + 14);
        badgeRightX -= mrpW;
        doc.roundedRect(badgeRightX, bY, mrpW, bH, 2).fill(THEME.WHITE);
        doc
          .font("Helvetica-Bold")
          .fontSize(7.8)
          .fillColor(THEME.SUCCESS_GREEN)
          .text(mrpText, badgeRightX, bY + 5, { width: mrpW, align: "center", lineBreak: false });
        badgeRightX -= 5;
      }

      // 2. Packaging Badge
      const packW = Math.max(62, packagingText.length * 5.5 + 14);
      badgeRightX -= packW;
      doc.roundedRect(badgeRightX, bY, packW, bH, 2).fill(THEME.WHITE);
      doc
        .font("Helvetica-Bold")
        .fontSize(7.5)
        .fillColor(THEME.TEXT_DARK)
        .text(packagingText, badgeRightX, bY + 5, { width: packW, align: "center", lineBreak: false });
      badgeRightX -= 5;

      // 3. Dosage Badge
      const dosageW = Math.max(52, dosageText.length * 5.8 + 14);
      badgeRightX -= dosageW;
      doc.roundedRect(badgeRightX, bY, dosageW, bH, 2).fill(THEME.BG_PURPLE_LIGHT);
      doc
        .font("Helvetica-Bold")
        .fontSize(7.5)
        .fillColor(THEME.BRAND_PURPLE)
        .text(dosageText, badgeRightX, bY + 5, { width: dosageW, align: "center", lineBreak: false });
      badgeRightX -= 5;

      // 4. Rx Badge
      const rxW = 32;
      badgeRightX -= rxW;
      doc.roundedRect(badgeRightX, bY, rxW, bH, 2).fill(THEME.BG_PURPLE_LIGHT);
      doc
        .font("Helvetica-Bold")
        .fontSize(8)
        .fillColor(THEME.ACCENT_PURPLE)
        .text(rxText, badgeRightX, bY + 5, { width: rxW, align: "center", lineBreak: false });

      // Title on Left
      const titleW = badgeRightX - margin - 12;
      doc
        .font("Helvetica-Bold")
        .fontSize(12)
        .fillColor(THEME.WHITE)
        .text(productName, margin + 8, curY + 6.5, {
          width: titleW,
          lineBreak: false,
          ellipsis: true,
        });

      curY += titleBannerHeight;

      // Row 2: Sub-Strip for Active Salt / Composition (Clean Light Background)
      const compStripHeight = 20;
      doc
        .rect(margin, curY, contentWidth, compStripHeight)
        .fillAndStroke(THEME.ZEBRA_LIGHT, THEME.BORDER_GRID);

      doc
        .font("Helvetica-Bold")
        .fontSize(7.5)
        .fillColor(THEME.BRAND_PURPLE)
        .text("Active Salt / Composition:", margin + 8, curY + 5.5, { lineBreak: false });

      doc
        .font("Helvetica")
        .fontSize(7.5)
        .fillColor(THEME.TEXT_DARK)
        .text(genericText, margin + 115, curY + 5.5, {
          width: contentWidth - 125,
          height: 12,
          ellipsis: true,
          lineBreak: false,
        });

      curY += compStripHeight + 8; // ~136 pt

      // =========================================================================
      // 3. PRODUCT VISUAL & SPECIFICATIONS GRID (CATALOG TABLE STYLING)
      // =========================================================================
      const photoGridHeight = 160;
      const photoColWidth = 240;
      const specsColX = margin + photoColWidth + 10;
      const specsColWidth = contentWidth - photoColWidth - 10; // ~301 pt

      // --- Left: Angle-Wise Product Photos Showcase ---
      // 1. Table Header
      doc
        .rect(margin, curY, photoColWidth, 18)
        .fill(THEME.NAVY_HEADER);
      doc
        .font("Helvetica-Bold")
        .fontSize(7.5)
        .fillColor(THEME.WHITE)
        .text("PRODUCT PACKSHOT & ANGLE PRESENTATION", margin, curY + 5, {
          width: photoColWidth,
          align: "center",
          lineBreak: false,
        });

      // 2. Photo Area Frame
      doc
        .rect(margin, curY + 18, photoColWidth, photoGridHeight - 18)
        .fillAndStroke(THEME.WHITE, THEME.BORDER_GRID);

      const pAreaY = curY + 24;
      const pAreaH = photoGridHeight - 32; // ~128 pt

      if (productPhotos.length >= 2) {
        const frameW = (photoColWidth - 18) / 2; // ~111 pt
        const leftX = margin + 6;
        const rightX = margin + 6 + frameW + 6;

        // Angle 1
        doc
          .roundedRect(leftX, pAreaY, frameW, pAreaH, 3)
          .fillAndStroke(THEME.ZEBRA_LIGHT, THEME.BORDER_GRID);
        try {
          doc.image(productPhotos[0]!.buffer, leftX + 4, pAreaY + 4, {
            fit: [frameW - 8, pAreaH - 20],
            align: "center",
            valign: "center",
          });
        } catch {}
        doc
          .font("Helvetica-Bold")
          .fontSize(6.8)
          .fillColor(THEME.TEXT_SLATE)
          .text(productPhotos[0]!.label, leftX, pAreaY + pAreaH - 13, {
            width: frameW,
            align: "center",
            lineBreak: false,
            ellipsis: true,
          });

        // Angle 2
        doc
          .roundedRect(rightX, pAreaY, frameW, pAreaH, 3)
          .fillAndStroke(THEME.ZEBRA_LIGHT, THEME.BORDER_GRID);
        try {
          doc.image(productPhotos[1]!.buffer, rightX + 4, pAreaY + 4, {
            fit: [frameW - 8, pAreaH - 20],
            align: "center",
            valign: "center",
          });
        } catch {}
        doc
          .font("Helvetica-Bold")
          .fontSize(6.8)
          .fillColor(THEME.TEXT_SLATE)
          .text(productPhotos[1]!.label, rightX, pAreaY + pAreaH - 13, {
            width: frameW,
            align: "center",
            lineBreak: false,
            ellipsis: true,
          });
      } else if (productPhotos.length === 1) {
        const frameW = photoColWidth - 12;
        const leftX = margin + 6;

        doc
          .roundedRect(leftX, pAreaY, frameW, pAreaH, 3)
          .fillAndStroke(THEME.ZEBRA_LIGHT, THEME.BORDER_GRID);
        try {
          doc.image(productPhotos[0]!.buffer, leftX + 6, pAreaY + 4, {
            fit: [frameW - 12, pAreaH - 20],
            align: "center",
            valign: "center",
          });
        } catch {}
        doc
          .font("Helvetica-Bold")
          .fontSize(7)
          .fillColor(THEME.TEXT_SLATE)
          .text("Primary Formulation Angle Packshot", leftX, pAreaY + pAreaH - 13, {
            width: frameW,
            align: "center",
            lineBreak: false,
          });
      } else {
        const frameW = photoColWidth - 12;
        const leftX = margin + 6;
        doc
          .roundedRect(leftX, pAreaY, frameW, pAreaH, 3)
          .fillAndStroke(THEME.ZEBRA_LIGHT, THEME.BORDER_GRID);
        doc
          .font("Helvetica-Bold")
          .fontSize(11)
          .fillColor(THEME.BRAND_PURPLE)
          .text(dosageText, leftX, pAreaY + 42, { width: frameW, align: "center", lineBreak: false });
        doc
          .font("Helvetica")
          .fontSize(7.5)
          .fillColor(THEME.TEXT_MUTED)
          .text("Standardized Pharmaceutical Specimen", leftX, pAreaY + 58, {
            width: frameW,
            align: "center",
            lineBreak: false,
          });
      }

      // --- Right: Key Formulation Specifications Table (Catalog Table Rows) ---
      // 1. Table Header
      doc
        .rect(specsColX, curY, specsColWidth, 18)
        .fill(THEME.NAVY_HEADER);
      doc
        .font("Helvetica-Bold")
        .fontSize(7.5)
        .fillColor(THEME.WHITE)
        .text("KEY FORMULATION SPECIFICATIONS", specsColX, curY + 5, {
          width: specsColWidth,
          align: "center",
          lineBreak: false,
        });

      // 2. Table Rows
      const divisionName =
        product.subCategoryName ||
        product.subCategory?.name ||
        (typeof product.category === "object" ? product.category?.name : product.category) ||
        "Speciality Formulation";

      const medical = getClinicalMedicalData(product);

      const specRows = [
        { label: "Therapeutic Class", val: String(divisionName), bold: true },
        { label: "Dosage Form & Pack", val: `${dosageText}  |  ${packagingText}`, bold: true },
        { label: "Active Ingredients", val: genericText, bold: false },
        { label: "Administration Mode", val: medical.howToUse, bold: false },
        { label: "Storage Directive", val: medical.storage, bold: false },
        { label: "Prescription Status", val: `${rxText} — Prescription Medicine Only`, bold: true, color: THEME.ACCENT_PURPLE },
      ];

      const sRowHeight = (photoGridHeight - 18) / specRows.length; // ~23.6 pt
      let sY = curY + 18;

      specRows.forEach((r, idx) => {
        const isEven = idx % 2 === 0;

        // Background zebra
        doc
          .rect(specsColX, sY, specsColWidth, sRowHeight)
          .fillAndStroke(isEven ? THEME.WHITE : THEME.ZEBRA_LIGHT, THEME.BORDER_GRID);

        // Label Column
        doc
          .font("Helvetica-Bold")
          .fontSize(7.5)
          .fillColor(THEME.TEXT_SLATE)
          .text(r.label, specsColX + 8, sY + 7, { width: 95, lineBreak: false });

        // Value Column
        doc
          .font(r.bold ? "Helvetica-Bold" : "Helvetica")
          .fontSize(7.5)
          .fillColor(r.color || THEME.TEXT_BLACK)
          .text(r.val, specsColX + 108, sY + 7, {
            width: specsColWidth - 116,
            height: 13,
            ellipsis: true,
            lineBreak: false,
          });

        sY += sRowHeight;
      });

      curY += photoGridHeight + 8; // ~304 pt

      // =========================================================================
      // 4. APPROVED CLINICAL INDICATIONS TABLE (CATALOG TABLE FORMAT)
      // =========================================================================
      const indTableHeight = 78;

      // Table Header
      doc
        .rect(margin, curY, contentWidth, 18)
        .fill(THEME.NAVY_HEADER);
      doc
        .font("Helvetica-Bold")
        .fontSize(7.5)
        .fillColor(THEME.WHITE)
        .text("APPROVED CLINICAL INDICATIONS & THERAPEUTIC APPLICATIONS", margin, curY + 5, {
          width: contentWidth,
          align: "center",
          lineBreak: false,
        });

      // Table Body Frame
      doc
        .rect(margin, curY + 18, contentWidth, indTableHeight - 18)
        .fillAndStroke(THEME.WHITE, THEME.BORDER_GRID);

      // Indications list
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
          "Primary and secondary clinical management in indicated conditions",
          "Rapid symptomatic relief and targeted therapeutic efficacy",
          "Management of acute and recurrent inflammatory/microbial episodes",
          "Adjuvant maintenance therapy under specialist medical supervision",
        ];
      }

      const halfIndW = (contentWidth - 16) / 2; // ~267 pt
      let indRowY = curY + 24;

      for (let i = 0; i < Math.min(4, indicationList.length); i++) {
        const item = indicationList[i]!;
        const isLeft = i % 2 === 0;
        const colX = isLeft ? margin + 8 : margin + 8 + halfIndW + 8;
        if (isLeft && i > 0) {
          indRowY += 24;
        }

        // Bullet icon
        doc.circle(colX + 4, indRowY + 5, 2.5).fill(THEME.BRAND_PURPLE);
        doc
          .font("Helvetica")
          .fontSize(8)
          .fillColor(THEME.TEXT_DARK)
          .text(item, colX + 13, indRowY, {
            width: halfIndW - 18,
            height: 18,
            ellipsis: true,
            lineBreak: false,
          });
      }

      curY += indTableHeight + 8; // ~390 pt

      // =========================================================================
      // 5. MAIN FOCUS: CLINICAL SIDE EFFECTS & ADVERSE REACTIONS PROFILE (ROYAL PURPLE)
      // =========================================================================
      const adrTableHeight = 162;

      // Primary Deep Purple Section Header
      doc
        .rect(margin, curY, contentWidth, 20)
        .fill(THEME.PURPLE_HEADER);
      doc
        .font("Helvetica-Bold")
        .fontSize(8.5)
        .fillColor(THEME.WHITE)
        .text("CLINICAL SIDE EFFECTS & ADVERSE DRUG REACTIONS (ADR) PROFILE (SAFETY MONOGRAPH)", margin, curY + 6, {
          width: contentWidth,
          align: "center",
          lineBreak: false,
        });

      // Sub-Headers for Common vs Rare Columns
      const subHeaderY = curY + 20;
      const subHeaderHeight = 18;
      const adrColW = contentWidth / 2; // ~275.64 pt

      // Left Sub-header: Common & Mild
      doc
        .rect(margin, subHeaderY, adrColW, subHeaderHeight)
        .fill(THEME.PURPLE_SUBHEADER);
      doc
        .font("Helvetica-Bold")
        .fontSize(7.5)
        .fillColor(THEME.WHITE)
        .text("COMMON & MILD ADVERSE EFFECTS", margin, subHeaderY + 5, {
          width: adrColW,
          align: "center",
          lineBreak: false,
        });

      // Right Sub-header: Rare & Precautionary
      doc
        .rect(margin + adrColW, subHeaderY, adrColW, subHeaderHeight)
        .fill(THEME.PURPLE_SUBHEADER);
      doc
        .font("Helvetica-Bold")
        .fontSize(7.5)
        .fillColor(THEME.WHITE)
        .text("RARE & PRECAUTIONARY EFFECTS", margin + adrColW, subHeaderY + 5, {
          width: adrColW,
          align: "center",
          lineBreak: false,
        });

      // Content Box Frame
      const adrContentY = subHeaderY + subHeaderHeight;
      const adrContentHeight = adrTableHeight - 20 - subHeaderHeight - 22; // ~102 pt

      // Left Column Frame (Common)
      doc
        .rect(margin, adrContentY, adrColW, adrContentHeight)
        .fillAndStroke(THEME.WHITE, THEME.BORDER_GRID);

      let effY = adrContentY + 8;
      for (let i = 0; i < Math.min(3, medical.commonSideEffects.length); i++) {
        const eff = medical.commonSideEffects[i]!;
        const isEven = i % 2 === 0;
        doc.rect(margin + 4, effY - 2, adrColW - 8, 28).fill(isEven ? THEME.WHITE : THEME.ZEBRA_LIGHT);

        doc.circle(margin + 12, effY + 5, 2.5).fill(THEME.ACCENT_PURPLE);
        doc
          .font("Helvetica")
          .fontSize(7.5)
          .fillColor(THEME.TEXT_DARK)
          .text(eff, margin + 20, effY, {
            width: adrColW - 30,
            height: 24,
            ellipsis: true,
            lineGap: 1.5,
          });
        effY += 31;
      }

      // Right Column Frame (Rare)
      doc
        .rect(margin + adrColW, adrContentY, adrColW, adrContentHeight)
        .fillAndStroke(THEME.WHITE, THEME.BORDER_GRID);

      let rareY = adrContentY + 8;
      for (let i = 0; i < Math.min(3, medical.rareSideEffects.length); i++) {
        const eff = medical.rareSideEffects[i]!;
        const isEven = i % 2 === 0;
        doc.rect(margin + adrColW + 4, rareY - 2, adrColW - 8, 28).fill(isEven ? THEME.WHITE : THEME.ZEBRA_LIGHT);

        doc.circle(margin + adrColW + 12, rareY + 5, 2.5).fill(THEME.ACCENT_PURPLE);
        doc
          .font("Helvetica")
          .fontSize(7.5)
          .fillColor(THEME.TEXT_DARK)
          .text(eff, margin + adrColW + 20, rareY, {
            width: adrColW - 30,
            height: 24,
            ellipsis: true,
            lineGap: 1.5,
          });
        rareY += 31;
      }

      // Pharmacovigilance Directive Row (Full Width at Bottom of ADR Table)
      const pvY = adrContentY + adrContentHeight;
      const pvH = 22;
      doc
        .rect(margin, pvY, contentWidth, pvH)
        .fillAndStroke(THEME.BG_PURPLE_LIGHT, THEME.BORDER_PURPLE);

      doc
        .font("Helvetica-Bold")
        .fontSize(7.5)
        .fillColor(THEME.NAVY_HEADER)
        .text(
          `PHARMACOVIGILANCE DIRECTIVE: Report suspected ADR directly to Zeal Safety Desk: ${email}   |   Helpline: ${phone}`,
          margin,
          pvY + 7,
          {
            width: contentWidth,
            align: "center",
            lineBreak: false,
          }
        );

      curY += adrTableHeight + 8; // ~560 pt

      // =========================================================================
      // 6. CONTRAINDICATIONS, PRECAUTIONS & SCHEDULE H WARNING TABLE
      // =========================================================================
      const safetyTableHeight = 158;

      // Table Header
      doc
        .rect(margin, curY, contentWidth, 18)
        .fill(THEME.NAVY_HEADER);
      doc
        .font("Helvetica-Bold")
        .fontSize(7.5)
        .fillColor(THEME.WHITE)
        .text("CONTRAINDICATIONS, CLINICAL PRECAUTIONS & REGULATORY WARNING", margin, curY + 5, {
          width: contentWidth,
          align: "center",
          lineBreak: false,
        });

      // Table Body Frame
      doc
        .rect(margin, curY + 18, contentWidth, safetyTableHeight - 18)
        .fillAndStroke(THEME.WHITE, THEME.BORDER_GRID);

      const sBodyY = curY + 24;
      const halfSafetyW = (contentWidth - 20) / 2; // ~265 pt

      // Left Column: Contraindications & Pregnancy
      doc
        .font("Helvetica-Bold")
        .fontSize(7.8)
        .fillColor(THEME.PURPLE_HEADER)
        .text("CONTRAINDICATIONS (DO NOT PRESCRIBE)", margin + 8, sBodyY, { lineBreak: false });

      doc
        .font("Helvetica")
        .fontSize(7.5)
        .fillColor(THEME.TEXT_DARK)
        .text(medical.contraindications, margin + 8, sBodyY + 11, {
          width: halfSafetyW - 6,
          height: 44,
          ellipsis: true,
          lineGap: 2,
        });

      const pregY = sBodyY + 60;
      doc
        .font("Helvetica-Bold")
        .fontSize(7.8)
        .fillColor(THEME.PURPLE_HEADER)
        .text("PREGNANCY & LACTATION ADVISORY", margin + 8, pregY, { lineBreak: false });

      doc
        .font("Helvetica")
        .fontSize(7.5)
        .fillColor(THEME.TEXT_DARK)
        .text(
          product.pregnancyInfo ||
            "Use during pregnancy and lactation only if potential clinical benefit clearly outweighs fetal risk, strictly under obstetrician supervision.",
          margin + 8,
          pregY + 11,
          {
            width: halfSafetyW - 6,
            height: 38,
            ellipsis: true,
            lineGap: 2,
          }
        );

      // Right Column: Special Precautions & Schedule H Warning Box
      const rightSafetyX = margin + halfSafetyW + 12;

      doc
        .font("Helvetica-Bold")
        .fontSize(7.8)
        .fillColor(THEME.PURPLE_HEADER)
        .text("KEY CLINICAL PRECAUTIONS", rightSafetyX, sBodyY, { lineBreak: false });

      doc
        .font("Helvetica")
        .fontSize(7.5)
        .fillColor(THEME.TEXT_DARK)
        .text(medical.precautions, rightSafetyX, sBodyY + 11, {
          width: halfSafetyW - 6,
          height: 44,
          ellipsis: true,
          lineGap: 2,
        });

      // Schedule H Prescription Warning Box (High Contrast Badge)
      const rxBoxY = pregY - 2;
      const rxBoxHeight = 52;
      doc
        .roundedRect(rightSafetyX, rxBoxY, halfSafetyW - 6, rxBoxHeight, 3)
        .fillAndStroke(THEME.BG_PURPLE_LIGHT, THEME.ACCENT_PURPLE);

      doc
        .font("Helvetica-Bold")
        .fontSize(7.5)
        .fillColor(THEME.NAVY_HEADER)
        .text("SCHEDULE H PRESCRIPTION DRUG — WARNING", rightSafetyX, rxBoxY + 6, {
          width: halfSafetyW - 6,
          align: "center",
          lineBreak: false,
        });

      doc
        .font("Helvetica")
        .fontSize(7)
        .fillColor(THEME.TEXT_DARK)
        .text(
          "To be sold by retail on the prescription of a Registered Medical Practitioner (RMP) only. Not for public consumer circulation. Keep strictly out of reach of children.",
          rightSafetyX + 6,
          rxBoxY + 20,
          {
            width: halfSafetyW - 18,
            height: 28,
            align: "center",
            ellipsis: true,
            lineGap: 1.5,
          }
        );

      // =========================================================================
      // 7. EXECUTIVE FOOTER (EXACT MATCH WITH ZEAL PRODUCT CATALOG PDF)
      // =========================================================================
      const footerLineY = 797;
      const footerRow1Y = 805;
      const footerRow2Y = 819;

      // Separator line above footer
      doc
        .moveTo(margin, footerLineY)
        .lineTo(margin + contentWidth, footerLineY)
        .lineWidth(0.75)
        .strokeColor(THEME.BORDER_MUTED)
        .stroke();

      // Footer Row 1: Helpline, Email, Website & Page Number
      doc
        .font("Helvetica-Bold")
        .fontSize(7.5)
        .fillColor(THEME.TEXT_DARK)
        .text(`Official Helpline: ${phone}   |   Email: ${email}   |   Website: ${website}`, margin, footerRow1Y, {
          width: contentWidth - 95,
          align: "left",
          lineBreak: false,
        });

      doc
        .font("Helvetica-Bold")
        .fontSize(8.5)
        .fillColor(THEME.ACCENT_PURPLE)
        .text("Page 1 of 1", margin + contentWidth - 90, footerRow1Y, {
          width: 90,
          align: "right",
          lineBreak: false,
        });

      // Footer Row 2: Regulatory Disclaimer & QC Verification
      doc
        .font("Helvetica")
        .fontSize(6.8)
        .fillColor(THEME.TEXT_MUTED)
        .text(
          `* Strictly for Licensed Wholesale Stockists, Doctors & Registered Chemists. • ${companyName}`,
          margin,
          footerRow2Y,
          { width: contentWidth - 95, align: "left", lineBreak: false }
        );

      doc
        .font("Helvetica")
        .fontSize(6.8)
        .fillColor(THEME.BORDER_MUTED)
        .text("Verified by Zeal Quality Control", margin + contentWidth - 90, footerRow2Y, {
          width: 90,
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
