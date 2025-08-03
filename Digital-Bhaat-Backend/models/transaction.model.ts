import mongoose, { Schema } from "mongoose";



export interface ITransaction extends Document {
    transactionDoneBy: mongoose.Types.ObjectId,
    transactionDoneTo: mongoose.Types.ObjectId,
    type: "csr" | "ads" | "Manual",
    transactionType: "credit" | "Debit",
    amount: number;
    csrOrganisationId: mongoose.Types.ObjectId,
    adsOrganisationId: mongoose.Types.ObjectId,
    brideId: mongoose.Types.ObjectId
    gamificationDonationId: mongoose.Types.ObjectId

}

const TransactionSchema = new Schema<ITransaction>(
    {
        transactionDoneBy: { type: Schema.Types.ObjectId, required: true, ref: "User" }, // or Organisation/System if needed
        transactionDoneTo: { type: Schema.Types.ObjectId, required: true, ref: "BrideProfile" },

        type: { type: String, enum: ["csr", "ads", "manual"], required: true },
        transactionType: { type: String, enum: ["credit", "debit"], required: true },

        amount: { type: Number, required: true },

        csrOrganisationId: {
            type: Schema.Types.ObjectId, ref: "Csr", required: function (this: ITransaction) {
                return this.type === "csr";
            }
        },
        adsOrganisationId: {
            type: Schema.Types.ObjectId, ref: "Advertiser", required: function (this: ITransaction) {
                return this.type === "ads";
            }
        },

        brideId: { type: Schema.Types.ObjectId, ref: "BrideProfile", required: true },
        gamificationDonationId: { type: Schema.Types.ObjectId, ref: "GamificationDonation" },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<ITransaction>("Transaction", TransactionSchema);