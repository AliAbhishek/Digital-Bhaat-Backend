import { Router } from "express";
import authController from "../../controller/app/auth.controller";
import { validateZod } from "../../middlewares/zodValidator.middleware";
import { loginSchema, signUpSchema, verifyOtpSchema } from "../../zodSchemas/authSchema.zod";



const authRouter = Router()

const routes = [
    { method: "post", path: "/login", handler: authController.login, middlewares: [validateZod(loginSchema)] },
    { method: "post", path: "/signup", handler: authController.signUp, middlewares: [validateZod(signUpSchema)] },
    { method: "post", path: "/verifyOTP", handler: authController.verifyOtp, middlewares: [validateZod(verifyOtpSchema)] },
    { method: "post", path: "/resendOTP", handler: authController.resendOtp }

];

// Loop through all route definitions and register them
routes.forEach(({ method, path, handler, middlewares = [] }) => {
    // @ts-ignore - TS doesn't know about dynamic methods
    authRouter[method](path, ...middlewares, handler);
});
export default authRouter;


