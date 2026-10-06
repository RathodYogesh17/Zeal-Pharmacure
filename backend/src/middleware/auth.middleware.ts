import jwt from "jsonwebtoken";
import User from "../models/user.model";
import HTTP_STATUS from "../constants/httpStatus";
import MESSAGES from "../constants/messages";
import type { IAuthenticatedRequest } from "../types/express.types";
import { getEffectivePermissions } from "../services/permission.service";

const authMiddleware = async (
  req: IAuthenticatedRequest,
  res: import("express").Response,
  next: import("express").NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
    if (!token) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({ success: false, message: MESSAGES.UNAUTHORIZED, });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET || "access_secret") as { _id: string; email: string;  role: string;};
    const user = await User.findById(decoded._id).select("-password").populate("role", "name code").lean();
    if (!user || user.isDeleted || !user.isActive) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({ success: false, message: MESSAGES.UNAUTHORIZED, });
      return;
    }
    const roleName = ((user.role as { name?: string })?.name || decoded.role || "USER") as import("../constants/enums").UserRole;
    const effectivePermissions = await getEffectivePermissions({
      _id: String(user._id),
      role: roleName,
    });
    req.user = {
      _id: String(user._id),
      email: user.email,
      role: roleName,
      permissions: [...effectivePermissions],
    };
    next();

  } catch (error) {
    res.status(HTTP_STATUS.UNAUTHORIZED).json({ success: false, message: MESSAGES.INVALID_TOKEN });
  }
};

export { authMiddleware };