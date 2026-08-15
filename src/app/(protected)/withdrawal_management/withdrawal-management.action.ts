"use server";

import { db } from "@/drizzle";
import {
  notifications,
  userFunds,
  userwithdrawalHistory,
} from "@/drizzle/schemas";
import { PaymentOptionDetails } from "@/lib/types";
import { escapeMarkdown, formatCurrency } from "@/lib/utils";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import TelegramBot from "node-telegram-bot-api";

const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN as string;
const chatId = process.env.TELEGRAM_CHAT_ID as string;

/**
 * Rejects a withdrawal transaction and notifies the user with the reason.
 *
 * @param {unknown} prevState The previous state of the form submission.
 * @param {FormData} formData The form data submitted by the user.
 * @returns {Promise<{ error: string } | { success: boolean }>} An object containing either an `error` property or a `success` property.
 */
export async function rejectTransaction(
  prevState: unknown,
  formData: FormData,
): Promise<{ error: string } | { success: boolean }> {
  if (!telegramBotToken || !chatId) {
    console.error("Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID");
    return { error: "Server configuration error" };
  }

  // Get the reason and user ID from the form data
  const reason = formData.get("reason") as string;
  const userId = formData.get("userId") as string;
  const transactionId = formData.get("transactionId") as string;

  try {
    await db.transaction(async (tx) => {
      const transaction = await tx.query.userwithdrawalHistory.findFirst({
        where: (userwithdrawalHistory, { eq }) =>
          eq(userwithdrawalHistory.id, transactionId),
        columns: {
          amount: true,
          userId: true,
        },
      });

      if (!transaction) throw new Error("Transaction not found");

      // Insert a new notification into the database
      await tx.insert(notifications).values({
        userId,
        title: "Withdrwal Request Rejected",
        message: reason,
      });

      const amount = Number.parseFloat(transaction.amount);

      const userFund = await tx.query.userFunds.findFirst({
        where: (userFunds, { eq }) => eq(userFunds.userId, userId),
        columns: {
          amount: true,
        },
      });

      // Get the user's current balance
      const balance = userFund ? Number.parseFloat(userFund.amount) : 0;

      // Update the user's fund balance by adding back the rejected amount
      await tx
        .update(userFunds)
        .set({ amount: (balance + amount).toString() })
        .where(eq(userFunds.userId, transaction.userId));

      // Update the transaction status in the database
      await tx
        .update(userwithdrawalHistory)
        .set({ status: "failed" })
        .where(eq(userwithdrawalHistory.id, transactionId));

      const user = await tx.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, userId),
        columns: {
          name: true,
          username: true,
          email: true,
        },
      });

      const formattedAmount = escapeMarkdown(formatCurrency(amount));
      const message = `*Fund Withdrawal Request Rejected ❌*\n\n👤 _${escapeMarkdown(
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

      revalidatePath("/withdrawal_management");
      revalidatePath("/dashboard");
      revalidatePath("/withdraw_funds");
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
  if (!telegramBotToken || !chatId) {
    console.error("Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID");
    return { error: "Server configuration error" };
  }

  // Get the user ID and transaction ID from the form data
  const userId = formData.get("userId") as string;
  const transactionId = formData.get("transactionId") as string;

  try {
    await db.transaction(async (tx) => {
      const transaction = await tx.query.userwithdrawalHistory.findFirst({
        where: eq(userwithdrawalHistory.id, transactionId),
        columns: {
          amount: true,
          details: true,
        },
      });

      if (!transaction) throw new Error("Transaction was not found");

      const user = await tx.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, userId),
        columns: {
          name: true,
          username: true,
          email: true,
        },
      });

      if (!user) throw new Error("User was not found");

      // Format and escape the currency amount
      const formattedAmount = escapeMarkdown(
        formatCurrency(Number.parseFloat(transaction.amount)),
      );

      const parsedDetails = transaction.details as PaymentOptionDetails;

      const message = `*Funds Withdrawal Request Approved ✅*\n\n👤 _${escapeMarkdown(
        user?.name || "Unknown",
      )}_\nUsername: _${escapeMarkdown(
        user?.username || "N/A",
      )}_\nEmail: _${escapeMarkdown(
        user?.email || "N/A",
      )}_\n\n💰 *${escapeMarkdown(formattedAmount)}*\n\n\n\n_ACCOUNT DETAILS_\n\nAcoount Name: *${
        escapeMarkdown(parsedDetails.accountHolderName)
      }*\nAccount No: *${escapeMarkdown(parsedDetails.accountNumber)}*\nBank: *${
        escapeMarkdown(parsedDetails.bankName)
      }*`;

      const bot = new TelegramBot(telegramBotToken, { polling: false });

      await bot.sendMessage(chatId, message, {
        parse_mode: "MarkdownV2",
      });

      // Update the transaction status in the database
      await tx
        .update(userwithdrawalHistory)
        .set({ status: "success" })
        .where(eq(userwithdrawalHistory.id, transactionId));

      // Insert a new notification into the database
      await tx.insert(notifications).values({
        userId,
        title: "Transaction Approved",
        message: "Your withdrawal request has been approved 🎉",
      });

      revalidatePath("/withdrawal_management");
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
