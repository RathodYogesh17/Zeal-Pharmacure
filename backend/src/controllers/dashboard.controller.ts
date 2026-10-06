import type { Request, Response } from "express";
import * as dashboardService from "../services/dashboard.service";
import HTTP_STATUS from "../constants/httpStatus";
import MESSAGES from "../constants/messages";
import { sendSuccess } from "../utils/apiResponse";

const getDashboardStats = async (_req: Request, res: Response): Promise<void> => {
  const result = await dashboardService.getDashboardOverview();
  sendSuccess(res, HTTP_STATUS.OK, MESSAGES.DASHBOARD_STATS_FETCHED, result);
};

export { getDashboardStats };
export default { getDashboardStats };
