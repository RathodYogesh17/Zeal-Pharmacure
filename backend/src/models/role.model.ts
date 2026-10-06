import mongoose from "mongoose";

const { Schema } = mongoose;

const roleSchema = new Schema(
  {
    // ==========================================
    // ROLE INFORMATION
    // ==========================================
    name: {  type: String, required: true, unique: true,  trim: true, index: true,},
    code: { type: String, required: true, unique: true, uppercase: true, trim: true, index: true,},
    description: {  type: String,default: "", trim: true,},

    // ==========================================
    // ROLE TYPE
    // ==========================================

    isSystemRole: { type: Boolean, default: false, index: true,},

    // ==========================================
    // DISPLAY
    // ==========================================
    sortOrder: { type: Number, default: 0, min: 0, index: true,},

    // ==========================================
    // STATUS
    // ==========================================
    isActive: { type: Boolean,  default: true,index: true,},

    // ==========================================
    // AUDIT
    // ==========================================
    createdBy: { type: Schema.Types.ObjectId, ref: "User", default: null,}, 
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", default: null,}, 
  },
  {
    timestamps: true,
  }
);


// ==========================================
// INDEXES
// ==========================================
roleSchema.index({ isActive: 1, sortOrder: 1});
roleSchema.index({ isSystemRole: 1, isActive: 1});


// ==========================================
// MODEL
// ==========================================

const Role = mongoose.model("Role", roleSchema);

export default Role;