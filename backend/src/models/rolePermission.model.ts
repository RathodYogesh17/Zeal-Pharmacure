import mongoose from "mongoose";

const { Schema } = mongoose;

const rolePermissionSchema = new Schema(
  {
    // ==========================================
    // ROLE
    // ==========================================
    roleId: { type: Schema.Types.ObjectId, ref: "Role",  required: true, index: true,},

    // ==========================================
    // PERMISSION
    // ==========================================
    permissionId: {  type: Schema.Types.ObjectId, ref: "Permission", required: true, index: true, },

    // ==========================================
    // STATUS
    // ==========================================
    isActive: {type: Boolean, default: true, index: true,}, 

    // ==========================================
    // AUDIT
    // ==========================================
    assignedBy: { type: Schema.Types.ObjectId, ref: "User", default: null,}, 
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", default: null,},
  },
  {
    timestamps: true,
  }
);


// ==========================================
// UNIQUE MAPPING
// ==========================================
rolePermissionSchema.index(
  { roleId: 1, permissionId: 1,},
  { unique: true,}
);


// ==========================================
// QUERY INDEX
// ==========================================
rolePermissionSchema.index({ roleId: 1, isActive: 1,});
rolePermissionSchema.index({ permissionId: 1, isActive: 1,});

// ==========================================
// MODEL
// ==========================================
const RolePermission = mongoose.model( "RolePermission", rolePermissionSchema);

export default RolePermission;