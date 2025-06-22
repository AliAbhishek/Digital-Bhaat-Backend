import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import responseHandlers from "../services/response/response.service";
import statusCodes from "../utils/statusCode.utils";

export const validateZod = (schema: ZodSchema<any>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            console.error("Zod Validation Error:", result.error);
            const errorMessages = result.error.errors.map(err => err.message);
            return responseHandlers.failureResponse(res,
                statusCodes.BAD_REQUEST,
                errorMessages.join(", "),
            );
        }
       
        // Attach the parsed data to req.body
        req.body = result.data;
        next();
    };
};
