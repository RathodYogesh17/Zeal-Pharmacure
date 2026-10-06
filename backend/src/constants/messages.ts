const MESSAGES = {
  // Common
  SUCCESS: "Operation successful",

  // Auth
  LOGIN_SUCCESS: "Login successful",
  LOGOUT_SUCCESS: "Logout successful",
  REGISTRATION_SUCCESS: "Registration successful. You can now login.",
  INVALID_CREDENTIALS: "Invalid email or password",
  EMAIL_OR_PHONE_EXISTS: "Email or phone already registered",
  ACCOUNT_INACTIVE: "Account is inactive",

  // OTP and password
  OTP_NOT_FOUND: "OTP not found. Please request a new one.",
  OTP_EXPIRED: "OTP has expired",
  INVALID_OTP: "Invalid OTP",
  OTP_VERIFIED: "OTP verified successfully",
  LOGIN_OTP_SENT: "OTP sent to your email. Verify OTP to complete login.",
  LOGIN_OTP_DEV: "OTP generated in development mode. Use {otp} to complete login.",
  ADMIN_LOGIN_SUCCESS: "OTP verified successfully. Login successful.",
  PASSWORD_RESET_OTP_VERIFIED: "OTP verified successfully. You can now reset your password.",
  FORGOT_PASSWORD_SENT: "If the email exists, a password reset link has been sent",
  PASSWORD_CHANGED: "Password changed successfully",
  PASSWORD_RESET: "Password reset successfully",
  PASSWORD_RESET_SUCCESS: "Password reset successful. You can now login with your new password.",
  CURRENT_PASSWORD_INCORRECT: "Current password is incorrect",
  PASSWORD_SAME_AS_CURRENT: "New password must be different from current password",
  PASSWORD_CONFIRM_MISMATCH: "newPassword and confirmPassword must match",

  // User and staff CRUD
  UNAUTHORIZED: "Authentication required",
  FORBIDDEN: "You do not have permission",
  USER_NOT_FOUND: "User not found",
  STAFF_CREATED: "Staff user created successfully",
  USER_FETCHED: "User fetched successfully",
  USERS_FETCHED: "Users fetched successfully",
  USER_UPDATED: "User updated successfully",
  USER_DELETED: "User deleted successfully",
  USER_ACTIVATED: "User activated successfully",
  USER_DEACTIVATED: "User deactivated successfully",
  INVALID_USER_ID: "Invalid user ID",
  EMAIL_EXISTS: "Email already exists",
  PHONE_EXISTS: "Phone already exists",
  PUBLIC_USER_ONLY: "Public website registration can only create USER role. Use staff creation for admin roles.",
  STAFF_ROLE_ONLY: "Only staff roles can be created here",

  // Gallery and media
  GALLERY_UPLOADED: "Gallery images uploaded successfully",
  GALLERY_FETCHED: "Gallery images fetched successfully",
  GALLERY_DELETED: "Gallery image deleted successfully",
  MEDIA_REQUIRED: "At least one image is required",
  MEDIA_NOT_FOUND: "Gallery image not found",
  MEDIA_IN_USE: "Gallery image is currently in use and cannot be deleted",
  INVALID_MEDIA_ID: "Invalid media ID",

  // Category
  CATEGORY_CREATED: "Category created successfully",
  CATEGORY_FETCHED: "Category fetched successfully",
  CATEGORIES_FETCHED: "Categories fetched successfully",
  CATEGORY_UPDATED: "Category updated successfully",
  CATEGORY_DELETED: "Category deleted successfully",
  CATEGORY_NOT_FOUND: "Category not found",
  CATEGORY_ALREADY_EXISTS: "A category with this name already exists",
  INVALID_CATEGORY_ID: "Invalid category ID",

  // Product
  PRODUCT_CREATED: "Product created successfully",
  PRODUCT_FETCHED: "Product fetched successfully",
  PRODUCTS_FETCHED: "Products fetched successfully",
  PRODUCT_UPDATED: "Product updated successfully",
  PRODUCT_DELETED: "Product deleted successfully",
  PRODUCT_NOT_FOUND: "Product not found",
  PRODUCT_ALREADY_EXISTS: "A product with this name already exists",
  INVALID_PRODUCT_ID: "Invalid product ID",
  RELATED_PRODUCTS_FETCHED: "Related products fetched successfully",

  // Enquiry
  ENQUIRY_CREATED: "Enquiry submitted successfully. Our team will contact you soon.",
  ENQUIRY_FETCHED: "Enquiry fetched successfully",
  ENQUIRIES_FETCHED: "Enquiries fetched successfully",
  ENQUIRY_UPDATED: "Enquiry updated successfully",
  ENQUIRY_DELETED: "Enquiry deleted successfully",
  ENQUIRY_NOT_FOUND: "Enquiry not found",
  ENQUIRY_ASSIGNED: "Enquiry assigned to sales representative successfully",
  ENQUIRY_STATUS_UPDATED: "Enquiry status updated successfully",
  ENQUIRY_NOTE_ADDED: "Follow-up note added successfully",
  INVALID_ENQUIRY_ID: "Invalid enquiry ID",

  // Review & Ratings
  REVIEW_SUBMITTED: "Review submitted successfully and sent for admin verification",
  REVIEW_APPROVED: "Review approved successfully",
  REVIEW_REJECTED: "Review rejected successfully",
  REVIEW_DELETED: "Review deleted successfully",
  REVIEWS_FETCHED: "Reviews fetched successfully",
  REVIEW_NOT_FOUND: "Review not found",
  INVALID_REVIEW_ID: "Invalid review ID",

  // Careers & Job Openings
  JOB_CREATED: "Job vacancy created successfully",
  JOB_UPDATED: "Job vacancy updated successfully",
  JOB_DELETED: "Job vacancy deleted successfully",
  JOB_NOT_FOUND: "Job vacancy not found",
  JOBS_FETCHED: "Job vacancies fetched successfully",
  JOB_FETCHED: "Job vacancy fetched successfully",
  APPLICATION_SUBMITTED: "Job application submitted successfully. Zeal Pharma HR will contact you soon.",
  APPLICATIONS_FETCHED: "Job applications fetched successfully",
  APPLICATION_FETCHED: "Job application fetched successfully",
  APPLICATION_STATUS_UPDATED: "Candidate application status updated successfully",
  APPLICATION_NOTE_ADDED: "Candidate evaluation note added successfully",
  APPLICATION_NOT_FOUND: "Job application not found",
  APPLICATION_DELETED: "Job application deleted successfully",
  RESUME_REQUIRED: "Resume file (PDF or Word document) is required",
  INVALID_RESUME_TYPE: "Only PDF, DOC, and DOCX files are allowed for resumes",

  // CMS & Content
  CONTENT_FETCHED: "Content fetched successfully",
  CONTENT_CREATED: "Content created successfully",
  CONTENT_UPDATED: "Content updated successfully",
  CONTENT_DELETED: "Content deleted successfully",
  CONTENT_NOT_FOUND: "Content page or section not found",

  // Dashboard & Analytics
  DASHBOARD_STATS_FETCHED: "Dashboard overview and analytics fetched successfully",

  // Taxonomy & Filters
  FILTERS_FETCHED: "Product catalogue filters fetched successfully",

  // Middleware and system
  VALIDATION_ERROR: "Validation failed",
  INVALID_TOKEN: "Invalid or expired token",
  AUTHENTICATION_REQUIRED: "Authentication required",
  ACCESS_DENIED: "You are not allowed to access this resource",
  SERVER_ERROR: "Internal server error",
} as const;

export default MESSAGES;