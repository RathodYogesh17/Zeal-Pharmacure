import type { Request } from "express";
import type { IAuthenticatedRequest } from "./express.types";

export interface IPermission {
  _id: string;
  key: string;
  name: string;
  module: string;
  action: string;
  description?: string;
  sortOrder: number;
  isSystemPermission: boolean;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IRole {
  _id: string;
  name: string;
  code: string;
  description: string;
  isSystemRole: boolean;
  sortOrder: number;
  isActive: boolean;
  createdBy?: string | null;
  updatedBy?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IRolePermission {
  _id: string;
  roleId: string;
  permissionId: string;
  isActive: boolean;
  assignedBy?: string | null;
  updatedBy?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICreateRoleRequest {
  name: string;
  code?: string;
  description?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface IUpdateRoleRequest {
  name?: string;
  code?: string;
  description?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface IAssignRolePermissionsRequest {
  permissionIds: string[];
}

export interface IUserPermission {
  _id: string;
  userId: string;
  permissionId: string;
  effect: "ALLOW" | "DENY";
  isActive: boolean;
  assignedBy?: string | null;
  updatedBy?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserPermissionOverrideItem {
  permissionId: string;
  effect?: "ALLOW" | "DENY";
  type?: "ALLOW" | "DENY";
  isActive?: boolean;
}

export interface IAssignUserPermissionsRequest {
  overrides: IUserPermissionOverrideItem[];
}

export interface ISettingsRequest extends IAuthenticatedRequest {}
