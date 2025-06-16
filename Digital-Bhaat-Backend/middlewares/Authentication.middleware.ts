import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.utils";
import { CustomError } from "../services/response/response.service";
import statusCodes from "../utils/statusCode.utils";

export const requireAuth = (req: any, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new CustomError(statusCodes.UNAUTHORIZED, "Unauthorised yo make the request")
    }

    const token = authHeader.split(" ")[1];
    const decoded: any = verifyToken(token);

    if (!decoded) {
        throw new CustomError(statusCodes.UNAUTHORIZED, "Invalid or expired token")

    }

    // Attach user data to request
    req.user.userId = decoded?.userID;
    req.user.role = decoded?.role
    next();
};
