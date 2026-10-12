import mongoose from "mongoose";

const { Schema } = mongoose;

// ==========================================
// CANDIDATE NOTE
// ==========================================

const candidateNoteSchema = new Schema(
  {
    note: { type: String,required: true, trim: true, },
    addedBy: { type: Schema.Types.ObjectId, ref: "User", required: true,},
    addedAt: { type: Date, default: Date.now,},
  },
  { _id: true,}
);

// ==========================================
// INTERVIEW ROUND 🆕
// ==========================================

const interviewRoundSchema = new Schema(
  {
    roundName: { type: String, required: true, trim: true, },
    interviewDate: { type: Date, default: null, },
    mode: { type: String,
      enum: ["ONLINE", "OFFLINE", "PHONE"],
      default: "ONLINE", },
    meetingLink: {type: String, default: "", trim: true,},
    interviewer: { type: Schema.Types.ObjectId,  ref: "User", default: null,},
    status: { type: String,
      enum: [ "SCHEDULED","COMPLETED", "CANCELLED", "RESCHEDULED", ],
      default: "SCHEDULED",
    },
    feedback: { type: String, default: "", trim: true, },
    rating: { type: Number, min: 1, max: 5, default: null,},
    notes: { type: String, default: "", trim: true,},
  },
  {
    _id: true,
  }
);

// ==========================================
// CAREER APPLICATION
// ==========================================

const careerApplicationSchema = new Schema(
  {
    // ==========================================
    // APPLICATION
    // ==========================================

    applicationCode: { type: String, unique: true, sparse: true, trim: true, },
    jobOpening: { type: Schema.Types.ObjectId, ref: "JobOpening", default: null, },
    positionAppliedFor: { type: String, required: true, trim: true, },
    department: { type: String, required: true, trim: true, },

    // ==========================================
    // CANDIDATE INFORMATION
    // ==========================================

    fullName: { type: String, required: true, trim: true, },
    email: { type: String, required: true, lowercase: true, trim: true, },
    phone: { type: String, required: true, trim: true, },
    whatsappNumber: { type: String, default: "", trim: true, },
    currentCity: { type: String, required: true, trim: true, },
    currentState: { type: String, required: true, trim: true, },
    preferredLocation: { type: String, default: "", trim: true, },
    dateOfBirth: { type: Date, default: null, },

    // ==========================================
    // EDUCATION / EXPERIENCE
    // ==========================================

    qualification: { type: String, required: true, trim: true, },
    totalExperienceYears: { type: Number, required: true, min: 0, },
    currentCompany: { type: String, default: "", trim: true, },
    currentDesignation: { type: String, default: "", trim: true, },
    currentCtc: { type: String, default: "", trim: true, },
    expectedCtc: { type: String, default: "", trim: true, },
    noticePeriod: { type: String, default: "", trim: true, },

    skills: { type: [String], default: [], },

    // ==========================================
    // RESUME
    // ==========================================

    resumeUrl: { type: String, default: "", trim: true, },
    resumeMediaId: { type: Schema.Types.ObjectId, ref: "Media", default: null, },
    resumeOriginalName: { type: String, default: "", trim: true, },
    resumeMimeType: { type: String, default: "", trim: true, },
    resumeSize: { type: Number, default: 0, min: 0, },
    coverNote: { type: String, default: "", trim: true, },

    // ==========================================
    // APPLICATION STATUS
    // ==========================================

    status: {
      type: String,
      enum: ["NEW", "SHORTLISTED", "INTERVIEW_SCHEDULED", "OFFERED", "HIRED", "REJECTED", "ON_HOLD", "WITHDRAWN"],
      default: "NEW",
    },

    // ==========================================
    // INTERVIEWS
    // ==========================================

    interviewRounds: { type: [interviewRoundSchema], default: [], },

    // ==========================================
    // HR MANAGEMENT
    // ==========================================

    hrNotes: { type: [candidateNoteSchema], default: [], },
    assignedTo: { type: Schema.Types.ObjectId, ref: "User", default: null, },
    assignedBy: { type: Schema.Types.ObjectId, ref: "User", default: null, },
    assignedAt: { type: Date, default: null, },
    lastContactedAt: { type: Date, default: null, },
    lastContactedBy: { type: Schema.Types.ObjectId, ref: "User", default: null, },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", default: null, },

    // ==========================================
    // SOURCE
    // ==========================================

    source: { type: String, default: "WEBSITE_CAREERS", trim: true, },

    // ==========================================
    // PRIVACY / CONSENT
    // ==========================================

    consentGiven: { type: Boolean, default: false, },
    consentAt: { type: Date, default: null, },

    // ==========================================
    // SOFT DELETE
    // ==========================================

    isDeleted: { type: Boolean, default: false, },
    deletedAt: { type: Date, default: null, },
    deletedBy: { type: Schema.Types.ObjectId, ref: "User", default: null, },
  },
  {
    timestamps: true,
  }
);

// ==========================================
// OPTIMIZED COMPOUND INDEXES
// ==========================================

// 1. Primary listing, pagination & newest-first sort
careerApplicationSchema.index({ isDeleted: 1, createdAt: -1 });

// 2. Status pipeline filtering & sorting
careerApplicationSchema.index({ isDeleted: 1, status: 1, createdAt: -1 });

// 3. Filter by job opening and status
careerApplicationSchema.index({ isDeleted: 1, jobOpening: 1, status: 1 });

// 4. Filter by assigned HR recruiter and status
careerApplicationSchema.index({ isDeleted: 1, assignedTo: 1, status: 1 });

// 5. Candidate lookups / deduplication
careerApplicationSchema.index({ email: 1, isDeleted: 1 });
careerApplicationSchema.index({ phone: 1, isDeleted: 1 });

// 6. Role & Department queries
careerApplicationSchema.index({ positionAppliedFor: 1, department: 1 });

const CareerApplication = mongoose.model(
  "CareerApplication",
  careerApplicationSchema
);

export default CareerApplication;
