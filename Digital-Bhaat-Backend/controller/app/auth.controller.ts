import authService from "../../services/app/auth.service"
import { Request, Response } from "express";
import responseHandlers, { CustomError } from "../../services/response/response.service";
import statusCodes from "../../utils/statusCode.utils";
import messages from "../../utils/messages.utils";
import { otpCreationAndExpiration } from "../../utils/otpCreationAndExpiration";
import { globalService } from "../../services/app/global.service";
import { generateToken } from "../../utils/jwt.utils";



const authController = {

    signUp: async (req: Request, res: Response) => {
        // await connectDB();
        const { countryCode, phoneNumber, role } = req.body;
        console.log("Request body:", req.body);
        const existingUser = await authService.findUserByPhone(countryCode, phoneNumber);
        // Generate OTP and expiry
        const { otp, otpExpiresIn } = await otpCreationAndExpiration();
        if (existingUser) {

            return responseHandlers.failureResponse(
                res,
                statusCodes.BAD_REQUEST,
                messages?.alreadyRegister
            );
        } else {
            // SIGNUP FLOW
            const creatUser = await authService.createUser({ countryCode, phoneNumber, role });
            if (!creatUser) {
                throw new CustomError(statusCodes.BAD_REQUEST, messages?.someThingWentWrong);
            }

            creatUser.otp = otp;
            creatUser.otpExpiresIn = otpExpiresIn;
            const user = await creatUser.save();

            return responseHandlers.sucessResponse(
                res,
                statusCodes.CREATED,
                messages.registrationSuccess,
                { userId: user._id,otp }
            );
        }
    },

    login: async (req: Request, res: Response) => {
        // await connectDB();
        const { countryCode, phoneNumber } = req.body;

        const existingUser = await authService.findUserByPhone(countryCode, phoneNumber);
        // Generate OTP and expiry
        const { otp, otpExpiresIn } = await otpCreationAndExpiration();
        if (existingUser) {
            // LOGIN FLOW
            existingUser.otp = otp;
            existingUser.otpExpiresIn = otpExpiresIn;
            await existingUser.save();

            return responseHandlers.sucessResponse(
                res,
                statusCodes.SUCCESS,
                messages?.loginSuccessfull,
                { userId: existingUser._id,otp }
            );
        } else {

            return responseHandlers.failureResponse(
                res,
                statusCodes.BAD_REQUEST,
                messages.messageForRegistration,

            );
        }
    },

    verifyOtp: async (req: Request, res: Response) => {
        const { otp, userId } = req.body
        let findUser = await globalService.getUserProfile(userId)
        if (!findUser) {
            throw new CustomError(statusCodes.BAD_REQUEST, messages?.someThingWentWrong)
        }
        const currentTime = new Date();
        if (findUser.otpExpiresIn! < currentTime) {
            throw new CustomError(statusCodes.BAD_REQUEST, messages.otpExpired);
        }
        if (findUser.otp != otp) {
            throw new CustomError(statusCodes.BAD_REQUEST, messages.invalidOtp);
        }
        findUser.otp = undefined;
        findUser.otpExpiresIn = undefined;
        findUser.isPhoneNumberVerified = true;
        await findUser.save();
        let token = await generateToken({ userId: findUser._id, role: findUser.role })

        return responseHandlers.sucessResponse(
            res,
            statusCodes.SUCCESS,
            messages.otpVerifiedSuccessfully,
            { userId: findUser._id, isPhoneNumberVerified: findUser.isPhoneNumberVerified,isProfileCompleted:findUser.isProfileCompleted, token }
        );

    },

    resendOtp: async (req: Request, res: Response) => {
        const { userId } = req.body;
        const user = await globalService.getUserProfile(userId);

        if (!user) {
            throw new CustomError(statusCodes.NOT_FOUND, messages.someThingWentWrong);
        }

        const { otp, otpExpiresIn } = await otpCreationAndExpiration();

        user.otp = otp;
        user.otpExpiresIn = otpExpiresIn;
        await user.save();

        // Send OTP logic goes here (SMS, email, etc.)

        return responseHandlers.sucessResponse(res, statusCodes.SUCCESS, "OTP resent successfully", { otp }); // remove OTP in production
    },

}

export default authController