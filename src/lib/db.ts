import { db } from "@/drizzle";
import { generateBookingCode, generateRandomString } from "./utils";
import { users } from "@/drizzle/schemas/user.schema";
import { eq } from "drizzle-orm";
import { arbitrageGameBets } from "@/drizzle/schemas";

/**
 * Generates a referral code that does not exist in the database.
 *
 * @returns A string referral code.
 */
export async function generateReferralCode(): Promise<string> {
  // Generate a random referral code
  const referralCode = generateRandomString(8);

  // Check if the referral code already exists in the database
  const doesCodeExist = await db.$count(
    users,
    eq(users.referralCode, referralCode),
  );

  // If the referral code already exists, generate a new one
  return doesCodeExist ? generateReferralCode() : referralCode;
}

/** * Generates a unique booking code that does not exist in the database.
 *
 * @returns A string booking code.
 */
export async function generateUniqueBookingCode(): Promise<string> {
  const bookingCode = generateBookingCode();

  const doesCodeExist = await db.$count(
    arbitrageGameBets,
    eq(arbitrageGameBets.bookingCode, bookingCode),
  );

  return doesCodeExist ? generateUniqueBookingCode() : bookingCode;
}

/**
 * Checks if a given username is available in the database.
 *
 * @param username The username to check for availability.
 * @returns A boolean indicating if the username is available.
 */
export async function isUsernameAvailable(username: string): Promise<boolean> {
  // Count the number of users with the given username
  const count = await db.$count(users, eq(users.username, username));

  // If no users have the given username, return true
  // Otherwise, return false
  return count === 0;
}

/**
 * Checks if a given email is available in the database.
 *
 * @param email The email address to check for availability.
 * @returns A boolean indicating if the email is available.
 */
export async function isEmailAvailable(email: string): Promise<boolean> {
  // Count the number of users with the given email
  const count = await db.$count(users, eq(users.email, email));

  // If no users have the given email, return true
  // Otherwise, return false
  return count === 0;
}
