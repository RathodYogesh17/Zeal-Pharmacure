import type { Response } from "express";
import type { IApiErrorResponse, IApiSuccessResponse } from "../types/common.types";


const sendSuccess = <T>( res: Response<IApiSuccessResponse<T>>, statusCode: number, message: string, data?: T) => {
   return res.status(statusCode).json({ success: true, message, data, });
};

const sendError = ( res: Response<IApiErrorResponse>, statusCode: number, message: string, errors?: unknown) => {
  return res.status(statusCode).json({ success: false, message, errors, });
};

export { sendSuccess, sendError,};
