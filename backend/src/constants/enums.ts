export const USER_ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  SALES_MANAGER: "SALES_MANAGER",
  HR_MANAGER: "HR_MANAGER",
  CONTENT_MANAGER: "CONTENT_MANAGER",
  EMPLOYEE: "EMPLOYEE",
  USER: "USER",
} as const;

type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export type { UserRole };