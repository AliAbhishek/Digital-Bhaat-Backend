import { Router } from "express";
import adminController from "../../controller/admin/admin.controller";


const adminUserRoutes = Router()

const routes = [
    { method: "get", path: "/listUsers", handler: adminController.listUsers },
    { method: "put", path: "/updateUser/:id", handler: adminController.updateUser },
    { method: "get", path: "/getUserById/:id", handler: adminController.getUserById },
]

routes.forEach(({ method, path, handler }) => {
    // @ts-ignore - TS doesn't know about dynamic methods
    adminUserRoutes[method](path, handler);
});

export default adminUserRoutes