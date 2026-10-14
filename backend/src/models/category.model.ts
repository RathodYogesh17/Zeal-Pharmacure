import mongoose from "mongoose";
import "./user.model";
import "./media.model";

const { Schema } = mongoose;

const categorySchema = new Schema(
  {
    // ==========================================
    // BASIC INFORMATION
    // ==========================================

    name: { type: String, required: true, trim: true },
    code: { type: String, uppercase: true, trim: true, default: undefined },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    shortDescription: { type: String, default: "", trim: true,},
    description: { type: String, default: "", trim: true,},

    // ==========================================
    // MEDIA
    // ==========================================

    image: { type: String,  default: null, },
    imageId: {type: Schema.Types.ObjectId, ref: "Media", default: null,},
    bannerImage: { type: String, default: null,},
    bannerImageId: { type: Schema.Types.ObjectId,  ref: "Media", default: null,},
    icon: {type: String, default: null,  trim: true,},

    // ==========================================
    // DISPLAY / SORTING
    // ==========================================

    sortOrder: { type: Number, default: 0,  min: 0, index: true, },
    isFeatured: { type: Boolean, default: false, index: true,},
    showOnHome: { type: Boolean, default: false, index: true,},
    showInMenu: { type: Boolean, default: false, index: true,},

    // ==========================================
    // SEO
    // ==========================================

    seo: { 
      metaTitle: { type: String,  default: "",  trim: true, },
      metaDescription: { type: String, default: "",  trim: true,},
      keywords: { type: [String], default: [], },
      canonicalUrl: {  type: String, default: "", trim: true, },
    },

    // ==========================================
    // STATUS
    // ==========================================

    isActive: {type: Boolean, default: true, index: true,},
    isDeleted: { type: Boolean, default: false, index: true,},
    deletedAt: {type: Date, default: null, },

    // ==========================================
    // AUDIT
    // ==========================================

    createdBy: { type: Schema.Types.ObjectId, ref: "User", default: null,},
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", default: null,},
    deletedBy: {  type: Schema.Types.ObjectId,  ref: "User",  default: null, },
  },
  {
    timestamps: true,
  }
);

// ==========================================
// INDEXES
// ==========================================

categorySchema.index({ name: 1, isDeleted: 1,});
categorySchema.index({ sortOrder: 1, name: 1,});
categorySchema.index({ isActive: 1, isDeleted: 1});
categorySchema.index({ isFeatured: 1, isActive: 1,isDeleted: 1,});
categorySchema.index({ showOnHome: 1, isActive: 1, isDeleted: 1});
categorySchema.index({ showInMenu: 1, isActive: 1, isDeleted: 1 });
categorySchema.index(
  { code: 1 },
  { unique: true, partialFilterExpression: { code: { $type: "string" } } }
);

const Category = mongoose.model("Category", categorySchema);

export default Category;
