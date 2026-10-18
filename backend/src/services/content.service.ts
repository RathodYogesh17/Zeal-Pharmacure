import mongoose from "mongoose";
import Content from "../models/content.model";
import "../models/user.model";
import "../models/media.model";
import AppError from "../utils/appError";
import HTTP_STATUS from "../constants/httpStatus";
import MESSAGES from "../constants/messages";
import { buildPagination } from "../utils/pagination";
import type {
  ICreateContentRequest,
  IUpdateContentRequest,
  IContentQuery,
} from "../types/content.types";
import type { IAuthenticatedUser } from "../types/user.types";

const auditPopulate = [
  { path: "createdBy", select: "name email role" },
  { path: "updatedBy", select: "name email role" },
  { path: "mediaIds", select: "url originalName mimeType size" },
];

const defaultCmsSeeds: Array<{
  key: string;
  slug: string;
  title: string;
  description: string;
  contentType: "PAGE" | "SECTION" | "BANNER" | "FAQ" | "POLICY" | "SETTING";
  section: string;
  content: unknown;
  seo?: Record<string, unknown>;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  publishedAt: Date;
  isActive: boolean;
  isDeleted: boolean;
}> = [
    {
      key: "about-us",
      slug: "about-us",
      title: "About Zeal Pharmaceuticals",
      description: "Company history, vision, mission, and leadership message.",
      contentType: "PAGE",
      section: "company",
      content: {
        companyStory:
          "Zeal Pharmaceuticals is an ISO 9001:2015 and WHO-GMP compliant pharmaceutical enterprise dedicated to enhancing human healthcare through cutting-edge formulation sciences, rigorous clinical standards, and nationwide Stockists Distribution partnerships.",
        mission:
          "To formulate, produce, and deliver top-quality, affordable, and clinically efficacious allopathic and herbal medicines that doctors trust and patients rely on.",
        vision:
          "To establish Zeal Pharmaceuticals as the benchmark Stockists Distribution Network across all 28 Indian states, empowered by high quality formulations and ethical marketing.",
        directorName: "Board of Directors",
        directorTitle: "Executive Leadership, Zeal Pharmaceuticals",
        directorMessage:
          "At Zeal Pharma, quality is never an accident; it is always the result of high intention, sincere effort, intelligent direction, and skillful execution. We welcome ambitious pharma entrepreneurs to grow with us.",
        stats: [
          { label: "Approved Formulations", value: "250+", icon: "Pill" },
          { label: "Active Stockist Partners", value: "650+", icon: "Users" },
          { label: "States & UTs Covered", value: "22+", icon: "MapPin" },
          { label: "WHO-GMP Certified", value: "100%", icon: "ShieldCheck" },
        ],
      },
      seo: {
        metaTitle: "About Us | Zeal Pharmaceuticals - WHO-GMP Stockists Distribution",
        metaDescription:
          "Learn about Zeal Pharmaceuticals, our state-of-the-art WHO-GMP manufacturing facilities, and authorized Stockists Distribution programs.",
        keywords: ["Zeal Pharma", "Stockists Distribution Gujarat", "WHO-GMP Pharma Manufacturer"],
      },
      status: "PUBLISHED",
      publishedAt: new Date("2024-01-01"),
      isActive: true,
      isDeleted: false,
    },
    {
      key: "certifications",
      slug: "certifications",
      title: "Manufacturing Standards & Certifications",
      description: "WHO-GMP, ISO 9001:2015, GLP, and Schedule M certifications.",
      contentType: "PAGE",
      section: "compliance",
      content: {
        intro:
          "Our formulation facilities operate under stringent Good Manufacturing Practices (cGMP) ensuring zero-defect packaging, chemical stability, and peak clinical bioavailability.",
        items: [
          {
            id: "who-gmp",
            title: "WHO-GMP Certification",
            code: "GMP/FDCA/WHO-COMPLIANT",
            issuer: "Food and Drugs Control Administration (FDCA)",
            validUntil: "Permanent / Ongoing Compliance",
            description:
              "Certified for adherence to international World Health Organization Good Manufacturing Practices for solid orals, liquids, and topical formulations.",
          },
          {
            id: "iso-9001",
            title: "ISO 9001:2015 Quality Management System",
            code: "ISO-QMS-9001",
            issuer: "International Organization for Standardization",
            validUntil: "Current",
            description:
              "Certified QMS covering pharmaceutical design, formulation development, quality control testing, and national logistics.",
          },
          {
            id: "glp",
            title: "Good Laboratory Practices (GLP)",
            code: "GLP-LAB-STABILITY",
            issuer: "National Quality Council",
            validUntil: "Current",
            description:
              "Fully equipped analytical testing laboratory featuring modern HPLC, dissolution testing apparatus, and microbiological incubators.",
          },
          {
            id: "schedule-m",
            title: "Schedule M Compliance",
            code: "SCH-M/DRUGS-COSMETICS-ACT",
            issuer: "State Drug Regulatory Authority",
            validUntil: "Current",
            description:
              "Strict compliance with Indian Drugs & Cosmetics Act Schedule M requirements for cleanrooms, AHUs, and sterile water systems.",
          },
        ],
      },
      seo: {
        metaTitle: "Certifications & Quality Standards | Zeal Pharmaceuticals",
        metaDescription: "WHO-GMP, ISO 9001:2015, and Schedule M certifications of Zeal Pharmaceuticals.",
      },
      status: "PUBLISHED",
      publishedAt: new Date("2024-01-01"),
      isActive: true,
      isDeleted: false,
    },
    {
      key: "faqs",
      slug: "faqs",
      title: "Frequently Asked Questions (Stockists Distribution)",
      description: "Common questions regarding Stockists Distribution, commercial terms, and orders.",
      contentType: "FAQ",
      section: "franchise",
      content: {
        intro: "Common questions from prospective stockists, distributors, and chemists.",
        items: [
          {
            id: "faq-1",
            category: "Stockists Distribution",
            question: "Does Zeal Pharmaceuticals provide exclusive Stockists Distribution rights?",
            answer:
              "Yes. We offer strictly protected territory rights backed by a formal Stockists Distribution Agreement to ensure you operate smoothly in your assigned territory.",
            sortOrder: 1,
          },
          {
            id: "faq-2",
            category: "Eligibility & Licenses",
            question: "What legal documents are mandatory to apply for Stockists Distribution?",
            answer:
              "A valid Wholesale Drug License (Form 20B and Form 21B) along with a valid GST Registration certificate are legally required under the Drugs and Cosmetics Act.",
            sortOrder: 2,
          },
          {
            id: "faq-3",
            category: "Order & Dispatch",
            question: "How quickly are orders dispatched after confirmation?",
            answer:
              "Orders are dispatched within 24 to 48 hours of confirmation via trusted pharmaceutical transport logistics with real-time consignment tracking.",
            sortOrder: 3,
          },
          {
            id: "faq-4",
            category: "Promotional Support",
            question: "What promotional inputs and marketing collaterals are provided?",
            answer:
              "We supply comprehensive promotional inputs free of charge, including A4 Clinical Visual Aids (LBLs), Catch Covers, Doctor Reminder Cards, Product Glossaries, and Medical Representative Bags.",
            sortOrder: 4,
          },
          {
            id: "faq-5",
            category: "Investment",
            question: "What is the minimum initial investment required for Stockists Distribution?",
            answer:
              "We offer flexible initial investment brackets starting from ₹50,000 to ₹5 Lakh+ depending on the territory size and selected therapeutic divisions.",
            sortOrder: 5,
          },
        ],
      },
      seo: {
        metaTitle: "Stockists Distribution FAQs | Zeal Pharmaceuticals",
        metaDescription: "Answers to common questions regarding Stockists Distribution, Drug License, and wholesale margins.",
      },
      status: "PUBLISHED",
      publishedAt: new Date("2024-01-01"),
      isActive: true,
      isDeleted: false,
    },
    {
      key: "banners",
      slug: "home-banners",
      title: "Homepage Hero Banners",
      description: "Rotating banners on homepage.",
      contentType: "BANNER",
      section: "home",
      content: [
        {
          id: "banner-1",
          title: "Partner with India’s Most Trusted Stockist Distribution Network",
          subtitle:
            "Direct depot access to 130+ DCGI-approved pharmaceutical formulations with protected district margins, transparent wholesale pricing, and dedicated stockist support.",
          badge: "WHO-GMP & DCGI COMPLIANT BULK DISTRIBUTION",
          imageUrl: "/banners/home_animated_world.jpg",
          ctaText: "Apply for Stockists Distribution",
          ctaLink: "/contact",
          sortOrder: 1,
          isActive: true,
        },
        {
          id: "banner-2",
          title: "Ready Bulk Stock with Pan-India Distribution Network",
          subtitle:
            "Equipped with modern temperature-controlled warehousing at Surat (7015, BTM Market) ensuring computerized FEFO batch management, zero stockouts, and seamless transit across all states.",
          badge: "CENTRAL LOGISTICS DEPOT • SURAT, GUJARAT",
          imageUrl: "/banners/home_animated_depot.jpg",
          ctaText: "Explore Product Catalog",
          ctaLink: "/products",
          sortOrder: 2,
          isActive: true,
        },
        {
          id: "banner-3",
          title: "Accelerate Prescriptions with Free Visual Aids & Detailing Kits",
          subtitle:
            "Empower your field network with premium doctor visual aids, clinical LBLs, reminder cards, scientific product glossaries, and physician sample kits provided at zero cost.",
          badge: "COMPREHENSIVE B2B MARKETING COLLATERALS",
          imageUrl: "/banners/home_animated_marketing.jpg",
          ctaText: "Request Stockist Kit",
          ctaLink: "/contact",
          sortOrder: 3,
          isActive: true,
        },
      ],
      seo: {
        metaTitle: "Zeal Pharmaceuticals - Premier Stockists & Distribution Partner",
      },
      status: "PUBLISHED",
      publishedAt: new Date("2024-01-01"),
      isActive: true,
      isDeleted: false,
    },
    {
      key: "contact-info",
      slug: "contact-info",
      title: "Corporate & Contact Information",
      description: "Office, manufacturing plant addresses, and contact numbers.",
      contentType: "SETTING",
      section: "corporate",
      content: {
        companyName: "Zeal Pharmaceuticals",
        headOfficeAddress: "Corporate Heights, S.G. Highway, Ahmedabad, Gujarat 380054, India",
        plantAddress: "Sanand GIDC Industrial Estate, Phase II, Ahmedabad, Gujarat 382110, India",
        phone: "+91 9316227576",
        salesHelpline: "+91 9316227576",
        hrHelpline: "+91 9316227576",
        email: "info@zealpharma.com",
        salesEmail: "sales@zealpharma.com",
        whatsappNumber: "+91 9316227576",
        gstNumber: "24AAACZ1234F1Z5",
        drugLicenseNumber: "20B-123456 / 21B-123456",
        workingHours: "Monday - Saturday: 9:30 AM - 6:30 PM",
      },
      status: "PUBLISHED",
      publishedAt: new Date("2024-01-01"),
      isActive: true,
      isDeleted: false,
    },
  ];

