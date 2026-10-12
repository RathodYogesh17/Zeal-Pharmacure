// Category Types
export interface ICategorySeo {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  canonicalUrl?: string;
}

export interface ICategory {
  _id: string;
  name: string;
  code?: string | null;
  slug: string;
  shortDescription?: string;
  description?: string;
  image?: string | null;
  bannerImage?: string | null;
  icon?: string | null;
  sortOrder?: number;
  isFeatured?: boolean;
  showOnHome?: boolean;
  showInMenu?: boolean;
  seo?: ICategorySeo;
  isActive?: boolean;
  productCount?: number;
  createdBy?: { _id?: string; name?: string; email?: string; role?: string } | string | null;
  updatedBy?: { _id?: string; name?: string; email?: string; role?: string } | string | null;
  createdAt?: string;
  updatedAt?: string;
}

// SubCategory
export interface ISubCategory {
  _id: string;
  name: string;
  code?: string | null;
  slug: string;
  shortDescription?: string;
  description?: string;
  category?: string | { _id: string; name: string };
  categoryRef?: string;
  image?: string | null;
  bannerImage?: string | null;
  sortOrder?: number;
  isFeatured?: boolean;
  showOnHome?: boolean;
  showInMenu?: boolean;
  seo?: ICategorySeo;
  isActive?: boolean;
  createdBy?: { _id?: string; name?: string; email?: string; role?: string } | string | null;
  updatedBy?: { _id?: string; name?: string; email?: string; role?: string } | string | null;
  createdAt?: string;
  updatedAt?: string;
}

// Product Types
export interface IProductPackSize {
  value?: number | null;
  unit?: string;
}

export interface IProductMediaItem {
  url: string;
  imageId?: string | null;
  title?: string;
  altText?: string;
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
  _id: string;
  name: string;
  slug: string;
  productCode?: string | null;
  brandName?: string;
  genericName: string;
  manufacturer?: string;
  composition: string;
  strength?: string;
  dosageForm: string;
  packaging: string;
  packSize?: IProductPackSize;
  category?: ICategory | string;
  subCategory?: ISubCategory | string | null;
  subCategoryName?: string;
  indications?: Array<{ _id: string; name: string; slug: string }> | string[];
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
  prescriptionType?: 'Rx' | 'OTC' | 'Schedule H' | 'Schedule H1' | 'General' | string;
  regulatoryInfo?: string;
  licenseNumber?: string;
  countryOfOrigin?: string;
  mrp?: number | null;
  availabilityStatus?: 'AVAILABLE' | 'OUT_OF_STOCK' | 'COMING_SOON' | 'DISCONTINUED';
  featuredImage?: string | null;
  featuredImageId?: string | null;
  mediaGallery?: Array<IProductMediaItem | string>;
  brochureUrl?: string | null;
  brochureName?: string;
  averageRating?: number;
  totalReviews?: number;
  isFeatured?: boolean;
  featuredOrder?: number;
  isNewLaunch?: boolean;
  launchDate?: string | Date | null;
  allowEnquiry?: boolean;
  viewCount?: number;
  enquiryCount?: number;
  seo?: IProductSeo;
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  publishedAt?: string | Date | null;
  isActive?: boolean;
  isDeleted?: boolean;
  deletedAt?: string | Date | null;
  createdBy?: any;
  updatedBy?: any;
  createdAt?: string;
  updatedAt?: string;
}

