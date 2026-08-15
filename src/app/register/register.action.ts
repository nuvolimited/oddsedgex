"use server";

import { db } from "@/drizzle";
import { users } from "@/drizzle/schemas/user.schema";
import { userFunds } from "@/drizzle/schemas/user_fund.schema";
import {
  generateReferralCode,
  isEmailAvailable,
  isUsernameAvailable,
} from "@/lib/db";
import { hashPassword } from "@/lib/password_hasher";
import { escapeMarkdown, toTitleCase } from "@/lib/utils";
import { eq } from "drizzle-orm";
import TelegramBot from "node-telegram-bot-api";

type Agent = {
  id: string;
  name: string;
};

const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN as string;
const chatId = process.env.TELEGRAM_CHAT_ID as string;

/**
 * Registers a new user in the database.
 *
 * @param prevState The previous state of the form submission.
 * @param formData The form data submitted by the user.
 * @returns An object containing either an `error` property or a `success` property.
 */
export async function register(
  prevState: unknown,
  formData: FormData,
): Promise<{ error: string } | { success: true }> {
  if (!telegramBotToken || !chatId) {
    console.error("Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID");
    return { error: "Server configuration error" };
  }

  const email = (formData.get("email") as string).trim().toLocaleLowerCase();
  const password = await hashPassword(formData.get("password") as string);
  const username = (formData.get("username") as string)
    .trim()
    .toLocaleLowerCase();
  const name = toTitleCase((formData.get("name") as string).trim());
  const referralCode = await generateReferralCode();
  const agent_code = formData.get("agent_code") as string;
  const phone = (formData.get("phone") as string).trim();
  let agent: Agent | undefined;

  if (agent_code) {
    const [agent_found] = await db
      .select({ id: users.id, name: users.name })
      .from(users)
      .where(eq(users.referralCode, agent_code.trim()));

    agent = agent_found;
  }

  // Check if the username is available
  if (!(await isUsernameAvailable(username))) {
    return {
      error: "Username already exists",
    };
  }

  // Check if the email is available
  if (!(await isEmailAvailable(email))) {
    return {
      error: "Email already exists",
    };
  }

  try {
    // Insert the new user into the `users` table
    // and insert a new row into the `user_funds` table
    await db.transaction(async (tx) => {
      const [user] = await tx
        .insert(users)
        .values({
          email,
          password,
          username,
          name,
          phone,
          referralCode,
          referrerId: agent?.id,
        })
        .returning();

      // Insert a new row into the `user_funds` table
      await tx.insert(userFunds).values({
        userId: user.id,
      });
    });

    let message = `🎉 *New User Registration*`;

    if (agent) {
      message += " *with Agent code*";
    }

    message += ` 🎉\n\n🪪 Name: _*${escapeMarkdown(name)}*_\n\n👤 Username: _*${escapeMarkdown(username)}*_\n\n✉️ Email: _*${escapeMarkdown(email)}*_\n\n📞 Phone: _*${escapeMarkdown(phone)}*_\n\n🔐 AgentCode: _*${escapeMarkdown(agent_code)}*_`;

    if (agent) {
      message += `\n\n🧑‍🧒 Agent: _*${escapeMarkdown(agent.name)}*_`;
    }

    const bot = new TelegramBot(telegramBotToken, { polling: false });
    await bot.sendMessage(chatId, message, {
      parse_mode: "MarkdownV2",
    });

    // Return a success response
    return {
      success: true,
    };
  } catch (err) {
    console.error("Error creating user", err);
    // Return an error response
    return {
      error: "Error creating user",
    };
  }
}
