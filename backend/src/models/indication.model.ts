import mongoose from "mongoose";

const { Schema } = mongoose;

const indicationSchema = new Schema(
  {
    // Basic Information
    name: { type: String, required: true, trim: true, index: true,},
    code: { type: String,  unique: true, sparse: true,uppercase: true, trim: true,index: true, }, 
    slug: { type: String,  required: true, lowercase: true, trim: true, index: true,},
    shortDescription: { type: String, default: "", trim: true,},
    description: { type: String, default: "", trim: true,},

    // Category Relationship
    category: { type: Schema.Types.ObjectId, ref: "Category",required: true, index: true,},
    subCategory: { type: Schema.Types.ObjectId,ref: "SubCategory", default: null,  index: true,},

    // Display
    sortOrder: { type: Number, default: 0,min: 0,index: true,},
    isFeatured: { type: Boolean,  default: false, index: true,}, 
    showOnHome: { type: Boolean, default: false, index: true,}, 

    // SEO
    seo: {
      metaTitle: { type: String, default: "", trim: true,},
      metaDescription: { type: String, default: "", trim: true, },
      keywords: { type: [String], default: [],},
      canonicalUrl: { type: String, default: "", trim: true,},
    }, // 🆕 NEW

    // Status
    isActive: { type: Boolean,  default: true,  index: true, },
    isDeleted: { type: Boolean,  default: false, index: true,},
    deletedAt: { type: Date, default: null, },

    // Audit
    createdBy: { type: Schema.Types.ObjectId, ref: "User", default: null,},
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", default: null,},
    deletedBy: { type: Schema.Types.ObjectId, ref: "User", default: null,},
  },
  {
    timestamps: true,
  }
);

// =========================
// Indexes
// =========================

indicationSchema.index({ name: 1, isDeleted: 1,});
indicationSchema.index({ category: 1, isDeleted: 1,});
indicationSchema.index({ category: 1, subCategory: 1, isDeleted: 1,});
indicationSchema.index({ slug: 1, isDeleted: 1,});
indicationSchema.index({ sortOrder: 1, name: 1,});
indicationSchema.index({ isFeatured: 1,isActive: 1,  isDeleted: 1,});
indicationSchema.index({ showOnHome: 1, isActive: 1, isDeleted: 1,});

// =========================
// Model
// =========================

const Indication = mongoose.model("Indication", indicationSchema);

export default Indication;
