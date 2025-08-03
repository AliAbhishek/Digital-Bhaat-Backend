import mongoose, { Schema } from "mongoose";



export interface IWallet extends Document {
    userId: mongoose.Types.ObjectId;
    balance: number;
    //   transactions: Transaction[];
}

const walletSchema = new Schema<IWallet>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    balance: {
        type: Number,
        default: 0,
    }
}, { timestamps: true });

export const Wallet = mongoose.model<IWallet>('Wallet', walletSchema);