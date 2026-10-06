import mongoose from "mongoose";

const { Schema } = mongoose;

const contentSchema = new Schema(
  {
    // ==========================================
    // IDENTIFICATION
    // ==========================================

    key: { type: String,  required: true,  unique: true, lowercase: true, trim: true, index: true,},
    slug: { type: String, default: "", lowercase: true, trim: true, index: true,},
    title: {type: String, required: true, trim: true,},
    description: { type: String, default: "", trim: true,},

    // ==========================================
    // CONTENT TYPE
    // ==========================================

    contentType: { type: String,
      enum: [ "PAGE", "SECTION", "BANNER","FAQ", "POLICY", "SETTING",],
      default: "SECTION", index: true,},
    section: {  type: String, default: "", trim: true, index: true, },

    // ==========================================
    // ACTUAL CONTENT
    // ==========================================

    content: { type: Schema.Types.Mixed, required: true,},

    // ==========================================
    // MEDIA
    // ==========================================

    mediaIds: { type: [{type: Schema.Types.ObjectId, ref: "Media", },], default: [],},

    // ==========================================
    // SEO
    // ==========================================

    seo: { 
      metaTitle: { type: String, default: "", trim: true, },
      metaDescription: { type: String, default: "", trim: true,},
      keywords: { type: [String], default: [], },
      canonicalUrl: { type: String, default: "", trim: true,},
      ogTitle: { type: String, default: "", trim: true,},
      ogDescription: { type: String, default: "", trim: true, },
      ogImage: { type: String, default: null, },
    },

    // ==========================================
    // DISPLAY
    // ==========================================

    sortOrder: { type: Number, default: 0, min: 0,index: true,},

    // ==========================================
    // PUBLISHING
    // ==========================================

    status: { type: String,
      enum: [ "DRAFT", "PUBLISHED",  "ARCHIVED", ], 
      default: "DRAFT",index: true,},

    publishedAt: { type: Date, default: null, index: true,},
    scheduledAt: { type: Date, default: null,index: true,},
    isActive: { type: Boolean, default: true, index: true,},

    // ==========================================
    // AUDIT
    // ==========================================

    createdBy: { type: Schema.Types.ObjectId, ref: "User", default: null,},
    updatedBy: {type: Schema.Types.ObjectId, ref: "User", default: null,},

    // ==========================================
    // SOFT DELETE
    // ==========================================

    isDeleted: { type: Boolean, default: false,index: true,},
    deletedAt: { type: Date, default: null,},
    deletedBy: {type: Schema.Types.ObjectId, ref: "User", default: null,},
  },
  {
    timestamps: true,
  }
);

// ==========================================
// INDEXES
// ==========================================

contentSchema.index({  key: 1, isActive: 1, isDeleted: 1,});
contentSchema.index({  section: 1,contentType: 1, sortOrder: 1,});
contentSchema.index({ status: 1,  isActive: 1, isDeleted: 1,});
contentSchema.index({ publishedAt: -1,});
contentSchema.index({ createdAt: -1,});

const Content = mongoose.model("Content", contentSchema);

export default Content;
