import type { Request } from "express";
import type { Types } from "mongoose";
import type { IAuthenticatedUser } from "./user.types";

export interface ISubCategorySeo {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  canonicalUrl?: string;
}

export interface ISubCategory {
  _id: Types.ObjectId | string;
  name: string;
  code?: string | null;
  slug: string;
  shortDescription?: string;
  description?: string;
  category: Types.ObjectId | string;
  image?: string | null;
  imageId?: Types.ObjectId | string | null;
  bannerImage?: string | null;
  bannerImageId?: Types.ObjectId | string | null;
  sortOrder: number;
  isFeatured: boolean;
  showOnHome: boolean;
  showInMenu: boolean;
  seo?: ISubCategorySeo;
  isActive: boolean;
  isDeleted: boolean;
  deletedAt?: Date | null;
  createdBy?: Types.ObjectId | string | null;
  updatedBy?: Types.ObjectId | string | null;
  deletedBy?: Types.ObjectId | string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICreateSubCategoryRequest {
  name: string;
  code?: string | null;
  slug?: string;
  shortDescription?: string;
  description?: string;
  category: string; // ObjectId of parent Category
  image?: string | null;
  imageId?: string | null;
  bannerImage?: string | null;
  bannerImageId?: string | null;
  sortOrder?: number;
  isFeatured?: boolean;
  showOnHome?: boolean;
  showInMenu?: boolean;
  seo?: ISubCategorySeo;
  isActive?: boolean;
}

export interface IUpdateSubCategoryRequest {
  name?: string;
  code?: string | null;
  slug?: string;
  shortDescription?: string;
  description?: string;
  category?: string;
  image?: string | null;
  imageId?: string | null;
  bannerImage?: string | null;
  bannerImageId?: string | null;
  sortOrder?: number;
  isFeatured?: boolean;
  showOnHome?: boolean;
  showInMenu?: boolean;
  seo?: ISubCategorySeo;
  isActive?: boolean;
}

export interface ISubCategoryQuery {
  page?: string;
  limit?: string;
  search?: string;
  category?: string; // Filter by parent Category ID or slug
  isActive?: string;
  isFeatured?: string;
  showOnHome?: string;
  showInMenu?: string;
}

export interface ISubCategoryRequest extends Request {
  user?: IAuthenticatedUser;
  validatedQuery?: ISubCategoryQuery;
}
