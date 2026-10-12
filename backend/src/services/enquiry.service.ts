import mongoose from "mongoose";
import "../models/role.model";
import ProductEnquiry from "../models/productEnquiry.model";
import FranchiseEnquiry from "../models/franchiseEnquiry.model";
import Product from "../models/product.model";
import User from "../models/user.model";
import AppError from "../utils/appError";
import HTTP_STATUS from "../constants/httpStatus";
import MESSAGES from "../constants/messages";
import PERMISSIONS from "../constants/permissions";
import { buildPagination } from "../utils/pagination";
import { validateDrugLicenseNumber } from "../utils/dlValidator";
import { sendLeadWhatsAppNotification, sendStatusUpdateWhatsAppNotification } from "./notification.service";
import { sendLeadAlertEmail, sendLeadConfirmationEmail, sendAdminReplyEmail } from "./mail.service";
import type {
  ICreateEnquiryRequest,
  ICreateProductEnquiryRequest,
  ICreateFranchiseEnquiryRequest,
  IUpdateEnquiryStatusRequest,
  IAssignEnquiryRequest,
  IAddEnquiryNoteRequest,
  IEnquiryQuery,
} from "../types/enquiry.types";
import type { IAuthenticatedUser } from "../types/user.types";

const productEnquiryPopulate = [
  {
    path: "product",
    select: "name slug genericName packaging dosageForm category featuredImage",
    populate: { path: "category", select: "name slug" },
  },
  {
    path: "products.product",
    select: "name slug genericName packaging dosageForm category featuredImage",
  },
  { path: "assignedTo", select: "name email role phone" },
  { path: "assignedBy", select: "name email role phone" },
  {
    path: "updatedBy",
    select: "name email role phone designation",
    populate: { path: "role", select: "name code description" },
  },
  {
    path: "internalNotes.addedBy",
    select: "name email role designation",
    populate: { path: "role", select: "name code description" },
  },
];

const franchiseEnquiryPopulate = [
  {
    path: "interestedProducts",
    select: "name slug genericName packaging dosageForm",
  },
  { path: "assignedTo", select: "name email role phone" },
  { path: "assignedBy", select: "name email role phone" },
  {
    path: "updatedBy",
    select: "name email role phone designation",
    populate: { path: "role", select: "name code description" },
  },
  {
    path: "internalNotes.addedBy",
    select: "name email role designation",
    populate: { path: "role", select: "name code description" },
  },
];

const validateEnquiryId = (id: string): void => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(MESSAGES.INVALID_ENQUIRY_ID, HTTP_STATUS.BAD_REQUEST);
  }
};

