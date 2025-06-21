
import { Router } from "express";
import authRouter from "./auth.routes";
import brideProfileRouter from "./brideProfile.routes";


const globalRouter = Router();


globalRouter.use("/auth", authRouter);
globalRouter.use("/brideProfile",brideProfileRouter)


export default globalRouter;
