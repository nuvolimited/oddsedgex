import { isAdmin } from "@/auth";
import Header from "@/components/ui/header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/drizzle";
import { FootBallArbitrageEventType } from "@/lib/types";
import { formatCurrency, toTitleCase } from "@/lib/utils";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import React from "react";

async function ArbitrageGame({
  params,
}: Readonly<{ params: Promise<{ id: string }> }>) {
  const id = (await params).id;

  // Check if the current user is not an admin
  if (!(await isAdmin())) {
    // If the user is not an admin, redirect them to the home page
    redirect("/");
  }

  // Input validation
  if (!id || typeof id !== "string") {
    notFound();
  }

  const game = await db.query.arbitrageGames.findFirst({
    where: (arbitrageGames, { eq }) => eq(arbitrageGames.id, id),
  });

  if (!game) {
    notFound();
  }

  const bets = await db.query.arbitrageGameBets.findMany({
    where: (arbitrageGameBets, { eq }) => eq(arbitrageGameBets.gameId, id),
    with: {
      user: {
        columns: {
          id: true,
          name: true,
        },
      },
    },
  });

  const event = game.event as FootBallArbitrageEventType;

  return (
    <div className="w-full flex flex-col gap-6">
      <Header title="Arbitrage Game Details">
        <p className="italic text-muted-foreground">
          {event.homeTeam} vs {event.awayTeam}
        </p>
      </Header>

      <div className="w-full px-4 gap-4 space-y-6">
        <div className="w-full grid md:grid-cols-2 gap-4">
          <div className="p-4 flex flex-col gap-2 border rounded-xl">
            <p className="text-xs">No. of Placed Bets</p>
            <h4>{bets.length}</h4>
          </div>

          <div className="p-4 flex flex-col gap-2 border rounded-xl">
            <p className="text-xs">Total Amount Placed</p>
            <h4>
              {formatCurrency(
                bets.reduce((acc, bet) => acc + Number(bet.amount), 0)
              )}
            </h4>
          </div>

          <div className="p-4 flex flex-col gap-2 border rounded-xl">
            <p className="text-xs">Expiry Date</p>
            <h4>
              {game.end.toLocaleDateString(undefined, {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                minute: "numeric",
                hour: "numeric",
                hour12: false,
              })}
            </h4>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead />
              <TableHead>User</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bets.map((bet, idx) => (
              <TableRow key={bet.id}>
                <TableCell className="py-4">{idx + 1}</TableCell>
                <TableCell className="py-4">
                  <Link href={`/users/user/${bet.user?.id}`}>
                    {bet.user?.name}
                  </Link>
                </TableCell>
                <TableCell className="py-4">
                  {formatCurrency(parseFloat(bet.amount))}
                </TableCell>
                <TableCell className="py-4">
                  {toTitleCase(bet.status)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default ArbitrageGame;
