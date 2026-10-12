import type { IAuthenticatedUser, ICreateUserRequest, IUpdateUserRequest, IUserQuery } from "../types/user.types";
import User from "../models/user.model";
import Role from "../models/role.model";
import mongoose from "mongoose";
import { hashPassword } from "../utils/password";
import { buildPagination, buildSearchFilter } from "../utils/pagination";
import AppError from "../utils/appError";
import HTTP_STATUS from "../constants/httpStatus";
import type { HttpStatusCode } from "../constants/httpStatus";
import MESSAGES from "../constants/messages";
import { resolveMediaReference } from "../services/media.service";
import { resolveRoleId } from "../utils/resolveRole";

const auditUserPopulate = [
  { path: "role", select: "name code description isSystemRole" },
  { path: "createdBy", select: "name email" },
  { path: "updatedBy", select: "name email" },
  { path: "deletedBy", select: "name email" },
];

const normalizeUserResponse = (userDoc: any) => {
  if (!userDoc) return userDoc;
  const roleName = typeof userDoc.role === "object" && userDoc.role !== null
    ? (userDoc.role.name || userDoc.role.code || "USER")
    : String(userDoc.role || "USER");
  return {
    ...userDoc,
    role: roleName,
    roleDetails: typeof userDoc.role === "object" ? userDoc.role : undefined,
  };
};

const throwServiceError = (message: string, statusCode: HttpStatusCode): never => {
  throw new AppError(message, statusCode);
};

const validateUserId = (id: string): void => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throwServiceError(MESSAGES.INVALID_USER_ID, HTTP_STATUS.BAD_REQUEST);
  }
};

const validateUniqueUserData = async (
  payload: { email?: string | undefined; phone?: string | undefined; excludeUserId?: string | undefined }
): Promise<void> => {
  const { email, phone, excludeUserId } = payload;
  if (email) {
    const existingEmail = await User.findOne({
      email,
      isDeleted: false,
      ...(excludeUserId ? { _id: { $ne: excludeUserId } } : {}),
    });
    if (existingEmail) {
      throwServiceError(MESSAGES.EMAIL_EXISTS, HTTP_STATUS.CONFLICT);
    }
  }
  if (phone) {
    const existingPhone = await User.findOne({
      phone,
      isDeleted: false,
      ...(excludeUserId ? { _id: { $ne: excludeUserId } } : {}),
    });
    if (existingPhone) {
      throwServiceError(MESSAGES.PHONE_EXISTS, HTTP_STATUS.CONFLICT);
    }
  }
};

// =====================================================
// CREATE USER
// =====================================================

const createUser = async (body: ICreateUserRequest, user?: IAuthenticatedUser) => {
  if (body.role && body.role !== "USER") {
    throwServiceError(MESSAGES.PUBLIC_USER_ONLY, HTTP_STATUS.BAD_REQUEST);
  }

  await validateUniqueUserData({ email: body.email, phone: body.phone });
  const hashedPassword = await hashPassword(body.password);
  const profileMedia = await resolveMediaReference(body.profileImageId, body.profileImage);
  const defaultRoleId = await resolveRoleId("USER");

  const newUser = await User.create({
    name: body.name.trim(),
    email: body.email.trim().toLowerCase(),
    phone: body.phone.trim(),
    password: hashedPassword,
    role: defaultRoleId,
    profileImage: profileMedia?.url || null,
    profileImageId: profileMedia?.id ? new mongoose.Types.ObjectId(profileMedia.id) : null,
    designation: body.designation?.trim() || "",
    department: body.department?.trim() || "",
    isActive: true,
    isDeleted: false,
    deletedAt: null,
    createdBy: user?._id || null,
    updatedBy: null,
    deletedBy: null,
    lastLogin: null,
  });

  const created = await User.findById(newUser._id)
    .select("-password")
    .populate(auditUserPopulate)
    .lean();
  return normalizeUserResponse(created);
};

const createStaffUser = async (body: ICreateUserRequest, user?: IAuthenticatedUser) => {
  const role = body.role || "ADMIN";
  const allowedRoles = ["SUPER_ADMIN", "ADMIN", "SALES_MANAGER", "HR_MANAGER", "CONTENT_MANAGER", "EMPLOYEE"];

  if (typeof role === "string" && !allowedRoles.includes(role) && !mongoose.Types.ObjectId.isValid(role)) {
    throwServiceError(MESSAGES.STAFF_ROLE_ONLY, HTTP_STATUS.BAD_REQUEST);
  }

  await validateUniqueUserData({ email: body.email, phone: body.phone });

  const hashedPassword = await hashPassword(body.password);
  const profileMedia = await resolveMediaReference(body.profileImageId, body.profileImage);
  const resolvedRoleId = await resolveRoleId(role);

  const newUser = await User.create({
    name: body.name.trim(),
    email: body.email.trim().toLowerCase(),
    phone: body.phone.trim(),
    password: hashedPassword,
    role: resolvedRoleId,
    profileImage: profileMedia?.url || null,
    profileImageId: profileMedia?.id ? new mongoose.Types.ObjectId(profileMedia.id) : null,
    designation: body.designation?.trim() || "",
    department: body.department?.trim() || "",
    isActive: true,
    isDeleted: false,
    deletedAt: null,
    createdBy: user?._id || null,
    updatedBy: null,
    deletedBy: null,
    lastLogin: null,
  });

  const createdStaff = await User.findById(newUser._id)
    .select("-password")
    .populate(auditUserPopulate)
    .lean();
  return normalizeUserResponse(createdStaff);
};

