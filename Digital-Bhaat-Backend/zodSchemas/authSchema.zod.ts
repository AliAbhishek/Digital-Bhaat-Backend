import { z } from "zod";

export const signUpSchema = z.object({
  countryCode: z.string().min(1, "Country code is required"),
  phoneNumber: z
    .string()
    .regex(/^\d{10}$/, "Phone number must be 10 digits"),
    role: z.enum(["user", "donor"]),

});

export const loginSchema = z.object({
  countryCode: z.string().min(1, "Country code is required"),
  phoneNumber: z
    .string()
    .regex(/^\d{10}$/, "Phone number must be 10 digits"),
   

});


export const verifyOtpSchema = z.object({
  otp: z.string().min(4, "OTP must be at least 4 digits").max(4, "OTP must be 4 digits"),
  userId: z.string().length(24, "Invalid user ID"),
});


