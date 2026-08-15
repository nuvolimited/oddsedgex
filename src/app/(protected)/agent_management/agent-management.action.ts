"use server";

import { db } from "@/drizzle";
import { agents } from "@/drizzle/schemas";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";


/**
 * Approves an agent by updating their status to "verified" in the database.
 *
 * @param {string} agentId - The ID of the agent to approve.
 * @return {Promise<{ error?: string; success?: boolean }>} - A promise that resolves to an object
 * containing an error message if the agent was not found, or a success flag if the agent was approved.
 */
export async function approveAgent(
  agentId: string
): Promise<{ error?: string; success?: boolean }> {
  // Check if the agent exists in the database
  const agentExists = await db.query.agents.findFirst({
    where: (agents, { eq }) => eq(agents.userId, agentId),
  });

  if (!agentExists) {
    // Return an error if the agent was not found
    return { error: "Agent not found" };
  }

  // Update the agent's status to "verified" in the database
  await db
    .update(agents)
    .set({ status: "verified" })
    .where(eq(agents.userId, agentId));

  // Revalidate the "/agent_management" page to update the agent's status on the client
  revalidatePath("/agent_management");

  // Return a success flag
  return { success: true };
}


/**
 * Rejects an agent by deleting their entry from the database.
 *
 * @param {string} agentId - The ID of the agent to reject.
 * @return {Promise<{ error?: string; success?: boolean }>} - A promise that resolves to an object
 * containing an error message if the agent was not found, or a success flag if the agent was rejected.
 */
export async function rejectAgent(
  agentId: string
): Promise<{ error?: string; success?: boolean }> {
  // Check if the agent exists in the database
  const agentExists = await db.query.agents.findFirst({
    where: (agents, { eq }) => eq(agents.userId, agentId),
  });

  if (!agentExists) {
    // Return an error if the agent was not found
    return { error: "Agent not found" };
  }

  // Delete the agent's entry from the database
  await db.delete(agents).where(eq(agents.userId, agentId));

  // Revalidate the "/agent_management" page to update the agent's status on the client
  revalidatePath("/agent_management");

  // Return a success flag
  return { success: true };
}
