import { z } from "zod";

export const registerFormSchema = z
  .object({
    name: z
      .string()
      .min(1, "Full Name is required")
      .min(3, "Full Name must be at least 3 characters long")
      .max(255, "Full Name must be less than 255 characters"),
    username: z
      .string()
      .min(1, "Username is required")
      .min(3, "Username must be at least 3 characters long")
      .max(255, "Username must be less than 255 characters")
      .transform((email) => email.toLowerCase()),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Provide a valid email address")
      .transform((email) => email.toLowerCase()),
    phone: z
      .string()
      .min(1, "Phone number is required")
      .max(15, "Phone number cannot exceed 15 characters"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(6, "Password should be at least 6 characters long"),
    confirmPassword: z.string().min(1, "Password Confiramtion is required"),
    agent_code: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
