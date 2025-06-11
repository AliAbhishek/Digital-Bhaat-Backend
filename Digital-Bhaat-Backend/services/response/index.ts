
import { Request, Response, NextFunction, ErrorRequestHandler } from "express";

export class CustomError extends Error {
  success;
  status;
  constructor(errStatus: number, message: string) {
    super(message);
    this.success = false;
    this.status = errStatus;
  }
}
const responseHandlers = {
  sucessResponse: (res: any, status: number, message: string, data?: any) => {
    return res
      .status(status)
      .json({ success: true, status: status, message, data });
  },
  failureResponse: (res: any, status: number, message: string) => {
    return res.status(status).json({ success: false, status: status, message });
  },
  customError: (status: number, message: string) => {
    return new CustomError(status, message);
  },

  globalErrorHandler: ((
    err: CustomError,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    console.error("❌ Global Error Handler:", err);

    // Default to 500 if no status is provided
    const statusCode = err.status || 500;
    const message = err.message || "Internal Server Error";

    res.status(statusCode).json({
      success: false,
      status: statusCode,
      message,
    });
  }) as ErrorRequestHandler, // ✅ Explicitly set as an ErrorRequestHandler
};

export default responseHandlers;
