import type { Request, Response } from "express";
import * as auditLogService from "../services/auditLog.service";
import HTTP_STATUS from "../constants/httpStatus";
import MESSAGES from "../constants/messages";
import { sendSuccess } from "../utils/apiResponse";
import type { IAuditLogQuery } from "../types/auditLog.types";

const getAuditLogs = async (req: Request, res: Response): Promise<void> => {
  const query: IAuditLogQuery = req.query as unknown as IAuditLogQuery;
  const result = await auditLogService.getAuditLogs(query);
  sendSuccess(res, HTTP_STATUS.OK, MESSAGES.SUCCESS, result);
};

const getAuditLogById = async (req: Request, res: Response): Promise<void> => {
  const result = await auditLogService.getAuditLogById(String(req.params.id));
  sendSuccess(res, HTTP_STATUS.OK, MESSAGES.SUCCESS, result);
};

const getAuditLogStats = async (_req: Request, res: Response): Promise<void> => {
  const result = await auditLogService.getAuditLogStats();
  sendSuccess(res, HTTP_STATUS.OK, MESSAGES.SUCCESS, result);
};

const getAuditModulesAndActions = async (_req: Request, res: Response): Promise<void> => {
  const result = await auditLogService.getAuditModulesAndActions();
  sendSuccess(res, HTTP_STATUS.OK, MESSAGES.SUCCESS, result);
};

export {
  getAuditLogs,
  getAuditLogById,
  getAuditLogStats,
  getAuditModulesAndActions,
};
