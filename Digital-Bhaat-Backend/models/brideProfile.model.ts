import mongoose, { Types } from "mongoose";
import encrypt from "mongoose-encryption";
import Env from "../config/Env.config";
import { generatePresignedUrl } from "../services/app/s3.service";

export interface IBrideProfile extends Document {
  guardianDetails: {
    fatherName: string;

    fatherPhoneNumber: string;

    guardianRelation: string;
    guardianDisability: boolean;
    isSingleParent: boolean;
    profileImage: string;
    street: string;
    village: string;
    postOffice: string;
    district: string;
    state: string;
    pincode: number;
  };
  fatherAadharNumber: string;
  brideDetails: {
    brideDOB: string;
    brideName: string;

    bridePhoneNumber: string;

    brideDisability: boolean;
    weddingDate: string;
    profileImage: string;
    street: string;
    village: string;
    postOffice: string;
    district: string;
    state: string;
    pincode: number;
    weddingVenue: string;
  };
  brideAadharNumber: string;
  familyIncome: number;
  stepCompleted: number;
  saveAsDraft: boolean;
  isProfileCompleted: boolean;
  isProfileVerifiedByAdmin: boolean;
  profileStatus: "Under Review" | "Approved" | "Rejected";
  profileCreatedBy: Types.ObjectId;
  amountSanctioned: number;
  amountSanctionedDate: Date;
  collectedAmount: number;
}

const brideProfileSchema = new mongoose.Schema<IBrideProfile>(
  {
    guardianDetails: {
      fatherName: String,

      fatherPhoneNumber: String,
      guardianRelation: String,
      guardianDisability: Boolean,
      isSingleParent: Boolean,
      profileImage: String,
      street: String,
      village: String,
      postOffice: String,
      district: String,
      state: String,
      pincode: Number,
    },
    fatherAadharNumber: String,
    brideDetails: {
      brideDOB: String,
      brideName: String,

      bridePhoneNumber: String,
      brideDisability: Boolean,
      weddingDate: String,
      profileImage: String,
      street: String,
      village: String,
      postOffice: String,
      district: String,
      state: String,
      pincode: Number,
      weddingVenue: String,
    },
    brideAadharNumber: String,
    familyIncome: Number,
    stepCompleted: { type: Number, default: 0 },
    saveAsDraft: { type: Boolean, default: true },
    isProfileCompleted: { type: Boolean, default: false },
    isProfileVerifiedByAdmin: { type: Boolean, default: false },
    profileStatus: {
      type: String,
      enum: ["Under Review", "Approved", "Rejected"],
      default: "Under Review",
    },
    profileCreatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    amountSanctioned: { type: Number, default: 0 },
    amountSanctionedDate: { type: Date },
    collectedAmount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

brideProfileSchema.set("toJSON", { virtuals: true });
brideProfileSchema.set("toObject", { virtuals: true });

const encKey = Env.MONGO_ENC_KEY!; // Must be 32 characters
const sigKey = Env.MONGO_SIG_KEY!; // Must be 64 characters

brideProfileSchema.plugin(encrypt, {
  encryptionKey: encKey,
  signingKey: sigKey,
  encryptedFields: ["fatherAadharNumber", "brideAadharNumber"],
});

brideProfileSchema
  .virtual("maskedGuardianAadhar")
  .get(function (this: IBrideProfile) {
    const aadhar = this.fatherAadharNumber;
    if (!aadhar) return "";
    return "XXXX-XXXX-" + aadhar.slice(-4);
  });

brideProfileSchema
  .virtual("maskedBrideAadhar")
  .get(function (this: IBrideProfile) {
    const aadhar = this.brideAadharNumber;
    if (!aadhar) return "";
    return "XXXX-XXXX-" + aadhar.slice(-4);
  });




export const BrideProfileModel = mongoose.model<IBrideProfile>(
  "BrideProfile",
  brideProfileSchema
);
