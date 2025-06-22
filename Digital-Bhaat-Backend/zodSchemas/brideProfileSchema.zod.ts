import { z } from "zod";

const addressSchema = z.object({
  street: z.string().min(1).optional(),
  village: z.string().min(1),
  postOffice: z.string().min(1),
  district: z.string().min(1),
  state: z.string().min(1),
  pincode: z.string(),
});

export const guardianDetailsSchema = z
  .object({
    fatherName: z.string().min(1),
    // fatherAadharNumber: z.string().length(12), // assuming Aadhaar length
    fatherPhoneNumber: z.string().length(10),
    // fatherAadhaarImage: z.string().url(),
    guardianRelation: z.string().min(1),
    guardianDisability: z.boolean(),
    isSingleParent: z.boolean(),
    profileImage: z.string().url().optional(),
    ...addressSchema.shape,
  })
  .strict();

export const brideDetailsSchema = z
  .object({
    brideDOB: z.string(), // ISO Date
    brideName: z.string().min(1),
    brideAadharNumber: z.string().length(12),
    bridePhoneNumber: z.string().length(10),
    brideAadhaarImage: z.string().url(),
    brideDisability: z.boolean(),
    weddingDate: z.string(),
    profileImage: z.string().url(),
    weddingVenue: z.string().min(1),
    ...addressSchema.shape,
  })
  .strict();

export const createBrideProfileSchema = z
  .object({
    brideDetails: brideDetailsSchema.optional(),
    guardianDetails: guardianDetailsSchema.optional(),
    familyIncome: z.number().min(0).optional(),
    step: z.number().min(1).max(4).optional(),
    saveAsDraft: z.boolean().optional(),
    fatherAadharNumber: z.string().length(12).optional()
  })
  .strict();
