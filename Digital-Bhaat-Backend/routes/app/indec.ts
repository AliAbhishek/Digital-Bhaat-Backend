
import { Router } from "express";
import authRouter from "./auth.routes";
import brideProfileRouter from "./brideProfile.routes";
import providerRouter from "./provider.route";
import gamesRouter from "./games.routes";
import donationRouter from "./donation.routes";


const globalRouter = Router();


globalRouter.use("/auth", authRouter);
globalRouter.use("/brideProfile",brideProfileRouter)
globalRouter.use("/provider",providerRouter)
globalRouter.use("/games",gamesRouter)
globalRouter.use("/donation",donationRouter)


export default globalRouter;
