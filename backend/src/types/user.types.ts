import mongoose from "mongoose";
import type { Request } from "express";
import type { IBaseDocument, IPaginatedResponse } from "./common.types";

type UserRole =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "SALES_MANAGER"
  | "HR_MANAGER"
  | "CONTENT_MANAGER"
  | "EMPLOYEE"
  | "USER";

interface IUser extends IBaseDocument {
  name: string;
  email: string;
  phone: string;
  password?: string;
  passwordChangedAt?: Date | null;
  failedLoginAttempts?: number;
  lockedUntil?: Date | null;
  role: UserRole | mongoose.Types.ObjectId | { _id: mongoose.Types.ObjectId | string; name: string; code?: string };
  profileImage?: string | null;
  profileImageId?: mongoose.Types.ObjectId | null;
  designation?: string;
  department?: string;
  lastLogin?: Date | null;
  lastLoginIp?: string;
  lastActivityAt?: Date | null;
  resetPasswordToken?: string | null;
  resetPasswordExpires?: Date | null;
  isEmailVerified?: boolean;
  emailVerifiedAt?: Date | null;
  createdBy?: mongoose.Types.ObjectId | null;
  updatedBy?: mongoose.Types.ObjectId | null;
  deletedBy?: mongoose.Types.ObjectId | null;
}

interface IAuthenticatedUser {
  _id: mongoose.Types.ObjectId | string;
  role: UserRole;
  email: string;
  permissions: string[];
}

interface IUserRequest extends Request {
  user?: IAuthenticatedUser;
}

interface ICreateUserRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
  role?: UserRole | string;
  profileImage?: string | null;
  profileImageId?: string | null;
  designation?: string;
  department?: string;
}

interface IUpdateUserRequest {
  name?: string;
  email?: string;
  phone?: string;
  role?: UserRole | string;
  profileImage?: string | null;
  profileImageId?: string | null;
  designation?: string;
  department?: string;
}

interface IUserQuery {
  page?: string;
  limit?: string;
  search?: string;
  role?: UserRole | string;
  department?: string;
  isActive?: string;
}

type IUserListResponse = Omit<IPaginatedResponse<IUser>, "items"> & { users: IUser[] };

interface IServiceError {
  statusCode?: number;
  message?: string;
}

export type {
  UserRole,
  IUser,
  IAuthenticatedUser,
  IUserRequest,
  ICreateUserRequest,
  IUpdateUserRequest,
  IUserQuery,
  IUserListResponse,
  IServiceError,
};