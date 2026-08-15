"use server";

import { db } from "@/drizzle";
import {
  arbitrageGameBets,
  arbitrageGames,
  userFunds,
} from "@/drizzle/schemas";
import { FootBallArbitrageEventType } from "@/lib/types";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

/**
 * Updates the arbitrage game outcome and processes the bets accordingly.
 *
 * This function performs the following steps:
 * 1. Retrieves the game ID and outcome from the provided form data.
 * 2. Initiates a database transaction to:
 *    - Check if the arbitrage game exists.
 *    - Update the game's outcome.
 *    - Process all bets related to the game:
 *      - Calculate the winnings based on the outcome.
 *      - Update user funds with the calculated winnings.
 *      - Set bet status to "paid".
 * 3. Revalidates cache paths for arbitrage game management and home.
 * 4. Returns a success response or an appropriate error message.
 *
 * @param prevState - The previous state, not used in this function.
 * @param formData - The form data containing "gameId" and "outcome".
 * @returns An object indicating success or containing an error message.
 */
export async function updateArbitrageGame(
  prevState: unknown,
  formData: FormData
) {
  const id = formData.get("gameId") as string;
  const outcome = formData.get("outcome") as string;

  try {
    return await db.transaction(async (tx) => {
      // Retrieve the arbitrage game by ID
      const [arbitrageGame] = await tx
        .select()
        .from(arbitrageGames)
        .where(eq(arbitrageGames.id, id));

      // Check if the arbitrage game exists
      if (!arbitrageGame) {
        return {
          error: "Arbitrage game not found",
        };
      }

      // Retrieve all bets associated with the game
      const bets = await tx
        .select()
        .from(arbitrageGameBets)
        .where(eq(arbitrageGameBets.gameId, id));

      // Update the game's outcome
      await tx
        .update(arbitrageGames)
        .set({ outcome })
        .where(eq(arbitrageGames.id, id));

      // Process each bet if there are any
      if (bets.length > 0) {
        for (const bet of bets) {
          // Retrieve user fund for the user who placed the bet
          const [userFund] = await tx
            .select()
            .from(userFunds)
            .where(eq(userFunds.userId, bet.userId));

          // Skip if user fund is not found
          if (!userFund) {
            continue;
          }

          const event = arbitrageGame.event as FootBallArbitrageEventType;

          let amount: number;
          const betAmount = parseFloat(bet.amount);

          // Calculate winnings based on the outcome
          if (outcome === "home") {
            amount = (event.homeTeamArbitrage / 100) * betAmount + betAmount;
          } else if (outcome === "away") {
            amount = (event.awayTeamArbitrage / 100) * betAmount + betAmount;
          } else {
            amount = (event.drawArbitrage / 100) * betAmount + betAmount;
          }

          // Add winnings to user fund
          amount += parseFloat(userFund.amount);

          // Update user fund with the new amount
          await tx
            .update(userFunds)
            .set({ amount: amount.toString() })
            .where(eq(userFunds.userId, bet.userId));

          // Update bet status to "paid"
          await tx
            .update(arbitrageGameBets)
            .set({ status: "paid" })
            .where(eq(arbitrageGameBets.id, bet.id));
        }
      }

      // Revalidate cache paths
      revalidatePath("/arbitrage_game_management");

      // Return a success response
      return { success: true };
    });
  } catch (error) {
    // Log the error
    console.error("Error updating arbitrage game outcome:", error);

    // Return an error response
    return {
      error: "An error occurred while updating arbitrage game outcome.",
    };
  }
}
