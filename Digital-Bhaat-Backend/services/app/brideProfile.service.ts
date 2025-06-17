
import { BrideProfileModel } from "../../models/brideProfile.model";

const brideProfileService = {
  findBrideProfile: async (id: string, userId: string) => {
    return await BrideProfileModel.findOne({
      _id: id,
      profileCreatedBy: userId,
    });
  },

  createBrideProfile: async (body: any) => {
    const brideProfile = await BrideProfileModel.create({
      ...body,
      brideAadharNumber: body?.guardianDetails?.fatherAadharNumber,
    });
    return brideProfile;
  },

  updateBrideProfile: async (id: string, userId: string, body: any) => {
    const brideProfile = await BrideProfileModel.findOneAndUpdate(
      {
        _id: id,
        profileCreatedBy: userId,
      },
      { $set: body },
      { new: true }
    );
    return brideProfile;
  },

  getAllBrideProfiles: async (userId: string) => {
    return await BrideProfileModel.find({ profileCreatedBy: userId });
  },
};

export default brideProfileService;
