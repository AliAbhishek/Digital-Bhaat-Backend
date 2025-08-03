import { Router } from "express";
import { requireAuth } from "../../middlewares/Authentication.middleware";
import DonationController from "../../controller/app/donation.controller";





const donationRouter = Router()

const routes = [
    { method: "post", path: "/donateViaPlaying", handler: DonationController.DonateViaPlaying, middlewares: [requireAuth] },
    { method: "get", path: "/getUserTransaction", handler: DonationController.userTransaction, middlewares: [requireAuth] },
   
   
];

// Loop through all route definitions and register them
routes.forEach(({ method, path, handler, middlewares = [] }) => {
    // @ts-ignore - TS doesn't know about dynamic methods
    donationRouter[method](path, ...middlewares, handler);
});
export default donationRouter;


