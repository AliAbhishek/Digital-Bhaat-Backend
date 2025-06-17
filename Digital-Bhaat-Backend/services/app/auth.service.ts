import usersModel from "../../models/users.model";

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
    }

};

export default authService;
