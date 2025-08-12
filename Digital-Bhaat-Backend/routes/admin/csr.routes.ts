import { Router } from "express";
import adminController from "../../controller/admin/admin.controller";
import authController from "../../controller/app/auth.controller";
import { setUploadFolder, uploadToS3 } from "../../middlewares/uploadToS3.middleware";



const csrRoutes = Router()

const routes = [
    { method: "get", path: "/getCSR", handler: adminController.getCSR },
    { method: "get", path: "/getCSRById/:id", handler: adminController.getCSRById },
    { method: "post", path: "/addCSR", handler: adminController.addCSR },
    { method: "put", path: "/editCSR/:id", handler: adminController.editCSR },
    { method: "delete", path: "/deleteCSR/:id", handler: adminController.deleteCSR },
    {
        method: "post",
        path: "/CSRLogoUpload",
        handler:  authController.uploadImagesToS3,
        middlewares: [ setUploadFolder("csrLogo"), uploadToS3],
    
    },
    { method: "get", path: "/getCsrTxnById/:id", handler: adminController.viewCsrTxn },

]

routes.forEach(({ method, path, handler, middlewares = [] }) => {
    // @ts-ignore - TS doesn't know about dynamic methods
    csrRoutes[method](path,...middlewares, handler);
});

export default csrRoutes