import mongoose, { Schema } from "mongoose";
import type { IAuditLogDocument } from "../types/auditLog.types";

const auditLogSchema = new Schema<IAuditLogDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    action: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    module: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    targetType: {
      type: String,
      default: null,
      trim: true,
      index: true,
    },

    targetId: {
      type: String,
      default: null,
      trim: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["SUCCESS", "FAILED"],
      default: "SUCCESS",
      index: true,
    },

    reason: {
      type: String,
      default: "",
      trim: true,
    },

    requestId: {
      type: String,
      default: null,
      trim: true,
      index: true,
    },

    ipAddress: {
      type: String,
      default: null,
      trim: true,
    },

    userAgent: {
      type: String,
      default: null,
      trim: true,
    },

    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Common audit-log queries
auditLogSchema.index({
  userId: 1,
  createdAt: -1,
});

auditLogSchema.index({
  module: 1,
  action: 1,
  createdAt: -1,
});

auditLogSchema.index({
  targetType: 1,
  targetId: 1,
  createdAt: -1,
});

auditLogSchema.index({
  createdAt: -1,
});

const AuditLog = mongoose.model<IAuditLogDocument>("AuditLog", auditLogSchema);

export default AuditLog;