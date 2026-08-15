"use server";

import { db } from "@/drizzle";
import { users } from "@/drizzle/schemas/user.schema";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { toTitleCase } from "@/lib/utils";
import { hashPassword, verifyPassword } from "@/lib/password_hasher";

/**
 * Updates the user's profile information.
 *
 * @param prevState The previous state of the form submission.
 * @param formData The form data submitted by the user.
 * @returns An object containing either an `error` property or a `success` property.
 */
export async function updateProfile(
  prevState: unknown,
  formData: FormData
): Promise<{ error: string } | { success: true }> {
  // Get the new full name from the form data
  const name = toTitleCase(formData.get("name") as string).trim();

  // Get the session from the auth middleware
  const session = await auth();

  // If there is no session, redirect the user to the login page
  if (!session?.user?.id) {
    redirect("/");
  }

  // Update the user's name in the database
  await db.update(users).set({ name }).where(eq(users.id, session.user.id));

  // Return a success object
  return { success: true };
}

/**
 * Changes the user's password.
 *
 * @param prevState The previous state of the form submission.
 * @param formData The form data submitted by the user.
 * @returns An object containing either an `error` property or a `success` property.
 */
export async function changePassword(
  prevState: unknown,
  formData: FormData
): Promise<{ error: string } | { success: true }> {
  // Get the session from the auth middleware
  const session = await auth();

  // If there is no session, redirect the user to the login page
  if (!session?.user?.id) {
    redirect("/");
  }

  // Retrieve the user's current password from the database
  const [user] = await db
    .select({ password: users.password })
    .from(users)
    .where(eq(users.id, session.user.id));

  // Get the current and new passwords from the form data
  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = await hashPassword(formData.get("password") as string);

  // Verify if the current password is correct
  if (!(await verifyPassword(currentPassword, user.password))) {
    return {
      error: "Current password is incorrect",
    };
  }

  try {
    // Update the user's password in the database
    await db
      .update(users)
      .set({ password: newPassword })
      .where(eq(users.id, session.user.id));

    // Return a success object
    return { success: true };
  } catch (error) {
    // Log any errors that occur while updating the password
    console.error("error updating password", error);

    // Return an error object
    return {
      error: "Error updating password",
    };
  }
}
