
import { Router } from "express";
import adminAuthRoutes from "./auth.routes";
import adminUserRoutes from "./users.routes";



const globalAdminRouter = Router();


globalAdminRouter.use("/auth", adminAuthRoutes);
globalAdminRouter.use("/user", adminUserRoutes);



export default globalAdminRouter;