// =====================================================
// GET SINGLE USER
// =====================================================

const getUser = async (id: string) => {
  validateUserId(id);
  const user = await User.findOne({ _id: id, isDeleted: false })
    .select("-password")
    .populate(auditUserPopulate)
    .lean();
  if (!user) {
    throwServiceError(MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }
  return normalizeUserResponse(user);
};

// =====================================================
// GET ALL USERS
// =====================================================

const getAllUsers = async (query: IUserQuery = {}) => {
  const { page, limit, skip } = buildPagination(Number(query.page ?? 1), Number(query.limit ?? 10));
  const filter: Record<string, unknown> = { isDeleted: false };
  const searchFilter = buildSearchFilter(String(query.search ?? ""));

  if (searchFilter) {
    filter.$or = searchFilter.$or;
  }

  if (query.role) {
    if (mongoose.Types.ObjectId.isValid(String(query.role)) && String(query.role).length === 24) {
      filter.role = new mongoose.Types.ObjectId(String(query.role));
    } else {
      const roleDoc = await Role.findOne({ name: String(query.role).toUpperCase() });
      if (roleDoc) filter.role = roleDoc._id;
    }
  }

  if (query.department) {
    filter.department = { $regex: new RegExp(query.department.trim(), "i") };
  }

  if (query.isActive !== undefined) {
    filter.isActive = query.isActive === "true";
  }

  const [users, total] = await Promise.all([
    User.find(filter)
      .select("-password")
      .populate(auditUserPopulate)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    User.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit);
  return { users: users.map(normalizeUserResponse), total, page, limit, totalPages };
};

// =====================================================
// UPDATE USER
// =====================================================

const updateUser = async (id: string, body: IUpdateUserRequest, user?: IAuthenticatedUser) => {
  validateUserId(id);
  const existingUser = await User.findOne({ _id: id, isDeleted: false });
  if (!existingUser) {
    throwServiceError(MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  await validateUniqueUserData({ email: body.email, phone: body.phone, excludeUserId: id });

  const updatePayload: Record<string, unknown> = {
    updatedBy: user?._id || null,
  };

  if (body.name !== undefined) updatePayload.name = body.name.trim();
  if (body.email !== undefined) updatePayload.email = body.email.trim().toLowerCase();
  if (body.phone !== undefined) updatePayload.phone = body.phone.trim();
  if (body.designation !== undefined) updatePayload.designation = body.designation.trim();
  if (body.department !== undefined) updatePayload.department = body.department.trim();

  if (body.role !== undefined) {
    updatePayload.role = await resolveRoleId(body.role);
  }

  if (body.profileImageId !== undefined || body.profileImage !== undefined) {
    const profileMedia = await resolveMediaReference(body.profileImageId, body.profileImage);
    updatePayload.profileImage = profileMedia?.url || null;
    updatePayload.profileImageId = profileMedia?.id ? new mongoose.Types.ObjectId(profileMedia.id) : null;
  }

  const updatedUser = await User.findByIdAndUpdate(
    id,
    updatePayload,
    { new: true, runValidators: true }
  )
    .select("-password")
    .populate(auditUserPopulate)
    .lean();

  return normalizeUserResponse(updatedUser);
};

// =====================================================
// SOFT DELETE USER
// =====================================================

const deleteUser = async (id: string, user?: IAuthenticatedUser) => {
  validateUserId(id);

  const deletedUser = await User.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { isDeleted: true, deletedAt: new Date(), deletedBy: user?._id || null },
    { new: true }
  ).lean();

  if (!deletedUser) {
    throw new AppError("User not found", HTTP_STATUS.NOT_FOUND);
  }
  return { _id: deletedUser._id, isDeleted: deletedUser.isDeleted, deletedAt: deletedUser.deletedAt };
};

// =====================================================
// ACTIVATE USER
// =====================================================

const activateUser = async (id: string, user?: IAuthenticatedUser) => {
  validateUserId(id);
  const updatedUser = await User.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { isActive: true, updatedBy: user?._id || null },
    { new: true }
  ).lean();

  if (!updatedUser) {
    throw new AppError("User not found", HTTP_STATUS.NOT_FOUND);
  }
  return { _id: updatedUser._id, isActive: updatedUser.isActive };
};

// =====================================================
// DEACTIVATE USER
// =====================================================

const deactivateUser = async (id: string, user?: IAuthenticatedUser) => {
  validateUserId(id);

  const updatedUser = await User.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { isActive: false, updatedBy: user?._id || null },
    { new: true }
  ).lean();

  if (!updatedUser) {
    throw new AppError("User not found", HTTP_STATUS.NOT_FOUND);
  }
  return { _id: updatedUser._id, isActive: updatedUser.isActive };
};

// =====================================================
// EXPORT
// =====================================================

export { createUser, createStaffUser, getUser, getAllUsers, updateUser, deleteUser, activateUser, deactivateUser };
