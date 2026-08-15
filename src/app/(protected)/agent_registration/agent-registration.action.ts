"use server";

import { auth } from "@/auth";
import { db } from "@/drizzle";
import { agents } from "@/drizzle/schemas/agent.schema";
import { toTitleCase } from "@/lib/utils";
import { redirect } from "next/navigation";

/**
 * Handles the agent registration submission
 * @param prevState The previous state of the form submission
 * @param formData The form data submitted by the user
 * @returns An object containing either an `error` property or a `success` property
 */
export async function createAgent(
  prevState: unknown,
  formData: FormData
): Promise<{ error: string } | { success: string }> {
  // Get the session from the auth middleware
  const session = await auth();

  // If there is no session, redirect the user to the login page
  if (!session?.user?.id) {
    redirect("/");
  }

  try {
    // Get the city, state, phone, address and kyc document from the form data
    const city = toTitleCase(formData.get("city") as string);
    const state = toTitleCase(formData.get("state") as string);
    const phone = formData.get("phone") as string;
    const address = formData.get("address") as string;
    const kyc = JSON.parse(formData.get("kyc") as string);

    // Insert the agent into the database
    await db.insert(agents).values({
      city,
      state,
      phone,
      address,
      kyc,
      userId: session.user.id,
    });

    // Return a success message
    return {
      success: "Registration successful. Please wait for approval",
    };
  } catch (error) {
    // Log the error
    console.error(error);

    // Return an error message
    return { error: "Failed to submit registration" };
  }
}
