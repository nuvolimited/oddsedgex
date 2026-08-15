import { auth } from "@/auth";
import Header from "@/components/ui/header";
import { db } from "@/drizzle";
import { redirect } from "next/navigation";
import React from "react";
import BetCard from "../_components/bet-card";

/**
 * A Next.js page that displays a user's bet history.
 *
 * The page uses the `auth` hook to get the user ID and redirects to the home page
 * if the user is not authenticated.
 *
 * The page then queries the database for all the bets associated with the user
 * using the `arbitrageGameBets` table. The bets are ordered by the creation date
 * in descending order (newest first).
 *
 * The page then renders a list of `BetCard` components, one for each bet in the
 * database. The `BetCard` component takes a `bet` prop which is an object with
 * the following properties:
 *
 * - `id`: The ID of the bet record.
 * - `userId`: The ID of the user who made the bet.
 * - `gameId`: The ID of the game the bet was placed on.
 * - `amount`: The amount of the bet.
 * - `status`: The status of the bet (pending, paid, etc.).
 * - `createdAt`: The date and time the bet was created.
 * - `game`: An object with the properties of the game the bet was placed on.
 *
 * The `game` object has the following properties:
 *
 * - `id`: The ID of the game.
 * - `start`: The start date and time of the game.
 * - `end`: The end date and time of the game.
 * - `event`: The event object associated with the game.
 * - `outcome`: The outcome of the game.
 */
async function BetHistory() {
  const userId = (await auth())?.user.id;
  if (!userId) redirect("/");

  const bets = await db.query.arbitrageGameBets.findMany({
    where: (arbitrageGameBets, { eq }) => eq(arbitrageGameBets.userId, userId),
    orderBy: (arbitrageGameBets, { desc }) => desc(arbitrageGameBets.createdAt),
    with: {
      game: {
        columns: {
          outcome: true,
          start: true,
          end: true,
          event: true,
        },
      },
    },
  });

  return (
    <div className="w-full flex flex-col gap-6">
      <Header title="Bet History" />

      <div className="w-full px-4 grid md:grid-cols-2 gap-4">
        {bets.map((bet) => (
          <BetCard key={bet.id} bet={bet} />
        ))}
      </div>
    </div>
  );
}

export default BetHistory;
