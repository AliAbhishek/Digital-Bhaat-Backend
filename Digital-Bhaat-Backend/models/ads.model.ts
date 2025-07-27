

import mongoose, { Schema, Document } from "mongoose";

export interface IAdvertiser extends Document {
    name: string;
    logoUrl: string;
    website?: string;
    contactEmail?: string;
    balance: number;
    isActive: boolean;
    total: number

}

const AdvertiserSchema = new Schema<IAdvertiser>(
    {
        name: { type: String, required: true },
        logoUrl: { type: String, required: true },
        website: String,
        contactEmail: String,
        balance: { type: Number, default: 0 },
        total: { type: Number, default: 0 },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);


AdvertiserSchema.pre("save", function (next) {
  if (this.isModified("total") && !this.isModified("balance")) {
    this.balance = (this.balance ||0) + this.total;
  }
  next();
});


export default mongoose.model<IAdvertiser>("Advertiser", AdvertiserSchema);
