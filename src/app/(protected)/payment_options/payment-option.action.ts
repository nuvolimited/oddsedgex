"use server";

import { db } from "@/drizzle";
import { paymentOptions } from "@/drizzle/schemas";
import { revalidatePath } from "next/cache";

/**
 * Handles creating a new payment option
 * @param prevState The previous state of the form submission
 * @param formData The form data submitted by the user
 * @returns An object containing either an `error` property or a `success` property
 */
export async function createPaymentOption(
  prevState: unknown,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  // Get the form details as a JSON object from the form data
  const details = JSON.parse(formData.get("details") as string);

  try {
    // Insert the payment option into the database
    await db.insert(paymentOptions).values({
      details,
    });

    // Revalidate the /payment_options page in the cache so that the new payment option is shown
    revalidatePath("/payment_options");

    // Return a success response
    return { success: true };
  } catch (error) {
    // Log the error
    console.error("Error creating payment option:", error);

    // Return an error response
    return { error: "Failed to create payment option" };
  }
}
