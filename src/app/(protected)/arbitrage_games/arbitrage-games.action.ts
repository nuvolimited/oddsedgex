"use server";

import { auth } from "@/auth";
import { db } from "@/drizzle";
import {
  arbitrageGameBets,
  arbitrageGames,
  userFunds,
  users,
} from "@/drizzle/schemas";
import { generateUniqueBookingCode } from "@/lib/db";
import { FootBallArbitrageEventType } from "@/lib/types";
import { escapeMarkdown, formatCurrency } from "@/lib/utils";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import TelegramBot from "node-telegram-bot-api";

/**
 * Handles the process of placing an arbitrage bet for a user.
 *
 * This function performs the following steps:
 * 1. Retrieves the game ID and bet amount from the provided form data.
 * 2. Authenticates the user session; redirects to the home page if unauthenticated.
 * 3. Validates the arbitrage game exists and checks that the bet amount is within allowed limits.
 * 4. Checks if the user has sufficient funds to place the bet.
 * 5. Executes a database transaction to:
 *    - Insert the bet record.
 *    - Deduct the bet amount from the user's funds.
 * 6. Returns a success response or an appropriate error message.
 *
 * @param prevState - The previous state, not used in this function.
 * @param formData - The form data containing "gameId" and "amount".
 * @returns An object indicating success or containing an error message.
 */
export async function placeArbitrageBet(
  prevState: unknown,
  formData: FormData,
) {
  const gameId = formData.get("gameId") as string;
  const amount = formData.get("amount") as string;

  const session = await auth();

  if (!session?.user?.id) {
    return redirect("/");
  }

  try {
    const arbitrageGame = await db.query.arbitrageGames.findFirst({
      where: eq(arbitrageGames.id, gameId),
      columns: {
        event: true,
        minBet: true,
        maxBet: true,
      },
    });

    if (!arbitrageGame) {
      return { error: "Arbitrage game not found" };
    }

    if (Number(amount) < Number(arbitrageGame.minBet)) {
      return {
        error: `Bet amount must be at least ${arbitrageGame.minBet}`,
      };
    }

    if (Number(amount) > Number(arbitrageGame.maxBet)) {
      return {
        error: `Bet amount must be at most ${arbitrageGame.maxBet}`,
      };
    }

    const userId = session.user.id;

    const arbitrageGameEvent =
      arbitrageGame.event as FootBallArbitrageEventType;

    return await db.transaction(async (tx) => {
      const userFund = await tx.query.userFunds.findFirst({
        where: eq(userFunds.userId, userId),
        columns: {
          amount: true,
        },
      });

      if (!userFund) {
        return { error: "User not found" };
      }

      if (Number(userFund.amount) < Number(amount)) {
        return {
          error: "You don't have enough funds to place this bet",
        };
      }

      await tx.insert(arbitrageGameBets).values({
        userId,
        gameId,
        amount,
        bookingCode: await generateUniqueBookingCode(),
      });

      await tx
        .update(userFunds)
        .set({ amount: (Number(userFund.amount) - Number(amount)).toString() })
        .where(eq(userFunds.userId, userId));

      // Initialize Telegram bot
      const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN as string;
      const chatId = process.env.TELEGRAM_CHAT_ID as string;

      if (!telegramBotToken || !chatId) {
        console.error("Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID");
        return { error: "Server configuration error" };
      }
      const bot = new TelegramBot(telegramBotToken, { polling: false });

      const user = await tx.query.users.findFirst({
        where: eq(users.id, userId),
        columns: {
          name: true,
        },
      });

      let message = `*New Arbitrage Bet Placed*\n\n`;
      message += `👤 User: _${escapeMarkdown(user?.name || "N/A")}_\n`;
      message += `🎲 Game : _${escapeMarkdown(arbitrageGameEvent.homeTeam || "N/A")} vs ${escapeMarkdown(arbitrageGameEvent.awayTeam || "N/A")}_\n\n`;
      message += `*Arbitrage Odds*\n`;
      message += `🏠 Home: *${escapeMarkdown(arbitrageGameEvent.homeTeamArbitrage.toString() || "N/A")}%*\n`;
      message += `🤝 Draw: *${escapeMarkdown(arbitrageGameEvent.drawArbitrage.toString() || "N/A")}%*\n`;
      message += `⚽ Away: *${escapeMarkdown(arbitrageGameEvent.awayTeamArbitrage.toString() || "N/A")}%*\n\n`;
      message += `💰 Bet Amount: *${escapeMarkdown(formatCurrency(Number.parseFloat(amount)) || "N/A")}*\n`;

      // Send message to Telegram
      await bot.sendMessage(chatId, message, { parse_mode: "MarkdownV2" });

      // Return a success response
      return { success: true };
    });
  } catch (error) {
    // Log the error
    console.error("Error placing bet:", error);

    // Return an error response
    return { error: "An error occurred while placing the bet." };
  }
}
