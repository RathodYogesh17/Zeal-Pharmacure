import mongoose from "mongoose";

const { Schema } = mongoose;

const reviewSchema = new Schema(
  {
    // ==========================================
    // PRODUCT
    // ==========================================

    product: { type: Schema.Types.ObjectId, ref: "Product", required: true, index: true,},
    // ==========================================
    // REVIEWER INFORMATION
    // ==========================================

    reviewerName: { type: String, required: true, trim: true, index: true,},
    reviewerRole: { type: String, default: "", trim: true, },
    reviewerDesignation: { type: String, default: "", trim: true,}, 

    // ==========================================
    // REVIEW
    // ==========================================
    rating: { type: Number,  required: true,  min: 1, max: 5,},
    title: { type: String, default: "",  trim: true,},
    comment: { type: String, required: true, trim: true,},

    // ==========================================
    // LOCATION
    // ==========================================
    city: {type: String, default: "",  trim: true, index: true, },
    state: {type: String, default: "", trim: true,  index: true,},

    // ==========================================
    // VERIFICATION
    // ==========================================
    isVerified: { type: Boolean,  default: false, index: true,},
    verifiedBy: { type: Schema.Types.ObjectId, ref: "User",default: null, }, 
    verifiedAt: { type: Date, default: null,}, 

    // ==========================================
    // APPROVAL / PUBLISHING
    // ==========================================
    isApproved: { type: Boolean, default: false,  index: true,},
    approvedBy: {  type: Schema.Types.ObjectId, ref: "User", default: null,},
    approvedAt: { type: Date, default: null,},
    isFeatured: { type: Boolean, default: false, index: true,}, 

    // ==========================================
    // ADMIN RESPONSE
    // ==========================================
    adminReply: {  type: String, default: "", trim: true,},
    adminReplyBy: {type: Schema.Types.ObjectId, ref: "User",default: null,},
    adminReplyAt: { type: Date, default: null,}, 

    // ==========================================
    // SOURCE
    // ==========================================
    source: { type: String,  default: "WEBSITE",  trim: true,index: true,}, 

    // ==========================================
    // AUDIT
    // ==========================================
    createdBy: { type: Schema.Types.ObjectId, ref: "User", default: null,}, 

    // ==========================================
    // SOFT DELETE
    // ==========================================
    isDeleted: { type: Boolean, default: false, index: true,},
    deletedAt: { type: Date, default: null,},
    deletedBy: { type: Schema.Types.ObjectId, ref: "User", default: null,},
  },
  {
    timestamps: true,
  }
);


// ==========================================
// INDEXES
// ==========================================
reviewSchema.index({ product: 1,  isApproved: 1, isDeleted: 1,});
reviewSchema.index({ product: 1, isFeatured: 1, isApproved: 1,isDeleted: 1,});
reviewSchema.index({ product: 1, rating: -1, isApproved: 1, isDeleted: 1,});
reviewSchema.index({ createdAt: -1});


// ==========================================
// MODEL
// ==========================================

const Review = mongoose.model("Review", reviewSchema);

export default Review;
