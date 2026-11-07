import type { Request, Response } from "express";
import * as productService from "../services/product.service";
import Product from "../models/product.model";
import { generateVisualAidPdf } from "../services/visualAid.service";
import { generateProductCatalogPdf } from "../services/catalogPdf.service";
import HTTP_STATUS from "../constants/httpStatus";
import MESSAGES from "../constants/messages";
import AppError from "../utils/appError";
import { sendSuccess } from "../utils/apiResponse";
import type { IProductRequest, ICreateProductRequest, IUpdateProductRequest, IToggleProductStatusRequest, IProductQuery,} from "../types/product.types";
import type { IAuthenticatedUser } from "../types/user.types";

import { recordAuditLog } from "../utils/auditLogger";

const createProduct = async (req: IProductRequest, res: Response): Promise<void> => {
  const body: ICreateProductRequest = req.body;
  const user = req.user ? (req.user as unknown as IAuthenticatedUser) : undefined;
  const result = await productService.createProduct(body, user);
  void recordAuditLog({
    userId: req.user?._id,
    action: "PRODUCT_CREATE",
    module: "PRODUCT",
    targetType: "Product",
    targetId: (result as unknown as { _id?: string })?._id ? String((result as unknown as { _id?: string })._id) : null,
    req,
    metadata: { name: body.name, slug: (result as unknown as { slug?: string })?.slug },
  });
  sendSuccess(res, HTTP_STATUS.CREATED, MESSAGES.PRODUCT_CREATED, result);
};

const getPublicProducts = async (req: IProductRequest, res: Response): Promise<void> => {
  const query: IProductQuery = req.validatedQuery ?? (req.query as IProductQuery);
  const result = await productService.getAllProducts(query, true);
  res.setHeader("Cache-Control", "public, s-maxage=120, stale-while-revalidate=300");
  sendSuccess(res, HTTP_STATUS.OK, MESSAGES.PRODUCTS_FETCHED, result);
};

const getAdminProducts = async (req: IProductRequest, res: Response): Promise<void> => {
  const query: IProductQuery = req.validatedQuery ?? (req.query as IProductQuery);
  const result = await productService.getAllProducts(query, false);
  sendSuccess(res, HTTP_STATUS.OK, MESSAGES.PRODUCTS_FETCHED, result);
};

const getProduct = async (req: Request, res: Response): Promise<void> => {
  const result = await productService.getProductBySlugOrId(String(req.params.slugOrId));
  res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");
  sendSuccess(res, HTTP_STATUS.OK, MESSAGES.PRODUCT_FETCHED, result);
};

const getRelatedProducts = async (req: Request, res: Response): Promise<void> => {
  const limitCount = req.query.limit ? Number(req.query.limit) : 4;
  const result = await productService.getRelatedProducts(String(req.params.slugOrId), limitCount);
  res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");
  sendSuccess(res, HTTP_STATUS.OK, MESSAGES.RELATED_PRODUCTS_FETCHED, result);
};

const updateProduct = async (req: IProductRequest, res: Response): Promise<void> => {
  const body: IUpdateProductRequest = req.body;
  const user = req.user ? (req.user as unknown as IAuthenticatedUser) : undefined;
  const result = await productService.updateProduct(String(req.params.id), body, user);
  void recordAuditLog({
    userId: req.user?._id,
    action: "PRODUCT_UPDATE",
    module: "PRODUCT",
    targetType: "Product",
    targetId: String(req.params.id),
    req,
    metadata: { updatedFields: Object.keys(body) },
  });
  sendSuccess(res, HTTP_STATUS.OK, MESSAGES.PRODUCT_UPDATED, result);
};

const toggleProductStatus = async (req: IProductRequest, res: Response): Promise<void> => {
  const body: IToggleProductStatusRequest = req.body;
  const user = req.user ? (req.user as unknown as IAuthenticatedUser) : undefined;
  const result = await productService.toggleProductStatus(String(req.params.id), body, user);
  void recordAuditLog({
    userId: req.user?._id,
    action: "PRODUCT_STATUS_CHANGE",
    module: "PRODUCT",
    targetType: "Product",
    targetId: String(req.params.id),
    req,
    metadata: { isActive: body.isActive, isFeatured: body.isFeatured, isNewLaunch: body.isNewLaunch },
  });
  sendSuccess(res, HTTP_STATUS.OK, MESSAGES.PRODUCT_UPDATED, result);
};

