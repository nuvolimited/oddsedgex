"use server";

import { db } from "@/drizzle";
import { predictionGames } from "@/drizzle/schemas";
import { revalidatePath } from "next/cache";

/**
 * Handles creating a new prediction game.
 *
 * @param {unknown} prevState The previous state of the form submission.
 * @param {FormData} formData The form data submitted by the user.
 * @returns {Promise<{ error: string } | { success: boolean }>} An object containing either an `error` property or a `success` property.
 */
export async function createPredictionGame(
  prevState: unknown,
  formData: FormData
) {
  // Get the form details as a JSON object from the form data
  const start = new Date(formData.get("start") as string);
  const end = new Date(formData.get("end") as string);
  const event = formData.get("event") as string;

  try {
    // Insert the prediction game into the database
    await db.insert(predictionGames).values({
      // Set the end time of the prediction game
      end: end,
      // Set the start time of the prediction game
      start: start,
      // Set the event details of the prediction game
      event: JSON.parse(event),
      // Set the type of the prediction game
      eventType: "football",
    });

    // Invalidate the prediction game management and home pages
    // so that the new prediction game is shown
    revalidatePath("/prediction_game_management");
    revalidatePath("/home");

    // Return a success response
    return { success: true };
  } catch (error) {
    // Log the error
    console.error("Error creating prediction game:", error);

    // Return an error response
    return { error: "Failed to create prediction game" };
  }
}
