import type { Request } from "express";
import type { Types } from "mongoose";
import type { IAuthenticatedUser } from "./user.types";

export type PrescriptionType = "Rx" | "OTC" | "Schedule H" | "Schedule H1" | "General";
export type ProductStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";
export type AvailabilityStatus = "AVAILABLE" | "OUT_OF_STOCK" | "COMING_SOON" | "DISCONTINUED";

export interface IProductMediaItem {
  url: string;
  imageId?: Types.ObjectId | string | null;
  title?: string;
  altText?: string;
}

export interface IProductPackSize {
  value?: number | null;
  unit?: string;
}

export interface IProductSeo {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string | null;
}

export interface IProduct {
  _id: Types.ObjectId | string;
  name: string;
  slug: string;
  productCode?: string | null;
  brandName?: string;
  genericName?: string;
  manufacturer?: string;
  composition: string;
  strength?: string;
  dosageForm: Types.ObjectId | string | { _id: string; name: string };
  packaging: string;
  packSize?: IProductPackSize;
  category: Types.ObjectId | string;
  subCategory?: Types.ObjectId | string | null;
  subCategoryName?: string;
  indications?: Types.ObjectId[] | string[];
  indicationTags?: string[];
  therapeuticClass?: string;
  tags?: string[];
  searchKeywords?: string[];
  shortDescription?: string;
  description?: string;
  sideEffects?: string;
  howToUse?: string;
  precautions?: string;
  contraindications?: string;
  warnings?: string;
  storage?: string;
  pregnancyInfo?: string;
  lactationInfo?: string;
  prescriptionType: PrescriptionType;
  regulatoryInfo?: string;
  licenseNumber?: string;
  countryOfOrigin?: string;
  mrp?: number | null;
  availabilityStatus?: AvailabilityStatus;
  featuredImage?: string | null;
  featuredImageId?: Types.ObjectId | string | null;
  mediaGallery: IProductMediaItem[];
  brochureUrl?: string | null;
  brochureName?: string;
  averageRating: number;
  totalReviews: number;
  isFeatured: boolean;
  featuredOrder?: number;
  isNewLaunch: boolean;
  launchDate?: Date | null;
  allowEnquiry?: boolean;
  viewCount?: number;
  enquiryCount?: number;
  seo?: IProductSeo;
  status?: ProductStatus;
  publishedAt?: Date | null;
  isActive: boolean;
  isDeleted: boolean;
  deletedAt?: Date | null;
  createdBy?: Types.ObjectId | string | null;
  updatedBy?: Types.ObjectId | string | null;
  deletedBy?: Types.ObjectId | string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICreateProductRequest {
  name: string;
  slug?: string;
  productCode?: string | null;
  brandName?: string;
  genericName?: string;
  manufacturer?: string;
  composition: string;
  strength?: string;
  dosageForm: string;
  packaging: string;
  packSize?: IProductPackSize;
  category: string;
  subCategory?: string | null;
  subCategoryName?: string;
  indications?: string[] | string;
  indicationTags?: string[];
  therapeuticClass?: string;
  tags?: string[];
  searchKeywords?: string[];
  shortDescription?: string;
  description?: string;
  sideEffects?: string;
  howToUse?: string;
  precautions?: string;
  contraindications?: string;
  warnings?: string;
  storage?: string;
  pregnancyInfo?: string;
  lactationInfo?: string;
  prescriptionType?: PrescriptionType;
  regulatoryInfo?: string;
  licenseNumber?: string;
  countryOfOrigin?: string;
  mrp?: number | null;
  availabilityStatus?: AvailabilityStatus;
  featuredImage?: string | null;
  featuredImageId?: string | null;
  mediaGallery?: Array<{ url: string; imageId?: string | null; title?: string; altText?: string }>;
  brochureUrl?: string | null;
  brochureName?: string;
  averageRating?: number;
  totalReviews?: number;
  isFeatured?: boolean;
  featuredOrder?: number;
  isNewLaunch?: boolean;
  launchDate?: Date | string | null;
  allowEnquiry?: boolean;
  seo?: IProductSeo;
  status?: ProductStatus;
  isActive?: boolean;
}

export interface IUpdateProductRequest {
  name?: string;
  slug?: string;
  productCode?: string | null;
  brandName?: string;
  genericName?: string;
  manufacturer?: string;
  composition?: string;
  strength?: string;
  dosageForm?: string;
  packaging?: string;
  packSize?: IProductPackSize;
  category?: string;
  subCategory?: string | null;
  subCategoryName?: string;
  indications?: string[] | string;
  indicationTags?: string[];
  therapeuticClass?: string;
  tags?: string[];
  searchKeywords?: string[];
  shortDescription?: string;
  description?: string;
  sideEffects?: string;
  howToUse?: string;
  precautions?: string;
  contraindications?: string;
  warnings?: string;
  storage?: string;
  pregnancyInfo?: string;
  lactationInfo?: string;
  prescriptionType?: PrescriptionType;
  regulatoryInfo?: string;
  licenseNumber?: string;
  countryOfOrigin?: string;
  mrp?: number | null;
  availabilityStatus?: AvailabilityStatus;
  featuredImage?: string | null;
  featuredImageId?: string | null;
  mediaGallery?: Array<{ url: string; imageId?: string | null; title?: string; altText?: string }>;
  brochureUrl?: string | null;
  brochureName?: string;
  averageRating?: number;
  totalReviews?: number;
  isFeatured?: boolean;
  featuredOrder?: number;
  isNewLaunch?: boolean;
  launchDate?: Date | string | null;
  allowEnquiry?: boolean;
  seo?: IProductSeo;
  status?: ProductStatus;
  isActive?: boolean;
}

export interface IToggleProductStatusRequest {
  isActive?: boolean;
  isFeatured?: boolean;
  isNewLaunch?: boolean;
}

export interface IProductQuery {
  page?: string;
  limit?: string;
  search?: string;
  category?: string;
  subCategory?: string;
  division?: string;
  dosageForm?: string;
  indication?: string;
  therapeuticClass?: string;
  prescriptionType?: string;
  availabilityStatus?: string;
  status?: string;
  isFeatured?: string;
  isNewLaunch?: string;
  isActive?: string;
  sortBy?: "name" | "createdAt" | "isFeatured" | "averageRating" | "featuredOrder";
  sortOrder?: "asc" | "desc";
  letter?: string;
  startDate?: string;
  endDate?: string;
}

export interface IFiltersResponse {
  divisions: Array<{ name: string; count: number }>;
  dosageForms: Array<{ name: string; count: number }>;
  indications: Array<{ name: string; count: number }>;
  totalProducts: number;
}

export interface IProductRequest extends Request {
  user?: IAuthenticatedUser;
  validatedQuery?: IProductQuery;
}
