"use server";

import { auth } from "@/auth";
import { db } from "@/drizzle";
import { notifications, userDepositHistory } from "@/drizzle/schemas";
import { escapeMarkdown, formatCurrency } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import TelegramBot from "node-telegram-bot-api";
import fs from "fs";
import path from "path";
import os from "os";

/**
 * Handles the deposit of funds by a user.
 *
 * This action is called when the user submits the deposit form. It extracts the
 * amount, proof, and details from the form data and inserts a record into the
 * user deposit history table. It also sends a notification to all admin users
 * with a link to the deposit request and sends a Telegram message with the image.
 *
 * @param prevState The previous state of the form submission.
 * @param formData The form data submitted by the user.
 * @returns An object containing either an `error` property or a `success` property.
 */
export async function depositFunds(
  prevState: unknown,
  formData: FormData
): Promise<{ error: string } | { success: string }> {
  // Get the session from the auth middleware
  const session = await auth();

  // If there is no session, redirect the user to the login page
  if (!session?.user?.id) {
    redirect("/");
  }

  // Extract the amount, proof, and details from the form data
  const amount = formData.get("amount") as string;
  const proof = formData.get("proof") as string;
  const details = JSON.parse(formData.get("details") as string);

  const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN as string;
  const chatId = process.env.TELEGRAM_CHAT_ID as string;

  if (!telegramBotToken || !chatId) {
    console.error("Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID");
    return { error: "Server configuration error" };
  }

  try {
    const result = await db.transaction(async (tx) => {
      // Insert the deposit record into the user deposit history table
      await tx.insert(userDepositHistory).values({
        userId: session.user.id!,
        amount: amount,
        proof,
        details,
      });

      const user = await tx.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, session.user.id!),
        columns: {
          name: true,
          username: true,
          email: true,
        },
      });

      // Get all admin users
      const admins = await tx.query.users.findMany({
        where: (users, { eq }) => eq(users.role, "admin"),
      });

      // Format and escape the currency amount
      const formattedAmount = escapeMarkdown(
        formatCurrency(parseFloat(amount))
      );

      // Format message using MarkdownV2
      const message = `*Deposit Fund Approval*\n\n👤 _${escapeMarkdown(
        user?.name || "Unknown"
      )}_\nUsername: _${escapeMarkdown(
        user?.username || "N/A"
      )}_\nEmail: _${escapeMarkdown(
        user?.email || "N/A"
      )}_\n\n💰 *${formattedAmount}*`;

      // Send a notification to each admin user
      await tx.insert(notifications).values(
        admins.map((admin) => ({
          userId: admin.id,
          title: "Funds Deposit Request",
          message: `User ${
            user!.name
          } has requested a deposit of ${formatCurrency(parseFloat(amount))}`,
        }))
      );

      // Initialize Telegram bot
      const bot = new TelegramBot(telegramBotToken, { polling: false });

      // Validate the proof URL
      const isValidUrl = (url: string) => {
        try {
          new URL(url);
          return true;
        } catch {
          return false;
        }
      };

      if (!isValidUrl(proof)) {
        throw new Error("Invalid proof URL");
      }

      // Download the image using fetch
      let imagePath: string | undefined;
      try {
        const response = await fetch(proof);
        if (!response.ok) {
          throw new Error(`Failed to fetch image: ${response.statusText}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const tempDir = os.tmpdir();
        imagePath = path.join(tempDir, `deposit-proof-${Date.now()}.png`);
        fs.writeFileSync(imagePath, buffer);

        // Send the photo to Telegram
        await bot.sendPhoto(chatId, fs.createReadStream(imagePath), {
          caption: message,
          parse_mode: "MarkdownV2",
        });
      } finally {
        // Clean up the temporary file
        if (imagePath && fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }

      revalidatePath("/deposit_funds");
      revalidatePath("/deposit_management");

      // Return a success message
      return {
        success:
          "Deposit request submitted successfully. Please wait for approval.",
      };
    });

    return result;
  } catch (error) {
    // Log the caught error
    console.error("Error in depositFunds:", error);
    return { error: "Failed to deposit funds" };
  }
}