// =====================================================
// 1. CREATE PRODUCT ENQUIRY (SINGLE / BULK PRODUCT)
// =====================================================
const createProductEnquiry = async (body: ICreateProductEnquiryRequest) => {
  let resolvedProductId: mongoose.Types.ObjectId | null = null;
  let resolvedProductName: string | undefined;

  const targetProductId = body.productId || (body as any).product;
  if (targetProductId && mongoose.Types.ObjectId.isValid(targetProductId)) {
    const product = await Product.findOne({ _id: targetProductId, isDeleted: false });
    if (product) {
      resolvedProductId = new mongoose.Types.ObjectId(product._id);
      resolvedProductName = product.name;
    }
  } else if (body.productSlug && body.productSlug.trim()) {
    const product = await Product.findOne({
      slug: body.productSlug.trim().toLowerCase(),
      isDeleted: false,
    });
    if (product) {
      resolvedProductId = new mongoose.Types.ObjectId(product._id);
      resolvedProductName = product.name;
    }
  }

  // Handle bulk products list if provided
  const bulkItems: Array<{
    product: mongoose.Types.ObjectId;
    quantity?: number | null;
    quantityUnit?: string;
    message?: string;
  }> = [];

  if (Array.isArray(body.products) && body.products.length > 0) {
    for (const item of body.products) {
      if (item.productId && mongoose.Types.ObjectId.isValid(item.productId)) {
        bulkItems.push({
          product: new mongoose.Types.ObjectId(item.productId),
          quantity: item.quantity ? Number(item.quantity) : null,
          quantityUnit: item.quantityUnit?.trim() || "",
          message: item.message?.trim() || "",
        });
      }
    }
  }

  const detectedType =
    body.enquiryType || (bulkItems.length > 0 ? "BULK_PRODUCT" : "SINGLE_PRODUCT");

  // Validate & normalize Drug License number if provided
  let normalizedDl = body.drugLicenseNumber?.trim() || "";
  if (normalizedDl) {
    const dlResult = validateDrugLicenseNumber(normalizedDl, body.state);
    if (!dlResult.isValid) {
      throw new AppError(
        dlResult.error || "Invalid Drug License Number format",
        HTTP_STATUS.BAD_REQUEST
      );
    }
    normalizedDl = dlResult.normalized;
  }

  const parsedQty =
    body.quantity !== undefined && body.quantity !== null && body.quantity !== ""
      ? Number(body.quantity) || null
      : null;

  const enquiry = await ProductEnquiry.create({
    enquiryType: detectedType as "SINGLE_PRODUCT" | "BULK_PRODUCT",
    product: resolvedProductId,
    products: bulkItems,
    name: (body.name || (body as any).fullName || "Valued Client").trim(),
    email: body.email.trim().toLowerCase(),
    phone: body.phone.trim(),
    whatsappNumber: body.whatsappNumber?.trim() || body.phone.trim(),
    companyName: body.companyName?.trim() || "",
    drugLicenseNumber: normalizedDl,
    gstNumber: body.gstNumber?.trim() || "",
    city: body.city.trim(),
    state: body.state.trim(),
    pincode: body.pincode?.trim() || "",
    quantity: parsedQty,
    quantityUnit: body.quantityUnit?.trim() || "",
    message: body.message?.trim() || "",
    status: "NEW" as const,
    source: (body.source as any) || "WEBSITE",
    isConfirmed: body.isConfirmed !== false,
    confirmedAt: body.isConfirmed !== false ? new Date() : null,
    assignedTo: null,
    assignedBy: null,
    assignedAt: null,
    internalNotes: [],
    isDeleted: false,
    deletedAt: null,
    deletedBy: null,
  });

  const populated = await ProductEnquiry.findById(enquiry._id)
    .populate(productEnquiryPopulate)
    .lean();

  if (body.isConfirmed !== false) {
    const whatsAppDispatch = await sendLeadWhatsAppNotification({
      enquiryId: String(enquiry._id),
      name: enquiry.name,
      phone: enquiry.phone,
      email: enquiry.email,
      city: enquiry.city,
      state: enquiry.state,
      companyName: enquiry.companyName,
      drugLicenseNumber: enquiry.drugLicenseNumber,
      gstNumber: enquiry.gstNumber,
      pincode: enquiry.pincode,
      quantity: enquiry.quantity ? String(enquiry.quantity) : "",
      message: enquiry.message,
      enquiryType: enquiry.enquiryType,
      productName: resolvedProductName,
      source: enquiry.source,
      isConfirmed: true,
    });

    void sendLeadAlertEmail({
      enquiryType: enquiry.enquiryType,
      name: enquiry.name,
      phone: enquiry.phone,
      email: enquiry.email,
      city: enquiry.city,
      state: enquiry.state,
      companyName: enquiry.companyName,
      productName: resolvedProductName,
      quantity: enquiry.quantity ? String(enquiry.quantity) : "",
      quantityUnit: enquiry.quantityUnit,
      drugLicenseNumber: enquiry.drugLicenseNumber,
      gstNumber: enquiry.gstNumber,
      message: enquiry.message,
      enquiryId: String(enquiry._id),
    });

    void sendLeadConfirmationEmail({
      name: enquiry.name,
      email: enquiry.email,
      enquiryType: enquiry.enquiryType,
      productName: resolvedProductName,
      enquiryId: String(enquiry._id),
    });

    return {
      ...populated,
      enquiryCategory: "PRODUCT",
      instantWhatsAppChatUrl: whatsAppDispatch.instantWhatsAppChatUrl,
      adminDirectWhatsAppUrl: whatsAppDispatch.adminDirectWhatsAppUrl,
      whatsAppAlertSent: whatsAppDispatch.sent,
    };
  }

  return {
    ...populated,
    enquiryCategory: "PRODUCT",
    confirmationRequired: true,
    message: "Product enquiry draft created. Please confirm to notify Zeal Pharma sales management.",
  };
};

