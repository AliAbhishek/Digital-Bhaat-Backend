import { Router } from "express";
import providerController from "../../controller/app/provider.controller";
import { requireAuth } from "../../middlewares/Authentication.middleware";




const providerRouter = Router()

const routes = [
    { method: "get", path: "/providerHomePage", handler: providerController.getVerifiedBrides, middlewares: [requireAuth] },
   
];

// Loop through all route definitions and register them
routes.forEach(({ method, path, handler, middlewares = [] }) => {
    // @ts-ignore - TS doesn't know about dynamic methods
    providerRouter[method](path, ...middlewares, handler);
});
export default providerRouter;


