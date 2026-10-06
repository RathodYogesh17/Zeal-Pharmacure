import type { Request } from "express";
import type { UserRole } from "./user.types";

export interface IAuthenticatedRequest extends Request {
	user?: {
		_id: string;
		email: string;
		role: UserRole;
		permissions: string[];
	};
}

export interface IValidatedQueryRequest<TQuery> extends IAuthenticatedRequest {
	validatedQuery?: TQuery;
}
