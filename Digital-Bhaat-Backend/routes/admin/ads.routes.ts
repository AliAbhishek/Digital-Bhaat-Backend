import { Router } from "express";
import adminController from "../../controller/admin/admin.controller";
import authController from "../../controller/app/auth.controller";
import { setUploadFolder, uploadToS3 } from "../../middlewares/uploadToS3.middleware";



const adsRoutes = Router()

const routes = [
    { method: "get", path: "/getAdvertisers", handler: adminController.getAdvertisers },
    { method: "post", path: "/addAdvertiser", handler: adminController.addAdvertiser },
    { method: "put", path: "/editAdvertiser/:id", handler: adminController.editAdvertiser },
    { method: "delete", path: "/deleteAdvertiser/:id", handler: adminController.deleteAdvertiser },
    {
        method: "post",
        path: "/adsLogoUpload",
        handler:  authController.uploadImagesToS3,
        middlewares: [ setUploadFolder("adsLogo"), uploadToS3],
    
      },

]

routes.forEach(({ method, path, handler, middlewares = [] }) => {
    // @ts-ignore - TS doesn't know about dynamic methods
    adsRoutes[method](path,...middlewares, handler);
});

export default adsRoutes