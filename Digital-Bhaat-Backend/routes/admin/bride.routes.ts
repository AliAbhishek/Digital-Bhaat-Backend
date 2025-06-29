import { Router } from "express";
import adminController from "../../controller/admin/admin.controller";


const adminBrideRoutes=Router()

const routes = [
    { method: "get", path: "/listBrides", handler: adminController.listBrides },
    { method: "put", path: "/updateBride/:id", handler: adminController.updateBride },
    { method: "get", path: "/getBrideById/:id", handler: adminController.getBrideById },
]

routes.forEach(({ method, path, handler }) => {
    // @ts-ignore - TS doesn't know about dynamic methods
    adminBrideRoutes[method](path, handler);
});

export default adminBrideRoutes