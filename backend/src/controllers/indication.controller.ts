import type { Request, Response } from "express";
import * as indicationService from "../services/indication.service";
import HTTP_STATUS from "../constants/httpStatus";
import { sendSuccess } from "../utils/apiResponse";
import type { IIndicationRequest, ICreateIndicationRequest, IUpdateIndicationRequest, IIndicationQuery,} from "../types/indication.types";
import type { IAuthenticatedUser } from "../types/user.types";


const createIndication = async (req: IIndicationRequest, res: Response): Promise<void> => {
  const body: ICreateIndicationRequest = req.body;
  const user = req.user ? (req.user as unknown as IAuthenticatedUser) : undefined;
  const result = await indicationService.createIndication(body, user);
  sendSuccess(res, HTTP_STATUS.CREATED, "Indication created successfully", result);
};

const getPublicIndications = async (req: Request, res: Response): Promise<void> => {
  const query: IIndicationQuery = req.query as IIndicationQuery;
  const result = await indicationService.getAllIndications(query, true);
  sendSuccess(res, HTTP_STATUS.OK, "Indications fetched successfully", result);
};

const getAdminIndications = async (req: IIndicationRequest, res: Response): Promise<void> => {
  const query: IIndicationQuery = req.validatedQuery ?? (req.query as IIndicationQuery);
  const result = await indicationService.getAllIndications(query, false);
  sendSuccess(res, HTTP_STATUS.OK, "Indications fetched successfully", result);
};

const getIndication = async (req: Request, res: Response): Promise<void> => {
  const result = await indicationService.getIndicationBySlugOrId(String(req.params.slugOrId));
  sendSuccess(res, HTTP_STATUS.OK, "Indication fetched successfully", result);
};

const updateIndication = async (req: IIndicationRequest, res: Response): Promise<void> => {
  const body: IUpdateIndicationRequest = req.body;
  const user = req.user ? (req.user as unknown as IAuthenticatedUser) : undefined;
  const result = await indicationService.updateIndication(String(req.params.id), body, user);
  sendSuccess(res, HTTP_STATUS.OK, "Indication updated successfully", result);
};

const deleteIndication = async (req: IIndicationRequest, res: Response): Promise<void> => {
  const user = req.user ? (req.user as unknown as IAuthenticatedUser) : undefined;
  const result = await indicationService.deleteIndication(String(req.params.id), user);
  sendSuccess(res, HTTP_STATUS.OK, "Indication deleted successfully", result);
};

export { createIndication, getPublicIndications, getAdminIndications, getIndication, updateIndication, deleteIndication,};
