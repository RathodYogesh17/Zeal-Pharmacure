import mongoose from "mongoose";
import Role from "../models/role.model";
import Permission from "../models/permission.model";
import RolePermission from "../models/rolePermission.model";
import UserPermission from "../models/userPermission.model";
import User from "../models/user.model";
import AuditLog from "../models/auditLog.model";
import AppError from "../utils/appError";
import HTTP_STATUS from "../constants/httpStatus";
import { buildPagination } from "../utils/pagination";
import { getEffectivePermissions } from "./permission.service";
import type {
  ICreateRoleRequest,
  IUpdateRoleRequest,
  IUserPermissionOverrideItem,
} from "../types/settings.types";
import type { IAuditLogQuery } from "../types/auditLog.types";
import type { IAuthenticatedUser } from "../types/user.types";

const validateObjectId = (id: string, label: string = "ID"): void => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(`Invalid ${label}`, HTTP_STATUS.BAD_REQUEST);
  }
};

// ==========================================
// PERMISSIONS
// ==========================================

const getAllPermissions = async () => {
  const permissions = await Permission.find({ isActive: true })
    .sort({ module: 1, sortOrder: 1, action: 1 })
    .lean();

  const grouped: Record<string, typeof permissions> = {};
  for (const perm of permissions) {
    const list = grouped[perm.module] || [];
    list.push(perm);
    grouped[perm.module] = list;
  }

  return {
    total: permissions.length,
    permissions,
    grouped,
  };
};

// ==========================================
// ROLES CRUD
// ==========================================

const getAllRoles = async () => {
  const roles = await Role.find().sort({ isSystemRole: -1, sortOrder: 1, name: 1 }).lean();

  const rolesWithPermissions = await Promise.all(
    roles.map(async (role) => {
      const rolePermissions = await RolePermission.find({ roleId: role._id, isActive: true })
        .populate("permissionId", "key name module action description sortOrder isSystemPermission")
        .lean();

      return {
        ...role,
        permissionsCount: rolePermissions.length,
        permissions: rolePermissions
          .map((rp) => rp.permissionId)
          .filter(Boolean),
      };
    })
  );

  return rolesWithPermissions;
};

const getRoleById = async (roleId: string) => {
  validateObjectId(roleId, "role ID");
  const role = await Role.findById(roleId).lean();
  if (!role) {
    throw new AppError("Role not found", HTTP_STATUS.NOT_FOUND);
  }

  const rolePermissions = await RolePermission.find({ roleId: role._id, isActive: true })
    .populate("permissionId", "key name module action description sortOrder isSystemPermission")
    .lean();

  return {
    ...role,
    permissionsCount: rolePermissions.length,
    permissions: rolePermissions
      .map((rp) => rp.permissionId)
      .filter(Boolean),
  };
};

const createRole = async (
  data: ICreateRoleRequest,
  user?: { _id?: string | mongoose.Types.ObjectId }
) => {
  const formattedName = data.name.trim();
  const formattedCode = (
    data.code?.trim() || formattedName.replace(/[^a-zA-Z0-9]+/g, "_")
  ).toUpperCase();

  const existingRole = await Role.findOne({
    $or: [{ name: formattedName }, { code: formattedCode }],
  });
  if (existingRole) {
    throw new AppError(
      `Role with name '${formattedName}' or code '${formattedCode}' already exists`,
      HTTP_STATUS.CONFLICT
    );
  }

  const newRole = await Role.create({
    name: formattedName,
    code: formattedCode,
    description: data.description?.trim() || "",
    isSystemRole: false,
    sortOrder: data.sortOrder ?? 0,
    isActive: data.isActive !== false,
    createdBy: user?._id ? new mongoose.Types.ObjectId(String(user._id)) : null,
    updatedBy: user?._id ? new mongoose.Types.ObjectId(String(user._id)) : null,
  });

  return newRole;
};

const updateRole = async (
  roleId: string,
  data: IUpdateRoleRequest,
  user?: { _id?: string | mongoose.Types.ObjectId }
) => {
  validateObjectId(roleId, "role ID");
  const role = await Role.findById(roleId);
  if (!role) {
    throw new AppError("Role not found", HTTP_STATUS.NOT_FOUND);
  }

  if (data.name && data.name.trim() !== role.name) {
    if (role.isSystemRole) {
      throw new AppError("System role names cannot be modified", HTTP_STATUS.FORBIDDEN);
    }

    const formattedName = data.name.trim();
    const existingRole = await Role.findOne({
      name: formattedName,
      _id: { $ne: role._id },
    });
    if (existingRole) {
      throw new AppError(`Role '${formattedName}' already exists`, HTTP_STATUS.CONFLICT);
    }
    role.name = formattedName;
  }

  if (data.code && data.code.trim().toUpperCase() !== role.code) {
    if (role.isSystemRole) {
      throw new AppError("System role codes cannot be modified", HTTP_STATUS.FORBIDDEN);
    }

    const formattedCode = data.code.trim().toUpperCase();
    const existingRole = await Role.findOne({
      code: formattedCode,
      _id: { $ne: role._id },
    });
    if (existingRole) {
      throw new AppError(`Role code '${formattedCode}' already exists`, HTTP_STATUS.CONFLICT);
    }
    role.code = formattedCode;
  }

  if (data.description !== undefined) {
    role.description = data.description.trim();
  }

  if (data.sortOrder !== undefined) {
    role.sortOrder = Number(data.sortOrder);
  }

  if (data.isActive !== undefined) {
    if (role.isSystemRole && !data.isActive) {
      throw new AppError("System roles cannot be deactivated", HTTP_STATUS.FORBIDDEN);
    }
    role.isActive = data.isActive;
  }

  role.updatedBy = user?._id ? new mongoose.Types.ObjectId(String(user._id)) : null;

  await role.save();
  return role;
};

