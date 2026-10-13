// Category Types
export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string | null;
  icon?: string | null;
  sortOrder?: number;
  isFeatured?: boolean;
  productCount?: number;
}

// SubCategory
export interface ISubCategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  categoryRef?: string;
}

export interface IProduct {
  _id: string;
  name: string;
  slug: string;
  productCode?: string;
  genericName: string;
  composition: string;
  strength?: string;
  manufacturer?: string;
  dosageForm: string;
  packaging: string;
  packSize?: { value?: number; unit?: string };
  category?: ICategory | string;
  subCategory?: ISubCategory | string | null;
  subCategoryName?: string;
  indications?: Array<{ _id: string; name: string; slug: string }> | string[];
  indicationTags?: string[];
  therapeuticClass?: string;
  shortDescription?: string;
  description?: string;
  howToUse?: string;
  sideEffects?: string;
  precautions?: string;
  contraindications?: string;
  warnings?: string;
  storage?: string;
  pregnancyInfo?: string;
  lactationInfo?: string;
  prescriptionType?: string;
  licenseNumber?: string;
  countryOfOrigin?: string;
  mrp?: number | null;
  featuredImage?: string | null;
  mediaGallery?: Array<any>;
  brochureUrl?: string | null;
  averageRating?: number;
  totalReviews?: number;
  isFeatured?: boolean;
  isNewLaunch?: boolean;
  isActive?: boolean;
  createdAt?: string;
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
  createdAt?: string;
}

// Enquiry Types
export interface IFranchiseEnquiryPayload {
  name?: string;
  fullName?: string;
  phone: string;
  whatsappNumber?: string;
  email: string;
  city: string;
  district?: string;
  preferredTerritory?: string;
  state: string;
  pincode?: string;
  address?: string;
  investmentBudget?: string;
  experienceYears?: string;
  pharmaExperience?: string;
  companyName?: string;
  businessType?: string;
  currentBusiness?: string;
  hasDrugLicense?: boolean;
  drugLicenseNumber?: string;
  hasGst?: boolean;
  gstNumber?: string;
  hasGodownFacility?: boolean;
  godownDetails?: string;
  hasTransportFacility?: boolean;
  transportDetails?: string;
  interestedDivisions?: string[];
  message?: string;
  source?: string;
  isConfirmed?: boolean;
}

export interface IGeneralEnquiryPayload {
  fullName: string;
  email: string;
  phone: string;
  subject?: string;
  message: string;
}

export interface IEnquiry {
  _id: string;
  enquiryType: string;
  name?: string;
  fullName?: string;
  email: string;
  phone: string;
  companyName?: string;
  product?: { _id: string; name: string; genericName?: string; slug?: string } | string | null;
  city?: string;
  district?: string;
  state?: string;
  territoryDistrict?: string;
  investmentBudget?: string;
  experienceYears?: string;
  pharmaExperience?: string;
  hasDrugLicense?: boolean;
  drugLicenseNumber?: string;
  hasGst?: boolean;
  gstNumber?: string;
  quantity?: string;
  message?: string;
  status: 'PENDING' | 'IN_TOUCH' | 'QUOTED' | 'CLOSED' | 'REJECTED';
  notes?: string;
  isConfirmed?: boolean;
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
  promoBanners?: {
    cardMonopoly?: string;
    warehouseDepot?: string;
    cardInstitutional?: string;
    promotionalKit?: string;
    productHeroSlide1?: string;
    productHeroSlide2?: string;
    productGummies?: string;
    productWellness?: string;
    productDiabetic?: string;
    productBiotin?: string;
    productRespiratory?: string;
    productPediatric?: string;
    productDerma?: string;
    warehouseRack?: string;
    productMultivitamin?: string;
    cardDiabetic?: string;
    cardBiotin?: string;
    cardRespiratory?: string;
    cardPediatric?: string;
    cardDerma?: string;
    [key: string]: string | undefined;
  };
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
  isActive?: boolean;
}

export interface IFaqItem {
  _id?: string;
  id?: string;
  category: string;
  question: string;
  answer: string;
  sortOrder?: number;
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
}

export interface ITestimonialItem {
  _id?: string;
  id?: string;
  name: string;
  role: string;
  clinic?: string;
  rating: number;
  comment: string;
  avatar?: string;
  verified?: boolean;
}

export interface IAboutContent {
  companyStory: string;
  mission: string;
  vision: string;
  directorName?: string;
  directorTitle?: string;
  directorMessage?: string;
  depotImage?: string;
  marketingKitImage?: string;
  leadershipImage?: string;
  heroImage?: string;
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
  designation?: string;
  department?: string;
  isEmailVerified?: boolean;
  lastLogin?: string | null;
  createdAt?: string;
}

export interface IAuthResponse {
  token: string;
  user: IUser;
}
