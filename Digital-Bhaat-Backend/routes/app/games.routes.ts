import { Router } from "express";
import { requireAuth } from "../../middlewares/Authentication.middleware";
import gamesController from "../../controller/app/games.controller";




const gamesRouter = Router()

const routes = [
    { method: "get", path: "/getGamesList", handler: gamesController.fetchAndStoreGames, middlewares: [requireAuth] },
    { method: "get", path: "/getFavGames", handler: gamesController.getFavGames, middlewares: [requireAuth] },
    { method: "post", path: "/addToFav", handler: gamesController.addToFavourite, middlewares: [requireAuth] },
   
];

// Loop through all route definitions and register them
routes.forEach(({ method, path, handler, middlewares = [] }) => {
    // @ts-ignore - TS doesn't know about dynamic methods
    gamesRouter[method](path, ...middlewares, handler);
});
export default gamesRouter;


