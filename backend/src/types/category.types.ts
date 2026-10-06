import mongoose from "mongoose";
import type { IBaseDocument, IPaginatedResponse } from "./common.types";
import type { IAuthenticatedRequest } from "./express.types";

export interface ICategorySeo {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  canonicalUrl?: string;
}

export interface ICategory extends IBaseDocument {
  name: string;
  code?: string | null;
  slug: string;
  shortDescription?: string;
  description: string;
  image: string | null;
  imageId: mongoose.Types.ObjectId | null;
  bannerImage: string | null;
  bannerImageId: mongoose.Types.ObjectId | null;
  icon: string | null;
  sortOrder: number;
  isFeatured: boolean;
  showOnHome: boolean;
  showInMenu: boolean;
  seo?: ICategorySeo;
  isActive: boolean;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdBy: mongoose.Types.ObjectId | null;
  updatedBy: mongoose.Types.ObjectId | null;
  deletedBy: mongoose.Types.ObjectId | null;
}

export interface ICreateCategoryRequest {
  name: string;
  code?: string | null;
  slug?: string;
  shortDescription?: string;
  description?: string;
  image?: string | null;
  imageId?: string | null;
  bannerImage?: string | null;
  bannerImageId?: string | null;
  icon?: string | null;
  sortOrder?: number;
  isFeatured?: boolean;
  showOnHome?: boolean;
  showInMenu?: boolean;
  seo?: ICategorySeo;
  isActive?: boolean;
}

export interface IUpdateCategoryRequest {
  name?: string;
  code?: string | null;
  slug?: string;
  shortDescription?: string;
  description?: string;
  image?: string | null;
  imageId?: string | null;
  bannerImage?: string | null;
  bannerImageId?: string | null;
  icon?: string | null;
  sortOrder?: number;
  isFeatured?: boolean;
  showOnHome?: boolean;
  showInMenu?: boolean;
  seo?: ICategorySeo;
  isActive?: boolean;
}

export interface ICategoryQuery {
  page?: string;
  limit?: string;
  search?: string;
  isActive?: string;
  isFeatured?: string;
  showOnHome?: string;
  showInMenu?: string;
}

export interface ICategoryListResponse extends IPaginatedResponse<ICategory> {}

export interface ICategoryRequest extends IAuthenticatedRequest {
  validatedQuery?: ICategoryQuery;
}
