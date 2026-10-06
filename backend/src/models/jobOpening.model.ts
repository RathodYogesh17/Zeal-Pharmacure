import mongoose from "mongoose";

const { Schema } = mongoose;

const jobOpeningSchema = new Schema(
  {
    // ==========================================
    // BASIC INFORMATION
    // ==========================================

    title: { type: String, required: true, trim: true, index: true,},
    code: { type: String, unique: true, sparse: true, uppercase: true, trim: true,index: true,},
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true,},
    shortDescription: { type: String, default: "", trim: true,}, 
    description: { type: String, required: true, trim: true,},

    // ==========================================
    // JOB DETAILS
    // ==========================================

    department: { type: String, required: true,trim: true,index: true,},
    location: { type: String, required: true, trim: true, index: true,},
    jobType: {
      type: String,
      enum: ["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP",],
      default: "FULL_TIME",
      index: true,},
    experienceRequired: { type: String, required: true, trim: true,},
    openingsCount: { type: Number, default: 1, min: 1,},
    salaryRange: { type: String, default: "", trim: true,},
    qualificationRequired: { type: String, default: "", trim: true,},

    // ==========================================
    // JOB REQUIREMENTS
    // ==========================================

    responsibilities: { type: [String], default: [],},
    requirements: { type: [String], default: [],},
    skills: { type: [String], default: [],}, 
    benefits: { type: [String], default: [],},

    // ==========================================
    // APPLICATION INFORMATION
    // ==========================================

    applicationEmail: { type: String, default: "", lowercase: true, trim: true,},
    applicationDeadline: { type: Date, default: null,  index: true,}, 

    // ==========================================
    // PUBLISH / DISPLAY
    // ==========================================

    status: { type: String, enum: ["OPEN", "CLOSED", "DRAFT"], default: "DRAFT", index: true,},
    publishedAt: { type: Date, default: null, index: true,},
    sortOrder: { type: Number, default: 0, min: 0, index: true,}, 
    isActive: { type: Boolean, default: true, index: true,},
    isFeatured: { type: Boolean, default: false, index: true,},

    // ==========================================
    // STATISTICS
    // ==========================================

    viewsCount: { type: Number, default: 0,  min: 0,},
    applicationCount: {  type: Number, default: 0, min: 0,},

    // ==========================================
    // SEO
    // ==========================================

    seo: {
      metaTitle: { type: String, default: "", trim: true, },
      metaDescription: { type: String, default: "", trim: true,},
      keywords: { type: [String], default: [],},
      canonicalUrl: { type: String, default: "", trim: true,},
    }, // 🆕 NEW

    // ==========================================
    // AUDIT
    // ==========================================

    createdBy: { type: Schema.Types.ObjectId, ref: "User", default: null,},
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", default: null, },
    isDeleted: { type: Boolean, default: false, index: true, },
    deletedAt: { type: Date, default: null, },
    deletedBy: { type: Schema.Types.ObjectId,  ref: "User",  default: null, },
  },
  {
    timestamps: true,
  }
);


// ==========================================
// INDEXES
// ==========================================

jobOpeningSchema.index({ status: 1, isActive: 1,isDeleted: 1,});
jobOpeningSchema.index({ department: 1, location: 1, isDeleted: 1,});
jobOpeningSchema.index({ jobType: 1, isActive: 1, isDeleted: 1,});
jobOpeningSchema.index({ isFeatured: 1, isActive: 1, isDeleted: 1,});
jobOpeningSchema.index({ sortOrder: 1, createdAt: -1,});
jobOpeningSchema.index({ applicationDeadline: 1, status: 1,});
jobOpeningSchema.index({ createdAt: -1,});


// ==========================================
// MODEL
// ==========================================

const JobOpening = mongoose.model(
  "JobOpening",
  jobOpeningSchema
);

export default JobOpening;
