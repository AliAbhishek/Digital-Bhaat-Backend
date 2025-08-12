
import { Router } from "express";
import adminAuthRoutes from "./auth.routes";
import adminUserRoutes from "./users.routes";
import adminBrideRoutes from "./bride.routes";
import adsRoutes from "./ads.routes";
import csrRoutes from "./csr.routes";



const globalAdminRouter = Router();


globalAdminRouter.use("/auth", adminAuthRoutes);
globalAdminRouter.use("/user", adminUserRoutes);
globalAdminRouter.use("/bride",adminBrideRoutes)
globalAdminRouter.use("/ads",adsRoutes)
globalAdminRouter.use("/csr",csrRoutes)



export default globalAdminRouter;