/**
 * Ensures default CMS content exists in database and normalizes existing documents
 */
const ensureCmsSeeded = async (): Promise<void> => {
  // Normalize any existing documents that were created without isDeleted or status
  await Content.updateMany(
    { isDeleted: { $exists: false } },
    { $set: { isDeleted: false } }
  );
  await Content.updateMany(
    { status: { $exists: false } },
    { $set: { status: "PUBLISHED" } }
  );
  await Content.updateMany(
    { isActive: { $exists: false } },
    { $set: { isActive: true } }
  );

  for (const seed of defaultCmsSeeds) {
    const existing = await Content.findOne({ key: seed.key });
    if (!existing) {
      await Content.create(seed);
    } else {
      const updateFields: Record<string, unknown> = {};
      if (existing.isDeleted === undefined || existing.isDeleted === null) updateFields.isDeleted = false;
      if (!existing.status) updateFields.status = "PUBLISHED";
      if (!existing.contentType) updateFields.contentType = seed.contentType;
      if (!existing.slug) updateFields.slug = seed.slug;
      if (existing.isActive === undefined || existing.isActive === null) updateFields.isActive = true;
      if (!existing.publishedAt) updateFields.publishedAt = seed.publishedAt || new Date();
      if (seed.key === "contact-info" && existing.content) {
        const c = existing.content as Record<string, unknown>;
        if (
          String(c.phone || '').includes('74360') ||
          String(c.salesHelpline || '').includes('74360') ||
          String(c.hrHelpline || '').includes('74360') ||
          String(c.whatsappNumber || '').includes('74360')
        ) {
          updateFields.content = {
            ...c,
            phone: "+91 9316227576",
            salesHelpline: "+91 9316227576",
            hrHelpline: "+91 9316227576",
            whatsappNumber: "+91 9316227576",
          };
        }
      }
      if (Object.keys(updateFields).length > 0) {
        await Content.updateOne({ _id: existing._id }, { $set: updateFields });
      }
    }
  }
};

