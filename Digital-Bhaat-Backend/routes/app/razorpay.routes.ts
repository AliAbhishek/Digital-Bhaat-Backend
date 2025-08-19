import { Router } from "express";
import razorpayController from "../../controller/app/razorpay.controller";
import { requireAuth } from "../../middlewares/Authentication.middleware";


const razorpayRouter = Router()

const routes = [
    { method: "post", path: "/createOrder", handler: razorpayController.createOrder, middlewares: [requireAuth] },

];

// Loop through all route definitions and register them
routes.forEach(({ method, path, handler, middlewares = [] }) => {
    // @ts-ignore - TS doesn't know about dynamic methods
    razorpayRouter[method](path, ...middlewares, handler);
});
export default razorpayRouter;


