import { Badge } from "@/components/ui/badge";
import Countdown from "@/components/ui/countdown";
import { FootBallArbitrageEventType } from "@/lib/types";
import { formatDateRange } from "@/lib/utils";
import Link from "next/link";
import { JSX, ReactNode } from "react";

type ArbitrageGameCardProps = {
  game: {
    id: string;
    start: Date;
    end: Date;
    event: unknown;
  };
  extras?: ReactNode;
  canView?: boolean;
};

type OddsInfoProps = {
  title: string;
  odds: number;
  arbitrage: number;
};

/**
 * A component to display odds information for a specific event.
 *
 * @param {OddsInfoProps} props - The properties for the component.
 * @returns {JSX.Element} The rendered component.
 */
function OddsInfo({
  title,
  odds,
  arbitrage,
}: Readonly<OddsInfoProps>): JSX.Element {
  return (
    <div className="bg-secondary text-secondary-foreground flex flex-col text-lg items-center gap-1.5 p-2 rounded-sm">
      {/* Display the title of the odds */}
      <div className="text-xs">{title}</div>
      {/* Display the odds value */}
      <div className="my-1.5">{odds}</div>
      {/* Display the arbitrage percentage */}
      <div>{arbitrage}%</div>
    </div>
  );
}

/**
 * A component to display an arbitrage game card.
 *
 * This component displays the information of an arbitrage game,
 * including the home and away teams, the odds for each team,
 * and the arbitrage percentage.
 *
 * @param {ArbitrageGameCardProps} props - The properties for the component.
 * @returns {JSX.Element} The rendered component.
 */
function ArbitrageGameCard({
  game: { id, start, end, event },
  extras,
  canView,
}: Readonly<ArbitrageGameCardProps>): JSX.Element {
  const {
    homeTeam,
    awayTeam,
    homeTeamOdds,
    awayTeamOdds,
    homeTeamArbitrage,
    awayTeamArbitrage,
    drawArbitrage,
    drawOdds,
  } = event as FootBallArbitrageEventType;

  const isOngoing = new Date() > start && new Date() < end;

  const isOver = new Date() > end;

  return (
    <div key={id} className="flex flex-col p-4 gap-1.5 border">
      <div className="flex items-center">
        {/* Countdown to the start of the game */}
        {isOngoing ? (
          <div className="flex items-center gap-1.5">
            <div className="size-2 rounded-full bg-red-600 animate-pulse" />
            <span className="text-muted-foreground italic text-xs">Live</span>
          </div>
        ) : (
          <div className="text-xs">
            <Countdown date={start} />
          </div>
        )}
        {isOver && <Badge variant="outline">FT</Badge>}
        <div className="flex-1" />
        <p className="text-xs text-muted-foreground">
          {formatDateRange(start, end)} {/* Date range of the game */}
        </p>
      </div>
      <div className="w-full flex gap-4 relative">
        <div className="flex flex-col justify-around text-center">
          <p>{homeTeam}</p>
          <p className="text-xs">vs</p>
          <p>{awayTeam}</p>
        </div>

        {/* Grid with the odds and arbitrage for each team */}
        <div className="grid grid-cols-3 flex-1 gap-1.5">
          <OddsInfo
            title="Home"
            odds={homeTeamOdds}
            arbitrage={homeTeamArbitrage}
          />
          <OddsInfo title="Draw" odds={drawOdds} arbitrage={drawArbitrage} />
          <OddsInfo
            title="Away"
            odds={awayTeamOdds}
            arbitrage={awayTeamArbitrage}
          />
        </div>

        {canView && (
          <Link
            href={`/arbitrage_game_management/${id}`}
            className="absolute inset-0"
          />
        )}
      </div>
      {/* Extras */}
      {extras}
    </div>
  );
}

export default ArbitrageGameCard;
