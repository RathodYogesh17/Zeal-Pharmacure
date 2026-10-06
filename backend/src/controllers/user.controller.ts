import type { Response } from "express";
import type { ICreateUserRequest, IUpdateUserRequest, IUserQuery, IUserRequest } from "../types/user.types";
import * as userService from "../services/user.service";
import HTTP_STATUS from "../constants/httpStatus";
import MESSAGES from "../constants/messages";
import { sendSuccess } from "../utils/apiResponse";
import { recordAuditLog } from "../utils/auditLogger";

const createStaffUser = async (req: IUserRequest, res: Response): Promise<void> => {
  const body: ICreateUserRequest = req.body;
  const result = await userService.createStaffUser(body, req.user);
  void recordAuditLog({
    userId: req.user?._id,
    action: "USER_CREATE",
    module: "USERS",
    targetType: "User",
    targetId: (result as unknown as { _id?: string })?._id ? String((result as unknown as { _id?: string })._id) : null,
    req,
    metadata: { email: body.email, role: body.role, name: body.name },
  });
  sendSuccess(res, HTTP_STATUS.CREATED, MESSAGES.STAFF_CREATED, result);
};

const getUser = async (req: IUserRequest, res: Response): Promise<void> => {
  const result = await userService.getUser(String(req.params.id));
  sendSuccess(res, HTTP_STATUS.OK, MESSAGES.USER_FETCHED, result);
};

const getAllUsers = async (req: IUserRequest & { validatedQuery?: IUserQuery }, res: Response): Promise<void> => {
  const query: IUserQuery = req.validatedQuery ?? req.query as IUserQuery;
  const result = await userService.getAllUsers(query);
  sendSuccess(res, HTTP_STATUS.OK, MESSAGES.USERS_FETCHED, result);
};

const updateUser = async (req: IUserRequest, res: Response): Promise<void> => {
  const body: IUpdateUserRequest = req.body;
  const result = await userService.updateUser(String(req.params.id), body, req.user);
  void recordAuditLog({
    userId: req.user?._id,
    action: "USER_UPDATE",
    module: "USERS",
    targetType: "User",
    targetId: String(req.params.id),
    req,
    metadata: { updatedFields: Object.keys(body) },
  });
  sendSuccess(res, HTTP_STATUS.OK, MESSAGES.USER_UPDATED, result);
};

const deleteUser = async (req: IUserRequest, res: Response): Promise<void> => {
  const result = await userService.deleteUser(String(req.params.id), req.user);
  void recordAuditLog({
    userId: req.user?._id,
    action: "USER_DELETE",
    module: "USERS",
    targetType: "User",
    targetId: String(req.params.id),
    req,
  });
  sendSuccess(res, HTTP_STATUS.OK, MESSAGES.USER_DELETED, result);
};

const activateUser = async (req: IUserRequest, res: Response): Promise<void> => {
  const result = await userService.activateUser(String(req.params.id), req.user);
  void recordAuditLog({
    userId: req.user?._id,
    action: "USER_ACTIVATE",
    module: "USERS",
    targetType: "User",
    targetId: String(req.params.id),
    req,
  });
  sendSuccess(res, HTTP_STATUS.OK, MESSAGES.USER_ACTIVATED, result);
};

const deactivateUser = async (req: IUserRequest, res: Response): Promise<void> => {
  const result = await userService.deactivateUser(String(req.params.id), req.user);
  void recordAuditLog({
    userId: req.user?._id,
    action: "USER_DEACTIVATE",
    module: "USERS",
    targetType: "User",
    targetId: String(req.params.id),
    req,
  });
  sendSuccess(res, HTTP_STATUS.OK, MESSAGES.USER_DEACTIVATED, result);
};

export { createStaffUser, getUser, getAllUsers, updateUser, deleteUser, activateUser, deactivateUser };

