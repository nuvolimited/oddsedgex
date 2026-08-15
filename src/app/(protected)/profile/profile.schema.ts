import { z } from "zod";

/**
 * The schema for the update profile form.
 *
 * This schema defines the shape of the data that's expected to be submitted
 * with the update profile form. It includes validation rules for each field.
 */
export const updateProfileFormSchema = z.object({
  name: z
    .string()
    .min(1, "Full Name is required")
    .min(3, "Full Name must be at least 3 characters long")
    .max(255, "Full Name must be less than 255 characters"),
});

/**
 * The schema for the change password form.
 *
 * This schema defines the shape of the data that's expected to be submitted
 * with the change password form. It includes validation rules for each field.
 */
export const changePasswordFormSchema = z
  .object({
    currentPassword: z.string().min(1, "Current Password is required"),
    password: z
      .string()
      .min(1, "New Password is required")
      .min(6, "New Password should be at least 6 characters long"),
    confirmPassword: z.string().min(1, "Password Confiramtion is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
  });
