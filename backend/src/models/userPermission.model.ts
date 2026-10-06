import mongoose from "mongoose";

const { Schema } = mongoose;

const userPermissionSchema = new Schema(
  {
    // =========================
    // USER
    // =========================
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true,},

    // =========================
    // PERMISSION
    // =========================
    permissionId: { type: Schema.Types.ObjectId, ref: "Permission",  required: true, index: true,},

    // =========================
    // PERMISSION TYPE
    // =========================
    effect: { type: String,  enum: ["ALLOW", "DENY"], default: "ALLOW", index: true,},

    // =========================
    // STATUS
    // =========================
    isActive: { type: Boolean, default: true,  index: true,},

    // =========================
    // AUDIT
    // =========================
    assignedBy: { type: Schema.Types.ObjectId,  ref: "User", default: null,},
    updatedBy: { type: Schema.Types.ObjectId, ref: "User",default: null,},
  },
  {
    timestamps: true,
  }
);

// =========================
// UNIQUE MAPPING
// =========================
userPermissionSchema.index(
  { userId: 1, permissionId: 1,}, { unique: true,}
);

// =========================
// QUERY INDEXES
// =========================
userPermissionSchema.index({ userId: 1,  isActive: 1});
userPermissionSchema.index({ permissionId: 1,  isActive: 1});
userPermissionSchema.index({ userId: 1, effect: 1, isActive: 1});

const UserPermission = mongoose.model( "UserPermission", userPermissionSchema);

export default UserPermission;