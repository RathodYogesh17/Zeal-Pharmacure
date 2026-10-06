import type { Request } from "express";
import type { Types } from "mongoose";
import type { IAuthenticatedUser } from "./user.types";

export type ProductEnquiryType = "SINGLE_PRODUCT" | "BULK_PRODUCT";
export type ProductEnquiryStatus =
  | "NEW"
  | "IN_PROGRESS"
  | "QUOTED"
  | "FOLLOW_UP"
  | "CLOSED"
  | "REJECTED";

export type FranchiseBusinessType =
  | "INDIVIDUAL"
  | "PROPRIETORSHIP"
  | "PARTNERSHIP"
  | "PRIVATE_LIMITED"
  | "LLP"
  | "OTHER";

export type FranchiseEnquiryStatus =
  | "NEW"
  | "CONTACTED"
  | "QUALIFIED"
  | "DOCUMENTS_PENDING"
  | "APPROVED"
  | "REJECTED"
  | "ON_HOLD"
  | "CLOSED";

// Backwards compatibility types
export type EnquiryType = "PRODUCT" | "FRANCHISE" | "THIRD_PARTY" | "GENERAL" | ProductEnquiryType;
export type EnquiryStatus =
  | "PENDING"
  | "IN_TOUCH"
  | "QUOTED"
  | "CLOSED"
  | "REJECTED"
  | ProductEnquiryStatus
  | FranchiseEnquiryStatus;

export interface IEnquiryNote {
  _id?: Types.ObjectId | string;
  note: string;
  addedBy: Types.ObjectId | string;
  addedAt: Date;
}

export interface IProductItem {
  _id?: Types.ObjectId | string;
  product: Types.ObjectId | string;
  quantity?: number | null;
  quantityUnit?: string;
  message?: string;
}

