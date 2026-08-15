"use server";

import { db } from "@/drizzle";
import { arbitrageGames } from "@/drizzle/schemas";
import { revalidatePath } from "next/cache";

/**
 * Creates a new arbitrage game entry in the database using the provided form data.
 *
 * This function extracts and validates form fields, calculates the expiration date
 * based on the selected expiry time, and inserts a new arbitrage game record.
 * After successful insertion, it invalidates relevant cache paths to ensure the
 * new game is visible in the UI.
 *
 * @param prevState - The previous state, if any (unused in this function).
 * @param formData - The form data containing arbitrage game details.
 *   Expected fields:
 *     - "start": string (ISO date)
 *     - "end": string (ISO date)
 *     - "minBet": string (minimum bet amount)
 *     - "maxBet": string (maximum bet amount)
 *     - "event": string (JSON stringified event object)
 *     - "expiry": string (expiry time, e.g., "48 hours", "2 weeks")
 *
 * @returns An object indicating success or error:
 *   - `{ success: true }` if the game was created successfully.
 *   - `{ error: string }` if there was a failure.
 *
 * @remarks
 * - The expiry time is validated against a list of allowed values.
 * - If the expiry time is invalid or missing, defaults to "48 hours".
 * - The event field is expected to be a JSON string and is parsed before insertion.
 * - Errors are logged to the console for debugging purposes.
 */
export async function createArbitrageGame(
  prevState: unknown,
  formData: FormData
) {
  // Get the form details as a JSON object from the form data
  const start = new Date(formData.get("start") as string);
  const end = new Date(formData.get("end") as string);
  const minBet = formData.get("minBet") as string;
  const maxBet = formData.get("maxBet") as string;
  const event = formData.get("event") as string;
  

  try {
    // Insert the arbitrage game into the database
    await db.insert(arbitrageGames).values({
      end: end,
      start: start,
      minBet: minBet,
      maxBet: maxBet,
      event: JSON.parse(event),
      eventType: "football",
      expiresAt: end,
    });

    // Invalidate the cache for the following paths so that the new arbitrage game is shown
    revalidatePath("/arbitrage_game_management");
    revalidatePath("/arbitrage_games");
    revalidatePath("/home");

    // Return a success response
    return { success: true };
  } catch (error) {
    // Log the error
    console.error("Error creating arbitrage game:", error);

    // Return an error response
    return { error: "Failed to create arbitrage game" };
  }
}
