import { z } from "zod";

export const rejectTransactionSchema = z.object({
  reason: z.string().min(1, "Reason is required"),
});
