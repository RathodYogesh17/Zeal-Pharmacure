import mongoose from "mongoose";

const { Schema } = mongoose;

const mediaSchema = new Schema(
  {
    // ==========================================
    // FILE INFORMATION
    // ==========================================

    originalName: { type: String, required: true, trim: true, },
    filename: { type: String, required: true, unique: true, trim: true,},
    url: { type: String, required: true, trim: true, },
    storageKey: { type: String,  default: "",  trim: true,}, 

    storageProvider: {
      type: String,
      enum: ["LOCAL", "CLOUDINARY", "S3", "OTHER"],
      default: "LOCAL",}, 

    // ==========================================
    // MEDIA TYPE
    // ==========================================

    mediaType: {
      type: String,
      enum: ["IMAGE", "VIDEO", "PDF", "DOCUMENT", "OTHER"], 
      required: true, index: true,},
    mimeType: { type: String, required: true, trim: true, },

    // ==========================================
    // FILE SIZE
    // ==========================================

    size: { type: Number, required: true, min: 0,},

    // ==========================================
    // IMAGE INFORMATION
    // ==========================================

    width: { type: Number,default: null, min: 0,}, 
    height: { type: Number, default: null, min: 0,}, 

    // ==========================================
    // MEDIA DETAILS
    // ==========================================

    title: { type: String, default: "", trim: true,}, 
    altText: { type: String, default: "", trim: true,}, 
    caption: { type: String, default: "",  trim: true,}, 

    // ==========================================
    // ORGANIZATION
    // ==========================================

    folder: { type: String, default: "OTHER", trim: true, index: true,}, 
    tags: { type: [String],  default: [], index: true,}, 

    // ==========================================
    // ACCESS
    // ==========================================

    isPublic: { type: Boolean, default: true, index: true,},

    // ==========================================
    // DUPLICATE DETECTION
    // ==========================================

    hash: { type: String, required: true,  unique: true, index: true, trim: true,},

    // ==========================================
    // USER / AUDIT
    // ==========================================

    uploadedBy: { type: Schema.Types.ObjectId, ref: "User", default: null, index: true,},

    // ==========================================
    // SOFT DELETE
    // ==========================================

    isDeleted: { type: Boolean, default: false,  index: true,},
    deletedAt: { type: Date,  default: null,},
    deletedBy: { type: Schema.Types.ObjectId, ref: "User", default: null,},
  },
  {
    timestamps: true,
  }
);


// ==========================================
// INDEXES
// ==========================================

mediaSchema.index({ mediaType: 1, isDeleted: 1,});
mediaSchema.index({ folder: 1, isDeleted: 1,})
mediaSchema.index({ uploadedBy: 1, createdAt: -1,});
mediaSchema.index({ isPublic: 1, isDeleted: 1});
mediaSchema.index({ createdAt: -1,});


// ==========================================
// MODEL
// ==========================================

const Media = mongoose.model("Media", mediaSchema);

export default Media;