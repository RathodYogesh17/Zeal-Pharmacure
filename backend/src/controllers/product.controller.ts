import type { Request, Response } from "express";
import * as productService from "../services/product.service";
import { generateVisualAidPdf } from "../services/visualAid.service";
import HTTP_STATUS from "../constants/httpStatus";
import MESSAGES from "../constants/messages";
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
  const pdfBuffer = await generateVisualAidPdf(product as any);

  const sanitizedFilename = `${product.slug || "product"}-visual-aid.pdf`;

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `inline; filename="${sanitizedFilename}"`);
  res.setHeader("Content-Length", pdfBuffer.length);
  res.status(HTTP_STATUS.OK).end(pdfBuffer);
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
  duplicateProduct,
};

