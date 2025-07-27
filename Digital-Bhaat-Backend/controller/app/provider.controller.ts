
import providerServices from "../../services/app/provider.service"
import responseHandlers from "../../services/response/response.service";
import statusCodes from "../../utils/statusCode.utils";




const providerController = {

    getVerifiedBrides: async (req: any, res: any) => {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || "";

        const result = await providerServices.getVerifiedProfiles(page, limit, search);

        return responseHandlers.sucessResponse(
            res,
            statusCodes.SUCCESS,
            "Profiles fetched successfully.",
            result
        );
    }

}

export default providerController