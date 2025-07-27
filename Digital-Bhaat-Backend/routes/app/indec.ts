
import { Router } from "express";
import authRouter from "./auth.routes";
import brideProfileRouter from "./brideProfile.routes";
import providerRouter from "./provider.route";
import gamesRouter from "./games.routes";


const globalRouter = Router();


globalRouter.use("/auth", authRouter);
globalRouter.use("/brideProfile",brideProfileRouter)
globalRouter.use("/provider",providerRouter)
globalRouter.use("/games",gamesRouter)


export default globalRouter;
