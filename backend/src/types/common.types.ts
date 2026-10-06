export interface IBaseDocument {
  isActive: boolean;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IApiSuccessResponse<T = unknown> {
  success: true;
  message: string;
  data?: T | undefined;
}

export interface IApiErrorResponse {
  success: false;
  message: string;
  errors?: unknown;
}

export type ApiResponse<T = unknown> = IApiSuccessResponse<T> | IApiErrorResponse;

export interface IPaginationParams {
  page: number;
  limit: number;
  skip: number;
}

export interface IPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface IPaginatedResponse<T> {
  items: T[];
  pagination: IPagination;
}