export interface IProductsResponse {
  products: IProduct[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Career Types
export interface IJobOpening {
  _id: string;
  title: string;
  code?: string;
  slug: string;
  shortDescription?: string;
  department: string;
  location: string;
  jobType: string;
  experienceRequired: string;
  openingsCount: number;
  salaryRange?: string;
  qualificationRequired?: string;
  responsibilities: string[];
  requirements: string[];
  skills?: string[];
  benefits?: string[];
  applicationEmail?: string;
  applicationDeadline?: string | Date | null;
  description: string;
  status: 'OPEN' | 'CLOSED' | 'DRAFT';
  publishedAt?: string | Date | null;
  sortOrder?: number;
  isActive: boolean;
  isFeatured?: boolean;
  viewsCount?: number;
  applicationCount?: number;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
    canonicalUrl?: string;
  };
  createdAt?: string;
  updatedAt?: string;
  createdBy?: any;
  updatedBy?: any;
}

export interface IInterviewRound {
  _id?: string;
  roundName: string;
  interviewDate?: string | Date | null;
  mode?: "ONLINE" | "OFFLINE" | "PHONE";
  meetingLink?: string;
  interviewer?: any;
  status?: "SCHEDULED" | "COMPLETED" | "CANCELLED" | "RESCHEDULED";
  feedback?: string;
  rating?: number | null;
  notes?: string;
}

export interface ICareerApplication {
  _id: string;
  applicationCode?: string;
  fullName: string;
  email: string;
  phone: string;
  jobId?: string;
  jobOpening?: any;
  jobTitle?: string;
  positionAppliedFor?: string;
  department?: string;
  skills?: string[];
  qualification?: string;
  totalExperience?: string;
  totalExperienceYears?: string;
  currentCompany?: string;
  currentDesignation?: string;
  currentCtc?: string;
  expectedCtc?: string;
  noticePeriodDays?: number;
  noticePeriod?: string;
  currentCity?: string;
  currentState?: string;
  preferredLocation?: string;
  whatsappNumber?: string;
  resumeMediaId?: string | null;
  resumeUrl?: string;
  resumeFileName?: string;
  resumeOriginalName?: string;
  coverNote?: string;
  coverLetter?: string;
  status: string;
  interviewDate?: string | Date | null;
  interviewRounds?: IInterviewRound[];
  internalNotes?: Array<{
    _id?: string;
    note: string;
    addedBy?: any;
    addedAt?: string;
  }>;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: any;
  updatedBy?: any;
}

// Enquiry Types
export interface IFranchiseEnquiryPayload {
  fullName: string;
  phone: string;
  email: string;
  city: string;
  district: string;
  state: string;
  investmentBudget: string;
  experienceYears?: string;
  hasDrugLicense?: boolean;
  drugLicenseNumber?: string;
  hasGst?: boolean;
  gstNumber?: string;
  message?: string;
}

export interface IGeneralEnquiryPayload {
  fullName: string;
  email: string;
  phone: string;
  subject?: string;
  message: string;
}

export type EnquiryStatus =
  | 'NEW'
  | 'CONTACTED'
  | 'IN_TOUCH'
  | 'IN_PROGRESS'
  | 'QUALIFIED'
  | 'DOCUMENTS_PENDING'
  | 'QUOTED'
  | 'FOLLOW_UP'
  | 'APPROVED'
  | 'REJECTED'
  | 'ON_HOLD'
  | 'CLOSED'
  | 'PENDING';

export interface IEnquiryNote {
  _id?: string;
  note: string;
  addedBy?: {
    _id?: string;
    name?: string;
    email?: string;
    role?: string;
  } | string;
  addedAt: string;
}

export interface IEnquiry {
  _id: string;
  enquiryType: string;
  enquiryCategory?: 'FRANCHISE' | 'PRODUCT' | 'GENERAL' | string;
  name?: string;
  fullName?: string;
  email: string;
  phone: string;
  whatsappNumber?: string;
  companyName?: string;
  product?: {
    _id: string;
    name: string;
    genericName?: string;
    slug?: string;
    dosageForm?: string;
    packaging?: string;
    featuredImage?: string;
    category?: any;
  } | string | null;
  products?: Array<{
    _id?: string;
    product: {
      _id: string;
      name: string;
      genericName?: string;
      slug?: string;
      dosageForm?: string;
      packaging?: string;
      featuredImage?: string;
      category?: any;
    } | string;
    quantity?: number | null;
    quantityUnit?: string;
    message?: string;
  }>;
  positionAppliedFor?: string;
  department?: string;
  qualification?: string;
  totalExperienceYears?: string | number;
  currentCompany?: string;
  currentDesignation?: string;
  currentCtc?: string;
  expectedCtc?: string;
  noticePeriod?: string;
  resumeUrl?: string;
  coverLetter?: string;
  skills?: string[];
  interviewRounds?: IInterviewRound[];
  interestedProducts?: Array<{ _id: string; name: string; genericName?: string; slug?: string } | string>;
  city?: string;
  district?: string;
  state?: string;
  address?: string;
  pincode?: string;
  territoryDistrict?: string;
  preferredTerritory?: string;
  investmentBudget?: string;
  experienceYears?: string;
  pharmaExperience?: string;
  currentBusiness?: string;
  businessType?: string;
  interestedDivisions?: string[];
  hasGodownFacility?: boolean;
  godownDetails?: string;
  hasTransportFacility?: boolean;
  transportDetails?: string;
  hasDrugLicense?: boolean;
  drugLicenseNumber?: string;
  hasGst?: boolean;
  gstNumber?: string;
  quantity?: string | number | null;
  quantityUnit?: string;
  message?: string;
  status: EnquiryStatus;
  source?: string;
  assignedTo?: {
    _id?: string;
    name?: string;
    email?: string;
    phone?: string;
  } | string | null;
  assignedBy?: any;
  assignedAt?: string | null;
  nextFollowUpAt?: string | null;
  lastContactedAt?: string | null;
  internalNotes?: IEnquiryNote[];
  notes?: string;
  isConfirmed?: boolean;
  confirmedAt?: string | null;
  instantWhatsAppChatUrl?: string;
  handledBy?: any;
  statusHistory?: any[];
  createdBy?: any;
  updatedBy?: any;
  createdAt?: string;
  updatedAt?: string;
}

// CMS & Content Types
export interface ISiteSettings {
  companyName: string;
  tagline: string;
  logoUrl?: string;
  phone: string;
  salesHelpline: string;
  hrHelpline: string;
  email: string;
  salesEmail: string;
  whatsappNumber: string;
  headOfficeAddress: string;
  plantAddress: string;
  workingHours: string;
  gstNumber?: string;
  drugLicenseNumber?: string;
  primaryCtaText?: string;
  primaryCtaLink?: string;
}

export interface IBannerItem {
  _id?: string;
  id?: string;
  title: string;
  subtitle: string;
  badge?: string;
  imageUrl?: string;
  ctaText?: string;
  ctaLink?: string;
  sortOrder?: number;
  order?: number;
  isActive?: boolean;
}

export interface IFaqItem {
  _id?: string;
  id?: string;
  category: string;
  question: string;
  answer: string;
  sortOrder?: number;
  order?: number;
}

export interface ICertificationItem {
  _id?: string;
  id?: string;
  title: string;
  code?: string;
  certificateNumber?: string;
  issuer: string;
  validUntil: string;
  description: string;
  icon?: string;
}

export interface IAboutContent {
  companyStory: string;
  mission: string;
  vision: string;
  directorName?: string;
  directorTitle?: string;
  directorMessage?: string;
  stats?: Array<{ label: string; value: string; icon?: string }>;
}

export interface ICmsItem {
  _id?: string;
  key: string;
  title: string;
  content: any;
  metadata?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  isActive?: boolean;
  updatedAt?: string;
}

// User & Auth
export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  profileImage?: string | null;
  profileImageId?: string | null;
}

export interface IAuthResponse {
  token: string;
  user: IUser;
}
