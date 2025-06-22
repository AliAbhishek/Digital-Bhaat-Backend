
import { BrideProfileModel } from "../../models/brideProfile.model";
import { addPresignedUrls } from "./s3.service";

const brideProfileService = {
  findBrideProfile: async (id: string, userId: string) => {
    let profile: any = await BrideProfileModel.findOne({
      _id: id,
      profileCreatedBy: userId,
    })
    // Optional: convert to plain object after virtuals are resolved
    if (profile) { profile = profile.toObject({ virtuals: true }); }

    const updateProfileWithSignedUrl = await addPresignedUrls(profile)

    return updateProfileWithSignedUrl
  },

  createBrideProfile: async (body: any) => {
    const brideProfile = await BrideProfileModel.create({
      ...body,
      brideAadharNumber: body?.guardianDetails?.fatherAadharNumber,
    });
    return brideProfile;
  },

  updateBrideProfile: async (id: string, userId: string, body: any) => {
    
    const brideProfile = await BrideProfileModel.findOne({
      _id: id,
      profileCreatedBy: userId,
    });

    if (!brideProfile) throw new Error("Profile not found");

    Object.assign(brideProfile, body); // merges all fields
    await brideProfile.save(); // triggers encryption

    return brideProfile;

    // return brideProfile;
  },

  getAllBrideProfiles: async (userId: string) => {
    return await BrideProfileModel.find({ profileCreatedBy: userId });
  },
};

export default brideProfileService;
