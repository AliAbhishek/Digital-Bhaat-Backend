import mongoose from "mongoose";
import Advertiser from "../../models/ads.model"
import csrModel from "../../models/csr.model";
import responseHandlers, { CustomError } from "../../services/response/response.service";
import { Wallet } from "../../models/wallet.model";
import GamificationDonation from "../../models/gamificationDonation.model";
import transactionModel from "../../models/transaction.model";
import statusCodes from "../../utils/statusCode.utils";





const DonationController = {

    DonateViaPlaying: async (req: any, res: any) => {
        const session = await mongoose.startSession();
        const { brideId, gameId } = req.body;
        const userId = req.user.userId
        const amount = 1;

        // Start transaction
        let populatedDonation: any = null; // <-- define it outside
        await session.withTransaction(async () => {
            // Choose funding source randomly
            let org, orgModel, orgField;
            let sourceType: "ads" | "csr" = Math.random() > 0.5 ? "ads" : "csr";

            // Try primary source
            const trySource = async (type: "ads" | "csr") => {
                const model = type === "ads" ? Advertiser : csrModel;
                const field = type === "ads" ? "adsOrganisation" : "csrOrganisation";
                const org = await model.findOne({ balance: { $gte: 1 } }).session(session);
                return { org, model, field, type };
            };

            // Attempt first choice
            let attempt = await trySource(sourceType);

            // If insufficient funds, try the other
            if (!attempt.org) {
                const fallbackType = sourceType === "ads" ? "csr" : "ads";
                attempt = await trySource(fallbackType);

                if (!attempt.org) {
                    throw new CustomError(400, "Both CSR and Ads organizations have insufficient funds");
                }
            }

            // Deduct ₹1 from selected org
            attempt.org.balance -= amount;
            await attempt.org.save({ session });

            // For later use
            org = attempt.org;
            orgModel = attempt.model;
            orgField = attempt.field;
            sourceType = attempt.type;


            // Credit ₹1 to bride wallet
            await Wallet.findOneAndUpdate(
                { userId: brideId },
                { $inc: { balance: amount } },
                { new: true, upsert: true, session }
            );

            // Create GamificationDonation record
            let donation: any = await GamificationDonation.create([{
                brideId,
                amount,
                gameId,
                gamePlayedBy: userId,
                type: sourceType,
                [orgField]: org._id,
            }], { session });

            console.log(donation, "donation")


            populatedDonation = await GamificationDonation.findById(donation[0]._id)
                .session(session)
                .populate({ path: "adsOrganisation", select: "name logoUrl website" })
                .populate({ path: "csrOrganisation", select: "name logoUrl website" });


            console.log(populatedDonation, "pppop")

            // Create Transaction
            await transactionModel.create([{
                transactionDoneBy: userId,
                transactionDoneTo: brideId,
                type: sourceType,
                transactionType: "credit",
                amount,
                brideId,
                gamificationDonationId: donation[0]?._id,
                csrOrganisationId: sourceType === "csr" ? org._id : undefined,
                adsOrganisationId: sourceType === "ads" ? org._id : undefined,
            }], { session });
        });

        await session.endSession();

        return responseHandlers.sucessResponse(
            res,
            statusCodes.SUCCESS,
            "Gamification Donation created successfully",
            { data: populatedDonation }
        );
    },

    userTransaction: async (req: any, res: any) => {
        const userId = req.user.userId;
        let userWallet= await Wallet.findOne({userId})
        let userTransactions = await transactionModel.find({ transactionDoneBy: userId }).populate({ path: "transactionDoneTo", select: "fullName email" })


        return responseHandlers.sucessResponse(
            res,
            statusCodes.SUCCESS,
            `Transactions fetched successfully`,
            {userWallet,userTransactions}
        );


    },

}

export default DonationController