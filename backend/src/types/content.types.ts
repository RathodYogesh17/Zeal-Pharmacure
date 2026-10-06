import type { Types } from "mongoose";

export type ContentType =
  | "PAGE"
  | "SECTION"
  | "BANNER"
  | "FAQ"
  | "POLICY"
  | "SETTING";

export type ContentStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface IBannerItem {
  id?: string | undefined;
  title: string;
  subtitle?: string | undefined;
  badge?: string | undefined;
  imageUrl: string;
  ctaText?: string | undefined;
  ctaLink?: string | undefined;
  sortOrder?: number | undefined;
  isActive?: boolean | undefined;
}

export interface IFaqItem {
  id?: string | undefined;
  question: string;
  answer: string;
  category?: string | undefined;
  sortOrder?: number | undefined;
}

export interface ICertificationItem {
  id?: string | undefined;
  title: string;
  code?: string | undefined;
  issuer?: string | undefined;
  validUntil?: string | undefined;
  badgeUrl?: string | undefined;
  description: string;
  documentUrl?: string | undefined;
}

export interface IAboutUsContent {
  companyStory: string;
  vision: string;
  mission: string;
  directorMessage?: string | undefined;
  directorName?: string | undefined;
  directorTitle?: string | undefined;
  directorImageUrl?: string | undefined;
  stats?: Array<{ label: string; value: string; icon?: string | undefined }> | undefined;
}

export interface IContactInfoContent {
  companyName: string;
  headOfficeAddress: string;
  plantAddress?: string | undefined;
  phone: string;
  salesHelpline: string;
  hrHelpline?: string | undefined;
  email: string;
  salesEmail: string;
  whatsappNumber: string;
  gstNumber?: string | undefined;
  drugLicenseNumber?: string | undefined;
  workingHours?: string | undefined;
  mapEmbedUrl?: string | undefined;
}

export interface IContentSeo {
  metaTitle?: string | undefined;
  metaDescription?: string | undefined;
  keywords?: string[] | undefined;
  canonicalUrl?: string | undefined;
  ogTitle?: string | undefined;
  ogDescription?: string | undefined;
  ogImage?: string | null | undefined;
}

export interface IContent {
  _id: Types.ObjectId | string;
  key: string;
  slug?: string | undefined;
  title: string;
  description?: string | undefined;
  contentType?: ContentType | undefined;
  section?: string | undefined;
  content: unknown;
  mediaIds?: Array<Types.ObjectId | string> | undefined;
  seo?: IContentSeo | undefined;
  metadata?: IContentSeo | undefined;
  sortOrder?: number | undefined;
  status?: ContentStatus | undefined;
  publishedAt?: Date | null | undefined;
  scheduledAt?: Date | null | undefined;
  isActive: boolean;
  createdBy?: Types.ObjectId | string | null | undefined;
  updatedBy?: Types.ObjectId | string | null | undefined;
  isDeleted?: boolean | undefined;
  deletedAt?: Date | null | undefined;
  deletedBy?: Types.ObjectId | string | null | undefined;
  createdAt?: Date | undefined;
  updatedAt?: Date | undefined;
}

export interface ICreateContentRequest {
  key: string;
  slug?: string | undefined;
  title: string;
  description?: string | undefined;
  contentType?: ContentType | undefined;
  section?: string | undefined;
  content: unknown;
  mediaIds?: string[] | undefined;
  seo?: IContentSeo | undefined;
  metadata?: IContentSeo | undefined;
  sortOrder?: number | undefined;
  status?: ContentStatus | undefined;
  publishedAt?: Date | string | null | undefined;
  scheduledAt?: Date | string | null | undefined;
  isActive?: boolean | undefined;
}

export interface IUpdateContentRequest {
  title?: string | undefined;
  slug?: string | undefined;
  description?: string | undefined;
  contentType?: ContentType | undefined;
  section?: string | undefined;
  content?: unknown;
  mediaIds?: string[] | undefined;
  seo?: IContentSeo | undefined;
  metadata?: IContentSeo | undefined;
  sortOrder?: number | undefined;
  status?: ContentStatus | undefined;
  publishedAt?: Date | string | null | undefined;
  scheduledAt?: Date | string | null | undefined;
  isActive?: boolean | undefined;
}

export interface IContentQuery {
  page?: string | undefined;
  limit?: string | undefined;
  search?: string | undefined;
  contentType?: string | undefined;
  section?: string | undefined;
  status?: string | undefined;
  isActive?: string | undefined;
}
