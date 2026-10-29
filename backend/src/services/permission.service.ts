import { USER_ROLES, type UserRole } from "../constants/enums";
import { ROLE_PERMISSIONS } from "../constants/rolePermissions";
import Permission from "../models/permission.model";
import Role from "../models/role.model";
import RolePermission from "../models/rolePermission.model";
import UserPermission from "../models/userPermission.model";
import PERMISSIONS, { type Permission as PermissionKey } from "../constants/permissions";

interface PermissionUser {
  _id: string;
  role: UserRole;
  permissions?: string[];
}

interface CachedPermissions {
  permissions: Set<string>;
  expiresAt: number;
}

// 5-minute in-memory cache to avoid 4 redundant database queries on every authenticated request
const permissionsCache = new Map<string, CachedPermissions>();
const CACHE_TTL_MS = 5 * 60 * 1000;

export const clearPermissionsCache = (userId?: string): void => {
  if (userId) {
    for (const key of permissionsCache.keys()) {
      if (key.startsWith(`${userId}_`)) {
        permissionsCache.delete(key);
      }
    }
  } else {
    permissionsCache.clear();
  }
};

const getEffectivePermissions = async (user: PermissionUser): Promise<Set<string>> => {
  if (user.role === USER_ROLES.SUPER_ADMIN) {
    return new Set(Object.values(PERMISSIONS));
  }

  const cacheKey = `${user._id}_${user.role}_${(user.permissions || []).sort().join(",")}`;
  const cached = permissionsCache.get(cacheKey);
  if (cached && Date.now() < cached.expiresAt) {
    return cached.permissions;
  }

  const configuredRole = ROLE_PERMISSIONS[user.role] || [];
  const role = await Role.findOne({
    $or: [
      { name: new RegExp(`^${user.role}$`, "i") },
      { code: new RegExp(`^${user.role}$`, "i") },
    ],
    isActive: true,
  }).lean();

  const rolePermissionIds = role
    ? await RolePermission.find({ roleId: role._id, isActive: true }).distinct("permissionId")
    : [];

  const rolePermissionKeys = rolePermissionIds.length > 0
    ? await Permission.find({ _id: { $in: rolePermissionIds }, isActive: true }).distinct("key")
    : configuredRole === "ALL" ? Object.values(ROLE_PERMISSIONS).flat() : configuredRole;

  const overrides = await UserPermission.find({ userId: user._id, isActive: true })
    .populate("permissionId", "key")
    .lean();

  const denied = new Set(
    overrides
      .filter((override) => override.effect === "DENY" || (override as { type?: string }).type === "DENY")
      .map((override) => (override.permissionId as { key?: string })?.key)
      .filter((key): key is string => Boolean(key))
  );

  const allowed = overrides
    .filter((override) => override.effect === "ALLOW" || (override as { type?: string }).type === "ALLOW")
    .map((override) => (override.permissionId as { key?: string })?.key)
    .filter((key): key is string => Boolean(key));

  const effectiveSet = new Set([
    ...(user.permissions || []),
    ...rolePermissionKeys,
    ...allowed,
  ].filter((permission) => !denied.has(permission)));

  permissionsCache.set(cacheKey, {
    permissions: effectiveSet,
    expiresAt: Date.now() + CACHE_TTL_MS,
  });

  return effectiveSet;
};

const hasPermission = async (user: PermissionUser, permission: PermissionKey): Promise<boolean> => {
  if (user.role === USER_ROLES.SUPER_ADMIN) return true;
  const permissions = await getEffectivePermissions(user);
  return permissions.has(permission);
};

export { getEffectivePermissions, hasPermission };