const deleteProduct = async (req: IProductRequest, res: Response): Promise<void> => {
  const user = req.user ? (req.user as unknown as IAuthenticatedUser) : undefined;
  const result = await productService.deleteProduct(String(req.params.id), user);
  void recordAuditLog({
    userId: req.user?._id,
    action: "PRODUCT_DELETE",
    module: "PRODUCT",
    targetType: "Product",
    targetId: String(req.params.id),
    req,
  });
  sendSuccess(res, HTTP_STATUS.OK, MESSAGES.PRODUCT_DELETED, result);
};

const getProductFilters = async (req: Request, res: Response): Promise<void> => {
  const division = req.query.division
    ? String(req.query.division)
    : req.query.subCategory
    ? String(req.query.subCategory)
    : undefined;
  const result = await productService.getProductFilters(division);
  sendSuccess(res, HTTP_STATUS.OK, MESSAGES.FILTERS_FETCHED, result);
};

const downloadVisualAidPdf = async (req: Request, res: Response): Promise<void> => {
  const slugOrId = String(req.params.slugOrId);
  const product = await productService.getProductBySlugOrId(slugOrId, false);
  if (!product) {
    throw new AppError("Product not found", HTTP_STATUS.NOT_FOUND);
  }

  try {
    const pdfBuffer = await generateVisualAidPdf(product as any, {
      companyName: "ZEAL PHARMACURE PVT. LTD.",
      phone: "+91 9909160190",
      email: "info@zealpharma.com",
      website: "www.zealpharmacure.com",
      headOfficeAddress: "7015, BTM Market, Sita Nagar, Parvat Patiya, Surat, Gujarat – 395010",
    });
    const sanitizedFilename = `${product.slug || "product"}-visual-aid.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename="${sanitizedFilename}"`);
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.setHeader("Content-Length", pdfBuffer.length);
    res.status(HTTP_STATUS.OK).end(pdfBuffer);
  } catch (err: any) {
    console.error(`[VISUAL-AID ERROR] Failed generating PDF for ${slugOrId}:`, err);
    throw new AppError(
      err?.message ? `Failed to generate Visual Aid PDF: ${err.message}` : "Failed to generate Visual Aid PDF. Please try again later.",
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }
};

const downloadCatalogPdf = async (req: IProductRequest, res: Response): Promise<void> => {
  try {
    const products = await Product.find({ isActive: true, isDeleted: false })
      .select("name slug composition dosageForm packaging mrp category prescriptionType")
      .populate("category", "name")
      .sort({ name: 1 })
      .lean();

    const pdfBuffer = await generateProductCatalogPdf(products as any, {
      companyName: "ZEAL PHARMACURE PVT. LTD.",
      phone: "+91 9909160190",
      email: "info@zealpharma.com",
      website: "www.zealpharmacure.com",
      headOfficeAddress: "7015, BTM Market, Sita Nagar, Parvat Patiya, Surat, Gujarat – 395010",
      userEmail: req.user?.email,
      userName: req.user ? (req.user as any).name : undefined,
    });

    const dateStr = new Date().toISOString().slice(0, 10);
    const filename = `Zeal_Pharmacure_Product_Catalog_${dateStr}.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.setHeader("Content-Length", pdfBuffer.length);
    res.status(HTTP_STATUS.OK).end(pdfBuffer);
  } catch (err: any) {
    console.error("[CATALOG-PDF ERROR] Failed generating catalog PDF:", err);
    throw new AppError(
      err?.message ? `Failed to generate Product Catalog PDF: ${err.message}` : "Failed to generate Product Catalog PDF.",
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }
};

const duplicateProduct = async (req: IProductRequest, res: Response): Promise<void> => {
  const user = req.user ? (req.user as unknown as IAuthenticatedUser) : undefined;
  const result = await productService.duplicateProduct(String(req.params.id), user);
  void recordAuditLog({
    userId: req.user?._id,
    action: "PRODUCT_CREATE",
    module: "PRODUCT",
    targetType: "Product",
    targetId: (result as unknown as { _id?: string })?._id ? String((result as unknown as { _id?: string })._id) : null,
    req,
    metadata: {
      originalProductId: req.params.id,
      duplicateName: (result as unknown as { name?: string })?.name,
      slug: (result as unknown as { slug?: string })?.slug,
    },
  });
  sendSuccess(res, HTTP_STATUS.CREATED, "Product duplicated successfully", result);
};

export {
  createProduct,
  getPublicProducts,
  getAdminProducts,
  getProduct,
  getRelatedProducts,
  updateProduct,
  toggleProductStatus,
  deleteProduct,
  getProductFilters,
  downloadVisualAidPdf,
  downloadCatalogPdf,
  duplicateProduct,
};

