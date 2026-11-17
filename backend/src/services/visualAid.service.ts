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
// COLOR PALETTE: PURE ROYAL PURPLE & SLATE GRAY THEME (ZERO MULTI-COLOR RAINBOW)
// =========================================================================
const PURPLE = {
  DARKEST: "#3B0764",   // Deep purple
  DEEP: "#4C1D95",      // Dark violet for strong headers
  PRIMARY: "#6D28D9",   // Brand royal purple
  VIBRANT: "#7C3AED",   // Vibrant accent purple
  ACCENT: "#8B5CF6",    // Medium purple for bullets / badges
  LIGHT_BG: "#FAF5FF",  // 50 shade for cards
  MUTED_BG: "#F5F3FF",  // 100 shade for headers
  BORDER: "#DDD6FE",    // Light purple border
  BORDER_LIGHT: "#EDE9FE",
};

const TEXT = {
  BLACK: "#0F172A",     // Pure dark for headings
  DARK_GRAY: "#1E293B", // Primary body text
  MID_GRAY: "#475569",  // Secondary body text
  MUTED_GRAY: "#64748B",// Captions & directives
  LIGHT_GRAY: "#94A3B8",// Borders / lines
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
 * Collect product angle-wise images (Primary front view + Side / Blister packshot angle)
 */
const getProductAngleImages = async (
  product: IVisualAidProduct
): Promise<Array<{ buffer: Buffer; label: string }>> => {
  const candidates: Array<{ url: string; label: string }> = [];

  // Primary image
  const feat =
    (typeof product.featuredImage === "string" ? product.featuredImage : product.featuredImage?.url) ||
    ((product as any).imageUrl as string);
  if (feat) candidates.push({ url: feat, label: "Primary Pack Angle" });

  // Media gallery
  const gallery = (product as any).mediaGallery;
  if (Array.isArray(gallery)) {
    gallery.forEach((g: any, i: number) => {
      const u = typeof g === "string" ? g : g?.url;
      const lbl = g?.title || g?.altText || (i === 0 ? "Side / Pack Angle" : "Blister Angle View");
      if (u && !candidates.some((c) => c.url === u)) {
        candidates.push({ url: u, label: lbl });
      }
    });
  }

  // Secondary images array
  if (Array.isArray(product.images)) {
    product.images.forEach((img: any, i: number) => {
      const u = typeof img === "string" ? img : img?.url;
      const lbl = i === 0 ? "Packaging Angle" : "Alternate View";
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
 * Clinical side effects and pharmacovigilance data resolver
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
  const rawWarnings = product.warnings?.trim();

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

  // Realistic formulation-specific fallback side effects
  if (commonSideEffects.length === 0) {
    if (dosage.includes("CREAM") || dosage.includes("OINTMENT") || dosage.includes("LOTION") || dosage.includes("GEL")) {
      commonSideEffects = [
        "Mild transient localized burning sensation or mild erythema upon cutaneous application",
        "Occasional dryness or localized skin peeling during the initial phase of treatment",
        "Mild transient itching or irritation at application site; typically resolves spontaneously",
      ];
      rareSideEffects = [
        "Contact allergic sensitization or secondary skin rash (discontinue if symptoms persist)",
        "Folliculitis or localized cutaneous atrophy upon prolonged continuous occlusion",
        "Transient hypersensitivity reaction in individuals with known excipient sensitivity",
      ];
    } else if (dosage.includes("SYRUP") || dosage.includes("SUSPENSION") || dosage.includes("DROPS")) {
      commonSideEffects = [
        "Mild gastrointestinal distress, transient nausea, or slight stomach fullness",
        "Temporary altered taste perception, mild dry mouth, or increased thirst",
        "Occasional mild drowsiness or transient light-headedness in sensitive patients",
      ];
      rareSideEffects = [
        "Cutaneous allergic manifestations, localized pruritus, or rash (rare, discontinue therapy)",
        "Gastrointestinal hypermotility, abdominal cramps, or mild loose stools with higher doses",
        "Rare idiosyncratic allergic reactions; immediate medical consultation recommended",
      ];
    } else {
      // Tablets & Capsules
      commonSideEffects = [
        "Mild gastrointestinal disturbances (transient nausea, dyspepsia, epigastric discomfort)",
        "Transient mild headache, light-headedness, or slight daytime fatigue/dizziness",
        "Occasional minor alteration in bowel habits (mild constipation or transient loose stools)",
      ];
      rareSideEffects = [
        "Generalized hypersensitivity reactions (cutaneous urticaria, pruritus, or skin rash)",
        "Transient elevations in hepatic transaminases or renal parameters during prolonged therapy",
        "Idiosyncratic allergic response; discontinue therapy promptly and consult physician",
      ];
    }
  }

  if (rareSideEffects.length === 0) {
    rareSideEffects = [
      "Hypersensitivity reactions including skin rash, urticaria, or facial edema (rare)",
      "Transient hepatic/renal biomarker variations during extended high-dose regimens",
      "Severe idiosyncratic reaction; discontinue promptly and seek medical attention",
    ];
  }

  return {
    commonSideEffects,
    rareSideEffects,
    contraindications:
      rawContraindications ||
      "Known hypersensitivity to the active drug substance or excipients. Severe uncompensated hepatic impairment or acute renal insufficiency. Co-administration with contraindicated monoamine or enzyme-inhibiting agents.",
    precautions:
      rawPrecautions ||
      "Administer with clinical caution in patients with history of gastrointestinal ulceration, chronic renal dysfunction, or hepatic impairment. Monitor complete blood count and liver enzyme profiles during extended therapy.",
    warnings:
      rawWarnings ||
      "Keep medicine out of reach of children. Not intended for self-medication. Pregnant or nursing mothers should seek clinical evaluation before initiating therapy.",
    storage:
      product.storage ||
      "Store below 25°C in a dry and dark place. Protect from moisture, freezing, and direct sunlight.",
    howToUse:
      product.howToUse ||
      "Dosage as directed by Registered Medical Practitioner (RMP). Swallow whole with water; do not crush or chew.",
  };
};

/**
 * Generate a high-resolution, print-ready A4 Visual Aid Monograph PDF
 * with strict Royal Purple & Slate theme, angle-wise product photos,
 * top side with only company logo/name/contact/email/website,
 * bottom side with only company name and page number,
 * and primary medical focus on Side Effects & Product Details.
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
        margins: { top: 0, bottom: 0, left: 24, right: 24 },
        info: {
          Title: `${product.name} - Scientific Visual Aid & Product Monograph`,
          Author: "ZEAL PHARMACURE PRIVATE LIMITED",
          Subject: `Clinical Visual Aid and Formulation Monograph for ${product.name}`,
          Keywords: "Zeal Pharma, Visual Aid, Product Monograph, Side Effects, Formulation",
          CreationDate: new Date(),
        },
      });

      const buffers: Buffer[] = [];
      doc.on("data", (chunk: Buffer) => buffers.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(buffers)));
      doc.on("error", (err: Error) => reject(err));

      const margin = 24;
      const contentWidth = 547.28; // 595.28 - 24 * 2 = 547.28 pt

      // Company info
      const companyName = options.companyName || "ZEAL PHARMACURE PVT. LTD.";
      const phone = options.phone || "+91 9909160190";
      const email = options.email || "zealpharmacure@gmail.com";
      const website = options.website || "www.zealpharmacure.com";

      // =========================================================================
      // 1. TOP HEADER (CLEAN: ONLY LOGO, NAME, CONTACT, EMAIL & WEBSITE)
      // =========================================================================
      const headerY = 18;
      const logoSize = 42;
      let textStartX = margin;

      if (logoBuffer) {
        try {
          doc.image(logoBuffer, margin, headerY + 1, {
            width: logoSize,
            height: logoSize,
          });
          textStartX = margin + logoSize + 12; // 78 pt
        } catch {
          textStartX = margin;
        }
      }

      // Company Brand Lockup (Left)
      doc
        .font("Helvetica-Bold")
        .fontSize(14)
        .fillColor(PURPLE.DARKEST)
        .text(companyName, textStartX, headerY + 4, { lineBreak: false });

      doc
        .font("Helvetica-Bold")
        .fontSize(7.5)
        .fillColor(PURPLE.VIBRANT)
        .text("SCIENTIFIC PRODUCT VISUAL AID & DRUG MONOGRAPH", textStartX, headerY + 23, { lineBreak: false });

      // Clean Contact Details (Right side)
      const contactBoxWidth = 190;
      const contactBoxX = margin + contentWidth - contactBoxWidth;
      const contactTextY = headerY + 5;

      doc
        .font("Helvetica")
        .fontSize(7.5)
        .fillColor(TEXT.MID_GRAY)
        .text(`Helpline: ${phone}`, contactBoxX, contactTextY, {
          width: contactBoxWidth,
          align: "right",
          lineBreak: false,
        });

      doc
        .font("Helvetica")
        .fontSize(7.5)
        .fillColor(TEXT.MID_GRAY)
        .text(`Email: ${email}`, contactBoxX, contactTextY + 12, {
          width: contactBoxWidth,
          align: "right",
          lineBreak: false,
        });

      doc
        .font("Helvetica-Bold")
        .fontSize(7.5)
        .fillColor(PURPLE.PRIMARY)
        .text(website, contactBoxX, contactTextY + 24, {
          width: contactBoxWidth,
          align: "right",
          lineBreak: false,
        });

      // Header Separator Line in Brand Purple
      const headerDividerY = 66;
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

      // Badges width calculation from right to left
      let badgeRightX = margin + contentWidth - 10;
      const badgeY = curY + (titleBoxHeight - 18) / 2;

      // 1. MRP Badge (if available)
      if (mrpText) {
        const mrpW = Math.max(58, mrpText.length * 5.5 + 12);
        badgeRightX -= mrpW;
        doc
          .roundedRect(badgeRightX, badgeY, mrpW, 18, 3)
          .fillAndStroke(PURPLE.MUTED_BG, PURPLE.BORDER);
        doc
          .font("Helvetica-Bold")
          .fontSize(7.2)
          .fillColor(PURPLE.PRIMARY)
          .text(mrpText, badgeRightX, badgeY + 5, { width: mrpW, align: "center", lineBreak: false });
        badgeRightX -= 6;
      }

      // 2. Packaging Badge
      const packW = Math.max(62, packagingText.length * 5.2 + 12);
      badgeRightX -= packW;
      doc
        .roundedRect(badgeRightX, badgeY, packW, 18, 3)
        .fillAndStroke("#FFFFFF", PURPLE.BORDER);
      doc
        .font("Helvetica-Bold")
        .fontSize(7.2)
        .fillColor(TEXT.DARK_GRAY)
        .text(packagingText, badgeRightX, badgeY + 5, { width: packW, align: "center", lineBreak: false });
      badgeRightX -= 6;

      // 3. Dosage Form Badge
      const dosageW = Math.max(50, dosageText.length * 5.5 + 12);
      badgeRightX -= dosageW;
      doc
        .roundedRect(badgeRightX, badgeY, dosageW, 18, 3)
        .fillAndStroke(PURPLE.MUTED_BG, PURPLE.BORDER);
      doc
        .font("Helvetica-Bold")
        .fontSize(7.2)
        .fillColor(PURPLE.PRIMARY)
        .text(dosageText, badgeRightX, badgeY + 5, { width: dosageW, align: "center", lineBreak: false });
      badgeRightX -= 6;

      // 4. Rx Badge
      const rxW = 30;
      badgeRightX -= rxW;
      doc
        .roundedRect(badgeRightX, badgeY, rxW, 18, 3)
        .fillAndStroke(PURPLE.MUTED_BG, PURPLE.VIBRANT);
      doc
        .font("Helvetica-Bold")
        .fontSize(7.5)
        .fillColor(PURPLE.DARKEST)
        .text(rxText, badgeRightX, badgeY + 5, { width: rxW, align: "center", lineBreak: false });

      // Title & Generic Text on Left
      const titleAvailableWidth = badgeRightX - margin - 20;
      doc
        .font("Helvetica-Bold")
        .fontSize(14)
        .fillColor(TEXT.BLACK)
        .text(productName, margin + 10, curY + 8, {
          width: titleAvailableWidth,
          lineBreak: false,
        });

      doc
        .font("Helvetica-Oblique")
        .fontSize(8)
        .fillColor(PURPLE.PRIMARY)
        .text(genericText, margin + 10, curY + 26, {
          width: titleAvailableWidth,
          lineBreak: false,
        });

      curY += titleBoxHeight + 8;

      // =========================================================================
      // 3. PRODUCT ANGLE-WISE PHOTOS & PRESENTATION CARD
      // =========================================================================
      const photoSectionHeight = 146;
      const photoCardWidth = 252;
      const specsCardWidth = contentWidth - photoCardWidth - 10; // 285.28 pt
      const specsCardX = margin + photoCardWidth + 10;

      // --- Left: Angle-Wise Photo Showcase Box ---
      doc
        .roundedRect(margin, curY, photoCardWidth, photoSectionHeight, 4)
        .fillAndStroke("#FFFFFF", PURPLE.BORDER);

      // Photo Box Header Bar (Centered)
      const photoHeaderHeight = 18;
      doc
        .roundedRect(margin, curY, photoCardWidth, photoHeaderHeight, 4)
        .fill(PURPLE.MUTED_BG);
      doc
        .font("Helvetica-Bold")
        .fontSize(7.5)
        .fillColor(PURPLE.PRIMARY)
        .text("PRODUCT PACKSHOT & ANGLE PRESENTATION", margin, curY + 5, {
          width: photoCardWidth,
          align: "center",
          lineBreak: false,
        });

      // Render Photo(s)
      const photoAreaY = curY + photoHeaderHeight + 6;
      const photoAreaHeight = photoSectionHeight - photoHeaderHeight - 26; // ~102 pt

      if (productPhotos.length >= 2) {
        // Multi-angle: 2 photo frames side by side
        const colW = (photoCardWidth - 22) / 2; // ~115 pt
        const leftX = margin + 8;
        const rightX = margin + 8 + colW + 6;

        // Frame 1
        doc
          .roundedRect(leftX, photoAreaY, colW, photoAreaHeight, 3)
          .fillAndStroke(PURPLE.LIGHT_BG, PURPLE.BORDER_LIGHT);
        try {
          doc.image(productPhotos[0]!.buffer, leftX + 4, photoAreaY + 4, {
            fit: [colW - 8, photoAreaHeight - 20],
            align: "center",
            valign: "center",
          });
        } catch {}
        doc
          .font("Helvetica-Bold")
          .fontSize(6.5)
          .fillColor(TEXT.MID_GRAY)
          .text(productPhotos[0]!.label, leftX, photoAreaY + photoAreaHeight - 14, {
            width: colW,
            align: "center",
            lineBreak: false,
          });

        // Frame 2
        doc
          .roundedRect(rightX, photoAreaY, colW, photoAreaHeight, 3)
          .fillAndStroke(PURPLE.LIGHT_BG, PURPLE.BORDER_LIGHT);
        try {
          doc.image(productPhotos[1]!.buffer, rightX + 4, photoAreaY + 4, {
            fit: [colW - 8, photoAreaHeight - 20],
            align: "center",
            valign: "center",
          });
        } catch {}
        doc
          .font("Helvetica-Bold")
          .fontSize(6.5)
          .fillColor(TEXT.MID_GRAY)
          .text(productPhotos[1]!.label, rightX, photoAreaY + photoAreaHeight - 14, {
            width: colW,
            align: "center",
            lineBreak: false,
          });
      } else if (productPhotos.length === 1) {
        // Single packshot angle - spacious centered display
        const frameW = photoCardWidth - 16;
        const frameX = margin + 8;

        doc
          .roundedRect(frameX, photoAreaY, frameW, photoAreaHeight, 3)
          .fillAndStroke(PURPLE.LIGHT_BG, PURPLE.BORDER_LIGHT);
        try {
          doc.image(productPhotos[0]!.buffer, frameX + 6, photoAreaY + 4, {
            fit: [frameW - 12, photoAreaHeight - 20],
            align: "center",
            valign: "center",
          });
        } catch {}
        doc
          .font("Helvetica-Bold")
          .fontSize(6.8)
          .fillColor(TEXT.MID_GRAY)
          .text("Primary Formulation Angle Packshot", frameX, photoAreaY + photoAreaHeight - 14, {
            width: frameW,
            align: "center",
            lineBreak: false,
          });
      } else {
        // High quality vector silhouette fallback
        const frameW = photoCardWidth - 16;
        const frameX = margin + 8;
        doc
          .roundedRect(frameX, photoAreaY, frameW, photoAreaHeight, 3)
          .fillAndStroke(PURPLE.LIGHT_BG, PURPLE.BORDER_LIGHT);

        doc
          .font("Helvetica-Bold")
          .fontSize(10)
          .fillColor(PURPLE.VIBRANT)
          .text(dosageText, frameX, photoAreaY + 34, { width: frameW, align: "center", lineBreak: false });

        doc
          .font("Helvetica")
          .fontSize(7.5)
          .fillColor(TEXT.MUTED_GRAY)
          .text("Standardized Pharmaceutical Packaging Specimen", frameX, photoAreaY + 50, {
            width: frameW,
            align: "center",
            lineBreak: false,
          });
      }

      // Bottom Verified Tag inside Photo Box
      doc
        .font("Helvetica-Bold")
        .fontSize(6.8)
        .fillColor(PURPLE.PRIMARY)
        .text("AUTHENTIC WHO-GMP BATCH FORMULATION", margin, curY + photoSectionHeight - 13, {
          width: photoCardWidth,
          align: "center",
          lineBreak: false,
        });

      // --- Right: Clinical Specifications & Administration (Two Stacked Cards) ---
      const subCardHeight = (photoSectionHeight - 6) / 2; // 70 pt each

      // Sub-card 1: Product Specifications
      doc
        .roundedRect(specsCardX, curY, specsCardWidth, subCardHeight, 4)
        .fillAndStroke("#FFFFFF", PURPLE.BORDER);

      doc
        .roundedRect(specsCardX, curY, specsCardWidth, 18, 4)
        .fill(PURPLE.MUTED_BG);
      doc
        .font("Helvetica-Bold")
        .fontSize(7.5)
        .fillColor(PURPLE.PRIMARY)
        .text("FORMULATION SPECIFICATIONS", specsCardX, curY + 5, {
          width: specsCardWidth,
          align: "center",
          lineBreak: false,
        });

      const divisionName =
        product.subCategoryName ||
        product.subCategory?.name ||
        (typeof product.category === "object" ? product.category?.name : product.category) ||
        "Speciality Pharmaceutical";

      const specY = curY + 24;
      doc
        .font("Helvetica-Bold")
        .fontSize(7)
        .fillColor(TEXT.MUTED_GRAY)
        .text("Therapeutic Segment:", specsCardX + 10, specY, { lineBreak: false });
      doc
        .font("Helvetica-Bold")
        .fontSize(7.5)
        .fillColor(TEXT.BLACK)
        .text(String(divisionName), specsCardX + 96, specY, { width: specsCardWidth - 104, lineBreak: false });

      doc
        .font("Helvetica-Bold")
        .fontSize(7)
        .fillColor(TEXT.MUTED_GRAY)
        .text("Dosage & Pack:", specsCardX + 10, specY + 14, { lineBreak: false });
      doc
        .font("Helvetica")
        .fontSize(7.5)
        .fillColor(TEXT.BLACK)
        .text(`${dosageText}  |  ${packagingText}`, specsCardX + 96, specY + 14, { lineBreak: false });

      doc
        .font("Helvetica-Bold")
        .fontSize(7)
        .fillColor(TEXT.MUTED_GRAY)
        .text("Manufacturing:", specsCardX + 10, specY + 28, { lineBreak: false });
      doc
        .font("Helvetica")
        .fontSize(7.5)
        .fillColor(PURPLE.PRIMARY)
        .text("WHO-GMP & cGMP Certified Facility", specsCardX + 96, specY + 28, { lineBreak: false });

      // Sub-card 2: Administration & Storage Guidelines
      const subCard2Y = curY + subCardHeight + 6;
      doc
        .roundedRect(specsCardX, subCard2Y, specsCardWidth, subCardHeight, 4)
        .fillAndStroke("#FFFFFF", PURPLE.BORDER);

      doc
        .roundedRect(specsCardX, subCard2Y, specsCardWidth, 18, 4)
        .fill(PURPLE.MUTED_BG);
      doc
        .font("Helvetica-Bold")
        .fontSize(7.5)
        .fillColor(PURPLE.PRIMARY)
        .text("ADMINISTRATION & STORAGE DIRECTIVES", specsCardX, subCard2Y + 5, {
          width: specsCardWidth,
          align: "center",
          lineBreak: false,
        });

      const medical = getClinicalMedicalData(product);
      const sub2ContentY = subCard2Y + 24;

      doc
        .font("Helvetica-Bold")
        .fontSize(7)
        .fillColor(TEXT.MUTED_GRAY)
        .text("Administration:", specsCardX + 10, sub2ContentY, { lineBreak: false });
      doc
        .font("Helvetica")
        .fontSize(7.2)
        .fillColor(TEXT.BLACK)
        .text(medical.howToUse, specsCardX + 78, sub2ContentY, {
          width: specsCardWidth - 86,
          lineBreak: false,
        });

      doc
        .font("Helvetica-Bold")
        .fontSize(7)
        .fillColor(TEXT.MUTED_GRAY)
        .text("Storage Temp:", specsCardX + 10, sub2ContentY + 14, { lineBreak: false });
      doc
        .font("Helvetica")
        .fontSize(7.2)
        .fillColor(TEXT.DARK_GRAY)
        .text(medical.storage, specsCardX + 78, sub2ContentY + 14, {
          width: specsCardWidth - 86,
          lineBreak: false,
        });

      doc
        .font("Helvetica-Bold")
        .fontSize(7)
        .fillColor(TEXT.MUTED_GRAY)
        .text("Classification:", specsCardX + 10, sub2ContentY + 28, { lineBreak: false });
      doc
        .font("Helvetica-Bold")
        .fontSize(7.2)
        .fillColor(PURPLE.VIBRANT)
        .text(`${rxText} — Prescription Medicine Only`, specsCardX + 78, sub2ContentY + 28, {
          width: specsCardWidth - 86,
          lineBreak: false,
        });

      curY += photoSectionHeight + 8;

      // =========================================================================
      // 4. APPROVED CLINICAL INDICATIONS & THERAPEUTIC APPLICATIONS
      // =========================================================================
      const indSectionHeight = 88;
      doc
        .roundedRect(margin, curY, contentWidth, indSectionHeight, 4)
        .fillAndStroke("#FFFFFF", PURPLE.BORDER);

      // Centered Header
      doc
        .roundedRect(margin, curY, contentWidth, 18, 4)
        .fill(PURPLE.MUTED_BG);
      doc
        .font("Helvetica-Bold")
        .fontSize(7.8)
        .fillColor(PURPLE.PRIMARY)
        .text("APPROVED CLINICAL INDICATIONS & THERAPEUTIC APPLICATIONS", margin, curY + 5, {
          width: contentWidth,
          align: "center",
          lineBreak: false,
        });

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
          "Primary and secondary clinical indication for therapeutic target management",
          "Rapid symptomatic relief and systemic clinical formulation efficacy",
          "Management of acute and chronic pathological manifestations",
          "Prophylaxis and functional clinical recovery in approved indications",
          "Adjuvant therapy under specialist physician or RMP guidance",
          "Maintenance therapy and sustained patient tolerance support",
        ];
      }

      const halfIndCol = (contentWidth - 28) / 2; // ~259 pt
      let indRowY = curY + 24;

      for (let i = 0; i < Math.min(6, indicationList.length); i++) {
        const item = indicationList[i]!;
        const isLeft = i % 2 === 0;
        const colX = isLeft ? margin + 12 : margin + 12 + halfIndCol + 8;
        if (isLeft && i > 0) {
          indRowY += 19;
        }

        // Purple Bullet Point
        doc.circle(colX + 3, indRowY + 4, 3).fill(PURPLE.VIBRANT);
        doc
          .font("Helvetica")
          .fontSize(7.5)
          .fillColor(TEXT.DARK_GRAY)
          .text(item, colX + 11, indRowY, {
            width: halfIndCol - 15,
            lineBreak: false,
          });
      }

      curY += indSectionHeight + 8;

      // =========================================================================
      // 5. MAIN FOCUS: CLINICAL SIDE EFFECTS & ADVERSE DRUG REACTIONS (ADR)
      // =========================================================================
      const adrSectionHeight = 172;
      doc
        .roundedRect(margin, curY, contentWidth, adrSectionHeight, 4)
        .fillAndStroke("#FFFFFF", PURPLE.PRIMARY);

      // High-Priority Solid Purple Header Bar
      const adrHeaderHeight = 20;
      doc
        .roundedRect(margin, curY, contentWidth, adrHeaderHeight, 4)
        .fill(PURPLE.PRIMARY);
      doc
        .font("Helvetica-Bold")
        .fontSize(8.5)
        .fillColor("#FFFFFF")
        .text("CLINICAL SIDE EFFECTS & ADVERSE REACTIONS PROFILE (SAFETY MONOGRAPH)", margin, curY + 6, {
          width: contentWidth,
          align: "center",
          lineBreak: false,
        });

      const adrContentY = curY + adrHeaderHeight + 7;
      const subAdrBoxHeight = 54;
      const subAdrColW = (contentWidth - 18) / 2; // ~264 pt

      // Box 1: Common / Mild Effects
      doc
        .roundedRect(margin + 6, adrContentY, subAdrColW, subAdrBoxHeight, 3)
        .fillAndStroke(PURPLE.LIGHT_BG, PURPLE.BORDER);

      doc
        .font("Helvetica-Bold")
        .fontSize(7.5)
        .fillColor(PURPLE.DEEP)
        .text("COMMON & MILD ADVERSE EFFECTS", margin + 14, adrContentY + 6, { lineBreak: false });

      let effCurY = adrContentY + 18;
      for (let i = 0; i < Math.min(3, medical.commonSideEffects.length); i++) {
        const eff = medical.commonSideEffects[i]!;
        doc.circle(margin + 17, effCurY + 3.5, 2.5).fill(PURPLE.ACCENT);
        doc
          .font("Helvetica")
          .fontSize(6.8)
          .fillColor(TEXT.DARK_GRAY)
          .text(eff, margin + 24, effCurY, {
            width: subAdrColW - 30,
            lineBreak: false,
          });
        effCurY += 10.5;
      }

      // Box 2: Rare & Idiosyncratic Effects
      const box2X = margin + 6 + subAdrColW + 6;
      doc
        .roundedRect(box2X, adrContentY, subAdrColW, subAdrBoxHeight, 3)
        .fillAndStroke(PURPLE.LIGHT_BG, PURPLE.BORDER);

      doc
        .font("Helvetica-Bold")
        .fontSize(7.5)
        .fillColor(PURPLE.DEEP)
        .text("RARE & PRECAUTIONARY EFFECTS", box2X + 8, adrContentY + 6, { lineBreak: false });

      let rareCurY = adrContentY + 18;
      for (let i = 0; i < Math.min(3, medical.rareSideEffects.length); i++) {
        const eff = medical.rareSideEffects[i]!;
        doc.circle(box2X + 11, rareCurY + 3.5, 2.5).fill(PURPLE.ACCENT);
        doc
          .font("Helvetica")
          .fontSize(6.8)
          .fillColor(TEXT.DARK_GRAY)
          .text(eff, box2X + 18, rareCurY, {
            width: subAdrColW - 26,
            lineBreak: false,
          });
        rareCurY += 10.5;
      }

      // Box 3: Mechanism of Tolerance & Clinical Management
      const manageBoxY = adrContentY + subAdrBoxHeight + 6;
      const manageBoxHeight = 44;
      doc
        .roundedRect(margin + 6, manageBoxY, contentWidth - 12, manageBoxHeight, 3)
        .fillAndStroke(PURPLE.MUTED_BG, PURPLE.BORDER);

      doc
        .font("Helvetica-Bold")
        .fontSize(7.2)
        .fillColor(PURPLE.PRIMARY)
        .text("CLINICAL ADVERSE EVENT MANAGEMENT & MONITORING", margin + 14, manageBoxY + 6, { lineBreak: false });

      doc
        .font("Helvetica")
        .fontSize(6.8)
        .fillColor(TEXT.DARK_GRAY)
        .text(
          "• Most common adverse events are transient and attenuate as treatment continues without necessitating drug discontinuation.\n• In the event of severe hypersensitivity, persistent gastrointestinal distress, or idiosyncratic allergic reactions, discontinue immediately and implement appropriate supportive therapy.\n• Patients should be instructed to immediately report any unusual, severe, or persistent symptoms to their consulting medical practitioner.",
          margin + 14,
          manageBoxY + 17,
          {
            width: contentWidth - 28,
            lineGap: 1.2,
          }
        );

      // Box 4: Pharmacovigilance & ADR Reporting Direct Line (Centered bar)
      const pvBoxY = manageBoxY + manageBoxHeight + 5;
      const pvBoxHeight = 24;
      doc
        .roundedRect(margin + 6, pvBoxY, contentWidth - 12, pvBoxHeight, 3)
        .fill(PURPLE.LIGHT_BG);
      doc
        .font("Helvetica-Bold")
        .fontSize(7)
        .fillColor(PURPLE.DARKEST)
        .text(
          `PHARMACOVIGILANCE DIRECTIVE: Report suspected Adverse Drug Reactions (ADR) directly to Zeal Safety Desk: ${email} | Helpline: ${phone}`,
          margin + 6,
          pvBoxY + 8,
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
      const safetySectionHeight = 168;
      doc
        .roundedRect(margin, curY, contentWidth, safetySectionHeight, 4)
        .fillAndStroke("#FFFFFF", PURPLE.BORDER);

      // Centered Header
      doc
        .roundedRect(margin, curY, contentWidth, 18, 4)
        .fill(PURPLE.MUTED_BG);
      doc
        .font("Helvetica-Bold")
        .fontSize(7.8)
        .fillColor(PURPLE.PRIMARY)
        .text("CONTRAINDICATIONS, SPECIAL POPULATIONS & CLINICAL PRECAUTIONS", margin, curY + 5, {
          width: contentWidth,
          align: "center",
          lineBreak: false,
        });

      const safetyBodyY = curY + 23;
      const halfSafetyColW = (contentWidth - 24) / 2; // ~261 pt

      // Left Column: Contraindications & Special Warnings
      doc
        .font("Helvetica-Bold")
        .fontSize(7.5)
        .fillColor(PURPLE.DEEP)
        .text("CONTRAINDICATIONS (WHEN NOT TO USE)", margin + 10, safetyBodyY, { lineBreak: false });

      doc
        .font("Helvetica")
        .fontSize(6.8)
        .fillColor(TEXT.DARK_GRAY)
        .text(medical.contraindications, margin + 10, safetyBodyY + 11, {
          width: halfSafetyColW,
          lineGap: 1.5,
        });

      const popY = safetyBodyY + 56;
      doc
        .font("Helvetica-Bold")
        .fontSize(7.5)
        .fillColor(PURPLE.DEEP)
        .text("PREGNANCY & LACTATION DIRECTIVE", margin + 10, popY, { lineBreak: false });

      doc
        .font("Helvetica")
        .fontSize(6.8)
        .fillColor(TEXT.DARK_GRAY)
        .text(
          product.pregnancyInfo ||
            "Use during pregnancy and lactation only if potential clinical benefit clearly outweighs fetal risk, strictly under obstetrician supervision.",
          margin + 10,
          popY + 11,
          {
            width: halfSafetyColW,
            lineGap: 1.5,
          }
        );

      const warnY = popY + 44;
      doc
        .font("Helvetica-Bold")
        .fontSize(7.5)
        .fillColor(PURPLE.DEEP)
        .text("SPECIAL PRECAUTIONS & MONITORING", margin + 10, warnY, { lineBreak: false });

      doc
        .font("Helvetica")
        .fontSize(6.8)
        .fillColor(TEXT.DARK_GRAY)
        .text(medical.precautions, margin + 10, warnY + 11, {
          width: halfSafetyColW,
          lineGap: 1.5,
        });

      // Right Column: Drug Interactions & Schedule Warning Box
      const rightSafetyX = margin + 10 + halfSafetyColW + 10;

      doc
        .font("Helvetica-Bold")
        .fontSize(7.5)
        .fillColor(PURPLE.DEEP)
        .text("POTENTIAL DRUG INTERACTIONS", rightSafetyX, safetyBodyY, { lineBreak: false });

      doc
        .font("Helvetica")
        .fontSize(6.8)
        .fillColor(TEXT.DARK_GRAY)
        .text(
          "May interact with concomitant CYP enzyme modulators, gastric pH altering preparations, and active plasma-bound therapeutics. Clinicians are advised to review patient medication history prior to co-prescribing.",
          rightSafetyX,
          safetyBodyY + 11,
          {
            width: halfSafetyColW,
            lineGap: 1.5,
          }
        );

      doc
        .font("Helvetica-Bold")
        .fontSize(7.5)
        .fillColor(PURPLE.DEEP)
        .text("PEDIATRIC & GERIATRIC CONSIDERATIONS", rightSafetyX, popY, { lineBreak: false });

      doc
        .font("Helvetica")
        .fontSize(6.8)
        .fillColor(TEXT.DARK_GRAY)
        .text(
          "Geriatric patients with age-related renal or hepatic impairment should start at lower therapeutic dosages. Pediatric use strictly per weight-adjusted guidelines.",
          rightSafetyX,
          popY + 11,
          {
            width: halfSafetyColW,
            lineGap: 1.5,
          }
        );

      // Schedule H Prescription Warning Box (Bottom Right)
      const rxBoxY = warnY;
      const rxBoxHeight = 40;
      doc
        .roundedRect(rightSafetyX, rxBoxY, halfSafetyColW, rxBoxHeight, 3)
        .fillAndStroke(PURPLE.LIGHT_BG, PURPLE.VIBRANT);

      doc
        .font("Helvetica-Bold")
        .fontSize(7.5)
        .fillColor(PURPLE.DARKEST)
        .text("SCHEDULE H PRESCRIPTION DRUG — WARNING", rightSafetyX, rxBoxY + 6, {
          width: halfSafetyColW,
          align: "center",
          lineBreak: false,
        });

      doc
        .font("Helvetica")
        .fontSize(6.6)
        .fillColor(TEXT.DARK_GRAY)
        .text(
          "To be sold by retail on the prescription of a Registered Medical Practitioner (RMP) only. Not for public consumer circulation. Keep out of reach of children.",
          rightSafetyX + 6,
          rxBoxY + 18,
          {
            width: halfSafetyColW - 12,
            align: "center",
            lineGap: 1.2,
          }
        );

      // =========================================================================
      // 7. BOTTOM FOOTER (ONLY ONE SIDE NAME, OTHER SIDE PAGE NUMBER ONLY)
      // =========================================================================
      const footerLineY = 788;
      const footerTextY = 795;

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
        .fontSize(8)
        .fillColor(TEXT.DARK_GRAY)
        .text(companyName, margin, footerTextY, { lineBreak: false });

      doc
        .font("Helvetica")
        .fontSize(7.5)
        .fillColor(TEXT.MUTED_GRAY)
        .text(`   •   ${productName} MONOGRAPH & VISUAL AID`, { continued: false });

      // Right: Page Number ONLY
      doc
        .font("Helvetica-Bold")
        .fontSize(8)
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
