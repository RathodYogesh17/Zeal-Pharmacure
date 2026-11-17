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
// COLOR PALETTE: PURE ROYAL PURPLE & READABLE SLATE GRAY THEME
// =========================================================================
const PURPLE = {
  DARKEST: "#3B0764",   // Deepest purple for strong titles
  DEEP: "#4C1D95",      // Dark violet for primary headers
  PRIMARY: "#6D28D9",   // Brand royal purple
  VIBRANT: "#7C3AED",   // Vibrant accent purple for badges
  ACCENT: "#8B5CF6",    // Medium purple for bullets & borders
  LIGHT_BG: "#FAF5FF",  // Crisp 50-shade card background
  MUTED_BG: "#F5F3FF",  // 100-shade section header background
  BORDER: "#DDD6FE",    // Light purple border
  BORDER_LIGHT: "#EDE9FE",
};

const TEXT = {
  BLACK: "#0F172A",     // Pure dark for primary headings
  DARK_GRAY: "#1E293B", // Primary body text - high contrast & legible
  MID_GRAY: "#475569",  // Secondary body & labels
  MUTED_GRAY: "#64748B",// Subtitles & directives
  LIGHT_GRAY: "#94A3B8",// Dividers & subtle borders
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
    } catch {
      // Continue search
    }
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

  // High-clarity formulation fallback side effects
  if (commonSideEffects.length === 0) {
    if (dosage.includes("CREAM") || dosage.includes("OINTMENT") || dosage.includes("LOTION") || dosage.includes("GEL")) {
      commonSideEffects = [
        "Mild transient localized burning or erythema at site of application",
        "Temporary localized skin peeling or dryness during initial therapy",
        "Mild cutaneous pruritus; typically subsides upon continued use",
      ];
      rareSideEffects = [
        "Contact allergic sensitization or localized dermatitis",
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
 * with spacious layout, readable typography (8pt-10pt), pure purple theme,
 * angle-wise photos, top header (logo, name, phone, email, website only),
 * bottom footer (company name + page number only), and primary focus on side effects.
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
        margins: { top: 0, bottom: 0, left: 26, right: 26 },
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

      const margin = 26;
      const contentWidth = 543.28; // 595.28 - 26 * 2

      // Company info
      const companyName = options.companyName || "ZEAL PHARMACURE PVT. LTD.";
      const phone = options.phone || "+91 9909160190";
      const email = options.email || "zealpharmacure@gmail.com";
      const website = options.website || "www.zealpharmacure.com";

      // =========================================================================
      // 1. TOP HEADER (CLEAN: ONLY LOGO, NAME, CONTACT, EMAIL & WEBSITE)
      // =========================================================================
      const headerY = 16;
      const logoSize = 42;
      let textStartX = margin;

      if (logoBuffer) {
        try {
          doc.image(logoBuffer, margin, headerY + 1, {
            width: logoSize,
            height: logoSize,
          });
          textStartX = margin + logoSize + 12;
        } catch {
          textStartX = margin;
        }
      }

      // Company Brand Lockup (Left)
      doc
        .font("Helvetica-Bold")
        .fontSize(15)
        .fillColor(PURPLE.DARKEST)
        .text(companyName, textStartX, headerY + 4, { lineBreak: false });

      doc
        .font("Helvetica-Bold")
        .fontSize(8)
        .fillColor(PURPLE.PRIMARY)
        .text("SCIENTIFIC PRODUCT VISUAL AID & DRUG MONOGRAPH", textStartX, headerY + 23, { lineBreak: false });

      // Clean Contact Details (Right side)
      const contactBoxWidth = 200;
      const contactBoxX = margin + contentWidth - contactBoxWidth;
      const contactTextY = headerY + 4;

      doc
        .font("Helvetica")
        .fontSize(8)
        .fillColor(TEXT.DARK_GRAY)
        .text(`Helpline: ${phone}`, contactBoxX, contactTextY, {
          width: contactBoxWidth,
          align: "right",
          lineBreak: false,
        });

      doc
        .font("Helvetica")
        .fontSize(8)
        .fillColor(TEXT.DARK_GRAY)
        .text(`Email: ${email}`, contactBoxX, contactTextY + 13, {
          width: contactBoxWidth,
          align: "right",
          lineBreak: false,
        });

      doc
        .font("Helvetica-Bold")
        .fontSize(8)
        .fillColor(PURPLE.PRIMARY)
        .text(website, contactBoxX, contactTextY + 26, {
          width: contactBoxWidth,
          align: "right",
          lineBreak: false,
        });

      // Header Separator Line in Brand Purple
      const headerDividerY = 64;
      doc
        .moveTo(margin, headerDividerY)
        .lineTo(margin + contentWidth, headerDividerY)
        .lineWidth(1)
        .strokeColor(PURPLE.PRIMARY)
        .stroke();

      // =========================================================================
      // 2. PRODUCT TITLE & IDENTITY BAR
      // =========================================================================
      let curY = 72;
      const titleBoxHeight = 44;

      doc
        .roundedRect(margin, curY, contentWidth, titleBoxHeight, 4)
        .fillAndStroke(PURPLE.LIGHT_BG, PURPLE.BORDER);

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

      // Badges from right to left
      let badgeRightX = margin + contentWidth - 10;
      const badgeY = curY + (titleBoxHeight - 20) / 2;

      // 1. MRP Badge (if available)
      if (mrpText) {
        const mrpW = Math.max(62, mrpText.length * 6 + 14);
        badgeRightX -= mrpW;
        doc
          .roundedRect(badgeRightX, badgeY, mrpW, 20, 3)
          .fillAndStroke(PURPLE.MUTED_BG, PURPLE.BORDER);
        doc
          .font("Helvetica-Bold")
          .fontSize(8)
          .fillColor(PURPLE.PRIMARY)
          .text(mrpText, badgeRightX, badgeY + 5.5, { width: mrpW, align: "center", lineBreak: false });
        badgeRightX -= 8;
      }

      // 2. Packaging Badge
      const packW = Math.max(66, packagingText.length * 5.6 + 14);
      badgeRightX -= packW;
      doc
        .roundedRect(badgeRightX, badgeY, packW, 20, 3)
        .fillAndStroke("#FFFFFF", PURPLE.BORDER);
      doc
        .font("Helvetica-Bold")
        .fontSize(8)
        .fillColor(TEXT.DARK_GRAY)
        .text(packagingText, badgeRightX, badgeY + 5.5, { width: packW, align: "center", lineBreak: false });
      badgeRightX -= 8;

      // 3. Dosage Form Badge
      const dosageW = Math.max(56, dosageText.length * 5.8 + 14);
      badgeRightX -= dosageW;
      doc
        .roundedRect(badgeRightX, badgeY, dosageW, 20, 3)
        .fillAndStroke(PURPLE.MUTED_BG, PURPLE.BORDER);
      doc
        .font("Helvetica-Bold")
        .fontSize(8)
        .fillColor(PURPLE.PRIMARY)
        .text(dosageText, badgeRightX, badgeY + 5.5, { width: dosageW, align: "center", lineBreak: false });
      badgeRightX -= 8;

      // 4. Rx Badge
      const rxW = 34;
      badgeRightX -= rxW;
      doc
        .roundedRect(badgeRightX, badgeY, rxW, 20, 3)
        .fillAndStroke(PURPLE.MUTED_BG, PURPLE.VIBRANT);
      doc
        .font("Helvetica-Bold")
        .fontSize(8.5)
        .fillColor(PURPLE.DARKEST)
        .text(rxText, badgeRightX, badgeY + 5.5, { width: rxW, align: "center", lineBreak: false });

      // Title & Generic Text on Left
      const titleAvailableWidth = badgeRightX - margin - 16;
      doc
        .font("Helvetica-Bold")
        .fontSize(15)
        .fillColor(TEXT.BLACK)
        .text(productName, margin + 12, curY + 7, {
          width: titleAvailableWidth,
          lineBreak: false,
          ellipsis: true,
        });

      doc
        .font("Helvetica-Oblique")
        .fontSize(8.5)
        .fillColor(PURPLE.PRIMARY)
        .text(genericText, margin + 12, curY + 26, {
          width: titleAvailableWidth,
          height: 14,
          ellipsis: true,
          lineBreak: false,
        });

      curY += titleBoxHeight + 8;

      // =========================================================================
      // 3. PRODUCT ANGLE-WISE PHOTOS & KEY FORMULATION SPECIFICATIONS
      // =========================================================================
      const photoSectionHeight = 166;
      const photoCardWidth = 252;
      const specsCardWidth = contentWidth - photoCardWidth - 10; // ~281 pt
      const specsCardX = margin + photoCardWidth + 10;

      // --- Left: Angle-Wise Photo Showcase Box ---
      doc
        .roundedRect(margin, curY, photoCardWidth, photoSectionHeight, 4)
        .fillAndStroke("#FFFFFF", PURPLE.BORDER);

      // Centered Header Bar
      const photoHeaderHeight = 20;
      doc
        .roundedRect(margin, curY, photoCardWidth, photoHeaderHeight, 4)
        .fill(PURPLE.MUTED_BG);
      doc
        .font("Helvetica-Bold")
        .fontSize(8)
        .fillColor(PURPLE.PRIMARY)
        .text("PRODUCT PACKSHOT & ANGLE PRESENTATION", margin, curY + 6, {
          width: photoCardWidth,
          align: "center",
          lineBreak: false,
        });

      // Render Photo(s)
      const photoAreaY = curY + photoHeaderHeight + 7;
      const photoAreaHeight = photoSectionHeight - photoHeaderHeight - 14; // ~132 pt

      if (productPhotos.length >= 2) {
        // Multi-angle: 2 photo frames side by side
        const colW = (photoCardWidth - 20) / 2; // ~116 pt
        const leftX = margin + 7;
        const rightX = margin + 7 + colW + 6;

        // Frame 1
        doc
          .roundedRect(leftX, photoAreaY, colW, photoAreaHeight, 3)
          .fillAndStroke(PURPLE.LIGHT_BG, PURPLE.BORDER_LIGHT);
        try {
          doc.image(productPhotos[0]!.buffer, leftX + 4, photoAreaY + 5, {
            fit: [colW - 8, photoAreaHeight - 22],
            align: "center",
            valign: "center",
          });
        } catch {}
        doc
          .font("Helvetica-Bold")
          .fontSize(7)
          .fillColor(TEXT.MID_GRAY)
          .text(productPhotos[0]!.label, leftX, photoAreaY + photoAreaHeight - 14, {
            width: colW,
            align: "center",
            lineBreak: false,
            ellipsis: true,
          });

        // Frame 2
        doc
          .roundedRect(rightX, photoAreaY, colW, photoAreaHeight, 3)
          .fillAndStroke(PURPLE.LIGHT_BG, PURPLE.BORDER_LIGHT);
        try {
          doc.image(productPhotos[1]!.buffer, rightX + 4, photoAreaY + 5, {
            fit: [colW - 8, photoAreaHeight - 22],
            align: "center",
            valign: "center",
          });
        } catch {}
        doc
          .font("Helvetica-Bold")
          .fontSize(7)
          .fillColor(TEXT.MID_GRAY)
          .text(productPhotos[1]!.label, rightX, photoAreaY + photoAreaHeight - 14, {
            width: colW,
            align: "center",
            lineBreak: false,
            ellipsis: true,
          });
      } else if (productPhotos.length === 1) {
        // Single packshot angle - spacious centered display
        const frameW = photoCardWidth - 14;
        const frameX = margin + 7;

        doc
          .roundedRect(frameX, photoAreaY, frameW, photoAreaHeight, 3)
          .fillAndStroke(PURPLE.LIGHT_BG, PURPLE.BORDER_LIGHT);
        try {
          doc.image(productPhotos[0]!.buffer, frameX + 6, photoAreaY + 5, {
            fit: [frameW - 12, photoAreaHeight - 22],
            align: "center",
            valign: "center",
          });
        } catch {}
        doc
          .font("Helvetica-Bold")
          .fontSize(7.5)
          .fillColor(TEXT.MID_GRAY)
          .text("Primary Formulation Angle Packshot", frameX, photoAreaY + photoAreaHeight - 14, {
            width: frameW,
            align: "center",
            lineBreak: false,
          });
      } else {
        // High quality vector silhouette fallback
        const frameW = photoCardWidth - 14;
        const frameX = margin + 7;
        doc
          .roundedRect(frameX, photoAreaY, frameW, photoAreaHeight, 3)
          .fillAndStroke(PURPLE.LIGHT_BG, PURPLE.BORDER_LIGHT);

        doc
          .font("Helvetica-Bold")
          .fontSize(11)
          .fillColor(PURPLE.VIBRANT)
          .text(dosageText, frameX, photoAreaY + 44, { width: frameW, align: "center", lineBreak: false });

        doc
          .font("Helvetica")
          .fontSize(8)
          .fillColor(TEXT.MUTED_GRAY)
          .text("Standardized Pharmaceutical Packaging Specimen", frameX, photoAreaY + 62, {
            width: frameW,
            align: "center",
            lineBreak: false,
          });
      }

      // --- Right: Key Formulation Specifications (Single Airy, Unified Card) ---
      doc
        .roundedRect(specsCardX, curY, specsCardWidth, photoSectionHeight, 4)
        .fillAndStroke("#FFFFFF", PURPLE.BORDER);

      doc
        .roundedRect(specsCardX, curY, specsCardWidth, photoHeaderHeight, 4)
        .fill(PURPLE.MUTED_BG);
      doc
        .font("Helvetica-Bold")
        .fontSize(8)
        .fillColor(PURPLE.PRIMARY)
        .text("KEY FORMULATION SPECIFICATIONS", specsCardX, curY + 6, {
          width: specsCardWidth,
          align: "center",
          lineBreak: false,
        });

      const divisionName =
        product.subCategoryName ||
        product.subCategory?.name ||
        (typeof product.category === "object" ? product.category?.name : product.category) ||
        "Speciality Formulation";

      const medical = getClinicalMedicalData(product);
      let specRowY = curY + 28;
      const specRowGap = 22;

      // 1. Therapeutic Class
      doc
        .font("Helvetica-Bold")
        .fontSize(8)
        .fillColor(TEXT.MID_GRAY)
        .text("Therapeutic Class:", specsCardX + 12, specRowY, { lineBreak: false });
      doc
        .font("Helvetica-Bold")
        .fontSize(8.5)
        .fillColor(TEXT.BLACK)
        .text(String(divisionName), specsCardX + 98, specRowY, {
          width: specsCardWidth - 108,
          height: 16,
          ellipsis: true,
          lineBreak: false,
        });
      specRowY += specRowGap;

      // 2. Active Composition
      doc
        .font("Helvetica-Bold")
        .fontSize(8)
        .fillColor(TEXT.MID_GRAY)
        .text("Composition:", specsCardX + 12, specRowY, { lineBreak: false });
      doc
        .font("Helvetica")
        .fontSize(8)
        .fillColor(TEXT.DARK_GRAY)
        .text(genericText, specsCardX + 98, specRowY, {
          width: specsCardWidth - 108,
          height: 16,
          ellipsis: true,
          lineBreak: false,
        });
      specRowY += specRowGap;

      // 3. Dosage & Pack
      doc
        .font("Helvetica-Bold")
        .fontSize(8)
        .fillColor(TEXT.MID_GRAY)
        .text("Dosage & Pack:", specsCardX + 12, specRowY, { lineBreak: false });
      doc
        .font("Helvetica")
        .fontSize(8.5)
        .fillColor(TEXT.BLACK)
        .text(`${dosageText}  |  ${packagingText}`, specsCardX + 98, specRowY, {
          width: specsCardWidth - 108,
          height: 16,
          ellipsis: true,
          lineBreak: false,
        });
      specRowY += specRowGap;

      // 4. Administration
      doc
        .font("Helvetica-Bold")
        .fontSize(8)
        .fillColor(TEXT.MID_GRAY)
        .text("Administration:", specsCardX + 12, specRowY, { lineBreak: false });
      doc
        .font("Helvetica")
        .fontSize(8)
        .fillColor(TEXT.DARK_GRAY)
        .text(medical.howToUse, specsCardX + 98, specRowY, {
          width: specsCardWidth - 108,
          height: 16,
          ellipsis: true,
          lineBreak: false,
        });
      specRowY += specRowGap;

      // 5. Storage Condition
      doc
        .font("Helvetica-Bold")
        .fontSize(8)
        .fillColor(TEXT.MID_GRAY)
        .text("Storage:", specsCardX + 12, specRowY, { lineBreak: false });
      doc
        .font("Helvetica")
        .fontSize(8)
        .fillColor(TEXT.DARK_GRAY)
        .text(medical.storage, specsCardX + 98, specRowY, {
          width: specsCardWidth - 108,
          height: 16,
          ellipsis: true,
          lineBreak: false,
        });
      specRowY += specRowGap;

      // 6. Classification
      doc
        .font("Helvetica-Bold")
        .fontSize(8)
        .fillColor(TEXT.MID_GRAY)
        .text("Classification:", specsCardX + 12, specRowY, { lineBreak: false });
      doc
        .font("Helvetica-Bold")
        .fontSize(8)
        .fillColor(PURPLE.VIBRANT)
        .text(`${rxText} — Prescription Medicine Only`, specsCardX + 98, specRowY, {
          width: specsCardWidth - 108,
          height: 16,
          ellipsis: true,
          lineBreak: false,
        });

      curY += photoSectionHeight + 8;

      // =========================================================================
      // 4. APPROVED CLINICAL INDICATIONS (CLEAN, AIRY & READABLE)
      // =========================================================================
      const indSectionHeight = 88;
      doc
        .roundedRect(margin, curY, contentWidth, indSectionHeight, 4)
        .fillAndStroke("#FFFFFF", PURPLE.BORDER);

      // Centered Header
      doc
        .roundedRect(margin, curY, contentWidth, 20, 4)
        .fill(PURPLE.MUTED_BG);
      doc
        .font("Helvetica-Bold")
        .fontSize(8)
        .fillColor(PURPLE.PRIMARY)
        .text("APPROVED CLINICAL INDICATIONS & THERAPEUTIC USES", margin, curY + 6, {
          width: contentWidth,
          align: "center",
          lineBreak: false,
        });

      // Indications list (Focused on top 4)
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

      const halfIndCol = (contentWidth - 28) / 2; // ~257 pt
      let indRowY = curY + 28;

      for (let i = 0; i < Math.min(4, indicationList.length); i++) {
        const item = indicationList[i]!;
        const isLeft = i % 2 === 0;
        const colX = isLeft ? margin + 14 : margin + 14 + halfIndCol + 8;
        if (isLeft && i > 0) {
          indRowY += 24;
        }

        // Purple Bullet Point
        doc.circle(colX + 3, indRowY + 5, 3).fill(PURPLE.VIBRANT);
        doc
          .font("Helvetica")
          .fontSize(8.5)
          .fillColor(TEXT.DARK_GRAY)
          .text(item, colX + 12, indRowY, {
            width: halfIndCol - 16,
            height: 20,
            ellipsis: true,
            lineBreak: false,
          });
      }

      curY += indSectionHeight + 8;

      // =========================================================================
      // 5. MAIN FOCUS: CLINICAL SIDE EFFECTS & ADVERSE REACTIONS PROFILE
      // =========================================================================
      const adrSectionHeight = 162;
      doc
        .roundedRect(margin, curY, contentWidth, adrSectionHeight, 4)
        .fillAndStroke("#FFFFFF", PURPLE.PRIMARY);

      // Solid Brand Purple Header Bar (Centered)
      const adrHeaderHeight = 22;
      doc
        .roundedRect(margin, curY, contentWidth, adrHeaderHeight, 4)
        .fill(PURPLE.PRIMARY);
      doc
        .font("Helvetica-Bold")
        .fontSize(9)
        .fillColor("#FFFFFF")
        .text("CLINICAL SIDE EFFECTS & ADVERSE DRUG REACTIONS (ADR) PROFILE", margin, curY + 6.5, {
          width: contentWidth,
          align: "center",
          lineBreak: false,
        });

      const adrContentY = curY + adrHeaderHeight + 8;
      const subAdrBoxHeight = 100;
      const subAdrColW = (contentWidth - 18) / 2; // ~262 pt

      // Box 1: Common / Mild Effects
      doc
        .roundedRect(margin + 6, adrContentY, subAdrColW, subAdrBoxHeight, 3)
        .fillAndStroke(PURPLE.LIGHT_BG, PURPLE.BORDER);

      doc
        .font("Helvetica-Bold")
        .fontSize(8)
        .fillColor(PURPLE.DEEP)
        .text("COMMON & MILD ADVERSE EFFECTS", margin + 14, adrContentY + 8, { lineBreak: false });

      let effCurY = adrContentY + 24;
      for (let i = 0; i < Math.min(3, medical.commonSideEffects.length); i++) {
        const eff = medical.commonSideEffects[i]!;
        doc.circle(margin + 17, effCurY + 4, 2.5).fill(PURPLE.ACCENT);
        doc
          .font("Helvetica")
          .fontSize(8)
          .fillColor(TEXT.DARK_GRAY)
          .text(eff, margin + 25, effCurY, {
            width: subAdrColW - 32,
            height: 20,
            ellipsis: true,
            lineGap: 1.5,
          });
        effCurY += 24;
      }

      // Box 2: Rare & Precautionary Effects
      const box2X = margin + 6 + subAdrColW + 6;
      doc
        .roundedRect(box2X, adrContentY, subAdrColW, subAdrBoxHeight, 3)
        .fillAndStroke(PURPLE.LIGHT_BG, PURPLE.BORDER);

      doc
        .font("Helvetica-Bold")
        .fontSize(8)
        .fillColor(PURPLE.DEEP)
        .text("RARE & PRECAUTIONARY EFFECTS", box2X + 10, adrContentY + 8, { lineBreak: false });

      let rareCurY = adrContentY + 24;
      for (let i = 0; i < Math.min(3, medical.rareSideEffects.length); i++) {
        const eff = medical.rareSideEffects[i]!;
        doc.circle(box2X + 13, rareCurY + 4, 2.5).fill(PURPLE.ACCENT);
        doc
          .font("Helvetica")
          .fontSize(8)
          .fillColor(TEXT.DARK_GRAY)
          .text(eff, box2X + 21, rareCurY, {
            width: subAdrColW - 28,
            height: 20,
            ellipsis: true,
            lineGap: 1.5,
          });
        rareCurY += 24;
      }

      // Pharmacovigilance Directive Strip (Centered below side effects boxes)
      const pvBoxY = adrContentY + subAdrBoxHeight + 6;
      const pvBoxHeight = 20;
      doc
        .roundedRect(margin + 6, pvBoxY, contentWidth - 12, pvBoxHeight, 3)
        .fill(PURPLE.MUTED_BG);
      doc
        .font("Helvetica-Bold")
        .fontSize(7.5)
        .fillColor(PURPLE.DARKEST)
        .text(
          `PHARMACOVIGILANCE DIRECTIVE: Report suspected ADR directly to Zeal Safety Desk: ${email}  |  Helpline: ${phone}`,
          margin + 6,
          pvBoxY + 6,
          {
            width: contentWidth - 12,
            align: "center",
            lineBreak: false,
          }
        );

      curY += adrSectionHeight + 8;

      // =========================================================================
      // 6. CONTRAINDICATIONS, PRECAUTIONS & SCHEDULE WARNING
      // =========================================================================
      const safetySectionHeight = 164;
      doc
        .roundedRect(margin, curY, contentWidth, safetySectionHeight, 4)
        .fillAndStroke("#FFFFFF", PURPLE.BORDER);

      // Centered Header
      doc
        .roundedRect(margin, curY, contentWidth, 20, 4)
        .fill(PURPLE.MUTED_BG);
      doc
        .font("Helvetica-Bold")
        .fontSize(8)
        .fillColor(PURPLE.PRIMARY)
        .text("CONTRAINDICATIONS, CLINICAL PRECAUTIONS & REGULATORY WARNING", margin, curY + 6, {
          width: contentWidth,
          align: "center",
          lineBreak: false,
        });

      const safetyBodyY = curY + 28;
      const halfSafetyColW = (contentWidth - 28) / 2; // ~257 pt

      // Left Column: Contraindications & Pregnancy
      doc
        .font("Helvetica-Bold")
        .fontSize(8)
        .fillColor(PURPLE.DEEP)
        .text("CONTRAINDICATIONS (DO NOT PRESCRIBE)", margin + 12, safetyBodyY, { lineBreak: false });

      doc
        .font("Helvetica")
        .fontSize(8)
        .fillColor(TEXT.DARK_GRAY)
        .text(medical.contraindications, margin + 12, safetyBodyY + 12, {
          width: halfSafetyColW - 6,
          height: 48,
          ellipsis: true,
          lineGap: 2.5,
        });

      const popY = safetyBodyY + 68;
      doc
        .font("Helvetica-Bold")
        .fontSize(8)
        .fillColor(PURPLE.DEEP)
        .text("PREGNANCY & LACTATION ADVISORY", margin + 12, popY, { lineBreak: false });

      doc
        .font("Helvetica")
        .fontSize(8)
        .fillColor(TEXT.DARK_GRAY)
        .text(
          product.pregnancyInfo ||
            "Use during pregnancy and lactation only if potential clinical benefit clearly outweighs fetal risk, strictly under obstetrician supervision.",
          margin + 12,
          popY + 12,
          {
            width: halfSafetyColW - 6,
            height: 38,
            ellipsis: true,
            lineGap: 2.5,
          }
        );

      // Right Column: Special Precautions & Schedule H Warning Box
      const rightSafetyX = margin + 14 + halfSafetyColW + 6;

      doc
        .font("Helvetica-Bold")
        .fontSize(8)
        .fillColor(PURPLE.DEEP)
        .text("KEY CLINICAL PRECAUTIONS", rightSafetyX, safetyBodyY, { lineBreak: false });

      doc
        .font("Helvetica")
        .fontSize(8)
        .fillColor(TEXT.DARK_GRAY)
        .text(medical.precautions, rightSafetyX, safetyBodyY + 12, {
          width: halfSafetyColW - 6,
          height: 48,
          ellipsis: true,
          lineGap: 2.5,
        });

      // Schedule H Prescription Warning Box (Clean, Centered, High Contrast)
      const rxBoxY = popY - 2;
      const rxBoxHeight = 58;
      doc
        .roundedRect(rightSafetyX, rxBoxY, halfSafetyColW - 4, rxBoxHeight, 3)
        .fillAndStroke(PURPLE.LIGHT_BG, PURPLE.VIBRANT);

      doc
        .font("Helvetica-Bold")
        .fontSize(8)
        .fillColor(PURPLE.DARKEST)
        .text("SCHEDULE H PRESCRIPTION DRUG — WARNING", rightSafetyX, rxBoxY + 8, {
          width: halfSafetyColW - 4,
          align: "center",
          lineBreak: false,
        });

      doc
        .font("Helvetica")
        .fontSize(7.5)
        .fillColor(TEXT.DARK_GRAY)
        .text(
          "To be sold by retail on the prescription of a Registered Medical Practitioner (RMP) only. Not for public consumer circulation. Keep strictly out of reach of children.",
          rightSafetyX + 8,
          rxBoxY + 22,
          {
            width: halfSafetyColW - 20,
            height: 30,
            align: "center",
            ellipsis: true,
            lineGap: 1.5,
          }
        );

      // =========================================================================
      // 7. BOTTOM FOOTER (ONLY ONE SIDE NAME, OTHER SIDE PAGE NUMBER ONLY)
      // =========================================================================
      const footerLineY = 786;
      const footerTextY = 793;

      // Clean footer separator line in light purple
      doc
        .moveTo(margin, footerLineY)
        .lineTo(margin + contentWidth, footerLineY)
        .lineWidth(0.75)
        .strokeColor(PURPLE.BORDER)
        .stroke();

      // Left: Company Name & Product Name
      doc
        .font("Helvetica-Bold")
        .fontSize(8.5)
        .fillColor(TEXT.DARK_GRAY)
        .text(companyName, margin, footerTextY, { lineBreak: false });

      doc
        .font("Helvetica")
        .fontSize(8)
        .fillColor(TEXT.MUTED_GRAY)
        .text(`   •   ${productName} MONOGRAPH & VISUAL AID`, { continued: false });

      // Right: Page Number ONLY
      doc
        .font("Helvetica-Bold")
        .fontSize(8.5)
        .fillColor(PURPLE.PRIMARY)
        .text("Page 1 of 1", margin + contentWidth - 80, footerTextY, {
          width: 80,
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
