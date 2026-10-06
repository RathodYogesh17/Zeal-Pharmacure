import mongoose from "mongoose";
import Role from "../models/role.model";
import { USER_ROLES } from "../constants/enums";

/**
 * Resolves a role name (e.g. "USER", "ADMIN") or role ObjectId string to a valid mongoose Role ObjectId.
 * If the role does not yet exist in the DB, it creates a system/standard role entry.
 */
export const resolveRoleId = async (
  roleNameOrId?: string | mongoose.Types.ObjectId | null
): Promise<mongoose.Types.ObjectId> => {
  if (!roleNameOrId) {
    const defaultRole = await Role.findOne({ name: USER_ROLES.USER });
    if (defaultRole) return defaultRole._id as mongoose.Types.ObjectId;
    const created = await Role.create({
      name: USER_ROLES.USER,
      code: "USER",
      description: "Default application user",
      isSystemRole: true,
      isActive: true,
    });
    return created._id as mongoose.Types.ObjectId;
  }

  const roleStr = String(roleNameOrId).trim();

  // If it's a valid 24-character hexadecimal ObjectId
  if (mongoose.Types.ObjectId.isValid(roleStr) && roleStr.length === 24) {
    const existingById = await Role.findById(roleStr);
    if (existingById) return existingById._id as mongoose.Types.ObjectId;
  }

  const upperName = roleStr.toUpperCase();
  const existingByName = await Role.findOne({
    $or: [{ name: upperName }, { code: upperName }, { name: roleStr }],
  });
  if (existingByName) return existingByName._id as mongoose.Types.ObjectId;

  // Create role on-the-fly if needed
  const isSystem = Object.values(USER_ROLES).includes(upperName as (typeof USER_ROLES)[keyof typeof USER_ROLES]);
  const newRole = await Role.create({
    name: upperName,
    code: upperName,
    description: `${upperName} role`,
    isSystemRole: isSystem,
    isActive: true,
  });

  return newRole._id as mongoose.Types.ObjectId;
};
