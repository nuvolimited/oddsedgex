import { buttonVariants } from "@/components/ui/button";
import Header from "@/components/ui/header";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import { db } from "@/drizzle";
import { FootBallPredictionEventType } from "@/lib/types";
import { cn, formatDateTime } from "@/lib/utils";
import { Metadata } from "next";
import Link from "next/link";
import { JSX } from "react";

export const metadata: Metadata = {
  title: "Prediction Game Management - OddsEdgeX",
};

/**
 * A button component that links to the create prediction game page.
 *
 * This component renders a button styled link that, when clicked,
 * navigates the user to the page for creating a new prediction game.
 *
 * @returns {JSX.Element} The rendered button component
 */
function CreatePredictionGameButton(): JSX.Element {
  return (
    // Link to the create prediction game page
    <Link
      href="/prediction_game_management/create"
      className={cn(buttonVariants())} // Apply button styling
    >
      {/* Button label */}
      Create a prediction game
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
function NoGamesFound() {
  return (
    <div className="w-full h-80 flex flex-col items-center justify-center gap-4">
      {/* Message displayed when there are no games found */}
      <p className="text-muted-foreground">No games found</p>

      {/* Button to create a new prediction game */}
      <CreatePredictionGameButton />
    </div>
  );
}

/**
 * A page component for managing prediction games.
 *
 * This component renders a header with a link to create a new prediction game,
 * and a table with the current prediction games.
 *
 * @returns {JSX.Element} The rendered component
 */
async function PredictionGameManagement(): Promise<JSX.Element> {
  /**
   * Fetch the prediction games from the database where the start date is greater than or equal to the current date.
   * Map the results to include the event object.
   *
   * @type {FootBallPredictionEventType[]}
   */
  const games = (
    await db.query.predictionGames.findMany({
      where: (predictionGames, { gte }) =>
        gte(predictionGames.start, new Date()),
    })
  ).map((game) => ({
    ...game,
    event: game.event as FootBallPredictionEventType,
  }));

  return (
    <div className="w-full flex flex-col gap-6">
      <Header title="Arbitrage Game Management">
        <p className="italic text-muted-foreground">
          Manage your prediction games here
        </p>
      </Header>
      {games.length === 0 ? (
        <NoGamesFound />
      ) : (
        <div className="w-full px-4 flex flex-col">
          <div className="w-full flex">
            <div className="flex-1" />
            <CreatePredictionGameButton />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>Odds(1|x|2)</TableHead>
                <TableHead>Start</TableHead>
                <TableHead>End</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {games.map((game) => (
                <TableRow key={game.id}>
                  <TableCell className="py-4">{`${game.event.homeTeam} vs ${game.event.awayTeam}`}</TableCell>
                  <TableCell className="py-4">{`${game.event.homeTeamOdds} | ${game.event.drawOdds} | ${game.event.awayTeamOdds}`}</TableCell>
                  <TableCell className="py-4">
                    {formatDateTime(game.start)}
                  </TableCell>
                  <TableCell className="py-4">
                    {formatDateTime(game.end)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

export default PredictionGameManagement;
