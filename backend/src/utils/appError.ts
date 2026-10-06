import type { HttpStatusCode } from "../constants/httpStatus";

class AppError extends Error { statusCode: HttpStatusCode; isOperational: boolean; 
  constructor(message: string, statusCode: HttpStatusCode = 500) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.isOperational = true;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export default AppError;