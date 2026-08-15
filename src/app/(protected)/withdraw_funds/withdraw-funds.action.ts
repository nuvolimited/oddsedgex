"use server";

import { auth } from "@/auth";
import { db } from "@/drizzle";
import { notifications, userFunds, userwithdrawalHistory } from "@/drizzle/schemas";
import { PaymentOptionDetails } from "@/lib/types";
import { escapeMarkdown, formatCurrency } from "@/lib/utils";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import TelegramBot from "node-telegram-bot-api";

/**
 * Handles the withdrawal of funds by a user.
 *
 * This function processes a user's withdrawal request by checking their balance,
 * recording the transaction, and notifying admin users for approval.
 *
 * @param prevState The previous state of the form submission.
 * @param formData The form data submitted by the user.
 * @returns An object containing either an `error` property or a `success` property.
 */
export async function withdrawFunds(
  prevState: unknown,
  formData: FormData
): Promise<{ error?: string; success?: string }> {
  // Extract the amount and details from the form data
  const amount = Number.parseFloat(formData.get("amount") as string);
  const details = JSON.parse(formData.get("details") as string);

  // Get the session from the auth middleware
  const session = await auth();

  // If there is no session, redirect the user to the login page
  if (!session?.user?.id) {
    redirect("/");
  }

  const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN as string;
  const chatId = process.env.TELEGRAM_CHAT_ID as string;

  if (!telegramBotToken || !chatId) {
    console.error("Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID");
    return { error: "Server configuration error" };
  }

  try {
    await db.transaction(async (tx) => {
      // Fetch the user's fund record from the database
      const userFund = await tx.query.userFunds.findFirst({
        where: (userFunds, { eq }) => eq(userFunds.userId, session.user.id!),
        with: {
          user: {
            columns: {
              id: true,
              name: true,
            },
          },
        },
      });

      // Throw an error if the user's fund record is not found
      if (!userFund) {
        throw new Error("User fund record not found");
      }

      const balance = Number.parseFloat(userFund.amount);
      
      // Check if the user has sufficient funds for the withdrawal
      if (balance < amount) {
        throw new Error("Insufficient funds");
      }

      // Insert a new record into the withdrawal history table
      await tx.insert(userwithdrawalHistory).values({
        userId: session.user.id!,
        amount: amount.toString(),
        details,
      });

      // Update the user's fund balance
      await tx
        .update(userFunds)
        .set({ amount: (balance - amount).toString() })
        .where(eq(userFunds.userId, session.user.id!));
        
      // Get all admin users
      const admins = await tx.query.users.findMany({
        where: (users, { eq }) => eq(users.role, "admin"),
      });

      // Send a notification to each admin user with a link to the withdrawal request
      await tx.insert(notifications).values(
        admins.map((admin) => ({
          userId: admin.id,
          title: "Funds Withdrawal Request",
          message: `User, ${
            userFund.user.name
          }, has requested a withdrawal of ${formatCurrency(amount)}.`,
        }))
      );

      // Fetch user details for the message
      const user = await tx.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, session.user.id!),
        columns: {
          name: true,
          username: true,
          email: true,
        },
      });

      // Format and escape the currency amount
      const formattedAmount = escapeMarkdown(formatCurrency(amount));

      const parsedDetails = details as PaymentOptionDetails;

      // Format message using MarkdownV2
      const message = `*Funds Withdrawal Request*\n\n👤 _${escapeMarkdown(
        user?.name || "Unknown"
      )}_\nUsername: _${escapeMarkdown(
        user?.username || "N/A"
      )}_\nEmail: _${escapeMarkdown(
        user?.email || "N/A"
      )}_\n\n💰 *${formattedAmount}*\n\n\n\n_ACCOUNT DETAILS_\n\nAcoount Name: *${
        escapeMarkdown(parsedDetails.accountHolderName || "N/A")
      }*\nAccount No: *${parsedDetails.accountNumber}*\nBank: *${
        escapeMarkdown(parsedDetails.bankName || "N/A")
      }*`;

      const bot = new TelegramBot(telegramBotToken, { polling: false });

      await bot.sendMessage(chatId, message, {
        parse_mode: "MarkdownV2",
      });

      revalidatePath("/withdraw_funds");
      revalidatePath("/withdrawal_management");
    });

    // Return a success response
    return {
      success:
        "Withdrawal request submitted successfully. Please wait for approval.",
    };
  } catch (error) {
    // Log the error
    console.error("Error withdrawing funds:", error);

    // Return an error response
    return {
      error:
        error instanceof Error ? error.message : "Failed to withdraw funds",
    };
  }
}
