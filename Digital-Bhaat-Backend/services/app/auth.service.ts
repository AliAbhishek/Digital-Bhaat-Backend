import usersModel from "../../models/users.model";
import { addPresignedUrls } from "./s3.service";

interface IBody {
    countryCode: string;
    phoneNumber: number;
    role: string;
}

const authService = {
    createUser: async (body: IBody) => {
        return await usersModel.create(body);
    },
    findUserByPhone: async (countryCode: string, phoneNumber: string) => {
        return await usersModel.findOne({ countryCode, phoneNumber });
    },
    updateProfile: async (id: string, body: any) => {
        return await usersModel.findByIdAndUpdate(id, {...body,isProfileCompleted: true}, { new: true,runValidators: true });
    },
    findUserById:async (id: string) => {
        let profile:any = await usersModel.findById(id);
         if (profile) { profile = profile.toObject({ virtuals: true }); }
        
            const updateProfileWithSignedUrl = await addPresignedUrls(profile)

        
            return updateProfileWithSignedUrl
    },

};

export default authService;
