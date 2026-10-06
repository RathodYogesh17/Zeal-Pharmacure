import mongoose from "mongoose";

const { Schema } = mongoose;

const permissionSchema = new Schema(
  {
    // ==========================================
    // PERMISSION INFORMATION
    // ==========================================

    key: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    }, // 🆕 NEW

    module: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    action: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    // ==========================================
    // DISPLAY
    // ==========================================

    sortOrder: {
      type: Number,
      default: 0,
      min: 0,
      index: true,
    }, // 🆕 NEW

    // ==========================================
    // SYSTEM CONTROL
    // ==========================================

    isSystemPermission: {
      type: Boolean,
      default: false,
      index: true,
    }, // 🆕 NEW

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);


// ==========================================
// INDEXES
// ==========================================

permissionSchema.index({
  module: 1,
  action: 1,
});

permissionSchema.index({
  module: 1,
  isActive: 1,
  sortOrder: 1,
});


// ==========================================
// MODEL
// ==========================================

const Permission = mongoose.model(
  "Permission",
  permissionSchema
);

export default Permission;