const createContent = async (body: ICreateContentRequest, user?: IAuthenticatedUser) => {
  await ensureCmsSeeded();

  const cleanKey = body.key.toLowerCase().trim();
  const existing = await Content.findOne({ key: cleanKey });
  if (existing && existing.isDeleted !== true) {
    throw new AppError("Content key already exists", HTTP_STATUS.CONFLICT);
  }

  const seoData = body.seo || body.metadata;
  const status = body.status || "PUBLISHED";
  const publishedAt =
    status === "PUBLISHED"
      ? body.publishedAt
        ? new Date(body.publishedAt)
        : new Date()
      : body.publishedAt
        ? new Date(body.publishedAt)
        : null;

  const contentDocData = {
    key: cleanKey,
    slug: body.slug ? body.slug.trim().toLowerCase() : cleanKey,
    title: body.title.trim(),
    description: body.description?.trim() || "",
    contentType: body.contentType || "SECTION",
    section: body.section?.trim() || "",
    content: body.content,
    mediaIds: body.mediaIds ? body.mediaIds.map((id) => new mongoose.Types.ObjectId(id)) : [],
    seo: {
      metaTitle: seoData?.metaTitle?.trim() || "",
      metaDescription: seoData?.metaDescription?.trim() || "",
      keywords: seoData?.keywords || [],
      canonicalUrl: seoData?.canonicalUrl?.trim() || "",
      ogTitle: seoData?.ogTitle?.trim() || "",
      ogDescription: seoData?.ogDescription?.trim() || "",
      ogImage: seoData?.ogImage || null,
    },
    sortOrder: Number(body.sortOrder) || 0,
    status,
    publishedAt,
    scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : null,
    isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
    createdBy: user?._id ? new mongoose.Types.ObjectId(user._id) : null,
    updatedBy: user?._id ? new mongoose.Types.ObjectId(user._id) : null,
    isDeleted: false,
    deletedAt: null,
    deletedBy: null,
  };

  if (existing) {
    const doc = await Content.findByIdAndUpdate(existing._id, contentDocData, {
      new: true,
      runValidators: true,
    });
    return Content.findById(doc!._id).populate(auditPopulate).lean();
  }

  const doc = await Content.create(contentDocData);
  return Content.findById(doc._id).populate(auditPopulate).lean();
};

