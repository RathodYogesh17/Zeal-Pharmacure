import mongoose from "mongoose";

const { Schema } = mongoose;

const noteSchema = new Schema(
  {
    note: { type: String, required: true, trim: true,},
    addedBy: {type: Schema.Types.ObjectId, ref: "User", required: true,},
    addedAt: { type: Date, default: Date.now,},
  },
  { _id: true }
);

const franchiseEnquirySchema = new Schema(
  {
    // ==========================================
    // APPLICANT INFORMATION
    // ==========================================

    name: { type: String, required: true,  trim: true, index: true,},
    email: { type: String, required: true, lowercase: true, trim: true, index: true,},
    phone: { type: String, required: true, trim: true, index: true,},
    whatsappNumber: {  type: String,default: "", trim: true,},

    // ==========================================
    // COMPANY
    // ==========================================

    companyName: { type: String, default: "",  trim: true,index: true,},
    businessType: {
      type: String,
      enum: [ "INDIVIDUAL", "PROPRIETORSHIP", "PARTNERSHIP", "PRIVATE_LIMITED", "LLP", "OTHER", ],
      default: "INDIVIDUAL",
    },

    // ==========================================
    // LICENSE / TAX
    // ==========================================

    drugLicenseNumber: { type: String, default: "", trim: true,},
    gstNumber: { type: String, default: "", trim: true,},

    // ==========================================
    // LOCATION
    // ==========================================

    address: { type: String, default: "", trim: true,},
    city: { type: String, required: true, trim: true, index: true,},
    state: {type: String, required: true, trim: true, index: true,},
    district: { type: String,  default: "", trim: true, index: true,},
    pincode: { type: String, default: "", trim: true,},

    // ==========================================
    // BUSINESS PROFILE
    // ==========================================

    pharmaExperience: { type: String,default: "", trim: true,},
    currentBusiness: { type: String, default: "", trim: true,},
    investmentBudget: { type: String, default: "", trim: true,},
    interestedDivisions: { type: [String], default: [], },

    // ==========================================
    // FACILITIES
    // ==========================================

    hasGodownFacility: { type: Boolean, default: false,},
    godownDetails: {type: String, default: "", trim: true, },
    hasTransportFacility: { type: Boolean, default: false,},
    transportDetails: { type: String,  default: "", trim: true, },

    // ==========================================
    // EXPERIENCE / REQUIREMENT
    // ==========================================

    preferredTerritory: { type: String, default: "", trim: true,},
    interestedProducts: { type: [Schema.Types.ObjectId], ref: "Product", default: [],},
    message: {  type: String, default: "",  trim: true,},

    // ==========================================
    // CRM STATUS
    // ==========================================

    status: { type: String,
      enum: ["NEW","CONTACTED", "QUALIFIED", "DOCUMENTS_PENDING", "APPROVED", "REJECTED", "ON_HOLD", "CLOSED",],
      default: "NEW",
      index: true,
    },

    assignedTo: { type: Schema.Types.ObjectId, ref: "User", default: null, index: true, },
    assignedBy: { type: Schema.Types.ObjectId, ref: "User", default: null,},
    assignedAt: { type: Date, default: null,},

    // ==========================================
    // FOLLOW-UP
    // ==========================================

    nextFollowUpAt: { type: Date, default: null, index: true,},
    lastContactedAt: { type: Date, default: null,},

    // ==========================================
    // INTERNAL NOTES
    // ==========================================

    internalNotes: { type: [noteSchema], default: [],},

    // ==========================================
    // SOURCE
    // ==========================================

    source: {
      type: String,
      enum: [ "WEBSITE", "FRANCHISE_PAGE", "CONTACT_PAGE", "ADMIN", "OTHER", ],
      default: "WEBSITE",
      index: true,
    },

    // ==========================================
    // CONFIRMATION
    // ==========================================

    isConfirmed: { type: Boolean,  default: true, index: true, },
    confirmedAt: { type: Date, default: null,},

    // ==========================================
    // SOFT DELETE
    // ==========================================

    isDeleted: { type: Boolean, default: false,  index: true,},
    deletedAt: { type: Date,  default: null,},
    deletedBy: { type: Schema.Types.ObjectId, ref: "User",  default: null, },
  },
  {
    timestamps: true,
  }
);

// ==========================================
// INDEXES
// ==========================================

franchiseEnquirySchema.index({ status: 1, isDeleted: 1,});
franchiseEnquirySchema.index({ state: 1, city: 1, district: 1,});
franchiseEnquirySchema.index({ assignedTo: 1, status: 1,});
franchiseEnquirySchema.index({ nextFollowUpAt: 1,status: 1});
franchiseEnquirySchema.index({ createdAt: -1});

const FranchiseEnquiry = mongoose.model(
  "FranchiseEnquiry",
  franchiseEnquirySchema
);

export default FranchiseEnquiry;
