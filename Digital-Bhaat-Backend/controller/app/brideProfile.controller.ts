import {  Response } from "express";
import statusCodes from "../../utils/statusCode.utils";
import brideProfileService from "../../services/app/brideProfile.service";
import responseHandlers, {
  CustomError,
} from "../../services/response/response.service";

const brideProfileController = {
  createBrideProfile: async (req: any, res: Response) => {
    const userId = req.user.userId;

    const newProfile = await brideProfileService.createBrideProfile({
      guardianDetails: req.body.guardianDetails,
      stepCompleted: 1,
      profileCreatedBy: userId,
    });

    if (!newProfile) {
      throw new CustomError(
        statusCodes.BAD_REQUEST,
        "Bride profile is not created"
      );
    }

    return responseHandlers.sucessResponse(
      res,
      statusCodes.SUCCESS,
      "Bride profile created successfully",
      { data: newProfile }
    );
  },

  updateBrideProfileStep: async (req: any, res: Response) => {
    const userId = req.user.userId;
    const profileId = req.params.id;
    const step = Number(req.body.step || 1);
    const isFinalStep = step == 4;

    // ✅ Fetch existing profile first
    const existingProfile = await brideProfileService.findBrideProfile(
      profileId,
      userId
    );
    if (!existingProfile) {
      throw new CustomError(
        statusCodes.NOT_FOUND,
        "Profile not found or access denied."
      );
    }

    // 🔒 Block editing if already submitted and under review or approved
    if (
      existingProfile.isProfileCompleted &&
      ["Under Review", "Approved"].includes(existingProfile.profileStatus)
    ) {
      throw new CustomError(
        statusCodes.FORBIDDEN,
        "Profile is already submitted and cannot be edited."
      );
    }

    const updatePayload: any = {};
    if (step == 2) {
        updatePayload.brideDetails = req.body.brideDetails
        updatePayload.brideAadharNumber=req.body.brideDetails.brideAadharNumber
    };
    if (step == 3) {
      updatePayload.familyIncome = req.body.familyIncome;
    }
    if (isFinalStep) {
      if (req.body.saveAsDraft) {
        updatePayload.saveAsDraft = true;
      } else {
        updatePayload.saveAsDraft = false;
        updatePayload.isProfileCompleted = true;
        updatePayload.profileStatus = "Under Review"; // auto move to review
      }
    }

    updatePayload.stepCompleted = step;

    const updated = await brideProfileService.updateBrideProfile(
      profileId,
      userId,
      updatePayload
    );

    if (!updated) {
      throw new CustomError(
        statusCodes.NOT_FOUND,
        "Profile not found or access denied."
      );
    }

    return responseHandlers.sucessResponse(
      res,
      statusCodes.SUCCESS,
      isFinalStep ? "Profile submitted successfully." : "Step updated.",
      { data: updated }
    );
  },

  // ✅ Get all profiles by logged-in user
  getAllBrideProfiles: async (req: any, res: Response) => {
    const userId = req.user.userId;
    const profiles = await brideProfileService.getAllBrideProfiles(userId);
    if (!profiles) {
      throw new CustomError(statusCodes.NOT_FOUND, "No profiles found.");
    }

    return responseHandlers.sucessResponse(
      res,
      statusCodes.SUCCESS,
      "Profiles fetched successfully.",
      { data: profiles }
    );
  },

  // ✅ Get profile by ID
  getBrideProfileById: async (req: any, res: Response) => {
    const userId = req.user.userId;
    const profileId = req.params.id;

    const profile = await brideProfileService.findBrideProfile(
      profileId,
      userId
    );

    if (!profile) {
      throw new CustomError(statusCodes.NOT_FOUND, "No profiles found.");
    }

    return responseHandlers.sucessResponse(
      res,
      statusCodes.SUCCESS,
      "Profiles fetched successfully.",
      { data: profile }
    );
  },
};

export default brideProfileController;
