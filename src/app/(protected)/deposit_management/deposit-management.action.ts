"use server";

import { db } from "@/drizzle";
import {
  notifications,
  userDepositHistory,
  userFunds,
} from "@/drizzle/schemas";
import { escapeMarkdown, formatCurrency } from "@/lib/utils";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import TelegramBot from "node-telegram-bot-api";

const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN as string;
const chatId = process.env.TELEGRAM_CHAT_ID as string;

/**
 * Rejects a deposit transaction and notifies the user with the reason.
 *
 * @param {unknown} prevState The previous state of the form submission.
 * @param {FormData} formData The form data submitted by the user.
 * @returns {Promise<{ error: string } | { success: boolean }>} An object containing either an `error` property or a `success` property.
 */
export async function rejectTransaction(
  prevState: unknown,
  formData: FormData,
): Promise<{ error: string } | { success: boolean }> {
  // Get the reason and user ID from the form data
  const reason = formData.get("reason") as string;
  const userId = formData.get("userId") as string;
  const transactionId = formData.get("transactionId") as string;

  if (!telegramBotToken || !chatId) {
    console.error("Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID");
    return { error: "Server configuration error" };
  }

  try {
    await db.transaction(async (tx) => {
      const transaction = await tx.query.userDepositHistory.findFirst({
        where: (userDepositHistory, { eq }) =>
          eq(userDepositHistory.id, transactionId),
        columns: {
          amount: true,
        },
      });

      if (!transaction) throw new Error("Transaction not found");

      // Insert a new notification into the database
      await tx.insert(notifications).values({
        userId,
        title: "Transaction Rejected",
        message: reason,
      });

      // Update the transaction status in the database
      await tx
        .update(userDepositHistory)
        .set({ status: "failed" })
        .where(eq(userDepositHistory.id, transactionId));

      const user = await tx.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, userId),
        columns: {
          name: true,
          username: true,
          email: true,
        },
      });

      // Format and escape the currency amount
      const formattedAmount = escapeMarkdown(
        formatCurrency(Number.parseFloat(transaction.amount)),
      );
      const message = `*Deposit request rejected*\n\n👤 _${escapeMarkdown(
        user?.name || "Unknown",
      )}_\nUsername: _${escapeMarkdown(
        user?.username || "N/A",
      )}_\nEmail: _${escapeMarkdown(
        user?.email || "N/A",
      )}_\n\n💰 *${formattedAmount}*\n\n\n*Reason*\n_${escapeMarkdown(
        reason,
      )}_`;

      // Initialize Telegram bot
      const bot = new TelegramBot(telegramBotToken, { polling: false });

      await bot.sendMessage(chatId, message, {
        parse_mode: "MarkdownV2",
      });

      revalidatePath("/deposit_management");
      revalidatePath("/dashboard");
      revalidatePath("/deposit_funds");
    });

    // Return a success response
    return { success: true };
  } catch (error) {
    // Log the error
    console.error("Error rejecting transaction:", error);

    // Return an error response
    return { error: "Failed to reject transaction" };
  }
}

export async function approveTransaction(
  prevState: unknown,
  formData: FormData,
): Promise<{ error: string } | { success: boolean }> {
  // Get the user ID and transaction ID from the form data
  const userId = formData.get("userId") as string;
  const transactionId = formData.get("transactionId") as string;

  if (!telegramBotToken || !chatId) {
    console.error("Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID");
    return { error: "Server configuration error" };
  }

  try {
    await db.transaction(async (tx) => {
      const transactionAmount = await tx.query.userDepositHistory.findFirst({
        where: eq(userDepositHistory.id, transactionId),
        columns: {
          amount: true,
        },
      });

      // Get the user's balance from the database
      const userBalance = await tx.query.userFunds.findFirst({
        where: eq(userFunds.userId, userId),
        columns: {
          amount: true,
        },
      });

      const user = await tx.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, userId),
        with: {
          referrer: {
            columns: { name: true, id: true, username: true },
          },
        },
        columns: {
          name: true,
          username: true,
          email: true,
        },
      });

      const amount =
        Number(transactionAmount?.amount) + Number(userBalance?.amount);

      //   Update the user's balance in the database
      await tx
        .update(userFunds)
        .set({ amount: amount.toString() })
        .where(eq(userFunds.userId, userId));

      // Update the transaction status in the database
      await tx
        .update(userDepositHistory)
        .set({ status: "success" })
        .where(eq(userDepositHistory.id, transactionId));

      // Insert a new notification into the database
      await tx.insert(notifications).values({
        userId,
        title: "Transaction Approved",
        message: "Your transaction has been approved 🎉",
      });

      // Format and escape the currency amount
      const formattedAmount = escapeMarkdown(
        formatCurrency(Number(transactionAmount?.amount)),
      );
      const message = `*Deposit Approved*\n\n👤 _${escapeMarkdown(
        user?.name || "Unknown",
      )}_\nUsername: _${escapeMarkdown(
        user?.username || "N/A",
      )}_\nEmail: _${escapeMarkdown(
        user?.email || "N/A",
      )}_\n\n💰 *${formattedAmount}*`;

      // Initialize Telegram bot
      const bot = new TelegramBot(telegramBotToken, { polling: false });

      await bot.sendMessage(chatId, message, {
        parse_mode: "MarkdownV2",
      });

      if (user?.referrer) {
        const referrerFunds = await tx.query.userFunds.findFirst({
          where: eq(userFunds.userId, user.referrer.id),
          columns: {
            amount: true,
          },
        });

        const referralBonus = (Number(transactionAmount?.amount) * 2) / 100;
        const updatedReferrerAmount =
          Number(referrerFunds?.amount) + referralBonus;

        // Update referrer's funds
        await tx
          .update(userFunds)
          .set({ amount: updatedReferrerAmount.toString() })
          .where(eq(userFunds.userId, user.referrer.id));

        // Notify admin about the bonus
        const bonusMessage = `*Referral Bonus*\n\n👤 _${escapeMarkdown(
          user.referrer.name,
        )}_\nUsername: _${escapeMarkdown(
          user.referrer.username || "N/A",
        )}_\n\n💰 *${escapeMarkdown(
          formatCurrency(referralBonus),
        )}*`;

        await bot.sendMessage(chatId, bonusMessage, {
          parse_mode: "MarkdownV2",
        });

        // Insert a notification for the referrer
        await tx.insert(notifications).values({
          userId: user.referrer.id,
          title: "Referral Bonus Credited",
          message: `You have received a referral bonus of ${formatCurrency(
            referralBonus,
          )} for referring ${user.username}.`,
        });
      }

      revalidatePath("/deposit_management");
      revalidatePath("/dashboard");
      revalidatePath("/deposit_funds");
    });

    // Return a success response
    return { success: true };
  } catch (error) {
    // Log the error
    console.error("Error approving transaction:", error);

    // Return an error response
    return { error: "Failed to approve transaction" };
  }
}
