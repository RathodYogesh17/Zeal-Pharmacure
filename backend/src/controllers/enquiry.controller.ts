import type { Request, Response } from "express";
import * as enquiryService from "../services/enquiry.service";
import { validateDrugLicenseNumber } from "../utils/dlValidator";
import HTTP_STATUS from "../constants/httpStatus";
import MESSAGES from "../constants/messages";
import { sendSuccess } from "../utils/apiResponse";
import type {
  IEnquiryRequest,
  ICreateEnquiryRequest,
  ICreateProductEnquiryRequest,
  ICreateFranchiseEnquiryRequest,
  IUpdateEnquiryStatusRequest,
  IAssignEnquiryRequest,
  IAddEnquiryNoteRequest,
  IEnquiryQuery,
} from "../types/enquiry.types";
import type { IAuthenticatedUser } from "../types/user.types";

const createProductEnquiry = async (req: Request, res: Response): Promise<void> => {
  const body: ICreateProductEnquiryRequest = req.body;
  const result = await enquiryService.createProductEnquiry(body);
  sendSuccess(res, HTTP_STATUS.CREATED, "Product enquiry submitted successfully", result);
};

const createFranchiseEnquiry = async (req: Request, res: Response): Promise<void> => {
  const body: ICreateFranchiseEnquiryRequest = req.body;
  const result = await enquiryService.createFranchiseEnquiry(body);
  sendSuccess(
    res,
    HTTP_STATUS.CREATED,
    "PCD Pharma franchise enquiry submitted successfully.",
    result
  );
};

const createEnquiry = async (req: Request, res: Response): Promise<void> => {
  const body: ICreateEnquiryRequest = req.body;
  const result = await enquiryService.createEnquiry(body);
  sendSuccess(res, HTTP_STATUS.CREATED, MESSAGES.ENQUIRY_CREATED, result);
};

const validateDrugLicense = async (req: Request, res: Response): Promise<void> => {
  const rawDl = String(
    req.body?.drugLicenseNumber ||
      req.query?.drugLicenseNumber ||
      req.query?.dl ||
      ""
  );
  const state = (req.body?.state || req.query?.state)
    ? String(req.body?.state || req.query?.state)
    : undefined;

  const result = validateDrugLicenseNumber(rawDl, state);
  sendSuccess(
    res,
    HTTP_STATUS.OK,
    result.isValid
      ? "Drug License format is valid"
      : (result.error || "Invalid Drug License format"),
    result
  );
};

const getAllProductEnquiries = async (req: IEnquiryRequest, res: Response): Promise<void> => {
  const query: IEnquiryQuery = req.validatedQuery ?? (req.query as IEnquiryQuery);
  const result = await enquiryService.getAllProductEnquiries(query);
  sendSuccess(res, HTTP_STATUS.OK, "Product enquiries fetched successfully", result);
};

const getAllFranchiseEnquiries = async (req: IEnquiryRequest, res: Response): Promise<void> => {
  const query: IEnquiryQuery = req.validatedQuery ?? (req.query as IEnquiryQuery);
  const result = await enquiryService.getAllFranchiseEnquiries(query);
  sendSuccess(res, HTTP_STATUS.OK, "Franchise enquiries fetched successfully", result);
};

const getAllEnquiries = async (req: IEnquiryRequest, res: Response): Promise<void> => {
  const query: IEnquiryQuery = req.validatedQuery ?? (req.query as IEnquiryQuery);
  const user = req.user ? (req.user as unknown as IAuthenticatedUser) : undefined;
  const result = await enquiryService.getAllEnquiries(query, user);
  sendSuccess(res, HTTP_STATUS.OK, MESSAGES.ENQUIRIES_FETCHED, result);
};

const getEnquiry = async (req: Request, res: Response): Promise<void> => {
  const result = await enquiryService.getEnquiryById(String(req.params.id));
  sendSuccess(res, HTTP_STATUS.OK, MESSAGES.ENQUIRY_FETCHED, result);
};

const updateEnquiryStatus = async (req: IEnquiryRequest, res: Response): Promise<void> => {
  const body: IUpdateEnquiryStatusRequest = req.body;
  const user = req.user ? (req.user as unknown as IAuthenticatedUser) : undefined;
  const result = await enquiryService.updateEnquiryStatus(String(req.params.id), body, user);
  sendSuccess(res, HTTP_STATUS.OK, MESSAGES.ENQUIRY_STATUS_UPDATED, result);
};

const assignEnquiry = async (req: IEnquiryRequest, res: Response): Promise<void> => {
  const body: IAssignEnquiryRequest = req.body;
  const user = req.user ? (req.user as unknown as IAuthenticatedUser) : undefined;
  const result = await enquiryService.assignEnquiry(String(req.params.id), body, user);
  sendSuccess(res, HTTP_STATUS.OK, MESSAGES.ENQUIRY_ASSIGNED, result);
};

const addEnquiryNote = async (req: IEnquiryRequest, res: Response): Promise<void> => {
  const body: IAddEnquiryNoteRequest = req.body;
  const user = req.user ? (req.user as unknown as IAuthenticatedUser) : undefined;
  const result = await enquiryService.addEnquiryNote(String(req.params.id), body, user);
  sendSuccess(res, HTTP_STATUS.OK, MESSAGES.ENQUIRY_NOTE_ADDED, result);
};

const deleteEnquiry = async (req: IEnquiryRequest, res: Response): Promise<void> => {
  const user = req.user ? (req.user as unknown as IAuthenticatedUser) : undefined;
  const result = await enquiryService.deleteEnquiry(String(req.params.id), user);
  sendSuccess(res, HTTP_STATUS.OK, MESSAGES.ENQUIRY_DELETED, result);
};

const confirmEnquiry = async (req: Request, res: Response): Promise<void> => {
  const result = await enquiryService.confirmEnquiry(String(req.params.id));
  sendSuccess(res, HTTP_STATUS.OK, "Enquiry confirmed and sales management notified successfully.", result);
};

const replyEnquiryEmail = async (req: IEnquiryRequest, res: Response): Promise<void> => {
  const user = req.user ? (req.user as unknown as IAuthenticatedUser) : undefined;
  const { message, subject } = req.body;
  const result = await enquiryService.replyEnquiryEmail(String(req.params.id), message, user, subject);
  sendSuccess(res, HTTP_STATUS.OK, result.message, result);
};

export {
  createProductEnquiry,
  createFranchiseEnquiry,
  createEnquiry,
  confirmEnquiry,
  validateDrugLicense,
  getAllProductEnquiries,
  getAllFranchiseEnquiries,
  getAllEnquiries,
  getEnquiry,
  updateEnquiryStatus,
  assignEnquiry,
  addEnquiryNote,
  deleteEnquiry,
  replyEnquiryEmail,
};

