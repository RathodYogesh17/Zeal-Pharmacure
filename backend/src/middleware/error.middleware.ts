import type { ErrorRequestHandler } from "express";
import HTTP_STATUS from "../constants/httpStatus";
import MESSAGES from "../constants/messages";
import AppError from "../utils/appError";


const errorMiddleware: ErrorRequestHandler = (error, _req, res, _next) => {
	const isAppError = error instanceof AppError;
	let statusCode = isAppError ? error.statusCode : HTTP_STATUS.INTERNAL_SERVER_ERROR;
	let message = isAppError ? error.message : MESSAGES.SERVER_ERROR;

	// Handle Mongoose validation errors gracefully
	if (error?.name === "ValidationError" && error?.errors) {
		statusCode = HTTP_STATUS.BAD_REQUEST;
		message = Object.values(error.errors).map((err: any) => err.message).join(", ");
	} else if (error?.name === "CastError") {
		statusCode = HTTP_STATUS.BAD_REQUEST;
		message = `Invalid value for field: ${error.path}`;
	}

	if (!isAppError && statusCode === HTTP_STATUS.INTERNAL_SERVER_ERROR) {
		console.error("Unhandled error:", error);
	}

	const origin = _req.headers?.origin;
	if (origin) {
		res.setHeader("Access-Control-Allow-Origin", origin);
		res.setHeader("Access-Control-Allow-Credentials", "true");
	}

	res.status(statusCode).json({ success: false, message });
};

export default errorMiddleware;
