import mongoose from "mongoose";
import "./user.model";
import "./category.model";
import "./media.model";

const { Schema } = mongoose;

const subCategorySchema = new Schema(
  {
    // ==========================================
    // BASIC INFORMATION
    // ==========================================
    name: { type: String, required: true, trim: true, index: true },
    code: { type: String, uppercase: true, trim: true, default: undefined }, 
    slug: { type: String, required: true, lowercase: true, trim: true, index: true },
    shortDescription: { type: String,  default: "", trim: true,},
    description: { type: String, default: "", trim: true,},

    // ==========================================
    // PARENT CATEGORY
    // ==========================================
    category: {  type: Schema.Types.ObjectId,  ref: "Category",  required: true, index: true,},

    // ==========================================
    // MEDIA
    // ==========================================
    image: { type: String, default: null,},
    imageId: { type: Schema.Types.ObjectId, ref: "Media", default: null,},
    bannerImage: {type: String, default: null,}, 
    bannerImageId: { type: Schema.Types.ObjectId, ref: "Media", default: null,},

    // ==========================================
    // DISPLAY
    // ==========================================
    sortOrder: { type: Number, default: 0, min: 0, index: true,},
    isFeatured: { type: Boolean, default: false, index: true,}, 
    showOnHome: {type: Boolean, default: false, index: true,},
    showInMenu: { type: Boolean,  default: true,  index: true, },

    // ==========================================
    // SEO
    // ==========================================

    seo: {
      metaTitle: { type: String,  default: "", trim: true,},
      metaDescription: { type: String, default: "", trim: true,},
      keywords: { type: [String], default: [],},
      canonicalUrl: {  type: String, default: "",  trim: true,  },
    }, 

    // ==========================================
    // STATUS
    // ==========================================
    isActive: { type: Boolean,default: true, index: true, },
    isDeleted: { type: Boolean, default: false, index: true,},
    deletedAt: { type: Date, default: null,},

    // ==========================================
    // AUDIT
    // ==========================================
    createdBy: { type: Schema.Types.ObjectId, ref: "User", default: null,},
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", default: null,},
    deletedBy: { type: Schema.Types.ObjectId,  ref: "User", default: null, },
  },
  { timestamps: true,}
);


// ==========================================
// INDEXES
// ==========================================

// Same category mein active duplicate name prevent
subCategorySchema.index(
  { category: 1, name: 1,},
  {unique: true, partialFilterExpression: { isDeleted: false,}, }
);
subCategorySchema.index({ category: 1, isActive: 1, isDeleted: 1, sortOrder: 1,});
subCategorySchema.index({ slug: 1, isDeleted: 1,});
subCategorySchema.index({ isFeatured: 1,isActive: 1,isDeleted: 1,});
subCategorySchema.index({  showOnHome: 1,  isActive: 1, isDeleted: 1,});
subCategorySchema.index({ showInMenu: 1, isActive: 1, isDeleted: 1 });
subCategorySchema.index(
  { code: 1 },
  { unique: true, partialFilterExpression: { code: { $type: "string" } } }
);


// ==========================================
// MODEL
// ==========================================

const SubCategory = mongoose.model(  "SubCategory", subCategorySchema);

export default SubCategory;
