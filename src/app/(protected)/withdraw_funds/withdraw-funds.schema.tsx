import { toTitleCase } from "@/lib/utils";
import { z } from "zod";

export const withdrawFundsFormSchema = z.object({
  amount: z.number().min(100, "Amount must be at least 100"),
  details: z.object({
    accountNumber: z.string().min(1, "Account number is required").trim(),
    bankName: z.string().min(1, "Bank name is required"),
    accountHolderName: z
      .string()
      .min(1, "Account holder name is required")
      .transform((val) => toTitleCase(val).trim()),
  }),
});