const deleteRole = async (roleId: string) => {
  validateObjectId(roleId, "role ID");
  const role = await Role.findById(roleId);
  if (!role) {
    throw new AppError("Role not found", HTTP_STATUS.NOT_FOUND);
  }

  if (role.isSystemRole) {
    throw new AppError("System roles cannot be deleted", HTTP_STATUS.FORBIDDEN);
  }

  const assignedUsersCount = await User.countDocuments({
    role: { $in: [role._id, role.name] },
    isDeleted: false,
  } as Record<string, unknown>);
  if (assignedUsersCount > 0) {
    throw new AppError(
      `Cannot delete role '${role.name}' because it is currently assigned to ${assignedUsersCount} active user(s)`,
      HTTP_STATUS.CONFLICT
    );
  }

  await RolePermission.deleteMany({ roleId: role._id });
  await Role.findByIdAndDelete(role._id);

  return { _id: role._id, name: role.name, deleted: true };
};

// ==========================================
// ROLE PERMISSIONS ASSIGNMENT
// ==========================================

const assignRolePermissions = async (
  roleId: string,
  permissionIds: string[],
  user?: { _id?: string | mongoose.Types.ObjectId }
) => {
  validateObjectId(roleId, "role ID");
  const role = await Role.findById(roleId);
  if (!role) {
    throw new AppError("Role not found", HTTP_STATUS.NOT_FOUND);
  }

  const validPermissions = await Permission.find({
    _id: { $in: permissionIds },
    isActive: true,
  }).lean();

  if (validPermissions.length !== permissionIds.length) {
    throw new AppError("One or more permission IDs are invalid or inactive", HTTP_STATUS.BAD_REQUEST);
  }

  await RolePermission.deleteMany({ roleId: role._id });

  const assignedBy = user?._id ? new mongoose.Types.ObjectId(String(user._id)) : null;
  const updatedBy = user?._id ? new mongoose.Types.ObjectId(String(user._id)) : null;

  const mappings = permissionIds.map((permissionId) => ({
    roleId: role._id,
    permissionId: new mongoose.Types.ObjectId(permissionId),
    isActive: true,
    assignedBy,
    updatedBy,
  }));

  if (mappings.length > 0) {
    await RolePermission.insertMany(mappings, { ordered: false });
  }

  return getRoleById(roleId);
};

// ==========================================
// USER PERMISSION OVERRIDES (ALLOW / DENY)
// ==========================================

const getUserPermissions = async (userId: string) => {
  validateObjectId(userId, "user ID");
  const user = await User.findOne({ _id: userId, isDeleted: false })
    .populate("role", "name code")
    .lean();
  if (!user) {
    throw new AppError("User not found", HTTP_STATUS.NOT_FOUND);
  }

  const overrides = await UserPermission.find({ userId: user._id })
    .populate("permissionId", "key name module action description sortOrder isSystemPermission")
    .populate("assignedBy", "name email")
    .lean();

  const roleName = ((user.role as { name?: string })?.name || "USER") as import("../constants/enums").UserRole;

  const effectiveSet = await getEffectivePermissions({
    _id: String(user._id),
    role: roleName,
  });

  return {
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: roleName,
      roleDetails: user.role,
    },
    effectivePermissions: Array.from(effectiveSet),
    overrides,
  };
};

const assignUserPermissions = async (
  userId: string,
  overrides: IUserPermissionOverrideItem[],
  assignedByUserId?: string
) => {
  validateObjectId(userId, "user ID");
  const user = await User.findOne({ _id: userId, isDeleted: false });
  if (!user) {
    throw new AppError("User not found", HTTP_STATUS.NOT_FOUND);
  }

  if (overrides.length > 0) {
    const permissionIds = overrides.map((item) => item.permissionId);
    const validCount = await Permission.countDocuments({
      _id: { $in: permissionIds },
      isActive: true,
    });
    if (validCount !== permissionIds.length) {
      throw new AppError("One or more permission IDs are invalid or inactive", HTTP_STATUS.BAD_REQUEST);
    }
  }

  await UserPermission.deleteMany({ userId: user._id });

  const assignerId = assignedByUserId && mongoose.Types.ObjectId.isValid(assignedByUserId)
    ? new mongoose.Types.ObjectId(assignedByUserId)
    : null;

  if (overrides.length > 0) {
    const documents = overrides.map((item) => ({
      userId: user._id,
      permissionId: new mongoose.Types.ObjectId(item.permissionId),
      effect: item.effect || item.type || "ALLOW",
      isActive: item.isActive !== undefined ? item.isActive : true,
      assignedBy: assignerId,
      updatedBy: assignerId,
    }));
    await UserPermission.insertMany(documents, { ordered: false });
  }

  return getUserPermissions(userId);
};

// ==========================================
// AUDIT LOGS QUERY
// ==========================================
import { getAuditLogs } from "./auditLog.service";


export {
  getAllPermissions,
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
  assignRolePermissions,
  getUserPermissions,
  assignUserPermissions,
  getAuditLogs,
};
