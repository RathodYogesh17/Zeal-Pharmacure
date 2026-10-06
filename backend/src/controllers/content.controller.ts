import type { Request, Response } from "express";
import * as contentService from "../services/content.service";
import HTTP_STATUS from "../constants/httpStatus";
import MESSAGES from "../constants/messages";
import { sendSuccess } from "../utils/apiResponse";
import type {
  ICreateContentRequest,
  IUpdateContentRequest,
  IContentQuery,
} from "../types/content.types";
import type { IAuthenticatedUser } from "../types/user.types";
import type { IAuthenticatedRequest, IValidatedQueryRequest } from "../types/express.types";
import { recordAuditLog } from "../utils/auditLogger";

const createPage = async (req: IAuthenticatedRequest, res: Response): Promise<void> => {
  const body: ICreateContentRequest = req.body;
  const user = req.user as unknown as IAuthenticatedUser | undefined;
  const result = await contentService.createContent(body, user);

  void recordAuditLog({
    userId: req.user?._id,
    action: "CONTENT_CREATE",
    module: "CMS",
    targetType: "Content",
    targetId: (result as unknown as { _id?: string })?._id ? String((result as unknown as { _id?: string })._id) : null,
    req,
    metadata: { key: body.key, title: body.title, contentType: body.contentType },
  });

  sendSuccess(res, HTTP_STATUS.CREATED, MESSAGES.CONTENT_CREATED, result);
};

const getPublicPage = async (req: Request, res: Response): Promise<void> => {
  const key = String(req.params.key);
  const result = await contentService.getContentByKey(key, true);
  sendSuccess(res, HTTP_STATUS.OK, MESSAGES.CONTENT_FETCHED, result);
};

const getAllPublicPages = async (_req: Request, res: Response): Promise<void> => {
  const result = await contentService.getAllPublicContent();
  sendSuccess(res, HTTP_STATUS.OK, MESSAGES.CONTENT_FETCHED, result);
};

const getAdminPages = async (
  req: IValidatedQueryRequest<IContentQuery>,
  res: Response
): Promise<void> => {
  const query = req.validatedQuery ?? (req.query as IContentQuery);
  const result = await contentService.getAllContentAdmin(query);
  sendSuccess(res, HTTP_STATUS.OK, MESSAGES.CONTENT_FETCHED, result);
};

const updatePage = async (req: IAuthenticatedRequest, res: Response): Promise<void> => {
  const key = String(req.params.key);
  const body: IUpdateContentRequest = req.body;
  const user = req.user as unknown as IAuthenticatedUser | undefined;
  const result = await contentService.updateContent(key, body, user);

  void recordAuditLog({
    userId: req.user?._id,
    action: "CONTENT_UPDATE",
    module: "CMS",
    targetType: "Content",
    targetId: (result as unknown as { _id?: string })?._id ? String((result as unknown as { _id?: string })._id) : key,
    req,
    metadata: { updatedFields: Object.keys(body) },
  });

  sendSuccess(res, HTTP_STATUS.OK, MESSAGES.CONTENT_UPDATED, result);
};

const deletePage = async (req: IAuthenticatedRequest, res: Response): Promise<void> => {
  const key = String(req.params.key);
  const user = req.user as unknown as IAuthenticatedUser | undefined;
  const result = await contentService.deleteContent(key, user);

  void recordAuditLog({
    userId: req.user?._id,
    action: "CONTENT_DELETE",
    module: "CMS",
    targetType: "Content",
    targetId: result._id ? String(result._id) : key,
    req,
  });

  sendSuccess(res, HTTP_STATUS.OK, MESSAGES.CONTENT_DELETED, result);
};

export {
  createPage,
  getPublicPage,
  getAllPublicPages,
  getAdminPages,
  updatePage,
  deletePage,
};
