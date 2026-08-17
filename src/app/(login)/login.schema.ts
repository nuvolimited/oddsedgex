import { z } from "zod";

/**
 * The schema for the login form.
 *
 * This schema defines the shape of the data that's expected to be submitted
 * with the login form.
 */
export const loginFormSchema = z.object({
  username: z
    .string()
    .min(1, "Username/Email is required")
    .transform((email) => email.toLowerCase()),
  password: z.string().min(1, "Password is required"),
});