// =====================================================
// PRODUCT ENQUIRY
// =====================================================
export interface IProductEnquiry {
  _id: Types.ObjectId | string;
  enquiryType: ProductEnquiryType;
  product?: Types.ObjectId | string | null;
  products?: IProductItem[];
  name: string;
  email: string;
  phone: string;
  whatsappNumber?: string;
  companyName?: string;
  city: string;
  state: string;
  pincode?: string;
  drugLicenseNumber?: string;
  gstNumber?: string;
  quantity?: number | null;
  quantityUnit?: string;
  message?: string;
  status: ProductEnquiryStatus;
  assignedTo?: Types.ObjectId | string | null;
  assignedBy?: Types.ObjectId | string | null;
  assignedAt?: Date | null;
  internalNotes: IEnquiryNote[];
  source?: string;
  isConfirmed?: boolean;
  confirmedAt?: Date | null;
  isDeleted: boolean;
  deletedAt?: Date | null;
  deletedBy?: Types.ObjectId | string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICreateProductEnquiryRequest {
  enquiryType?: ProductEnquiryType;
  productId?: string;
  productSlug?: string;
  products?: Array<{
    productId: string;
    quantity?: number;
    quantityUnit?: string;
    message?: string;
  }>;
  name: string;
  email: string;
  phone: string;
  whatsappNumber?: string;
  companyName?: string;
  city: string;
  state: string;
  pincode?: string;
  drugLicenseNumber?: string;
  gstNumber?: string;
  quantity?: number | string | null;
  quantityUnit?: string;
  message?: string;
  source?: string;
  isConfirmed?: boolean;
}

// =====================================================
// FRANCHISE ENQUIRY
// =====================================================
export interface IFranchiseEnquiry {
  _id: Types.ObjectId | string;
  name: string;
  email: string;
  phone: string;
  whatsappNumber?: string;
  companyName?: string;
  businessType?: FranchiseBusinessType;
  drugLicenseNumber?: string;
  gstNumber?: string;
  address?: string;
  city: string;
  state: string;
  district?: string;
  pincode?: string;
  pharmaExperience?: string;
  currentBusiness?: string;
  investmentBudget?: string;
  interestedDivisions?: string[];
  hasGodownFacility?: boolean;
  godownDetails?: string;
  hasTransportFacility?: boolean;
  transportDetails?: string;
  preferredTerritory?: string;
  interestedProducts?: Array<Types.ObjectId | string>;
  message?: string;
  status: FranchiseEnquiryStatus;
  assignedTo?: Types.ObjectId | string | null;
  assignedBy?: Types.ObjectId | string | null;
  assignedAt?: Date | null;
  nextFollowUpAt?: Date | null;
  lastContactedAt?: Date | null;
  internalNotes: IEnquiryNote[];
  source?: string;
  isConfirmed?: boolean;
  confirmedAt?: Date | null;
  isDeleted: boolean;
  deletedAt?: Date | null;
  deletedBy?: Types.ObjectId | string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICreateFranchiseEnquiryRequest {
  name: string;
  email: string;
  phone: string;
  whatsappNumber?: string;
  companyName?: string;
  businessType?: FranchiseBusinessType;
  drugLicenseNumber?: string;
  gstNumber?: string;
  address?: string;
  city: string;
  state: string;
  district?: string;
  territoryDistrict?: string; // backwards compatibility alias
  pincode?: string;
  pharmaExperience?: string;
  currentBusiness?: string;
  investmentBudget?: string;
  interestedDivisions?: string[];
  hasGodownFacility?: boolean;
  godownDetails?: string;
  hasTransportFacility?: boolean;
  transportDetails?: string;
  preferredTerritory?: string;
  interestedProducts?: string[];
  message?: string;
  source?: string;
  isConfirmed?: boolean;
}

// Generic legacy alias
export interface IEnquiry extends IProductEnquiry {
  territoryDistrict?: string;
  investmentBudget?: string;
  pharmaExperience?: string;
  interestedDivisions?: string[];
  hasGodownFacility?: boolean;
  hasTransportFacility?: boolean;
}

export interface ICreateEnquiryRequest {
  enquiryType?: EnquiryType | undefined;
  productId?: string | undefined;
  productSlug?: string | undefined;
  products?: Array<{
    productId: string;
    quantity?: number;
    quantityUnit?: string;
    message?: string;
  }> | undefined;
  name: string;
  email: string;
  phone: string;
  whatsappNumber?: string | undefined;
  companyName?: string | undefined;
  businessType?: FranchiseBusinessType | undefined;
  drugLicenseNumber?: string | undefined;
  gstNumber?: string | undefined;
  address?: string | undefined;
  city: string;
  state: string;
  district?: string | undefined;
  pincode?: string | undefined;
  territoryDistrict?: string | undefined;
  investmentBudget?: string | undefined;
  pharmaExperience?: string | undefined;
  interestedDivisions?: string[] | undefined;
  hasGodownFacility?: boolean | undefined;
  godownDetails?: string | undefined;
  hasTransportFacility?: boolean | undefined;
  transportDetails?: string | undefined;
  preferredTerritory?: string | undefined;
  interestedProducts?: string[] | undefined;
  quantity?: number | string | null | undefined;
  quantityUnit?: string | undefined;
  message?: string | undefined;
  source?: string | undefined;
  isConfirmed?: boolean | undefined;
}

export interface IUpdateEnquiryStatusRequest {
  status: string;
  note?: string;
  nextFollowUpAt?: Date | string | null;
  notifyClient?: boolean;
  customWhatsAppMessage?: string;
}

export interface IAssignEnquiryRequest {
  assignedTo: string; // User ObjectId
  note?: string;
}

export interface IAddEnquiryNoteRequest {
  note: string;
}

export interface IEnquiryQuery {
  page?: string;
  limit?: string;
  search?: string;
  category?: "product" | "franchise" | "all";
  status?: string;
  enquiryType?: string;
  productId?: string;
  assignedTo?: string;
  city?: string;
  state?: string;
  district?: string;
  startDate?: string;
  endDate?: string;
}

export interface IEnquiryRequest extends Request {
  user?: IAuthenticatedUser;
  validatedQuery?: IEnquiryQuery;
}
