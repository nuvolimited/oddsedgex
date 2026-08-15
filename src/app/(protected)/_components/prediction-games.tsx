import { Button } from "@/components/ui/button";
import { db } from "@/drizzle";
import { FootBallPredictionEventType } from "@/lib/types";
import { formatDateTime } from "@/lib/utils";
import { Volleyball } from "lucide-react";

/**
 * A component to display a list of prediction games.
 *
 * The component renders a list of upcoming prediction games, with each item
 * containing the start date, home and away teams, and the odds for each team.
 *
 * @returns JSX.Element
 */
async function PredictionGames() {
  /**
   * Fetch the prediction games from the database where the start date is
   * greater than or equal to the current date.
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

  /**
   * If there are no games, return null.
   */
  if (games.length === 0) return null;

  /**
   * Render the list of games.
   */
  return (
    <div className="w-full flex flex-col divide-y">
      {games.map((game) => (
        <div key={game.id} className="py-4 grid grid-cols-5 w-full">
          <div className="flex flex-col col-span-2 gap-2">
            <span className="text-xs text-muted-foreground">
              {/* Display the start date of the game */}
              {formatDateTime(game.start)}
            </span>
            <div className="flex flex-col gap-2 w-full">
              {/* Display the home and away teams */}
              <div className="flex gap-2 items-center">
                <Volleyball className="size-4" />
                <p className="font-semibold">{game.event.homeTeam}</p>
              </div>
              <div className="flex gap-2 items-center">
                <Volleyball className="size-4" />
                <p className="font-semibold">{game.event.awayTeam}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col col-span-3 justify-around w-full">
            <div className="flex gap-1 w-full justify-end">
              {/* Display the odds for each team */}
              <Button
                variant="secondary"
                className="pointer-events-none flex-col h-auto"
                size="sm"
              >
                <span className="text-muted-foreground text-xs">1</span>
                <span className="font-semibold">{game.event.homeTeamOdds}</span>
              </Button>
              <Button
                variant="secondary"
                className="pointer-events-none flex-col py-2 h-auto"
                size="sm"
              >
                <span className="text-muted-foreground text-xs">x</span>
                <span className="font-semibold">{game.event.drawOdds}</span>
              </Button>
              <Button
                variant="secondary"
                className="pointer-events-none flex-col py-2 h-auto"
                size="sm"
              >
                <span className="text-muted-foreground text-xs">2</span>
                <span className="font-semibold">{game.event.awayTeamOdds}</span>
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default PredictionGames;
