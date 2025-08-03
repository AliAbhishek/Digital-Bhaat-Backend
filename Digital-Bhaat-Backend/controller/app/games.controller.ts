import gamesModel from "../../models/games.model";
import responseHandlers from "../../services/response/response.service";
import statusCodes from "../../utils/statusCode.utils";
import axios from "axios"
import { parseStringPromise } from "xml2js";
import fs from "fs";
import favouriteGamesModel from "../../models/favouriteGames.model";



const gamesController = {
    fetchAndStoreGames: async (req: any, res: Response) => {

        const search = req.query.search?.toString().trim() || "";
    //          const xmlData = fs.readFileSync("data/games.json", "utf-8");
    //     const result = await parseStringPromise(xmlData);
    //     const items = result?.rss?.channel?.[0]?.item || [];
    //     const limitedItems = items.slice(0, 100);

    //     const games = limitedItems.map((item: any) => (
    //         {
    //         gameId: item.id?.[0],
    //         title: item.title?.[0],
    //         description: item.description?.[0],
    //         category: item.category?.[0],
    //         thumb: item.thumb?.[0],
    //         url: item.url?.[0],
    //     }
    // ));

    // // console.log(limitedItems[0])



    //     const existingIds = new Set(
    //         (await gamesModel.find({}, "id")).map((game) => game.id)
    //     );

    //     const newGames = games.filter((game: any) => !existingIds.has(game.id));

    //     if (newGames.length > 0) {
    //         await gamesModel.insertMany(newGames);
    //     }

        const query = search
            ? { title: { $regex: new RegExp(search, "i") } }
            : {};

        const allGames = await gamesModel.find(query).limit(100);

        return responseHandlers.sucessResponse(
            res,
            statusCodes.SUCCESS,
            `Games fetched successfully.`,
            allGames
        );
    },

    updateGamesFeed: async (req: any, res: Response) => {
        const xmlData = fs.readFileSync("data/games.json", "utf-8");
        const result = await parseStringPromise(xmlData);
        const items = result?.rss?.channel?.[0]?.item || [];

        const games = items.map((item: any) => ({
            id: item.id?.[0],
            title: item.title?.[0],
            description: item.description?.[0],
            category: item.category?.[0],
            thumb: item.thumb?.[0],
            url: item.url?.[0],
        }));

        const existingIds = new Set(
            (await gamesModel.find({}, "id")).map((game) => game.id)
        );

        const newGames = games.filter((game: any) => !existingIds.has(game.id));

        if (newGames.length > 0) {
            await gamesModel.insertMany(newGames);
        }

        return responseHandlers.sucessResponse(
            res,
            statusCodes.SUCCESS,
            `${newGames.length} new games added.`,
            newGames
        );
    },

    addToFavourite: async (req: any, res: any) => {
        const userId = req.user.userId; // from auth middleware
        const { gameId } = req.body;
        const { type } = req.body
        let addToFav
        if (type == "remove") {
            addToFav = await favouriteGamesModel.deleteOne({ gameId, userId })
        } else {
            addToFav = await favouriteGamesModel.create({ gameId, userId })
        }

        return responseHandlers.sucessResponse(
            res,
            statusCodes.SUCCESS,
            type=="remove"? "Removed from favourites":`Added to favourites`,
            addToFav
        );


    },

    getFavGames: async (req: any, res: any) => {
        const userId = req.user.userId;
        let findFav = await favouriteGamesModel.find({ userId }).sort({createdAt:-1}).populate("gameId")

        return responseHandlers.sucessResponse(
            res,
            statusCodes.SUCCESS,
            `Fav games fetched successfully`,
            findFav
        );


    },

   



}

export default gamesController