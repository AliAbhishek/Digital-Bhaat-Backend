import mongoose, { Schema } from "mongoose";



export interface IGamificationDonation extends Document {
    brideId: mongoose.Types.ObjectId;
    amount: number;
    gameId: mongoose.Types.ObjectId;
    gamePlayedBy:mongoose.Types.ObjectId;
    type: string;
    csrOrganisation:mongoose.Types.ObjectId;
    adsOrganisation:mongoose.Types.ObjectId

}

const GamificationDonationSchema = new Schema<IGamificationDonation>(
  {
    brideId: {
      type: Schema.Types.ObjectId,
      ref: "BrideProfile",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      default: 1, // ₹1 per play
    },
    gamePlayedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    gameId: {
      type: Schema.Types.ObjectId,
      ref: "GamesModel",
    },
    type: {
      type: String,
      enum: ["csr", "ads"],
      default: "gamification",
    },
    csrOrganisation: {
      type: Schema.Types.ObjectId,
      ref: "Csr",
    },
    adsOrganisation: {
      type: Schema.Types.ObjectId,
      ref: "Advertiser",
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

// Model
const GamificationDonation = mongoose.model<IGamificationDonation>(
  "GamificationDonation",
  GamificationDonationSchema
);

export default GamificationDonation;