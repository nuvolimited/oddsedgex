import { z } from "zod";

export const resetUserPasswordFormSchema = z
  .object({
    password: z
      .string()
      .min(1, "New Password is required")
      .min(6, "New Password should be at least 6 characters long"),
    confirmPassword: z.string().min(1, "Password Confiramtion is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
  });

export const updateUserFormSchema = z.object({
  name: z
    .string()
    .min(1, "Full Name is required")
    .min(3, "Full Name must be at least 3 characters long")
    .max(255, "Full Name must be less than 255 characters"),
  username: z
    .string()
    .min(1, "Username is required")
    .min(3, "Username must be at least 3 characters long")
    .max(255, "Username must be less than 255 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Provide a valid email address"),
});

export const creditUserFormSchema = z.object({
  amount: z.number().min(5, "Minimum credit amount is 5"),
});

export const debitUserFormSchema = z.object({
  amount: z.number().min(5, "Minimum debit amount is 5"),
});