const getContentByKey = async (keyOrSlug: string, isPublic = true) => {
  await ensureCmsSeeded();

  const clean = keyOrSlug.toLowerCase().trim();
  const filter: Record<string, unknown> = {
    $or: [{ key: clean }, { slug: clean }],
    isDeleted: { $ne: true },
  };

  if (isPublic) {
    filter.isActive = { $ne: false };
    filter.status = { $nin: ["DRAFT", "ARCHIVED"] };
  }

  const doc = await Content.findOne(filter).populate(auditPopulate).lean();
  if (!doc) {
    throw new AppError(MESSAGES.CONTENT_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  return doc;
};

const getAllPublicContent = async () => {
  await ensureCmsSeeded();
  return Content.find({
    isActive: { $ne: false },
    isDeleted: { $ne: true },
    status: { $nin: ["DRAFT", "ARCHIVED"] },
  })
    .select("key slug title description contentType section content mediaIds seo sortOrder updatedAt")
    .sort({ sortOrder: 1, createdAt: -1 })
    .lean();
};

const getAllContentAdmin = async (query: IContentQuery = {}) => {
  await ensureCmsSeeded();

  const filter: Record<string, unknown> = { isDeleted: { $ne: true } };

  if (query.contentType) {
    filter.contentType = query.contentType;
  }

  if (query.section) {
    filter.section = query.section.trim();
  }

  if (query.status) {
    filter.status = query.status;
  }

  if (query.isActive !== undefined) {
    filter.isActive = query.isActive === "true";
  }

  if (query.search && query.search.trim()) {
    const searchRegex = { $regex: query.search.trim(), $options: "i" };
    filter.$or = [
      { key: searchRegex },
      { slug: searchRegex },
      { title: searchRegex },
      { description: searchRegex },
      { section: searchRegex },
    ];
  }

  const { page, limit, skip } = buildPagination(Number(query.page ?? 1), Number(query.limit ?? 50));

  const [contents, total] = await Promise.all([
    Content.find(filter)
      .populate(auditPopulate)
      .sort({ sortOrder: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Content.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit);
  return { contents, total, page, limit, totalPages };
};

const updateContent = async (
  keyOrId: string,
  body: IUpdateContentRequest,
  user?: IAuthenticatedUser
) => {
  await ensureCmsSeeded();

  const clean = keyOrId.toLowerCase().trim();

  // Look for existing content document by _id, key, or slug
  let existing = null;
  if (mongoose.Types.ObjectId.isValid(clean)) {
    existing = await Content.findOne({
      $or: [{ _id: clean }, { key: clean }, { slug: clean }],
    });
  } else {
    existing = await Content.findOne({
      $or: [{ key: clean }, { slug: clean }],
    });
  }

  const updatePayload: Record<string, unknown> = {
    isDeleted: false,
    updatedBy: user?._id ? new mongoose.Types.ObjectId(user._id) : null,
  };

  if (body.content !== undefined) updatePayload.content = body.content;
  if (body.title !== undefined) updatePayload.title = body.title.trim();
  if (body.slug !== undefined) updatePayload.slug = body.slug.trim().toLowerCase();
  if (body.description !== undefined) updatePayload.description = body.description.trim();
  if (body.contentType !== undefined) updatePayload.contentType = body.contentType;
  if (body.section !== undefined) updatePayload.section = body.section.trim();
  if (body.sortOrder !== undefined) updatePayload.sortOrder = Number(body.sortOrder);
  if (body.isActive !== undefined) updatePayload.isActive = Boolean(body.isActive);

  if (body.mediaIds !== undefined) {
    updatePayload.mediaIds = body.mediaIds.map((id) => new mongoose.Types.ObjectId(id));
  }

  if (body.status !== undefined) {
    updatePayload.status = body.status;
    if (body.status === "PUBLISHED" && !existing?.publishedAt && !body.publishedAt) {
      updatePayload.publishedAt = new Date();
    }
  } else if (!existing?.status) {
    updatePayload.status = "PUBLISHED";
  }

  if (body.publishedAt !== undefined) {
    updatePayload.publishedAt = body.publishedAt ? new Date(body.publishedAt) : null;
  }

  if (body.scheduledAt !== undefined) {
    updatePayload.scheduledAt = body.scheduledAt ? new Date(body.scheduledAt) : null;
  }

  const seoData = body.seo || body.metadata;
  if (seoData !== undefined) {
    updatePayload.seo = {
      metaTitle: seoData.metaTitle?.trim() || "",
      metaDescription: seoData.metaDescription?.trim() || "",
      keywords: seoData.keywords || [],
      canonicalUrl: seoData.canonicalUrl?.trim() || "",
      ogTitle: seoData.ogTitle?.trim() || "",
      ogDescription: seoData.ogDescription?.trim() || "",
      ogImage: seoData.ogImage || null,
    };
  }

  if (!existing) {
    const created = await Content.create({
      key: clean,
      slug: body.slug ? body.slug.trim().toLowerCase() : clean,
      title: body.title || clean.toUpperCase(),
      content: body.content ?? {},
      createdBy: user?._id ? new mongoose.Types.ObjectId(user._id) : null,
      isDeleted: false,
      status: "PUBLISHED",
      publishedAt: new Date(),
      isActive: true,
      ...updatePayload,
    });
    return Content.findById(created._id).populate(auditPopulate).lean();
  }

  const updated = await Content.findByIdAndUpdate(existing._id, updatePayload, {
    new: true,
    runValidators: true,
  })
    .populate(auditPopulate)
    .lean();

  return updated;
};

const deleteContent = async (keyOrId: string, user?: IAuthenticatedUser) => {
  const clean = keyOrId.toLowerCase().trim();
  const filter: Record<string, unknown> = {
    isDeleted: { $ne: true },
  };

  if (mongoose.Types.ObjectId.isValid(clean)) {
    filter.$or = [{ _id: clean }, { key: clean }, { slug: clean }];
  } else {
    filter.$or = [{ key: clean }, { slug: clean }];
  }

  const deleted = await Content.findOneAndUpdate(
    filter,
    {
      isDeleted: true,
      deletedAt: new Date(),
      deletedBy: user?._id ? new mongoose.Types.ObjectId(user._id) : null,
    },
    { new: true }
  ).lean();

  if (!deleted) {
    throw new AppError(MESSAGES.CONTENT_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  return {
    _id: deleted._id,
    key: deleted.key,
    title: deleted.title,
    isDeleted: deleted.isDeleted,
    deletedAt: deleted.deletedAt,
  };
};

export {
  ensureCmsSeeded,
  createContent,
  getContentByKey,
  getAllPublicContent,
  getAllContentAdmin,
  updateContent,
  deleteContent,
};
