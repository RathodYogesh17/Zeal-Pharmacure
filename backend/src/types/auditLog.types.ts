import mongoose, { Document } from "mongoose";

export type AuditLogStatus = "SUCCESS" | "FAILED";

export interface IAuditLog {
  userId: mongoose.Types.ObjectId | string;
  action: string;
  module: string;
  targetType?: string | null;
  targetId?: string | null;
  status: AuditLogStatus;
  reason?: string;
  requestId?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  metadata?: Record<string, unknown>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IAuditLogDocument extends IAuditLog, Document {}

export interface IAuditLogQuery {
  page?: string | number;
  limit?: string | number;
  search?: string;
  module?: string;
  action?: string;
  status?: string;
  userId?: string;
  targetType?: string;
  targetId?: string;
  requestId?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc" | "1" | "-1";
}

export interface IAuditLogStats {
  totalLogs: number;
  todayLogs: number;
  successLogs: number;
  failedLogs: number;
  moduleCounts: Array<{ _id: string; count: number }>;
  actionCounts: Array<{ _id: string; count: number }>;
  recentFailures: IAuditLog[];
}
