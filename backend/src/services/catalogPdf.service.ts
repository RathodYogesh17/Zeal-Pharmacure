import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export interface ICatalogProduct {
  name: string;
  slug?: string;
  composition: string;
  dosageForm?: string | { name?: string };
  packaging: string;
  mrp?: number | null;
  category?: { name?: string } | string;
  prescriptionType?: string;
}

export interface ICatalogPdfOptions {
  companyName?: string | undefined;
  phone?: string | undefined;
  email?: string | undefined;
  website?: string | undefined;
  headOfficeAddress?: string | undefined;
  userEmail?: string | undefined;
  userName?: string | undefined;
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
 * Generate a multi-page, executive A4 Product Price List & Formulation Directory PDF.
 * Formats exactly 20 formulations per page, covering the full height without bottom dead-space.
 * ZERO extra blank pages: strictly generates only the exact pages required by products data.
 */
export const generateProductCatalogPdf = async (
  products: ICatalogProduct[],
  options: ICatalogPdfOptions = {}
): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    try {
      // margins.bottom: 0 prevents PDFKit auto-page-break from creating blank pages at the end
      const doc = new PDFDocument({
        size: "A4",
        margins: { top: 16, bottom: 0, left: 22, right: 22 },
        bufferPages: true, // Enable 2-pass page numbering (Page X of Y)
        info: {
          Title: "Zeal Pharmacure - Official Product Catalog & Wholesale Rate Directory",
          Author: "ZEAL PHARMACURE PRIVATE LIMITED",
          Subject: "Wholesale Medicine Price List and Formulation Directory",
          Keywords: "Zeal Pharma, Product List, Price List, PCD Pharma Franchise, WHO-GMP Formulations",
          CreationDate: new Date(),
        },
      });

      const buffers: Buffer[] = [];
      doc.on("data", (chunk: Buffer) => buffers.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(buffers)));
      doc.on("error", (err: Error) => reject(err));

      const margin = 22;
      const contentWidth = 551; // 595.28 - 22 * 2 = 551.28 pt

      // Company Settings
      const companyName = options.companyName || "ZEAL PHARMACURE PVT. LTD.";
      const phone = options.phone || "+91 9909160190";
      const email = options.email || "info@zealpharma.com";
      const website = options.website || "www.zealpharmacure.com";
      const address = options.headOfficeAddress || "7015, BTM Market, Sita Nagar, Parvat Patiya, Surat, Gujarat – 395010";

      // Column Widths (Total: 551 pt)
      const colSr = { x: margin, w: 22 };                      // 22  (sum 22)
      const colName = { x: margin + 22, w: 114 };              // 114 (sum 136)
      const colCat = { x: margin + 136, w: 78 };               // 78  (sum 214)
      const colComp = { x: margin + 214, w: 172 };             // 172 (sum 386)
      const colForm = { x: margin + 386, w: 45 };              // 45  (sum 431)
      const colPack = { x: margin + 431, w: 52 };              // 52  (sum 483)
      const colMrp = { x: margin + 483, w: 68 };               // 68  (sum 551)

      const ROWS_PER_PAGE = 20;
      const rowHeight = 34.2; // 20 * 34.2 = 684 pt
      const headerEndY = 87;
      const tableHeaderY = 93;
      const tableHeaderHeight = 20;
      const tableDataStartY = tableHeaderY + tableHeaderHeight; // 113 pt

      const dateStr = new Date().toLocaleDateString("en-IN", {
        month: "short",
        year: "numeric",
      });

      const logoBuffer = getLogoBuffer();