// =====================================================
// 2. CREATE FRANCHISE ENQUIRY (STOCKISTS DISTRIBUTION APPLICATION)
// =====================================================
const createFranchiseEnquiry = async (body: ICreateFranchiseEnquiryRequest) => {
  let normalizedDl = body.drugLicenseNumber?.trim() || "";
  if (normalizedDl) {
    const dlResult = validateDrugLicenseNumber(normalizedDl, body.state);
    if (!dlResult.isValid) {
      throw new AppError(
        dlResult.error || "Invalid Drug License Number format",
        HTTP_STATUS.BAD_REQUEST
      );
    }
    normalizedDl = dlResult.normalized;
  }

  const district = body.district?.trim() || body.territoryDistrict?.trim() || body.city.trim();

  // Resolve interested products if provided
  const interestedProductIds: mongoose.Types.ObjectId[] = [];
  if (Array.isArray(body.interestedProducts)) {
    for (const prodId of body.interestedProducts) {
      if (mongoose.Types.ObjectId.isValid(prodId)) {
        interestedProductIds.push(new mongoose.Types.ObjectId(prodId));
      }
    }
  }

  const enquiry = await FranchiseEnquiry.create({
    name: (body.name || (body as any).fullName || "Valued Applicant").trim(),
    email: body.email.trim().toLowerCase(),
    phone: body.phone.trim(),
    whatsappNumber: body.whatsappNumber?.trim() || body.phone.trim(),
    companyName: body.companyName?.trim() || "",
    businessType: (body.businessType as any) || "INDIVIDUAL",
    drugLicenseNumber: normalizedDl,
    gstNumber: body.gstNumber?.trim() || "",
    address: body.address?.trim() || "",
    city: body.city.trim(),
    state: body.state.trim(),
    district,
    pincode: body.pincode?.trim() || "",
    pharmaExperience: body.pharmaExperience?.trim() || "",
    currentBusiness: body.currentBusiness?.trim() || "",
    investmentBudget: body.investmentBudget?.trim() || "",
    interestedDivisions: Array.isArray(body.interestedDivisions) ? body.interestedDivisions : [],
    hasGodownFacility: Boolean(body.hasGodownFacility),
    godownDetails: body.godownDetails?.trim() || "",
    hasTransportFacility: Boolean(body.hasTransportFacility),
    transportDetails: body.transportDetails?.trim() || "",
    preferredTerritory: body.preferredTerritory?.trim() || district,
    interestedProducts: interestedProductIds,
    message: body.message?.trim() || "",
    status: "NEW" as const,
    source: (body.source as any) || "FRANCHISE_PAGE",
    isConfirmed: body.isConfirmed !== false,
    confirmedAt: body.isConfirmed !== false ? new Date() : null,
    assignedTo: null,
    assignedBy: null,
    assignedAt: null,
    nextFollowUpAt: null,
    lastContactedAt: null,
    internalNotes: [],
    isDeleted: false,
    deletedAt: null,
    deletedBy: null,
  });

  const populated = await FranchiseEnquiry.findById(enquiry._id)
    .populate(franchiseEnquiryPopulate)
    .lean();

  if (body.isConfirmed !== false) {
    const whatsAppDispatch = await sendLeadWhatsAppNotification({
      enquiryId: String(enquiry._id),
      name: enquiry.name,
      phone: enquiry.phone,
      email: enquiry.email,
      city: enquiry.city,
      state: enquiry.state,
      companyName: enquiry.companyName,
      drugLicenseNumber: enquiry.drugLicenseNumber,
      gstNumber: enquiry.gstNumber,
      pincode: enquiry.pincode,
      territoryDistrict: enquiry.district,
      investmentBudget: enquiry.investmentBudget,
      pharmaExperience: enquiry.pharmaExperience,
      interestedDivisions: enquiry.interestedDivisions,
      hasGodownFacility: enquiry.hasGodownFacility,
      hasTransportFacility: enquiry.hasTransportFacility,
      quantity: "Stockists Distribution Territory Quota",
      message: enquiry.message,
      enquiryType: "FRANCHISE",
      source: enquiry.source,
      isConfirmed: true,
    });

    void sendLeadAlertEmail({
      enquiryType: "FRANCHISE",
      name: enquiry.name,
      phone: enquiry.phone,
      email: enquiry.email,
      city: enquiry.city,
      state: enquiry.state,
      companyName: enquiry.companyName,
      territoryDistrict: enquiry.district,
      investmentBudget: enquiry.investmentBudget,
      drugLicenseNumber: enquiry.drugLicenseNumber,
      gstNumber: enquiry.gstNumber,
      message: enquiry.message,
      enquiryId: String(enquiry._id),
    });

    void sendLeadConfirmationEmail({
      name: enquiry.name,
      email: enquiry.email,
      enquiryType: "FRANCHISE",
      enquiryId: String(enquiry._id),
    });

    return {
      ...populated,
      enquiryCategory: "FRANCHISE",
      instantWhatsAppChatUrl: whatsAppDispatch.instantWhatsAppChatUrl,
      adminDirectWhatsAppUrl: whatsAppDispatch.adminDirectWhatsAppUrl,
      whatsAppAlertSent: whatsAppDispatch.sent,
    };
  }

  return {
    ...populated,
    enquiryCategory: "FRANCHISE",
    confirmationRequired: true,
    message: "Franchise enquiry draft created. Please confirm to notify Zeal Pharma sales management.",
  };
};

// =====================================================
// 3. CREATE ENQUIRY (SMART ROUTER FOR GENERAL/LEGACY CALLS)
// =====================================================
const createEnquiry = async (body: ICreateEnquiryRequest) => {
  if (body.enquiryType === "FRANCHISE") {
    return createFranchiseEnquiry(body as unknown as ICreateFranchiseEnquiryRequest);
  }
  return createProductEnquiry(body as unknown as ICreateProductEnquiryRequest);
};

