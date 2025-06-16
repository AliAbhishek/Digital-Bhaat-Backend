import usersModel from "../../models/users.model";

export const globalService = {
    getUserProfile: async (id: string) => {
        return await usersModel.findById(id)
    }
}