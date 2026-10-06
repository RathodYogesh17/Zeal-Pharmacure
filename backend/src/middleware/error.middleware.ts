import type { ErrorRequestHandler } from "express";
import HTTP_STATUS from "../constants/httpStatus";
import MESSAGES from "../constants/messages";
import AppError from "../utils/appError";


const errorMiddleware: ErrorRequestHandler = (error, _req, res, _next) => {
	const isAppError = error instanceof AppError;
	const statusCode = isAppError ? error.statusCode : HTTP_STATUS.INTERNAL_SERVER_ERROR;
	const message = isAppError ? error.message : MESSAGES.SERVER_ERROR;

	if (!isAppError) {console.error("Unhandled error:", error);}
	res.status(statusCode).json({success: false,	message,});
};

export default errorMiddleware;