// =====================================================
// 4. CONFIRM ENQUIRY (WORKS FOR BOTH MODELS)
// =====================================================
const confirmEnquiry = async (id: string) => {
  validateEnquiryId(id);

  // Check in ProductEnquiry
  const productEnq = await ProductEnquiry.findOne({ _id: id, isDeleted: false });
  if (productEnq) {
    productEnq.isConfirmed = true;
    productEnq.confirmedAt = new Date();
    await productEnq.save();

    const populated = await ProductEnquiry.findById(id).populate(productEnquiryPopulate).lean();
    const resolvedProductName =
      populated?.product && typeof populated.product === "object" && "name" in populated.product
        ? (populated.product as { name: string }).name
        : undefined;

    const whatsAppDispatch = await sendLeadWhatsAppNotification({
      enquiryId: String(productEnq._id),
      name: productEnq.name,
      phone: productEnq.phone,
      email: productEnq.email,
      city: productEnq.city,
      state: productEnq.state,
      companyName: productEnq.companyName,
      drugLicenseNumber: productEnq.drugLicenseNumber,
      gstNumber: productEnq.gstNumber,
      pincode: productEnq.pincode,
      quantity: productEnq.quantity ? String(productEnq.quantity) : "",
      message: productEnq.message,
      enquiryType: productEnq.enquiryType,
      productName: resolvedProductName,
      source: productEnq.source,
      isConfirmed: true,
    });

    return {
      ...populated,
      enquiryCategory: "PRODUCT",
      instantWhatsAppChatUrl: whatsAppDispatch.instantWhatsAppChatUrl,
      adminDirectWhatsAppUrl: whatsAppDispatch.adminDirectWhatsAppUrl,
      whatsAppAlertSent: whatsAppDispatch.sent,
    };
  }

  // Check in FranchiseEnquiry
  const franchiseEnq = await FranchiseEnquiry.findOne({ _id: id, isDeleted: false });
  if (franchiseEnq) {
    franchiseEnq.isConfirmed = true;
    franchiseEnq.confirmedAt = new Date();
    await franchiseEnq.save();

    const populated = await FranchiseEnquiry.findById(id)
      .populate(franchiseEnquiryPopulate)
      .lean();

    const whatsAppDispatch = await sendLeadWhatsAppNotification({
      enquiryId: String(franchiseEnq._id),
      name: franchiseEnq.name,
      phone: franchiseEnq.phone,
      email: franchiseEnq.email,
      city: franchiseEnq.city,
      state: franchiseEnq.state,
      companyName: franchiseEnq.companyName,
      drugLicenseNumber: franchiseEnq.drugLicenseNumber,
      gstNumber: franchiseEnq.gstNumber,
      pincode: franchiseEnq.pincode,
      territoryDistrict: franchiseEnq.district,
      investmentBudget: franchiseEnq.investmentBudget,
      pharmaExperience: franchiseEnq.pharmaExperience,
      interestedDivisions: franchiseEnq.interestedDivisions,
      hasGodownFacility: franchiseEnq.hasGodownFacility,
      hasTransportFacility: franchiseEnq.hasTransportFacility,
      quantity: "Stockists Distribution Territory Quota",
      message: franchiseEnq.message,
      enquiryType: "FRANCHISE",
      source: franchiseEnq.source,
      isConfirmed: true,
    });

    return {
      ...populated,
      enquiryCategory: "FRANCHISE",
      instantWhatsAppChatUrl: whatsAppDispatch.instantWhatsAppChatUrl,
      adminDirectWhatsAppUrl: whatsAppDispatch.adminDirectWhatsAppUrl,
      whatsAppAlertSent: whatsAppDispatch.sent,
    };
  }

  throw new AppError(MESSAGES.ENQUIRY_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
};

// =====================================================
// 5. GET ALL PRODUCT ENQUIRIES (ADMIN)
// =====================================================
const getAllProductEnquiries = async (query: IEnquiryQuery = {}) => {
  const filter: Record<string, unknown> = { isDeleted: false };

  if (query.status) {
    filter.status = query.status;
  }
  if (query.enquiryType) {
    filter.enquiryType = query.enquiryType;
  }
  if (query.productId && mongoose.Types.ObjectId.isValid(query.productId)) {
    filter.product = new mongoose.Types.ObjectId(query.productId);
  }
  if (query.assignedTo && mongoose.Types.ObjectId.isValid(query.assignedTo)) {
    filter.assignedTo = new mongoose.Types.ObjectId(query.assignedTo);
  }
  if (query.city) {
    filter.city = { $regex: new RegExp(query.city.trim(), "i") };
  }
  if (query.state) {
    filter.state = { $regex: new RegExp(query.state.trim(), "i") };
  }

  if (query.startDate || query.endDate) {
    const dateFilter: Record<string, Date> = {};
    if (query.startDate) dateFilter.$gte = new Date(query.startDate);
    if (query.endDate) dateFilter.$lte = new Date(query.endDate);
    filter.createdAt = dateFilter;
  }

  if (query.search && query.search.trim()) {
    const searchRegex = { $regex: query.search.trim(), $options: "i" };
    filter.$or = [
      { name: searchRegex },
      { email: searchRegex },
      { phone: searchRegex },
      { companyName: searchRegex },
      { city: searchRegex },
      { state: searchRegex },
      { message: searchRegex },
    ];
  }

  const { page, limit, skip } = buildPagination(Number(query.page ?? 1), Number(query.limit ?? 20));

  const [enquiries, total] = await Promise.all([
    ProductEnquiry.find(filter)
      .populate(productEnquiryPopulate)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    ProductEnquiry.countDocuments(filter),
  ]);

  const mapped = enquiries.map((e) => ({
    ...e,
    enquiryCategory: "PRODUCT",
  }));

  const totalPages = Math.ceil(total / limit);
  return { enquiries: mapped, total, page, limit, totalPages, category: "PRODUCT" };
};

// =====================================================
// 6. GET ALL FRANCHISE ENQUIRIES (ADMIN)
// =====================================================
const getAllFranchiseEnquiries = async (query: IEnquiryQuery = {}) => {
  const filter: Record<string, unknown> = { isDeleted: false };

  if (query.status) {
    filter.status = query.status;
  }
  if (query.assignedTo && mongoose.Types.ObjectId.isValid(query.assignedTo)) {
    filter.assignedTo = new mongoose.Types.ObjectId(query.assignedTo);
  }
  if (query.city) {
    filter.city = { $regex: new RegExp(query.city.trim(), "i") };
  }
  if (query.state) {
    filter.state = { $regex: new RegExp(query.state.trim(), "i") };
  }
  if (query.district) {
    filter.district = { $regex: new RegExp(query.district.trim(), "i") };
  }

  if (query.startDate || query.endDate) {
    const dateFilter: Record<string, Date> = {};
    if (query.startDate) dateFilter.$gte = new Date(query.startDate);
    if (query.endDate) dateFilter.$lte = new Date(query.endDate);
    filter.createdAt = dateFilter;
  }

  if (query.search && query.search.trim()) {
    const searchRegex = { $regex: query.search.trim(), $options: "i" };
    filter.$or = [
      { name: searchRegex },
      { email: searchRegex },
      { phone: searchRegex },
      { companyName: searchRegex },
      { city: searchRegex },
      { state: searchRegex },
      { district: searchRegex },
      { preferredTerritory: searchRegex },
      { message: searchRegex },
    ];
  }

  const { page, limit, skip } = buildPagination(Number(query.page ?? 1), Number(query.limit ?? 20));

  const [enquiries, total] = await Promise.all([
    FranchiseEnquiry.find(filter)
      .populate(franchiseEnquiryPopulate)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    FranchiseEnquiry.countDocuments(filter),
  ]);

  const mapped = enquiries.map((e) => ({
    ...e,
    enquiryType: "FRANCHISE",
    enquiryCategory: "FRANCHISE",
  }));

  const totalPages = Math.ceil(total / limit);
  return { enquiries: mapped, total, page, limit, totalPages, category: "FRANCHISE" };
};

// =====================================================
// 7. GET ALL ENQUIRIES (SMART UNIFIED / CATEGORIZED)
// =====================================================
const getAllEnquiries = async (query: IEnquiryQuery = {}, user?: IAuthenticatedUser) => {
  if (query.category === "franchise" || query.enquiryType === "FRANCHISE") {
    return getAllFranchiseEnquiries(query);
  }
  if (query.category === "product") {
    return getAllProductEnquiries(query);
  }

  // Permission-based automatic categorization when viewing unified overview
  if (user && user.role !== "SUPER_ADMIN") {
    const granted = user.permissions || [];
    const hasWildcard = granted.includes("*");
    const hasProduct =
      hasWildcard || granted.includes(PERMISSIONS.PRODUCT_ENQUIRY_VIEW);
    const hasFranchise =
      hasWildcard ||
      granted.includes(PERMISSIONS.STOCKIST_ENQUIRY_VIEW) ||
      granted.includes(PERMISSIONS.SALES_ENQUIRY_VIEW) ||
      granted.includes("franchise_enquiry:view");

    if (hasFranchise && !hasProduct) {
      return getAllFranchiseEnquiries(query);
    }
    if (hasProduct && !hasFranchise) {
      return getAllProductEnquiries(query);
    }
  }

  // Combined overview (runs both)
  const [productRes, franchiseRes] = await Promise.all([
    getAllProductEnquiries(query),
    getAllFranchiseEnquiries(query),
  ]);

  const merged = [
    ...productRes.enquiries.map((e) => ({ ...e, enquiryCategory: "PRODUCT" })),
    ...franchiseRes.enquiries.map((e) => ({
      ...e,
      enquiryType: "FRANCHISE",
      enquiryCategory: "FRANCHISE",
    })),
  ].sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const total = productRes.total + franchiseRes.total;
  const limit = Number(query.limit ?? 20);
  const totalPages = Math.ceil(total / limit);

  return {
    enquiries: merged.slice(0, limit),
    total,
    page: Number(query.page ?? 1),
    limit,
    totalPages,
    productTotal: productRes.total,
    franchiseTotal: franchiseRes.total,
  };
};

// =====================================================
// 8. GET ENQUIRY BY ID
// =====================================================
const getEnquiryById = async (id: string) => {
  validateEnquiryId(id);

  const productEnq = await ProductEnquiry.findOne({ _id: id, isDeleted: false })
    .populate(productEnquiryPopulate)
    .lean();

  if (productEnq) {
    return { ...productEnq, enquiryCategory: "PRODUCT" };
  }

  const franchiseEnq = await FranchiseEnquiry.findOne({ _id: id, isDeleted: false })
    .populate(franchiseEnquiryPopulate)
    .lean();

  if (franchiseEnq) {
    return { ...franchiseEnq, enquiryCategory: "FRANCHISE" };
  }

  throw new AppError(MESSAGES.ENQUIRY_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
};

// =====================================================
// 9. UPDATE STATUS
// =====================================================
const updateEnquiryStatus = async (
  id: string,
  body: IUpdateEnquiryStatusRequest,
  user?: IAuthenticatedUser
) => {
  validateEnquiryId(id);

  // Check ProductEnquiry
  const productEnq = await ProductEnquiry.findOne({ _id: id, isDeleted: false });
  if (productEnq) {
    productEnq.status = body.status as any;
    if (user?._id) {
      productEnq.updatedBy = new mongoose.Types.ObjectId(user._id) as any;
    }
    if (body.note && body.note.trim() && user?._id) {
      productEnq.internalNotes.push({
        note: `Status changed to ${body.status}: ${body.note.trim()}`,
        addedBy: new mongoose.Types.ObjectId(user._id),
        addedAt: new Date(),
      });
    }

    let whatsAppDispatch = null;
    if (body.notifyClient !== false && productEnq.phone) {
      try {
        const isBulk = Boolean(productEnq.products && productEnq.products.length > 1);
        let prodName = isBulk ? `${productEnq.products.length} Formulations (Bulk Inquiry)` : "Product Formulation";
        let dosageOrPkg = "";

        if (!isBulk && productEnq.product) {
          const pDoc = await Product.findById(productEnq.product).select("name packaging dosageForm genericName").lean();
          if (pDoc?.name) {
            prodName = pDoc.name;
            dosageOrPkg = [pDoc.dosageForm, pDoc.packaging].filter(Boolean).join(" - ");
          }
        } else if (isBulk && productEnq.products && productEnq.products.length > 0) {
          const prodIds = productEnq.products.map((p: any) => p.product).filter(Boolean);
          const pDocs = await Product.find({ _id: { $in: prodIds } }).select("name").lean();
          if (pDocs.length > 0) {
            prodName = pDocs.map((p: any) => p.name).slice(0, 3).join(", ") + (pDocs.length > 3 ? ` +${pDocs.length - 3} more` : "");
          }
        }

        const qtyStr = productEnq.quantity
          ? `${productEnq.quantity} ${productEnq.quantityUnit || "Units"}`.trim()
          : undefined;

        whatsAppDispatch = await sendStatusUpdateWhatsAppNotification({
          recipientType: isBulk ? "BULK_CLIENT" : "PRODUCT_CLIENT",
          referenceId: String(productEnq._id),
          recipientName: productEnq.name,
          recipientPhone: productEnq.phone,
          recipientEmail: productEnq.email,
          newStatus: body.status,
          referenceTitle: prodName,
          additionalDetails: {
            productName: prodName,
            quantity: qtyStr,
            packaging: dosageOrPkg || undefined,
            companyName: productEnq.companyName || undefined,
            city: productEnq.city || undefined,
            state: productEnq.state || undefined,
            drugLicenseNumber: productEnq.drugLicenseNumber || undefined,
            gstNumber: productEnq.gstNumber || undefined,
            note: body.note ? body.note.trim() : undefined,
          },
          customMessage: body.customWhatsAppMessage || undefined,
        });

        if (user?._id) {
          productEnq.internalNotes.push({
            note: `WhatsApp status update (${body.status}) dispatched to client: ${productEnq.phone} (Bot Delivered: ${whatsAppDispatch?.deliveredViaBot ?? false})`,
            addedBy: new mongoose.Types.ObjectId(user._id),
            addedAt: new Date(),
          });
        }
      } catch (notifErr) {
        console.warn("Could not dispatch WhatsApp status notification for product enquiry:", notifErr);
      }
    }

    await productEnq.save();
    const updated = await ProductEnquiry.findById(id).populate(productEnquiryPopulate).lean();
    return { ...(updated as any), whatsAppDispatch };
  }

  // Check FranchiseEnquiry
  const franchiseEnq = await FranchiseEnquiry.findOne({ _id: id, isDeleted: false });
  if (franchiseEnq) {
    franchiseEnq.status = body.status as any;
    if (user?._id) {
      franchiseEnq.updatedBy = new mongoose.Types.ObjectId(user._id) as any;
    }
    if (body.nextFollowUpAt !== undefined) {
      franchiseEnq.nextFollowUpAt = body.nextFollowUpAt ? new Date(body.nextFollowUpAt) : null;
    }
    if (body.note && body.note.trim() && user?._id) {
      franchiseEnq.internalNotes.push({
        note: `Status changed to ${body.status}: ${body.note.trim()}`,
        addedBy: new mongoose.Types.ObjectId(user._id),
        addedAt: new Date(),
      });
    }

    let whatsAppDispatch = null;
    if (body.notifyClient !== false && franchiseEnq.phone) {
      try {
        const territory = franchiseEnq.district || franchiseEnq.city || franchiseEnq.preferredTerritory || "Designated Territory";
        const divisionsStr = franchiseEnq.interestedDivisions && franchiseEnq.interestedDivisions.length > 0
          ? franchiseEnq.interestedDivisions.join(", ")
          : undefined;

        whatsAppDispatch = await sendStatusUpdateWhatsAppNotification({
          recipientType: "FRANCHISE_CLIENT",
          referenceId: String(franchiseEnq._id),
          recipientName: franchiseEnq.name,
          recipientPhone: franchiseEnq.phone,
          recipientEmail: franchiseEnq.email,
          newStatus: body.status,
          referenceTitle: territory,
          additionalDetails: {
            territory,
            companyName: franchiseEnq.companyName || undefined,
            investmentBudget: franchiseEnq.investmentBudget || undefined,
            interestedDivisions: divisionsStr,
            city: franchiseEnq.city || undefined,
            state: franchiseEnq.state || undefined,
            drugLicenseNumber: franchiseEnq.drugLicenseNumber || undefined,
            gstNumber: franchiseEnq.gstNumber || undefined,
            note: body.note ? body.note.trim() : undefined,
          },
          customMessage: body.customWhatsAppMessage || undefined,
        });

        if (user?._id) {
          franchiseEnq.internalNotes.push({
            note: `WhatsApp status update (${body.status}) dispatched to client: ${franchiseEnq.phone} (Bot Delivered: ${whatsAppDispatch?.deliveredViaBot ?? false})`,
            addedBy: new mongoose.Types.ObjectId(user._id),
            addedAt: new Date(),
          });
        }
      } catch (notifErr) {
        console.warn("Could not dispatch WhatsApp status notification for franchise enquiry:", notifErr);
      }
    }

    await franchiseEnq.save();
    const updated = await FranchiseEnquiry.findById(id).populate(franchiseEnquiryPopulate).lean();
    return { ...(updated as any), whatsAppDispatch };
  }

  throw new AppError(MESSAGES.ENQUIRY_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
};

// =====================================================
// 10. ASSIGN ENQUIRY
// =====================================================
const assignEnquiry = async (
  id: string,
  body: IAssignEnquiryRequest,
  assignedByUser?: IAuthenticatedUser
) => {
  validateEnquiryId(id);

  if (!mongoose.Types.ObjectId.isValid(body.assignedTo)) {
    throw new AppError(MESSAGES.INVALID_USER_ID, HTTP_STATUS.BAD_REQUEST);
  }

  const assignedUser = await User.findOne({ _id: body.assignedTo, isDeleted: false });
  if (!assignedUser) {
    throw new AppError(MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  const productEnq = await ProductEnquiry.findOne({ _id: id, isDeleted: false });
  if (productEnq) {
    productEnq.assignedTo = new mongoose.Types.ObjectId(body.assignedTo);
    productEnq.assignedBy = assignedByUser?._id
      ? new mongoose.Types.ObjectId(assignedByUser._id)
      : null;
    productEnq.assignedAt = new Date();

    if (body.note && body.note.trim() && assignedByUser?._id) {
      productEnq.internalNotes.push({
        note: `Assigned to ${assignedUser.name}: ${body.note.trim()}`,
        addedBy: new mongoose.Types.ObjectId(assignedByUser._id),
        addedAt: new Date(),
      });
    }

    await productEnq.save();
    return ProductEnquiry.findById(id).populate(productEnquiryPopulate).lean();
  }

  const franchiseEnq = await FranchiseEnquiry.findOne({ _id: id, isDeleted: false });
  if (franchiseEnq) {
    franchiseEnq.assignedTo = new mongoose.Types.ObjectId(body.assignedTo);
    franchiseEnq.assignedBy = assignedByUser?._id
      ? new mongoose.Types.ObjectId(assignedByUser._id)
      : null;
    franchiseEnq.assignedAt = new Date();

    if (body.note && body.note.trim() && assignedByUser?._id) {
      franchiseEnq.internalNotes.push({
        note: `Assigned to ${assignedUser.name}: ${body.note.trim()}`,
        addedBy: new mongoose.Types.ObjectId(assignedByUser._id),
        addedAt: new Date(),
      });
    }

    await franchiseEnq.save();
    return FranchiseEnquiry.findById(id).populate(franchiseEnquiryPopulate).lean();
  }

  throw new AppError(MESSAGES.ENQUIRY_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
};

// =====================================================
// 11. ADD NOTE
// =====================================================
const addEnquiryNote = async (
  id: string,
  body: IAddEnquiryNoteRequest,
  user?: IAuthenticatedUser
) => {
  validateEnquiryId(id);

  const productEnq = await ProductEnquiry.findOne({ _id: id, isDeleted: false });
  if (productEnq) {
    productEnq.internalNotes.push({
      note: body.note.trim(),
      addedBy: user?._id ? new mongoose.Types.ObjectId(user._id) : (null as any),
      addedAt: new Date(),
    });
    await productEnq.save();
    return ProductEnquiry.findById(id).populate(productEnquiryPopulate).lean();
  }

  const franchiseEnq = await FranchiseEnquiry.findOne({ _id: id, isDeleted: false });
  if (franchiseEnq) {
    franchiseEnq.internalNotes.push({
      note: body.note.trim(),
      addedBy: user?._id ? new mongoose.Types.ObjectId(user._id) : (null as any),
      addedAt: new Date(),
    });
    await franchiseEnq.save();
    return FranchiseEnquiry.findById(id).populate(franchiseEnquiryPopulate).lean();
  }

  throw new AppError(MESSAGES.ENQUIRY_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
};

// =====================================================
// 12. SOFT DELETE
// =====================================================
const deleteEnquiry = async (id: string, user?: IAuthenticatedUser) => {
  validateEnquiryId(id);

  const productDeleted = await ProductEnquiry.findOneAndUpdate(
    { _id: id, isDeleted: false },
    {
      isDeleted: true,
      deletedAt: new Date(),
      deletedBy: user?._id ? new mongoose.Types.ObjectId(user._id) : null,
    },
    { new: true }
  ).lean();

  if (productDeleted) {
    return {
      _id: productDeleted._id,
      name: productDeleted.name,
      isDeleted: productDeleted.isDeleted,
      deletedAt: productDeleted.deletedAt,
      category: "PRODUCT",
    };
  }

  const franchiseDeleted = await FranchiseEnquiry.findOneAndUpdate(
    { _id: id, isDeleted: false },
    {
      isDeleted: true,
      deletedAt: new Date(),
      deletedBy: user?._id ? new mongoose.Types.ObjectId(user._id) : null,
    },
    { new: true }
  ).lean();

  if (franchiseDeleted) {
    return {
      _id: franchiseDeleted._id,
      name: franchiseDeleted.name,
      isDeleted: franchiseDeleted.isDeleted,
      deletedAt: franchiseDeleted.deletedAt,
      category: "FRANCHISE",
    };
  }

  throw new AppError(MESSAGES.ENQUIRY_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
};

// =====================================================
// 12. REPLY ENQUIRY VIA EMAIL (ADMIN / EMPLOYEE DIRECT OUTREACH)
// =====================================================
const replyEnquiryEmail = async (
  id: string,
  replyMessage: string,
  user?: IAuthenticatedUser,
  customSubject?: string
) => {
  validateEnquiryId(id);

  if (!replyMessage || !replyMessage.trim()) {
    throw new AppError("Reply message content cannot be empty", HTTP_STATUS.BAD_REQUEST);
  }

  let targetEnquiry: any = await ProductEnquiry.findOne({ _id: id, isDeleted: false }).lean();
  let modelType: "PRODUCT" | "FRANCHISE" = "PRODUCT";

  if (!targetEnquiry) {
    targetEnquiry = await FranchiseEnquiry.findOne({ _id: id, isDeleted: false }).lean();
    modelType = "FRANCHISE";
  }

  if (!targetEnquiry) {
    throw new AppError(MESSAGES.ENQUIRY_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  if (!targetEnquiry.email) {
    throw new AppError("Recipient email address is missing for this lead", HTTP_STATUS.BAD_REQUEST);
  }

  const clientName = targetEnquiry.name || "Valued Client";
  const subject = customSubject?.trim() || `Response regarding your inquiry - Zeal Pharmaceuticals`;
  const senderName = (user as any)?.name || "Zeal Pharma Sales Management";
  const senderDesignation = (user as any)?.designation || "Sales & Distribution Department";

  await sendAdminReplyEmail({
    to: targetEnquiry.email,
    subject,
    message: replyMessage.trim(),
    clientName,
    senderName,
    senderDesignation,
  });

  // Automatically append an internal note detailing the email outreach
  const preview = replyMessage.trim().slice(0, 100);
  const noteText = `✉️ Email response sent to ${targetEnquiry.email}: "${preview}${replyMessage.length > 100 ? '...' : ''}"`;
  const noteEntry = {
    note: noteText,
    addedBy: user?._id ? new mongoose.Types.ObjectId(user._id) : null,
    addedAt: new Date(),
  };

  if (modelType === "PRODUCT") {
    await ProductEnquiry.findByIdAndUpdate(id, {
      $push: { internalNotes: noteEntry },
      status: targetEnquiry.status === "NEW" ? "CONTACTED" : targetEnquiry.status,
    });
  } else {
    await FranchiseEnquiry.findByIdAndUpdate(id, {
      $push: { internalNotes: noteEntry },
      status: targetEnquiry.status === "NEW" ? "CONTACTED" : targetEnquiry.status,
    });
  }

  return {
    success: true,
    recipient: targetEnquiry.email,
    subject,
    message: "Email reply successfully dispatched to client",
  };
};

export {
  createProductEnquiry,
  createFranchiseEnquiry,
  createEnquiry,
  confirmEnquiry,
  getAllProductEnquiries,
  getAllFranchiseEnquiries,
  getAllEnquiries,
  getEnquiryById,
  updateEnquiryStatus,
  assignEnquiry,
  addEnquiryNote,
  deleteEnquiry,
  replyEnquiryEmail,
};

