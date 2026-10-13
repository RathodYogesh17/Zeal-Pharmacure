import HTTP_STATUS from "../constants/httpStatus";
import MESSAGES from "../constants/messages";
import type { AnySchema } from "joi";

type ExpressQuery = import("qs").ParsedQs & Record<string, unknown>;
type RequestWithValidatedBody = import("express").Request & {body: Record<string, unknown>;};
type RequestWithValidatedQuery = import("express").Request & {  validatedQuery?: ExpressQuery;};


const validate = (schema: AnySchema) => {
  return ( req: import("express").Request, res: import("express").Response, next: import("express").NextFunction ) => {
    const result = schema.validate(req.body, { abortEarly: false, stripUnknown: true, });
    if (result.error) {
      const errorList = result.error.details.map((detail) => detail.message.replace(/['"]/g, ""));
      console.warn(`[VALIDATION ERROR] [${req.method} ${req.originalUrl}]:`, errorList);
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: errorList[0] || MESSAGES.VALIDATION_ERROR,
        errors: errorList,
      });
    }
    const requestWithBody = req as RequestWithValidatedBody;
    requestWithBody.body = result.value as Record<string, unknown>;
    next();
  };
};



const validateQuery = (schema: AnySchema) => {
  return ( req: import("express").Request, res: import("express").Response, next: import("express").NextFunction ) => {
    const result = schema.validate(req.query as Record<string, unknown>, { abortEarly: false,  stripUnknown: true,  });
    if (result.error) {
      const errorList = result.error.details.map((detail) => detail.message.replace(/['"]/g, ""));
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: errorList[0] || MESSAGES.VALIDATION_ERROR,
        errors: errorList,
      });
    }
    const requestWithQuery = req as RequestWithValidatedQuery;
    requestWithQuery.validatedQuery = result.value as ExpressQuery;
    next();
  };
};

export { validate, validateQuery };