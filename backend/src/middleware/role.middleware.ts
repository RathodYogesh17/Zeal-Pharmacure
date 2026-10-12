import HTTP_STATUS from "../constants/httpStatus";
import { USER_ROLES } from "../constants/enums";
import MESSAGES from "../constants/messages";
import type { Permission } from "../constants/permissions";
import type { IAuthenticatedRequest } from "../types/express.types";

const allowedStaffRoles = [
  USER_ROLES.SUPER_ADMIN,
  USER_ROLES.ADMIN,
  USER_ROLES.SALES_MANAGER,
  USER_ROLES.HR_MANAGER,
  USER_ROLES.CONTENT_MANAGER,
  USER_ROLES.EMPLOYEE,
];

const requireRoles = (...roles: string[]) => {
  return ( req: IAuthenticatedRequest, res: import("express").Response, next: import("express").NextFunction
  ): void => {
    if (!req.user) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({ success: false, message: MESSAGES.AUTHENTICATION_REQUIRED });
      return;
    }
    if (!roles.includes(req.user.role)) {
      res.status(HTTP_STATUS.FORBIDDEN).json({ success: false, message: MESSAGES.ACCESS_DENIED });
      return;
    }
    next();
  };
};

const requireAdminAccess = requireRoles(...allowedStaffRoles);
const requireSuperAdmin = requireRoles(USER_ROLES.SUPER_ADMIN);

const requirePermissions = (...permissions: (Permission | string)[]) => {
  return (
    req: IAuthenticatedRequest,
    res: import("express").Response,
    next: import("express").NextFunction
  ): void => {
    if (!req.user) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({ success: false, message: MESSAGES.AUTHENTICATION_REQUIRED });
      return;
    }
    if (req.user.role === USER_ROLES.SUPER_ADMIN) {
      next();
      return;
    }

    const grantedPermissions = req.user.permissions || [];
    if (grantedPermissions.includes("*")) {
      next();
      return;
    }

    const hasAllPermissions = permissions.every((permission) =>
      grantedPermissions.includes(permission as Permission)
    );
    if (!hasAllPermissions) {
      res.status(HTTP_STATUS.FORBIDDEN).json({ success: false, message: MESSAGES.FORBIDDEN });
      return;
    }
    next();
  };
};

const requireAnyPermission = (...permissions: (Permission | string)[]) => {
  return (
    req: IAuthenticatedRequest,
    res: import("express").Response,
    next: import("express").NextFunction
  ): void => {
    if (!req.user) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({ success: false, message: MESSAGES.AUTHENTICATION_REQUIRED });
      return;
    }
    if (req.user.role === USER_ROLES.SUPER_ADMIN) {
      next();
      return;
    }

    const grantedPermissions = req.user.permissions || [];
    if (grantedPermissions.includes("*")) {
      next();
      return;
    }

    const hasAnyPermission = permissions.some((permission) =>
      grantedPermissions.includes(permission as Permission)
    );
    if (!hasAnyPermission) {
      res.status(HTTP_STATUS.FORBIDDEN).json({ success: false, message: MESSAGES.FORBIDDEN });
      return;
    }
    next();
  };
};

export {
  requireRoles,
  requireAdminAccess,
  requireSuperAdmin,
  requirePermissions,
  requireAnyPermission,
};