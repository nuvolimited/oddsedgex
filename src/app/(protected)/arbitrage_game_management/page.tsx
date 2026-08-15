import Header from "@/components/ui/header";
import { Metadata } from "next";
import { db } from "@/drizzle";
import ArbitrageGameCard from "../_components/arbitrage-game-card";
import UpdateArbitrageGameOutcome from "./update-arbitrage-outcome";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { JSX } from "react";

export const metadata: Metadata = {
  title: "Arbitrage Game Management - OddsEdgeX",
};

export const dynamic = "force-dynamic";
export const fetchCache = "default-no-store";

/**
 * A button component that links to the create arbitrage game page.
 *
 * This component renders a button styled link that, when clicked,
 * navigates the user to the page for creating a new arbitrage game.
 *
 * @returns {JSX.Element} The rendered button component
 */
function CreateArbitrageGameButton(): JSX.Element {
  return (
    // Link to the create arbitrage game page
    <Link
      href="/arbitrage_game_management/create"
      className={cn(buttonVariants())} // Apply button styling
    >
      {/* Button label */}
      Create an arbitrage game
    </Link>
  );
}

/**
 * A component that renders a message when there are no games found.
 *
 * The component renders a message with a button that links to the
 * create prediction game page.
 *
 * @returns The rendered component
 */
function NoGamesFound(): JSX.Element {
  return (
    <div className="w-full h-80 flex flex-col items-center justify-center gap-4">
      {/* Message displayed when there are no games found */}
      <p className="text-muted-foreground">No games found</p>

      {/* Button to create a new prediction game */}
      <CreateArbitrageGameButton />
    </div>
  );
}

/**
 * Asynchronous function to manage arbitrage games.
 *
 * This function fetches arbitrage games with null outcomes from the database,
 * and renders a management interface for these games. It includes options to create
 * new arbitrage games and update existing ones.
 *
 * @returns {JSX.Element} The rendered management interface
 */
async function ArbitrageGameManagement(): Promise<JSX.Element> {
  // Fetch games from the database with null outcomes
  const games = await db.query.arbitrageGames.findMany({
    where: (arbitrageGames, { or, eq, isNull }) =>
      or(eq(arbitrageGames.outcome, ""), isNull(arbitrageGames.outcome)),
  });

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header for the management page */}
      <Header title="Arbitrage Game Management">
        <p className="italic text-muted-foreground">
          Manage your arbitrage games here
        </p>
      </Header>

      {/* Check if there are any games */}
      {games.length === 0 ? (
        // Display message if no games are found
        <NoGamesFound />
      ) : (
        // Display games if present
        <div className="w-full px-4 flex flex-col">
          <div className="w-full flex">
            <div className="flex-1" />
            <CreateArbitrageGameButton />
          </div>

          {/* Render game cards in a grid */}
          <div className="w-full grid md:grid-cols-2 gap-4 lg:grid-cols-3 px-4">
            {games.map((game) => (
              <ArbitrageGameCard
                key={game.id}
                game={{ ...game }}
                extras={
                  <UpdateArbitrageGameOutcome
                    end={game.expiresAt}
                    gameId={game.id}
                  />
                }
                canView
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ArbitrageGameManagement;
