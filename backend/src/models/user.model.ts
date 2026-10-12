import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    // =========================
    // BASIC INFORMATION
    // =========================
    name: {  type: String, required: true, trim: true,},
    email: { type: String,  required: true, unique: true, lowercase: true, trim: true, index: true,},
    phone: { type: String,  default: "",trim: true, index: true,},

    // =========================
    // AUTHENTICATION
    // =========================
    password: { type: String,  required: true, select: false,},
    passwordChangedAt: { type: Date, default: null,},
    failedLoginAttempts: { type: Number, default: 0, min: 0,},
    lockedUntil: { type: Date, default: null,},

    // =========================
    // ROLE / RBAC
    // =========================
    role: { type: Schema.Types.Mixed, ref: "Role", required: true, index: true,},
    permissions: { type: [String], default: [] },

    // =========================
    // PROFILE
    // =========================
    profileImage: {type: String, default: null,  trim: true,},
    profileImageId: {type: Schema.Types.ObjectId,ref: "Media", default: null,},
    designation: {  type: String,default: "", trim: true,},
    department: { type: String, default: "", trim: true,},

    // =========================
    // ACCOUNT STATUS
    // =========================
    isActive: { type: Boolean, default: true, index: true,},
    isDeleted: { type: Boolean,default: false, index: true,},
    deletedAt: { type: Date, default: null,},

    // =========================
    // LOGIN INFORMATION
    // =========================
    lastLogin: { type: Date,  default: null,index: true,},
    lastLoginIp: {  type: String,default: "",trim: true,},
    lastActivityAt: {type: Date,  default: null,},

    // =========================
    // PASSWORD RESET
    // =========================
    resetPasswordToken: { type: String, default: null, select: false, },
    resetPasswordExpires: { type: Date, default: null, select: false,},

    // 2FA / OTP Verification (Internal helper fields)
    otpCode: { type: String, default: null, select: false,},
    otpExpiresAt: { type: Date, default: null,select: false,},
    otpPurpose: { type: String,  default: null, select: false,},

    // =========================
    // ACCOUNT VERIFICATION
    // =========================
    isEmailVerified: { type: Boolean, default: false, index: true,},
    emailVerifiedAt: { type: Date, default: null,},

    // =========================
    // AUDIT
    // =========================
    createdBy: { type: Schema.Types.ObjectId, ref: "User", default: null,},
    updatedBy: { type: Schema.Types.ObjectId,  ref: "User",  default: null,},
    deletedBy: { type: Schema.Types.ObjectId, ref: "User", default: null, },
  },
  { timestamps: true,}
);

// =========================
// INDEXES
// =========================
userSchema.index({email: 1, isDeleted: 1,});
userSchema.index({ role: 1, isActive: 1, isDeleted: 1,});
userSchema.index({department: 1, isActive: 1, isDeleted: 1,});
userSchema.index({ createdAt: -1,});
userSchema.index({ lastLogin: -1});

const User = mongoose.model("User", userSchema);

export default User;