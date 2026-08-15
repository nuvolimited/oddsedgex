import { z } from "zod";

export const placeArbitrageFormSchema = z.object({
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((val) => {
      const parsedValue = parseFloat(val);
      return !isNaN(parsedValue) && parsedValue >= 100;
    }, "Amount must be at least 100"),
});
