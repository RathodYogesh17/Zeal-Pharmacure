import mongoose from "mongoose";

const { Schema } = mongoose;

const productItemSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true, index: true,},
    quantity: {type: Number, default: null, min: 0,},
    quantityUnit: { type: String, default: "", trim: true,},
    message: { type: String, default: "", trim: true,},
  },
  { _id: true }
);

const noteSchema = new Schema(
  {
    note: { type: String, required: true,  trim: true,},
    addedBy: { type: Schema.Types.ObjectId, ref: "User", required: true,},
    addedAt: { type: Date, default: Date.now,},
  },
  { _id: true }
);

const productEnquirySchema = new Schema(
  {
    // ==========================================
    // ENQUIRY TYPE
    // ==========================================

    enquiryType: {type: String, enum: ["SINGLE_PRODUCT", "BULK_PRODUCT"], required: true, index: true,},

    // ==========================================
    // SINGLE PRODUCT
    // ==========================================

    product: { type: Schema.Types.ObjectId, ref: "Product", default: null, index: true, },

    // ==========================================
    // BULK / MULTIPLE PRODUCTS
    // ==========================================

    products: { type: [productItemSchema],  default: [], },

    // ==========================================
    // CUSTOMER INFORMATION
    // ==========================================

    name: { type: String,  required: true,  trim: true, index: true,},
    email: { type: String, required: true, lowercase: true, trim: true,  index: true,},
    phone: { type: String, required: true, trim: true, index: true,},
    whatsappNumber: { type: String,  default: "", trim: true,},
    companyName: { type: String, default: "",  trim: true, },

    // ==========================================
    // LOCATION
    // ==========================================

    city: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    state: { type: String, required: true, trim: true, index: true,},
    pincode: { type: String, default: "", trim: true,},

    // ==========================================
    // BUSINESS INFORMATION
    // ==========================================

    drugLicenseNumber: { type: String, default: "", trim: true,},
    gstNumber: { type: String,  default: "", trim: true, },

    // ==========================================
    // ENQUIRY DETAILS
    // ==========================================

    quantity: { type: Number, default: null, min: 0,},
    quantityUnit: {  type: String, default: "", trim: true,},
    message: { type: String, default: "", trim: true,},

    // ==========================================
    // STATUS / CRM
    // ==========================================

    status: {
      type: String,
      enum: [
        "NEW",
        "CONTACTED",
        "IN_TOUCH",
        "IN_PROGRESS",
        "QUALIFIED",
        "DOCUMENTS_PENDING",
        "QUOTED",
        "FOLLOW_UP",
        "APPROVED",
        "REJECTED",
        "ON_HOLD",
        "CLOSED",
        "PENDING",
      ],
      default: "NEW",
      index: true,
    },

    assignedTo: { type: Schema.Types.ObjectId, ref: "User",  default: null,  index: true,},
    assignedBy: { type: Schema.Types.ObjectId,  ref: "User", default: null,},
    assignedAt: { type: Date, default: null,},

    // ==========================================
    // INTERNAL NOTES
    // ==========================================

    internalNotes: { type: [noteSchema], default: [],},

    // ==========================================
    // SOURCE
    // ==========================================

    source: {
      type: String,
      enum: ["WEBSITE","PRODUCT_PAGE", "BULK_ENQUIRY","ADMIN","OTHER",],
      default: "WEBSITE", index: true,},

    // ==========================================
    // CONFIRMATION
    // ==========================================

    isConfirmed: { type: Boolean, default: true, index: true,},
    confirmedAt: { type: Date, default: null, },

    // ==========================================
    // SOFT DELETE
    // ==========================================

    isDeleted: { type: Boolean, default: false, index: true, },
    deletedAt: { type: Date, default: null, },
    deletedBy: { type: Schema.Types.ObjectId, ref: "User", default: null, },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", default: null, },
  },
  {
    timestamps: true,
  }
);

// ==========================================
// INDEXES
// ==========================================

productEnquirySchema.index({ status: 1, isDeleted: 1,});
productEnquirySchema.index({ enquiryType: 1,isDeleted: 1,});
productEnquirySchema.index({ product: 1,  status: 1 , isDeleted: 1,});
productEnquirySchema.index({ state: 1, city: 1,});
productEnquirySchema.index({ assignedTo: 1, status: 1,});
productEnquirySchema.index({ createdAt: -1});

const ProductEnquiry = mongoose.model(
  "ProductEnquiry",
  productEnquirySchema
);

export default ProductEnquiry;
