"use server";

import { isAdmin } from "@/auth";
import { db } from "@/drizzle";
import { userFunds, users } from "@/drizzle/schemas";
import { hashPassword } from "@/lib/password_hasher";
import { toTitleCase } from "@/lib/utils";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

/**
 * Resets a user's password to a new value.
 *
 * This function is called by the Next.js middleware when the user submits the
 * form to reset their password.
 *
 * @param prevState The previous state of the form submission.
 * @param formData The form data submitted by the user.
 * @returns An object containing either an `error` property or a `success` property.
 */
export async function resetUserPassword(
  prevState: unknown,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  // If there is no session, redirect the user to the login page
  if (!isAdmin) {
    redirect("/");
  }

  const userId = formData.get("userId") as string;
  const password = formData.get("newPassword") as string;

  try {
    const hashedPassword = await hashPassword(password);
    // Update the user's password in the database
    await db
      .update(users)
      .set({ password: hashedPassword })
      .where(eq(users.id, userId));

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error resetting user password:", error);

    return {
      error: "Failed to reset user password",
    };
  }
}

export async function updateUser(
  prevState: unknown,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  // If there is no session, redirect the user to the login page
  if (!isAdmin) {
    redirect("/");
  }

  const userId = formData.get("userId") as string;
  const name = formData.get("name") as string;
  const username = formData.get("username") as string;
  const email = formData.get("email") as string;

  try {
    // Update the user's information in the database
    await db
      .update(users)
      .set({ name: toTitleCase(name), username, email })
      .where(eq(users.id, userId));

    revalidatePath(`/users/user/${userId}`);

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error updating user information:", error);

    return {
      error: "Failed to update user information",
    };
  }
}

export async function debitUser(
  prevState: unknown,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  // If there is no session, redirect the user to the login page
  if (!isAdmin) {
    redirect("/");
  }

  const userId = formData.get("userId") as string;
  const amount = parseFloat(formData.get("amount") as string);

  try {
    const userFund = await db.query.userFunds.findFirst({
      where: (userFunds, { eq }) => eq(userFunds.userId, userId),
      columns: {
        amount: true,
      },
    });

    if (!userFund) {
      return { error: "User Account not found" };
    }

    let newAmount: string = "0";

    const difference = parseFloat(userFund.amount) - amount;

    if (difference >= 0) {
      newAmount = difference.toString();
    }

    await db
      .update(userFunds)
      .set({ amount: newAmount })
      .where(eq(userFunds.userId, userId));

    revalidatePath(`/users/user/${userId}`);

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error debiting user:", error);

    return {
      error: "Failed to debit user",
    };
  }
}

export async function creditUser(
  prevState: unknown,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  // If there is no session, redirect the user to the login page
  if (!isAdmin) {
    redirect("/");
  }

  const userId = formData.get("userId") as string;
  const amount = parseFloat(formData.get("amount") as string);

  try {
    const userFund = await db.query.userFunds.findFirst({
      where: (userFunds, { eq }) => eq(userFunds.userId, userId),
      columns: {
        amount: true,
      },
    });

    if (!userFund) {
      return { error: "User Account not found" };
    }

    const newAmount = (parseFloat(userFund.amount) + amount).toString();

    await db
      .update(userFunds)
      .set({ amount: newAmount })
      .where(eq(userFunds.userId, userId));

    revalidatePath(`/users/user/${userId}`);

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error crediting user:", error);

    return {
      error: "Failed to credit user",
    };
  }
}
