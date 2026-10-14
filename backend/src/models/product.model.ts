import mongoose from "mongoose";

const { Schema } = mongoose;

const mediaItemSchema = new Schema(
  {
    url: { type: String, required: true,},
    imageId: { type: Schema.Types.ObjectId, ref: "Media", default: null,},
    title: { type: String, default: "", trim: true,},
    altText: { type: String, default: "", trim: true, },
  },
  { _id: false }
);

const productSchema = new Schema(
  {
    // =====================================================
    // BASIC PRODUCT INFORMATION
    // =====================================================

    name: { type: String, required: true, trim: true, index: true,},
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true,index: true, },
    productCode: { type: String, unique: true,  sparse: true, uppercase: true, trim: true, index: true,},
    brandName: { type: String, default: "", trim: true, index: true,},
    genericName: { type: String, default: "", trim: true, index: true },
    manufacturer: { type: String, default: "", trim: true,},
    composition: { type: String, required: true, trim: true,},
    strength: { type: String, default: "", trim: true,},

    // =====================================================
    // CLASSIFICATION
    // =====================================================

    // 🆕 NEW (Supports ObjectId ref DosageForm or string format)
    dosageForm: { type: Schema.Types.Mixed, ref: "DosageForm", required: true, index: true,},
    packaging: { type: String, required: true, trim: true,},

    packSize: {
    value: { type: Number, default: null,  min: 0,}, unit: { type: String,   default: "",  trim: true,},},
    category: { type: Schema.Types.ObjectId, ref: "Category",  required: true, index: true,},
    subCategory: { type: Schema.Types.ObjectId,  ref: "SubCategory", default: null, index: true,},
    subCategoryName: { type: String, default: "", trim: true, index: true,},
    indications: [ {type: Schema.Types.ObjectId, ref: "Indication",},],
    indicationTags: { type: [String], default: [],},
    therapeuticClass: { type: String, default: "", trim: true, index: true,},
    tags: { type: [String],default: [],},
    searchKeywords: { type: [String],default: [],},

    // =====================================================
    // MEDICAL INFORMATION
    // =====================================================

    shortDescription: { type: String, default: "", trim: true,}, 
    description: { type: String, default: "", trim: true,},
    sideEffects: { type: String, default: "", trim: true,},
    howToUse: { type: String, default: "", trim: true,},
    precautions: { type: String, default: "", trim: true,},
    contraindications: {  type: String, default: "", trim: true,},
    warnings: { type: String, default: "", trim: true, },
    storage: { type: String, default: "", trim: true,},
    pregnancyInfo: { type: String, default: "", trim: true,},
    lactationInfo: { type: String, default: "", trim: true,},

    // =====================================================
    // PRESCRIPTION / REGULATORY
    // =====================================================

    prescriptionType: {
    type: String,
    enum: [ "Rx",  "OTC",  "Schedule H", "Schedule H1", "General", "OTC / General"], default: "Rx", index: true,},
    regulatoryInfo: { type: String,  default: "", trim: true,},
    licenseNumber: {  type: String, default: "", trim: true,},
    countryOfOrigin: { type: String, default: "India", trim: true,},
    mrp: { type: Number, default: null, min: 0, },

    // =====================================================
    // AVAILABILITY STATUS & PRICING
    // =====================================================

    availabilityStatus: { type: String, enum: [  "AVAILABLE", "OUT_OF_STOCK",  "COMING_SOON", "DISCONTINUED",  ], default: "AVAILABLE", index: true,},

    // =====================================================
    // MEDIA
    // =====================================================

    featuredImage: {
      type: String,
      default: null,
    },

    featuredImageId: { type: Schema.Types.ObjectId, ref: "Media", default: null,},
    mediaGallery: { type: [mediaItemSchema], default: [],},
    brochureUrl: { type: String, default: null,  trim: true,},
    brochureName: { type: String, default: "", trim: true,},

    // =====================================================
    // REVIEWS
    // =====================================================

    averageRating: { type: Number, default: 0, min: 0, max: 5, },
    totalReviews: { type: Number, default: 0,  min: 0,},

    // =====================================================
    // WEBSITE DISPLAY
    // =====================================================

    isFeatured: { type: Boolean, default: false, index: true,},
    featuredOrder: { type: Number, default: 0,  min: 0, index: true,},
    isNewLaunch: { type: Boolean, default: false, index: true,},
    launchDate: { type: Date,  default: null,},
    allowEnquiry: { type: Boolean, default: true, index: true,},
    viewCount: { type: Number,  default: 0, min: 0,},
    enquiryCount: { type: Number, default: 0, min: 0, },

    // =====================================================
    // SEO
    // =====================================================

    // 🆕 NEW
    seo: {
      metaTitle: { type: String,  default: "", trim: true,},
      metaDescription: { type: String, default: "", trim: true,},
      keywords: { type: [String], default: [],},
      canonicalUrl: { type: String, default: "", trim: true,},
      ogTitle: {  type: String, default: "", trim: true,},
      ogDescription: { type: String, default: "", trim: true, },
      ogImage: { type: String,default: null,  trim: true,},
    },

    // =====================================================
    // PRODUCT STATUS
    // =====================================================

    status: {  type: String, enum: ["DRAFT", "PUBLISHED", "ARCHIVED"], default: "DRAFT", index: true,},
    publishedAt: { type: Date, default: null,},
    isActive: { type: Boolean, default: true, index: true,},

    // =====================================================
    // SOFT DELETE
    // =====================================================

    isDeleted: { type: Boolean, default: false, index: true,},
    deletedAt: { type: Date, default: null, },

    // =====================================================
    // AUDIT
    // =====================================================

    createdBy: { type: Schema.Types.ObjectId, ref: "User", default: null,},
    updatedBy: { type: Schema.Types.ObjectId,  ref: "User",  default: null,},
    deletedBy: { type: Schema.Types.ObjectId, ref: "User", default: null, },
  },
  {
    timestamps: true,
  }
);

// =====================================================
// INDEXES
// =====================================================

productSchema.index({ name: 1,  isDeleted: 1,});
productSchema.index({ category: 1, isDeleted: 1, isActive: 1,});
productSchema.index({ subCategory: 1, isDeleted: 1, isActive: 1});
productSchema.index({ dosageForm: 1, isDeleted: 1, isActive: 1,});
productSchema.index({ indications: 1, isDeleted: 1 , isActive: 1});
productSchema.index({ therapeuticClass: 1, isDeleted: 1, isActive: 1,});
productSchema.index({ availabilityStatus: 1, isDeleted: 1, isActive: 1,});
productSchema.index({ averageRating: -1,});
productSchema.index({ isFeatured: 1, featuredOrder: 1, isDeleted: 1, isActive: 1});
productSchema.index({ isNewLaunch: 1, launchDate: -1,isDeleted: 1,isActive: 1});
productSchema.index({ status: 1, isDeleted: 1, isActive: 1,});
productSchema.index({ createdAt: -1});

// =====================================================
// FULL TEXT SEARCH
// =====================================================

productSchema.index(
  { name: "text", brandName: "text",   genericName: "text", composition: "text", indicationTags: "text", subCategoryName: "text", searchKeywords: "text", tags: "text",},
  { weights: {  name: 10,  brandName: 9, genericName: 8, composition: 6, indicationTags: 5,  subCategoryName: 4, searchKeywords: 4, tags: 3, },
    name: "ProductTextIndex",}
);

const Product = mongoose.model("Product", productSchema);

export default Product;
