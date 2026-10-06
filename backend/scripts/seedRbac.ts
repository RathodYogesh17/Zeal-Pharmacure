import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import connectDatabase from "../src/config/database/database";
import { USER_ROLES, type UserRole } from "../src/constants/enums";
import PERMISSIONS, { type Permission } from "../src/constants/permissions";
import { ROLE_PERMISSIONS } from "../src/constants/rolePermissions";
import PermissionModel from "../src/models/permission.model";
import Role from "../src/models/role.model";
import RolePermission from "../src/models/rolePermission.model";

const envPath = [
  path.resolve(process.cwd(), ".env"),
  path.resolve(process.cwd(), "..", ".env"),
].find((filePath) => fs.existsSync(filePath));

dotenv.config(envPath ? { path: envPath } : {});

const getPermissionDetails = (key: Permission) => {
  const parts = key.split(":");
  const module = parts[0] || "general";
  const action = parts[1] || "manage";
  return { module, action };
};

const formatPermissionName = (action: string, module: string): string => {
  const formatWord = (w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
  return `${formatWord(action)} ${formatWord(module)}`;
};

const seedRbac = async (): Promise<void> => {
  await connectDatabase();

  const permissionDocuments = await Promise.all(
    (Object.values(PERMISSIONS) as Permission[]).map(async (key, index) => {
      const details = getPermissionDetails(key);
      const name = formatPermissionName(details.action, details.module);
      return PermissionModel.findOneAndUpdate(
        { key },
        {
          key,
          name,
          ...details,
          description: `${details.action} ${details.module}`,
          sortOrder: index * 10,
          isSystemPermission: true,
          isActive: true,
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      ).lean();
    })
  );

  const permissionByKey = new Map(permissionDocuments.map((permission) => [permission.key, permission._id]));

  const rolesList = Object.values(USER_ROLES) as UserRole[];
  for (let index = 0; index < rolesList.length; index++) {
    const role = rolesList[index] as UserRole;
    const roleDocument = await Role.findOneAndUpdate(
      { name: role },
      {
        name: role,
        code: role,
        description: `${role} role`,
        isSystemRole: true,
        sortOrder: index * 10,
        isActive: true,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    if (roleDocument) {
      await RolePermission.deleteMany({ roleId: roleDocument._id });
      const rolePermissions = ROLE_PERMISSIONS[role] === "ALL"
        ? (Object.values(PERMISSIONS) as Permission[])
        : ROLE_PERMISSIONS[role];
      const mappings = rolePermissions
        .map((key: Permission) => ({
          roleId: roleDocument._id,
          permissionId: permissionByKey.get(key),
          isActive: true,
        }))
        .filter((mapping): mapping is { roleId: typeof roleDocument._id; permissionId: NonNullable<typeof mapping.permissionId>; isActive: boolean } => Boolean(mapping.permissionId));

      if (mappings.length > 0) {
        await RolePermission.insertMany(mappings, { ordered: false });
      }
    }
  }

  console.log("RBAC roles, permissions, and mappings seeded successfully");
  process.exit(0);
};

seedRbac().catch((error: unknown) => {
  console.error("RBAC seed failed:", error);
  process.exit(1);
});