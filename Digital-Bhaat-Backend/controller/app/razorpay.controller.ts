
import Razorpay from "razorpay";
import Env from "../../config/Env.config";
import responseHandlers from "../../services/response/response.service";
import statusCodes from "../../utils/statusCode.utils";

const razorpay = new Razorpay({
    key_id: Env.RAZORPAY_KEY_ID,     // From Dashboard
    key_secret: Env.RAZORPAY_KEY_SECRET  // From Dashboard
});

const razorpayController = {

    createOrder: async (req: any, res: any) => {

        const {amount,currency}=req.body
        // console.log(req.user,"user")
        const options = {
            amount: amount*100, // amount in paise (₹100)
            currency: currency,
            receipt: `DG-${Date.now()}`,
            notes: { userId: req.user.userId }
            
        };
        const order = await razorpay.orders.create(options);
        return responseHandlers.sucessResponse(
            res,
            statusCodes.SUCCESS,
            "Order Created successfully.",
            order
        );

    }

}

export default razorpayController