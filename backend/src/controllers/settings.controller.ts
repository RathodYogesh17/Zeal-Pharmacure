import type { Response } from "express";
import * as settingsService from "../services/settings.service";
import HTTP_STATUS from "../constants/httpStatus";
import MESSAGES from "../constants/messages";
import { sendSuccess } from "../utils/apiResponse";
import { recordAuditLog } from "../utils/auditLogger";
import type {
  ISettingsRequest,
  ICreateRoleRequest,
  IUpdateRoleRequest,
  IAssignRolePermissionsRequest,
  IAssignUserPermissionsRequest,
} from "../types/settings.types";

const getAllPermissions = async (_req: ISettingsRequest, res: Response): Promise<void> => {
  const result = await settingsService.getAllPermissions();
  sendSuccess(res, HTTP_STATUS.OK, MESSAGES.SUCCESS, result);
};

const getAllRoles = async (_req: ISettingsRequest, res: Response): Promise<void> => {
  const result = await settingsService.getAllRoles();
  sendSuccess(res, HTTP_STATUS.OK, MESSAGES.SUCCESS, result);
};

const getRoleById = async (req: ISettingsRequest, res: Response): Promise<void> => {
  const result = await settingsService.getRoleById(String(req.params.id));
  sendSuccess(res, HTTP_STATUS.OK, MESSAGES.SUCCESS, result);
};

const createRole = async (req: ISettingsRequest, res: Response): Promise<void> => {
  const body: ICreateRoleRequest = req.body;
  const result = await settingsService.createRole(body, req.user);
  void recordAuditLog({
    userId: req.user?._id,
    action: "ROLE_CREATE",
    module: "SETTINGS",
    targetType: "Role",
    targetId: (result as unknown as { _id?: string })?._id ? String((result as unknown as { _id?: string })._id) : null,
    req,
    metadata: { name: body.name, description: body.description },
  });
  sendSuccess(res, HTTP_STATUS.CREATED, "Role created successfully", result);
};

const updateRole = async (req: ISettingsRequest, res: Response): Promise<void> => {
  const body: IUpdateRoleRequest = req.body;
  const result = await settingsService.updateRole(String(req.params.id), body, req.user);
  void recordAuditLog({
    userId: req.user?._id,
    action: "ROLE_UPDATE",
    module: "SETTINGS",
    targetType: "Role",
    targetId: String(req.params.id),
    req,
    metadata: { updatedFields: Object.keys(body) },
  });
  sendSuccess(res, HTTP_STATUS.OK, "Role updated successfully", result);
};

const deleteRole = async (req: ISettingsRequest, res: Response): Promise<void> => {
  const result = await settingsService.deleteRole(String(req.params.id));
  void recordAuditLog({
    userId: req.user?._id,
    action: "ROLE_DELETE",
    module: "SETTINGS",
    targetType: "Role",
    targetId: String(req.params.id),
    req,
  });
  sendSuccess(res, HTTP_STATUS.OK, "Role deleted successfully", result);
};

const assignRolePermissions = async (req: ISettingsRequest, res: Response): Promise<void> => {
  const body: IAssignRolePermissionsRequest = req.body;
  const result = await settingsService.assignRolePermissions(
    String(req.params.id),
    body.permissionIds,
    req.user
  );
  void recordAuditLog({
    userId: req.user?._id,
    action: "ROLE_PERMISSIONS_ASSIGN",
    module: "SETTINGS",
    targetType: "Role",
    targetId: String(req.params.id),
    req,
    metadata: { permissionCount: body.permissionIds?.length },
  });
  sendSuccess(res, HTTP_STATUS.OK, "Role permissions assigned successfully", result);
};

const getUserPermissions = async (req: ISettingsRequest, res: Response): Promise<void> => {
  const result = await settingsService.getUserPermissions(String(req.params.id));
  sendSuccess(res, HTTP_STATUS.OK, MESSAGES.SUCCESS, result);
};

const assignUserPermissions = async (req: ISettingsRequest, res: Response): Promise<void> => {
  const body: IAssignUserPermissionsRequest = req.body;
  const result = await settingsService.assignUserPermissions(
    String(req.params.id),
    body.overrides,
    req.user?._id
  );
  void recordAuditLog({
    userId: req.user?._id,
    action: "USER_PERMISSIONS_ASSIGN",
    module: "SETTINGS",
    targetType: "User",
    targetId: String(req.params.id),
    req,
    metadata: { overridesCount: body.overrides?.length },
  });
  sendSuccess(res, HTTP_STATUS.OK, "User permissions updated successfully", result);
};

const getAuditLogs = async (req: ISettingsRequest, res: Response): Promise<void> => {
  const result = await settingsService.getAuditLogs(req.query);
  sendSuccess(res, HTTP_STATUS.OK, MESSAGES.SUCCESS, result);
};

export {
  getAllPermissions,
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
  assignRolePermissions,
  getUserPermissions,
  assignUserPermissions,
  getAuditLogs,
};
