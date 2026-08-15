import Header from "@/components/ui/header";
import { db } from "@/drizzle";
import PlaceBetDrawer from "./place-bet-drawer";
import { FootBallArbitrageEventType } from "@/lib/types";
import { isAuthenticated } from "@/auth";
import { redirect } from "next/navigation";
import SlidingImages from "../_components/sliding-images";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ArbitrageGameCountdown from "./arbitrage-game-countdown";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const fetchCache = "default-no-store";

async function ArbitrageGames() {
  if (!(await isAuthenticated())) {
    redirect("/");
  }

  const now = new Date();
  // Get only games for today
  const startOfDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    0,
    0,
    0,
    0
  );
  const endOfDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59,
    999
  );

  const games = await db.query.arbitrageGames.findMany({
    where: (arbitrageGames, { gte, lte, and }) =>
      and(
        gte(arbitrageGames.createdAt, startOfDay),
        lte(arbitrageGames.createdAt, endOfDay)
      ),
  });

  return (
    <div className="w-full flex flex-col items-center gap-6 h-full">
      <Header title="Arbitrage Games" />

      <div className="px-4 w-full space-y-4">
        <Input placeholder="Search match by name" />
        <Button size="lg" variant="secondary" className="w-full">
          Today&apos;s Games
        </Button>
        <Button size="lg" variant="outline" className="w-full">
          Reset
        </Button>
      </div>
      <ScrollArea className="w-full overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Match</TableHead>
              <TableHead>Odds(1|X|2)</TableHead>
              <TableHead>Arb %</TableHead>
              <TableHead>Start</TableHead>
              <TableHead>End</TableHead>
              <TableHead>Time Left</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {games.map((game) => {
              const {
                homeTeam,
                awayTeam,
                homeTeamOdds,
                awayTeamOdds,
                homeTeamArbitrage,
                awayTeamArbitrage,
                drawArbitrage,
                drawOdds,
              } = game.event as FootBallArbitrageEventType;
              return (
                <TableRow key={game.id}>
                  <TableCell>{`${homeTeam} vs ${awayTeam}`}</TableCell>
                  <TableCell>{`${homeTeamOdds} | ${drawOdds} | ${awayTeamOdds}`}</TableCell>
                  <TableCell>{`${homeTeamArbitrage} | ${drawArbitrage} | ${awayTeamArbitrage}`}</TableCell>
                  <TableCell>{formatDateTime(game.start)}</TableCell>
                  <TableCell>{formatDateTime(game.end)}</TableCell>
                  <TableCell>
                    <ArbitrageGameCountdown date={game.expiresAt} />
                  </TableCell>
                  <TableCell>
                    <PlaceBetDrawer
                      event={{
                        ...(game.event as FootBallArbitrageEventType),
                        id: game.id,
                      }}
                      disabled={new Date() >= game.start}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <div className="flex-1" />

      <SlidingImages />
    </div>
  );
}

export default ArbitrageGames;