      // Render Header for a single page with spacious layout
      const renderPageHeader = () => {
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
            textStartX = margin + logoSize + 12; // 12pt comfortable space after logo
          } catch {
            textStartX = margin;
          }
        }

        // 2. Company Info (Next to logo with clean vertical line spacing)
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
        const badgeWidth = 150;
        const badgeX = margin + contentWidth - badgeWidth;
        doc
          .roundedRect(badgeX, 23, badgeWidth, 23, 4)
          .fillAndStroke("#F5F3FF", "#DDD6FE");

        doc
          .font("Helvetica-Bold")
          .fontSize(7.8)
          .fillColor("#7C3AED")
          .text("WHOLESALE PRICE CATALOG", badgeX + 4, 30, {
            width: badgeWidth - 8,
            align: "center",
            lineBreak: false,
          });

        doc
          .font("Helvetica-Bold")
          .fontSize(7)
          .fillColor("#334155")
          .text(`130+ WHO-GMP Formulations`, badgeX - 35, 53, {
            width: badgeWidth + 35,
            align: "right",
            lineBreak: false,
          });

        doc
          .font("Helvetica")
          .fontSize(6.8)
          .fillColor("#64748B")
          .text(`Catalog Date: ${dateStr}   |   Govt. Licensed Directory`, badgeX - 35, 66, {
            width: badgeWidth + 35,
            align: "right",
            lineBreak: false,
          });

        // 4. Horizontal separator line under header
        doc
          .moveTo(margin, headerEndY)
          .lineTo(margin + contentWidth, headerEndY)
          .lineWidth(0.75)
          .strokeColor("#E2E8F0")
          .stroke();

        // 5. Table Header Box
        doc
          .rect(margin, tableHeaderY, contentWidth, tableHeaderHeight)
          .fill("#1E1B4B");

        // Table Column Labels
        doc.font("Helvetica-Bold").fontSize(7.2).fillColor("#FFFFFF");
        doc.text("SR.", colSr.x, tableHeaderY + 6.5, { width: colSr.w, align: "center", lineBreak: false });
        doc.text("PRODUCT NAME", colName.x + 4, tableHeaderY + 6.5, { width: colName.w - 4, align: "left", lineBreak: false });
        doc.text("CATEGORY", colCat.x + 4, tableHeaderY + 6.5, { width: colCat.w - 4, align: "left", lineBreak: false });
        doc.text("COMPOSITION / SALT FORMULATION", colComp.x + 4, tableHeaderY + 6.5, { width: colComp.w - 4, align: "left", lineBreak: false });
        doc.text("DOSAGE", colForm.x, tableHeaderY + 6.5, { width: colForm.w, align: "center", lineBreak: false });
        doc.text("PACKING", colPack.x + 4, tableHeaderY + 6.5, { width: colPack.w - 4, align: "left", lineBreak: false });
        doc.text("M.R.P. (Rs.)", colMrp.x, tableHeaderY + 6.5, { width: colMrp.w - 5, align: "right", lineBreak: false });
      };

      // Helper to format dosage form string
      const getDosageFormName = (df: any): string => {
        if (!df) return "Tablet";
        if (typeof df === "string") return df;
        if (typeof df === "object" && df.name) return String(df.name);
        return "Tablet";
      };

      // Helper to format category name string
      const getCategoryName = (cat: any): string => {
        if (!cat) return "General";
        if (typeof cat === "string") return cat;
        if (typeof cat === "object" && cat.name) return String(cat.name);
        return "General";
      };

      // Helper to truncate text cleanly
      const truncateText = (text: string, maxLen: number): string => {
        const cleaned = String(text || "").trim();
        if (cleaned.length <= maxLen) return cleaned;
        return cleaned.slice(0, maxLen - 1) + "…";
      };

      // Render all products page by page
      let currentItemIndex = 0;
      const totalProducts = products.length;

      if (totalProducts === 0) {
        renderPageHeader();
        doc
          .font("Helvetica")
          .fontSize(11)
          .fillColor("#64748B")
          .text("No active formulations found in catalog database.", margin, tableDataStartY + 50, {
            width: contentWidth,
            align: "center",
            lineBreak: false,
          });
      } else {
        while (currentItemIndex < totalProducts) {
          if (currentItemIndex > 0) {
            doc.addPage();
          }

          renderPageHeader();

          const pageProducts = products.slice(currentItemIndex, currentItemIndex + ROWS_PER_PAGE);

          pageProducts.forEach((prod, pIdx) => {
            const globalIdx = currentItemIndex + pIdx + 1;
            const y = tableDataStartY + pIdx * rowHeight;
            const isEven = pIdx % 2 === 0;

            // Row background (zebra striping)
            doc
              .rect(margin, y, contentWidth, rowHeight)
              .fill(isEven ? "#FFFFFF" : "#F8FAFC");

            // Row bottom separator line
            doc
              .moveTo(margin, y + rowHeight)
              .lineTo(margin + contentWidth, y + rowHeight)
              .lineWidth(0.5)
              .strokeColor("#E2E8F0")
              .stroke();

            const textY = y + 12; // Comfortable vertical centering in 34.2pt row

            // 1. Sr. No.
            doc
              .font("Helvetica")
              .fontSize(7.8)
              .fillColor("#64748B")
              .text(String(globalIdx).padStart(2, "0"), colSr.x, textY, {
                width: colSr.w,
                align: "center",
                lineBreak: false,
              });

            // 2. Product Name (Bold)
            doc
              .font("Helvetica-Bold")
              .fontSize(8.2)
              .fillColor("#0F172A")
              .text(truncateText(prod.name, 24), colName.x + 4, textY, {
                width: colName.w - 6,
                align: "left",
                lineBreak: false,
              });

            // 3. Category (Purple font)
            const catName = getCategoryName(prod.category);
            doc
              .font("Helvetica-Bold")
              .fontSize(7.2)
              .fillColor("#6D28D9")
              .text(truncateText(catName, 18), colCat.x + 4, textY, {
                width: colCat.w - 6,
                align: "left",
                lineBreak: false,
              });

            // 4. Composition (Dark charcoal)
            doc
              .font("Helvetica")
              .fontSize(7.2)
              .fillColor("#334155")
              .text(truncateText(prod.composition, 44), colComp.x + 4, textY, {
                width: colComp.w - 6,
                align: "left",
                lineBreak: false,
              });

            // 5. Dosage Form (Soft cyan/blue)
            const dosage = getDosageFormName(prod.dosageForm);
            doc
              .font("Helvetica-Bold")
              .fontSize(7.2)
              .fillColor("#0284C7")
              .text(truncateText(dosage, 10), colForm.x, textY, {
                width: colForm.w,
                align: "center",
                lineBreak: false,
              });

            // 6. Packaging Details
            doc
              .font("Helvetica")
              .fontSize(7.2)
              .fillColor("#475569")
              .text(truncateText(prod.packaging, 12), colPack.x + 4, textY, {
                width: colPack.w - 6,
                align: "left",
                lineBreak: false,
              });

            // 7. MRP (Green bold)
            const mrpVal = prod.mrp ? Number(prod.mrp) : null;
            const mrpStr = mrpVal && !isNaN(mrpVal) ? `Rs. ${mrpVal.toFixed(2)}` : "On Req.";
            doc
              .font("Helvetica-Bold")
              .fontSize(8.2)
              .fillColor("#059669")
              .text(mrpStr, colMrp.x, textY, {
                width: colMrp.w - 5,
                align: "right",
                lineBreak: false,
              });
          });

          currentItemIndex += pageProducts.length;
        }
      }

      // =========================================================================
      // SECOND PASS: FOOTERS AND DYNAMIC PAGE NUMBERING ON ALL PAGES
      // =========================================================================
      const range = doc.bufferedPageRange();
      const totalPages = range.count;

      for (let i = 0; i < totalPages; i++) {
        doc.switchToPage(i);

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

        // Footer Contact Line (Row 1)
        doc
          .font("Helvetica-Bold")
          .fontSize(7.5)
          .fillColor("#1E293B")
          .text(`Official Helpline: ${phone}   |   Email: ${email}   |   Website: ${website}`, margin, footerRow1Y, {
            width: contentWidth - 95,
            align: "left",
            lineBreak: false,
          });

        // Page Number (Row 1 Right: "Page 1 of X")
        doc
          .font("Helvetica-Bold")
          .fontSize(8.5)
          .fillColor("#7C3AED")
          .text(`Page ${i + 1} of ${totalPages}`, margin + contentWidth - 90, footerRow1Y, {
            width: 90,
            align: "right",
            lineBreak: false,
          });

        // Disclaimer Note (Row 2 Left - with comfortable spacing)
        doc
          .font("Helvetica")
          .fontSize(6.8)
          .fillColor("#64748B")
          .text(
            "* Strictly for Licensed Wholesale Stockists, Doctors & Registered Chemists. All rates inclusive of applicable GST.",
            margin,
            footerRow2Y,
            { width: contentWidth - 95, align: "left", lineBreak: false }
          );

        // Verified watermark timestamp (Row 2 Right)
        doc
          .font("Helvetica")
          .fontSize(6.8)
          .fillColor("#94A3B8")
          .text("Verified by Zeal Quality Control", margin + contentWidth - 90, footerRow2Y, {
            width: 90,
            align: "right",
            lineBreak: false,
          });
      }

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};
