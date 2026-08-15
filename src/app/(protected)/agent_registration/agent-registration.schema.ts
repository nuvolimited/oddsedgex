import { z } from "zod";

// Enum for KYC document types
export const agentRegistrationKYCDocumentEnum = z.enum(
  ["PASSPORT", "DRIVING_LICENSE", "OTHER"],
  {
    errorMap: () => ({
      message: `Document type must be either 'Passport' or 'Driving License' or 'Other'`,
    }),
  }
);

// Utility to validate URLs
const urlSchema = z
  .string()
  .url({ message: "Invalid URL format for document image" })
  .min(1, { message: "Document image URL is required" });

// Utility to validate ISO 8601 date and ensure it's in the future
const futureDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: "Expiration date must be in YYYY-MM-DD format",
  })
  .refine(
    (date) => {
      const inputDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Normalize to start of day
      return inputDate > today;
    },
    { message: "Expiration date must be in the future" }
  );

// KYC schema
const kycSchema = z
  .object({
    documentType: agentRegistrationKYCDocumentEnum,
    documentNumber: z
      .string()
      .min(1, { message: "Document number is required" })
      .max(20, { message: "Document number cannot exceed 20 characters" })
      .regex(/^[A-Za-z0-9-]+$/, {
        message: "Document number must be alphanumeric with hyphens only",
      })
      .trim(),
    documentFront: urlSchema,
    documentBack: urlSchema.optional(), // Optional for passports
    expirationDate: futureDateSchema,
  })
  .refine(
    (data) => {
      // Require documentBack for DRIVING_LICENSE
      if (data.documentType === "DRIVING_LICENSE" && !data.documentBack) {
        return false;
      }
      return true;
    },
    {
      message: "Document back is required for Driver’s License",
      path: ["documentBack"],
    }
  );

export const agentRegistrationFormSchema = z.object({
  phone: z
    .string()
    .min(1, { message: "Phone number is required" })
    .max(15, { message: "Phone number cannot exceed 15 characters" })
    .regex(/^\+?[1-9]\d{1,14}$/, {
      message:
        "Phone number must be numeric and include optional country code (e.g., +1234567890)",
    })
    .trim(),
  state: z
    .string()
    .min(1, { message: "State is required" })
    .max(100, { message: "State cannot exceed 100 characters" })
    .trim(),
  city: z
    .string()
    .min(1, { message: "City is required" })
    .max(100, { message: "City cannot exceed 100 characters" })
    .trim(),
  address: z
    .string()
    .min(1, { message: "Address is required" })
    .max(200, { message: "Address cannot exceed 200 characters" })
    .trim(),
  kyc: kycSchema,
});
