import mongoose from "mongoose";


export interface IGames extends Document {
    gameId: string;
    title: string;
    thumb: string;
    category: string;
    url: string
}

const GameSchema = new mongoose.Schema({
    gameId: { type: String },
    title: String,
    thumb: String,
    category: String,
    url: String,
});

export default mongoose.model<IGames>("GamesModel",GameSchema)
