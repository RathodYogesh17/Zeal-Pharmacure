import express from "express";
import {  createStaffUser,  getUser, getAllUsers,  updateUser, deleteUser,  activateUser, deactivateUser,} from "../controllers/user.controller";
import {  adminCreateUserSchema, updateUserSchema, userQuerySchema,} from "../validations/user.validation";
import { validate, validateQuery } from "../middleware/validation.middleware";
import { uploadProfileImage, attachProfileImageUrl } from "../middleware/upload.middleware";
import { authMiddleware } from "../middleware/auth.middleware";
import { requirePermissions } from "../middleware/role.middleware";
import PERMISSIONS from "../constants/permissions";
import asyncHandler from "../utils/asyncHandler";

const userRouter = express.Router();

userRouter.post("/staff", authMiddleware, requirePermissions(PERMISSIONS.USER_CREATE), uploadProfileImage, attachProfileImageUrl, validate(adminCreateUserSchema), asyncHandler(createStaffUser));
userRouter.get("/", authMiddleware, requirePermissions(PERMISSIONS.USER_VIEW), validateQuery(userQuerySchema), asyncHandler(getAllUsers));
userRouter.get("/:id", authMiddleware, requirePermissions(PERMISSIONS.USER_VIEW), asyncHandler(getUser));
userRouter.put("/:id", authMiddleware, requirePermissions(PERMISSIONS.USER_UPDATE), uploadProfileImage, attachProfileImageUrl, validate(updateUserSchema), asyncHandler(updateUser));
userRouter.delete("/:id", authMiddleware, requirePermissions(PERMISSIONS.USER_DELETE),asyncHandler(deleteUser));
userRouter.put("/:id/activate", authMiddleware, requirePermissions(PERMISSIONS.USER_UPDATE), asyncHandler(activateUser));
userRouter.put("/:id/deactivate", authMiddleware, requirePermissions(PERMISSIONS.USER_UPDATE), asyncHandler(deactivateUser));

export { userRouter };
