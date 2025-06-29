import { Router } from "express";
import adminController from "../../controller/admin/admin.controller";


const adminAuthRoutes=Router()

const routes=[
     { method: "get", path: "/createAdmin", handler: adminController.createAdmin },
     { method: "post", path: "/adminLogin", handler: adminController.adminLogin },
]

routes.forEach(({ method, path, handler }) => {
    // @ts-ignore - TS doesn't know about dynamic methods
    adminAuthRoutes[method](path, handler);
});

export default adminAuthRoutes