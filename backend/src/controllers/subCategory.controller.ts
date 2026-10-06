import type { Request, Response } from "express";
import * as subCategoryService from "../services/subCategory.service";
import HTTP_STATUS from "../constants/httpStatus";
import { sendSuccess } from "../utils/apiResponse";
import type {
  ISubCategoryRequest,
  ICreateSubCategoryRequest,
  IUpdateSubCategoryRequest,
  ISubCategoryQuery,
} from "../types/subCategory.types";
import type { IAuthenticatedUser } from "../types/user.types";

import { recordAuditLog } from "../utils/auditLogger";

const createSubCategory = async (req: ISubCategoryRequest, res: Response): Promise<void> => {
  const body: ICreateSubCategoryRequest = req.body;
  const user = req.user ? (req.user as unknown as IAuthenticatedUser) : undefined;
  const result = await subCategoryService.createSubCategory(body, user);
  void recordAuditLog({
    userId: req.user?._id,
    action: "SUBCATEGORY_CREATE",
    module: "SUBCATEGORY",
    targetType: "SubCategory",
    targetId: (result as unknown as { _id?: string })?._id ? String((result as unknown as { _id?: string })._id) : null,
    req,
    metadata: { name: body.name, category: body.category },
  });
  sendSuccess(res, HTTP_STATUS.CREATED, "SubCategory created successfully", result);
};

const getPublicSubCategories = async (req: Request, res: Response): Promise<void> => {
  const query: ISubCategoryQuery = req.query as ISubCategoryQuery;
  const result = await subCategoryService.getAllSubCategories(query, true);
  sendSuccess(res, HTTP_STATUS.OK, "SubCategories fetched successfully", result);
};

const getAdminSubCategories = async (req: ISubCategoryRequest, res: Response): Promise<void> => {
  const query: ISubCategoryQuery = req.validatedQuery ?? (req.query as ISubCategoryQuery);
  const result = await subCategoryService.getAllSubCategories(query, false);
  sendSuccess(res, HTTP_STATUS.OK, "SubCategories fetched successfully", result);
};

const getSubCategory = async (req: Request, res: Response): Promise<void> => {
  const result = await subCategoryService.getSubCategoryBySlugOrId(String(req.params.slugOrId));
  sendSuccess(res, HTTP_STATUS.OK, "SubCategory fetched successfully", result);
};

const updateSubCategory = async (req: ISubCategoryRequest, res: Response): Promise<void> => {
  const body: IUpdateSubCategoryRequest = req.body;
  const user = req.user ? (req.user as unknown as IAuthenticatedUser) : undefined;
  const result = await subCategoryService.updateSubCategory(String(req.params.id), body, user);
  void recordAuditLog({
    userId: req.user?._id,
    action: "SUBCATEGORY_UPDATE",
    module: "SUBCATEGORY",
    targetType: "SubCategory",
    targetId: String(req.params.id),
    req,
    metadata: { updatedFields: Object.keys(body) },
  });
  sendSuccess(res, HTTP_STATUS.OK, "SubCategory updated successfully", result);
};

const deleteSubCategory = async (req: ISubCategoryRequest, res: Response): Promise<void> => {
  const user = req.user ? (req.user as unknown as IAuthenticatedUser) : undefined;
  const result = await subCategoryService.deleteSubCategory(String(req.params.id), user);
  void recordAuditLog({
    userId: req.user?._id,
    action: "SUBCATEGORY_DELETE",
    module: "SUBCATEGORY",
    targetType: "SubCategory",
    targetId: String(req.params.id),
    req,
  });
  sendSuccess(res, HTTP_STATUS.OK, "SubCategory deleted successfully", result);
};

export {
  createSubCategory,
  getPublicSubCategories,
  getAdminSubCategories,
  getSubCategory,
  updateSubCategory,
  deleteSubCategory,
};
