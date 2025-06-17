import { Router } from "express";
import { validateZod } from "../../middlewares/zodValidator.middleware";
import brideProfileController from "../../controller/app/brideProfile.controller";
import { requireAuth } from "../../middlewares/Authentication.middleware";
import { createBrideProfileSchema } from "../../zodSchemas/brideProfileSchema.zod";

const brideProfileRouter = Router();

const routes = [
  {
    method: "post",
    path: "/createBrideProfile",
    handler: brideProfileController.createBrideProfile,
    middlewares: [requireAuth, validateZod(createBrideProfileSchema)],
  },
  {
    method: "put",
    path: "/updateBrideProfile/:id",
    handler: brideProfileController.updateBrideProfileStep,
    middlewares: [requireAuth, validateZod(createBrideProfileSchema)],
  },
  {
    method: "get",
    path: "/getBrideProfile/:id",
    handler: brideProfileController.getBrideProfileById,
    middlewares: [requireAuth],
  },
  {
    method: "get",
    path: "/getBrideProfiles",
    handler: brideProfileController.getAllBrideProfiles,
    middlewares: [requireAuth],
  },
];

// Loop through all route definitions and register them
routes.forEach(({ method, path, handler, middlewares = [] }) => {
  // @ts-ignore - TS doesn't know about dynamic methods
  brideProfileRouter[method](path, ...middlewares, handler);
});
export default brideProfileRouter;
