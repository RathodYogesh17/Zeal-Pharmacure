import type { Request, Response } from "express";
import * as categoryService from "../services/category.service";
import HTTP_STATUS from "../constants/httpStatus";
import MESSAGES from "../constants/messages";
import { sendSuccess } from "../utils/apiResponse";
import type {
  ICategoryRequest,
  ICreateCategoryRequest,
  IUpdateCategoryRequest,
  ICategoryQuery,
} from "../types/category.types";
import type { IAuthenticatedUser } from "../types/user.types";

import { recordAuditLog } from "../utils/auditLogger";

const createCategory = async (req: ICategoryRequest, res: Response): Promise<void> => {
  const body: ICreateCategoryRequest = req.body;
  const user = req.user ? (req.user as unknown as IAuthenticatedUser) : undefined;
  const result = await categoryService.createCategory(body, user);
  void recordAuditLog({
    userId: req.user?._id,
    action: "CATEGORY_CREATE",
    module: "CATEGORY",
    targetType: "Category",
    targetId: (result as unknown as { _id?: string })?._id ? String((result as unknown as { _id?: string })._id) : null,
    req,
    metadata: { name: body.name, slug: (result as unknown as { slug?: string })?.slug },
  });
  sendSuccess(res, HTTP_STATUS.CREATED, MESSAGES.CATEGORY_CREATED, result);
};

const getPublicCategories = async (_req: Request, res: Response): Promise<void> => {
  const result = await categoryService.getAllCategories({}, true);
  sendSuccess(res, HTTP_STATUS.OK, MESSAGES.CATEGORIES_FETCHED, result);
};

const getAdminCategories = async (req: ICategoryRequest, res: Response): Promise<void> => {
  const query: ICategoryQuery = req.validatedQuery ?? (req.query as ICategoryQuery);
  const result = await categoryService.getAllCategories(query, false);
  sendSuccess(res, HTTP_STATUS.OK, MESSAGES.CATEGORIES_FETCHED, result);
};

const getCategory = async (req: Request, res: Response): Promise<void> => {
  const result = await categoryService.getCategoryBySlugOrId(String(req.params.slugOrId));
  sendSuccess(res, HTTP_STATUS.OK, MESSAGES.CATEGORY_FETCHED, result);
};

const updateCategory = async (req: ICategoryRequest, res: Response): Promise<void> => {
  const body: IUpdateCategoryRequest = req.body;
  const user = req.user ? (req.user as unknown as IAuthenticatedUser) : undefined;
  const result = await categoryService.updateCategory(String(req.params.id), body, user);
  void recordAuditLog({
    userId: req.user?._id,
    action: "CATEGORY_UPDATE",
    module: "CATEGORY",
    targetType: "Category",
    targetId: String(req.params.id),
    req,
    metadata: { updatedFields: Object.keys(body) },
  });
  sendSuccess(res, HTTP_STATUS.OK, MESSAGES.CATEGORY_UPDATED, result);
};

const deleteCategory = async (req: ICategoryRequest, res: Response): Promise<void> => {
  const user = req.user ? (req.user as unknown as IAuthenticatedUser) : undefined;
  const result = await categoryService.deleteCategory(String(req.params.id), user);
  void recordAuditLog({
    userId: req.user?._id,
    action: "CATEGORY_DELETE",
    module: "CATEGORY",
    targetType: "Category",
    targetId: String(req.params.id),
    req,
  });
  sendSuccess(res, HTTP_STATUS.OK, MESSAGES.CATEGORY_DELETED, result);
};

export {
  createCategory,
  getPublicCategories,
  getAdminCategories,
  getCategory,
  updateCategory,
  deleteCategory,
};
