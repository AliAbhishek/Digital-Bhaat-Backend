import { Router } from "express";
import authController from "../../controller/app/auth.controller";
import { validateZod } from "../../middlewares/zodValidator.middleware";
import { loginSchema, profileSchema, signUpSchema, verifyOtpSchema } from "../../zodSchemas/authSchema.zod";
import { requireAuth } from "../../middlewares/Authentication.middleware";
import { uploadToS3 } from "../../middlewares/uploadToS3.middleware";



const authRouter = Router()

const routes = [
    { method: "post", path: "/login", handler: authController.login, middlewares: [validateZod(loginSchema)] },
    { method: "post", path: "/signup", handler: authController.signUp, middlewares: [validateZod(signUpSchema)] },
    { method: "post", path: "/verifyOTP", handler: authController.verifyOtp, middlewares: [validateZod(verifyOtpSchema)] },
    { method: "post", path: "/resendOTP", handler: authController.resendOtp },
    {
        method: "post",
        path: "/uploadImagesToS3",
        handler: authController.uploadImagesToS3,
        middlewares: [requireAuth,uploadToS3],
    },
    {
        method: "put",
        path: "/updateProfile",
        handler: authController.updateProfile,
        middlewares: [requireAuth, validateZod(profileSchema)],
    },
    {
        method: "get",
        path: "/getProfile",
        handler: authController.getUserProfile,
        middlewares: [requireAuth],
    },

];

// Loop through all route definitions and register them
routes.forEach(({ method, path, handler, middlewares = [] }) => {
    // @ts-ignore - TS doesn't know about dynamic methods
    authRouter[method](path, ...middlewares, handler);
});
export default authRouter;


