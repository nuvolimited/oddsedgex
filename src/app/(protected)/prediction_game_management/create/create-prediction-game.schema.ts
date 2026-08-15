import { toTitleCase } from "@/lib/utils";
import { z } from "zod";

export const createPredictionGameFormSchema = z
  .object({
    start: z.string().min(1, "Start date is required"),
    end: z.string().min(1, "End date is required"),
    event: z.object({
      homeTeam: z
        .string()
        .min(1, "Home Team Name is required")
        .transform((val) => toTitleCase(val).trim()),
      awayTeam: z
        .string()
        .min(1, "Away Team Name is required")
        .transform((val) => toTitleCase(val).trim()),
      homeTeamOdds: z
        .string()
        .min(1, "Home Team Odds is required")
        .refine((val) => {
          const parsedValue = parseFloat(val);
          return !isNaN(parsedValue) && parsedValue >= 0.001;
        }, "Home Team Odds is invalid"),
      awayTeamOdds: z
        .string()
        .min(1, "Away Team Odds is required")
        .refine((val) => {
          const parsedValue = parseFloat(val);
          return !isNaN(parsedValue) && parsedValue >= 0.001;
        }, "Away Team Odds is invalid"),
      drawOdds: z
        .string()
        .min(1, "Draw Odds is required")
        .refine((val) => {
          const parsedValue = parseFloat(val);
          return !isNaN(parsedValue) && parsedValue >= 0.001;
        }, "Draw Odds is invalid"),
    }),
  })
  .refine(
    (data) => {
      const start = new Date(data.start);
      const end = new Date(data.end);
      return start < end;
    },
    { message: "Start date must be before end date", path: ["start"] }
  );
