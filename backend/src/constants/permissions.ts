const PERMISSIONS = {
  // Dashboard
  DASHBOARD_VIEW: "dashboard:view",

  // Products
  PRODUCT_VIEW: "product:view",
  PRODUCT_CREATE: "product:create",
  PRODUCT_UPDATE: "product:update",
  PRODUCT_DELETE: "product:delete",
  PRODUCT_PUBLISH: "product:publish",

  // Categories
  CATEGORY_VIEW: "category:view",
  CATEGORY_CREATE: "category:create",
  CATEGORY_UPDATE: "category:update",
  CATEGORY_DELETE: "category:delete",

  // Product Enquiry
  PRODUCT_ENQUIRY_VIEW: "product_enquiry:view",
  PRODUCT_ENQUIRY_UPDATE: "product_enquiry:update",
  PRODUCT_ENQUIRY_DELETE: "product_enquiry:delete",
  PRODUCT_ENQUIRY_ASSIGN: "product_enquiry:assign",

  // Stockist / Franchise Enquiry
  STOCKIST_ENQUIRY_VIEW: "stockist_enquiry:view",
  STOCKIST_ENQUIRY_UPDATE: "stockist_enquiry:update",
  STOCKIST_ENQUIRY_DELETE: "stockist_enquiry:delete",
  STOCKIST_ENQUIRY_ASSIGN: "stockist_enquiry:assign",
  FRANCHISE_ENQUIRY_VIEW: "franchise_enquiry:view",

  // Sales
  SALES_ENQUIRY_VIEW: "sales_enquiry:view",
  SALES_ENQUIRY_UPDATE: "sales_enquiry:update",
  SALES_ENQUIRY_DELETE: "sales_enquiry:delete",
  SALES_ENQUIRY_ASSIGN: "sales_enquiry:assign",

  // Career
  JOB_VIEW: "job:view",
  JOB_CREATE: "job:create",
  JOB_UPDATE: "job:update",
  JOB_DELETE: "job:delete",

  APPLICATION_VIEW: "application:view",
  APPLICATION_UPDATE: "application:update",
  APPLICATION_DOWNLOAD_RESUME: "application:download_resume",

  // Gallery
  GALLERY_VIEW: "gallery:view",
  GALLERY_CREATE: "gallery:create",
  GALLERY_UPDATE: "gallery:update",
  GALLERY_DELETE: "gallery:delete",

  // CMS
  CMS_VIEW: "cms:view",
  CMS_CREATE: "cms:create",
  CMS_UPDATE: "cms:update",
  CMS_DELETE: "cms:delete",
  PAGE_VIEW: "page:view",
  PAGE_UPDATE: "page:update",

  // Media
  MEDIA_VIEW: "media:view",
  MEDIA_UPLOAD: "media:upload",
  MEDIA_DELETE: "media:delete",

  // Users
  USER_VIEW: "user:view",
  USER_CREATE: "user:create",
  USER_UPDATE: "user:update",
  USER_DELETE: "user:delete",

  // Settings
  SETTINGS_VIEW: "settings:view",
  SETTINGS_UPDATE: "settings:update",
  ROLE_VIEW: "role:view",
  ROLE_CREATE: "role:create",
  ROLE_UPDATE: "role:update",
  ROLE_DELETE: "role:delete",
  PERMISSION_VIEW: "permission:view",
  PERMISSION_ASSIGN: "permission:assign",
  AUDIT_VIEW: "audit:view",
} as const;

type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];


export type { Permission };
export default PERMISSIONS;