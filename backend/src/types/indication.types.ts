import type { Request } from "express";
import type { Types } from "mongoose";
import type { IAuthenticatedUser } from "./user.types";

export interface IIndicationSeo {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  canonicalUrl?: string;
}

export interface IIndication {
  _id: Types.ObjectId | string;
  name: string;
  code?: string | null;
  slug: string;
  shortDescription?: string;
  description?: string;
  category: Types.ObjectId | string;
  subCategory?: Types.ObjectId | string | null;
  sortOrder: number;
  isFeatured: boolean;
  showOnHome: boolean;
  seo?: IIndicationSeo;
  isActive: boolean;
  isDeleted: boolean;
  deletedAt?: Date | null;
  createdBy?: Types.ObjectId | string | null;
  updatedBy?: Types.ObjectId | string | null;
  deletedBy?: Types.ObjectId | string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICreateIndicationRequest {
  name: string;
  code?: string | null;
  slug?: string;
  shortDescription?: string;
  description?: string;
  category: string;
  subCategory?: string | null;
  sortOrder?: number;
  isFeatured?: boolean;
  showOnHome?: boolean;
  seo?: IIndicationSeo;
  isActive?: boolean;
}

export interface IUpdateIndicationRequest {
  name?: string;
  code?: string | null;
  slug?: string;
  shortDescription?: string;
  description?: string;
  category?: string | null;
  subCategory?: string | null;
  sortOrder?: number;
  isFeatured?: boolean;
  showOnHome?: boolean;
  seo?: IIndicationSeo;
  isActive?: boolean;
}

export interface IIndicationQuery {
  page?: string;
  limit?: string;
  search?: string;
  category?: string;
  subCategory?: string;
  isActive?: string;
  isFeatured?: string;
  showOnHome?: string;
}

export interface IIndicationRequest extends Request {
  user?: IAuthenticatedUser;
  validatedQuery?: IIndicationQuery;
}
