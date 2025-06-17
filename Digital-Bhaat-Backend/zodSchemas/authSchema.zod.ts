import { z } from "zod";

export const signUpSchema = z
  .object({
    countryCode: z.string().min(1, "Country code is required"),
    phoneNumber: z.string().regex(/^\d{10}$/, "Phone number must be 10 digits"),
    role: z.enum(["user", "donor"]),
  })
  .strict();

export const loginSchema = z
  .object({
    countryCode: z.string().min(1, "Country code is required"),
    phoneNumber: z.string().regex(/^\d{10}$/, "Phone number must be 10 digits"),
  })
  .strict();

export const verifyOtpSchema = z
  .object({
    otp: z
      .string()
      .min(4, "OTP must be at least 4 digits")
      .max(4, "OTP must be 4 digits"),
    userId: z.string().length(24, "Invalid user ID"),
  })
  .strict();

export const profileSchema = z
  .object({
    profileImage: z.string().url().optional(),

    fullName: z.string().min(1, "Full name is required").max(100),

    email: z.string().email("Invalid email"),

    address: z
      .object({
        street: z.string().min(1, "Street is required").optional(),
        village: z.string().min(1, "Village is required").optional(),
        city: z.string().min(1, "City is required"),
        district: z.string().min(1, "District is required"),
        state: z.string().min(1, "State is required"),
        pinCode: z
          .number({
            required_error: "Pin code is required",
            invalid_type_error: "Pin code must be a number",
          })
          .int()
          .min(100000, "Pin code must be at least 6 digits")
          .max(999999, "Pin code must be at most 6 digits"),
        country: z.string().min(1, "Country is required"),
      })
      .optional(),

    consentGiven: z
      .boolean({
        required_error: "Consent is required",
      })
      .optional(),

    isAnonymousDonation: z.boolean().optional(),
  })
  .strict();
