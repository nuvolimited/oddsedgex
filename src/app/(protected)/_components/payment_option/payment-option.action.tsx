"use server";

import { db } from "@/drizzle";
import { paymentOptions } from "@/drizzle/schemas";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function deletePaymentOption(
  prevState: unknown,
  formData: FormData,
) {
  const id = formData.get("id") as string;

  try {
    await db.delete(paymentOptions).where(eq(paymentOptions.id, id));
    revalidatePath("/payment_options");
    return { success: true };
  } catch (error) {
    console.error("Error deleting payment option:", error);
    return { error: "Failed to delete payment option" };
  }
}
