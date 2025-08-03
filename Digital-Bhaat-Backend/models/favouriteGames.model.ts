import mongoose, { Schema } from "mongoose";



export interface IFavGames extends Document {
    gameId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId
}

const FavGameSchema = new mongoose.Schema({
    gameId: { type: Schema.Types.ObjectId, ref: "GamesModel" },
    userId: { type: Schema.Types.ObjectId, ref: "User" },

},{
        timestamps: true,
    });

export default mongoose.model<IFavGames>("FavGamesModel", FavGameSchema)
