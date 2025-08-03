import { BrideProfileModel } from "../../models/brideProfile.model"
import { addPresignedUrls, generatePresignedUrl } from "./s3.service"



const providerServices = {
    getVerifiedProfiles: async (page = 1, limit = 10, search = "") => {
        const query: any = {
            isProfileVerifiedByAdmin: true,
            profileStatus: "Approved",
            saveAsDraft: false,
        };

        // Apply search filter
        if (search) {
            query.$or = [
                { "brideDetails.brideName": { $regex: search, $options: "i" } },
                { "guardianDetails.fatherName": { $regex: search, $options: "i" } },
            ];
        }

        const skip = (page - 1) * limit;

        const brides = await BrideProfileModel.find(query)
            .select("amountSanctioned collectedAmount isProfileVerifiedByAdmin profileStatus brideDetails.brideName brideDetails.weddingDate guardianDetails.fatherName guardianDetails.profileImage brideDetails.profileImage")
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });
        // console.log(brides, "brides")
        // Add presigned URLs
        const updatedUsers = await Promise.all(
            brides?.map(async (user: any) => {
                let profile = user.toObject()
                return await addPresignedUrls(profile)
            }
            )
        );
        // console.log(updatedUsers, "upp")

        const total = await BrideProfileModel.countDocuments(query);

        return {
            data: updatedUsers,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

}

export default providerServices