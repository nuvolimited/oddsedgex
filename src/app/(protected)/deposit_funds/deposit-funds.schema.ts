import { z } from "zod";

export const depositFundsFormSchema = z.object({
  amount: z.number().min(100, "Minimum deposit amount is 100"),
  proof: z.string().min(1, "Proof of deposit is required"),
  paymentOption: z.string().min(1, "Payment option is required"),
});
