import mongoose from "mongoose";
import AuditLog from "../models/auditLog.model";
import type { IAuditLogQuery, IAuditLogStats } from "../types/auditLog.types";
import { buildPagination } from "../utils/pagination";
import AppError from "../utils/appError";
import HTTP_STATUS from "../constants/httpStatus";

const getAuditLogs = async (query: IAuditLogQuery = {}) => {
  const { page, limit, skip } = buildPagination(Number(query.page ?? 1), Number(query.limit ?? 20));
  const filter: Record<string, unknown> = {};

  if (query.module && query.module.trim()) {
    filter.module = query.module.trim().toUpperCase();
  }

  if (query.action && query.action.trim()) {
    filter.action = query.action.trim().toUpperCase();
  }

  if (query.status && query.status.trim()) {
    filter.status = query.status.trim().toUpperCase();
  }

  if (query.userId && mongoose.Types.ObjectId.isValid(query.userId)) {
    filter.userId = new mongoose.Types.ObjectId(query.userId);
  }

  if (query.targetType && query.targetType.trim()) {
    filter.targetType = query.targetType.trim();
  }

  if (query.targetId && query.targetId.trim()) {
    filter.targetId = query.targetId.trim();
  }

  if (query.requestId && query.requestId.trim()) {
    filter.requestId = query.requestId.trim();
  }

  if (query.startDate || query.endDate) {
    const dateFilter: Record<string, Date> = {};
    if (query.startDate) {
      dateFilter.$gte = new Date(query.startDate);
    }
    if (query.endDate) {
      dateFilter.$lte = new Date(query.endDate);
    }
    filter.createdAt = dateFilter;
  }

  if (query.search && query.search.trim()) {
    const regex = { $regex: query.search.trim(), $options: "i" };
    filter.$or = [
      { action: regex },
      { module: regex },
      { targetType: regex },
      { targetId: regex },
      { reason: regex },
      { ipAddress: regex },
      { userAgent: regex },
      { requestId: regex },
    ];
  }

  const sortField = query.sortBy || "createdAt";
  const sortDirection = query.sortOrder === "asc" || query.sortOrder === "1" ? 1 : -1;
  const sortOption: Record<string, 1 | -1> = { [sortField]: sortDirection };

  const [logs, total] = await Promise.all([
    AuditLog.find(filter)
      .populate("userId", "name email role phone")
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .lean(),
    AuditLog.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit);
  return { logs, total, page, limit, totalPages };
};

const getAuditLogById = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid audit log ID", HTTP_STATUS.BAD_REQUEST);
  }

  const log = await AuditLog.findById(id)
    .populate("userId", "name email role phone profileImage")
    .lean();

  if (!log) {
    throw new AppError("Audit log not found", HTTP_STATUS.NOT_FOUND);
  }

  return log;
};

const getAuditLogStats = async (): Promise<IAuditLogStats> => {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const [totalLogs, todayLogs, successLogs, failedLogs, moduleCounts, actionCounts, recentFailures] =
    await Promise.all([
      AuditLog.countDocuments(),
      AuditLog.countDocuments({ createdAt: { $gte: startOfDay } }),
      AuditLog.countDocuments({ status: "SUCCESS" }),
      AuditLog.countDocuments({ status: "FAILED" }),
      AuditLog.aggregate([
        { $group: { _id: "$module", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 8 },
      ]),
      AuditLog.aggregate([
        { $group: { _id: "$action", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 8 },
      ]),
      AuditLog.find({ status: "FAILED" })
        .populate("userId", "name email role")
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
    ]);

  return {
    totalLogs,
    todayLogs,
    successLogs,
    failedLogs,
    moduleCounts,
    actionCounts,
    recentFailures: recentFailures as unknown as IAuditLogStats["recentFailures"],
  };
};

const getAuditModulesAndActions = async () => {
  const [modules, actions] = await Promise.all([
    AuditLog.distinct("module"),
    AuditLog.distinct("action"),
  ]);

  return {
    modules: modules.sort(),
    actions: actions.sort(),
  };
};

export {
  getAuditLogs,
  getAuditLogById,
  getAuditLogStats,
  getAuditModulesAndActions,
};
