import Env from "../../config/Env.config";
import adminModel from "../../models/admin.model"
import { BrideProfileModel } from "../../models/brideProfile.model";
import usersModel from "../../models/users.model";
import responseHandlers from "../../services/response/response.service";
import statusCodes from "../../utils/statusCode.utils";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import dotenv from "dotenv";
import { generateToken } from "../../utils/jwt.utils";
dotenv.config();

const adminController = {

    createAdmin: async (req: any, res: any) => {
        const email = "digitalbhat2025@gmail.com";
        const password = "Lovemaabappu@10";

        // Hash password using bcrypt
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create admin
        const admin = await adminModel.create({
            email,
            password: hashedPassword,
        });

        return responseHandlers.sucessResponse(res, statusCodes.SUCCESS, "Admin created successfully", admin)

    },

    adminLogin: async (req: any, res: any) => {
        const { email, password } = req.body;

        // 1. Check if admin exists
        const admin = await adminModel.findOne({ email });
        if (!admin) {
            return responseHandlers.failureResponse(res, statusCodes.BAD_REQUEST, "Admin not found")
        }

        // 2. Compare password
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return responseHandlers.failureResponse(res, statusCodes.BAD_REQUEST, "Invalid credentials")
        }
        
        // 3. Generate JWT token
        let token = await generateToken({ userId: admin._id, role: "admin" })

        return responseHandlers.sucessResponse(res, statusCodes.SUCCESS, "Admin login successfully", token)
    },

    listUsers: async (req: any, res: any) => {
        const { page = 1, limit = 10, email = "", role = "" } = req.query;

        // Convert page/limit to numbers
        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);

        // Build query object
        let query: any = {};

        if (email) {
            query.email = { $regex: email, $options: "i" }; // case-insensitive partial match
        }

        if (role) {
            query.role = role;
        }

        // Fetch total count for pagination
        const total = await usersModel.countDocuments(query);

        // Fetch paginated users
        const users = await usersModel
            .find(query)
            .skip((pageNumber - 1) * limitNumber)
            .limit(limitNumber)
            .sort({ createdAt: -1 }); // latest first

        return responseHandlers.sucessResponse(res, statusCodes.SUCCESS, "Users fetched successfully", {
            total,
            page: pageNumber,
            limit: limitNumber,
            users,
        });
    },

    updateUser: async (req: any, res: any) => {
        const userId = req.params.id;
        const updatedData = req.body;
        const updatedUser = await usersModel.findByIdAndUpdate(userId, { $set: updatedData }, {
            new: true,
            runValidators: true,
        })
        if (!updatedUser) {
            return responseHandlers.failureResponse(res, statusCodes.BAD_REQUEST, "User not updated")
        }
        responseHandlers.sucessResponse(res, statusCodes.SUCCESS, "User updated successfully", updatedUser)
    },

    getUserById: async (req: any, res: any) => {
        const userId = req.params.id;
        const users = await usersModel.findById(userId);
        responseHandlers.sucessResponse(res, statusCodes.SUCCESS, "Users fetched successfully", users)
    },

    listBrides: async (req: any, res: any) => {
        const users = await BrideProfileModel.find();
        responseHandlers.sucessResponse(res, statusCodes.SUCCESS, "Bride fetched successfully", users)
    },

    updateBride: async (req: any, res: any) => {
        const userId = req.params.id;
        const updatedData = req.body;
        const updatedUser = await BrideProfileModel.findByIdAndUpdate(userId, { $set: updatedData }, {
            new: true,
            runValidators: true,
        })
        if (!updatedUser) {
            return responseHandlers.failureResponse(res, statusCodes.BAD_REQUEST, "Bride not updated")
        }
        responseHandlers.sucessResponse(res, statusCodes.SUCCESS, "Bride updated successfully", updatedUser)
    },

    getBrideById: async (req: any, res: any) => {
        const userId = req.params.id;
        const users = await BrideProfileModel.findById(userId);
        responseHandlers.sucessResponse(res, statusCodes.SUCCESS, "Brides fetched successfully", users)
    },

}

export default adminController