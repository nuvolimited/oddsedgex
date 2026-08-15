"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Countdown from "@/components/ui/countdown";
import { FootBallArbitrageEventType } from "@/lib/types";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { Printer } from "lucide-react";

/**
 * Calculates the payout for a given arbitrage percentage and amount.
 * 
 * This function takes in two parameters: an arbitrage percentage and an amount,
 * and computes the payout by applying the arbitrage percentage to the amount,
 * then adding the original amount to the result. The computed payout is then
 * formatted as a currency string in Nigerian Naira (NGN) using the formatCurrency
 * function.
 *
 * @param {number} arbitrage - The arbitrage percentage (e.g., 10 for 10%)
 *                             which represents the additional percentage
 *                             to be applied to the original amount.
 * @param {number} amount - The original amount on which the arbitrage
 *                          percentage is applied to calculate the payout.
 * @returns {string} The calculated payout formatted as a currency string
 *                   in Nigerian Naira (NGN), which represents the total
 *                   amount after applying the arbitrage.
 */
const calculatePayout = (arbitrage: number, amount: number): string => {
  // Calculate the additional amount by applying the arbitrage percentage
  const additionalAmount = (arbitrage / 100) * amount;

  // Calculate the total payout by adding the additional amount to the original amount
  const totalPayout = additionalAmount + amount;

  // Format the total payout as a currency string for display
  return formatCurrency(totalPayout);
};

type BetCardProps = {
  bet: {
    id: string;
    createdAt: Date;
    userId: string;
    status: "pending" | "paid";
    gameId: string;
    amount: string;
    game: {
      end: Date;
      event: unknown;
      start: Date;
      outcome: string | null;
    };
  };
};

/**
 * A component to render a bet card.
 *
 * The component takes a prop called "bet" which is an object containing the details
 * of the bet. The object should have the following properties:
 *
 * - id: The ID of the bet
 * - createdAt: The date and time the bet was created
 * - userId: The ID of the user who made the bet
 * - status: The status of the bet (pending, paid, etc.)
 * - gameId: The ID of the game the bet was placed on
 * - amount: The amount of the bet
 * - game: An object containing the details of the game the bet was placed on
 *
 * The component renders a card with the details of the bet.
 *
 * @param {BetCardProps} props - The props for the component
 * @returns {JSX.Element} The rendered component
 */
export default function BetCard({ bet }: Readonly<BetCardProps>) {
  /**
   * The event object from the bet
   */
  const event = bet.game.event as FootBallArbitrageEventType;

  const amount = Number(bet.amount);

  /**
   * Check if the game is ongoing
   */
  const isOngoing = new Date() > bet.game.start && new Date() < bet.game.end;

  /**
   * Check if the game is over
   */
  const isOver = new Date() > bet.game.end;

  /**
   * The minimum expected payout for the bet
   */
  const min = formatCurrency(
    Math.min(
      ...[
        event.awayTeamArbitrage,
        event.homeTeamArbitrage,
        event.drawArbitrage,
      ].map(
        (arbitrage) =>
          (arbitrage / 100) * Number(bet.amount) + Number(bet.amount)
      )
    )
  );

  /**
   * The maximum expected payout for the bet
   */
  const max = formatCurrency(
    Math.max(
      ...[
        event.awayTeamArbitrage,
        event.homeTeamArbitrage,
        event.drawArbitrage,
      ].map(
        (arbitrage) =>
          (arbitrage / 100) * Number(bet.amount) + Number(bet.amount)
      )
    )
  );

  /**
   * Function to print the bet slip
   */
  const handlePrint = () => {
    // Create a new window for printing
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Bet Slip - ${bet.id.split("-")[0]}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .bet-slip { max-width: 450px; margin: 0 auto; font-size: 16px; }
            .header { display: flex; align-items: center; gap: 10px; }
            .logo { display: flex; align-items: center; gap: 2px; }
            .logo img { width: 128px; height: 48px; padding: 2px; }
            .bet-details > section { font-weight: 100;}
            .bet-details > section > span { font-size: 14px; font-weight: 600;}
            .bet-summary { width: 100%; margin-top: 20px; border: 2px solid #ccc; display: grid }
            .p-4 { padding: 4px; }
            .flex { display: flex; width: 100%; align-items: stretch; }
            .br { border-right: 2px solid #ccc; }
            .bt { border-top: 2px solid #ccc; }
          </style>
        </head>
        <body>
          <div class="bet-slip">
            <div class="header">
              <div class="logo">
                <img src="/arb_sport_logo.png" alt="OddsEdgeX logo" />
              </div>

              <div class="bet-details">
                <section>BET SLIP ID: <span>${
                  bet.id.split("-")[0]
                }</span></section>
                <section>STAKE DATE: <span>${bet.createdAt.toLocaleString(
                  "en-NG",
                  {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  }
                )}
                </span>
                </section>
                <section>STATUS: <span style="text-transform: capitalize;">${bet.status}</span></section>
                <section>STAKE: <span>${formatCurrency(amount)}</span></section>
              </div>
            </div>

            <div class="bet-summary">
              <div class="flex">
                <section class="p-4 br" style="width: 25%; font-weight: 600;">Team</section>
                <section class="p-4">${event.awayTeam} vs ${
      event.homeTeam
    }</section>
              </div>
              <div class="flex bt">
                <section class="p-4 br" style="width: 25%; font-weight: 600;">Date</section>
                <section class="p-4">${bet.game.start.toLocaleString("en-NG", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  minute: "2-digit",
                  hour: "2-digit",
                  second: "2-digit",
                  hour12: false,
                })}</section>
              </div>
              <div class="flex bt">
                <section class="p-4 br" style="width: 25%; font-weight: 600;">Options</section>
                <section class="p-4 br" style="text-align: center; width: 22%;">1</section>
                <section class="p-4 br" style="text-align: center; width: 22%;">x</section>
                <section class="p-4" style="text-align: center; width: 22%;">2</section>
              </div>
              <div class="flex bt">
                <section class="p-4 br" style="width: 25%; font-weight: 600;">Odds</section>
                <section class="p-4 br" style="text-align: center; width: 22%;">${
                  event.homeTeamOdds
                }</section>
                <section class="p-4 br" style="text-align: center; width: 22%;">${
                  event.drawOdds
                }</section>
                <section class="p-4" style="text-align: center; width: 22%;">${
                  event.awayTeamOdds
                }</section>
              </div>
              <div class="flex bt">
                <section class="p-4 br" style="width: 25%; font-weight: 600;">Percentage</section>
                <section class="p-4 br" style="text-align: center; width: 22%;">${
                  event.homeTeamArbitrage
                }%</section>
                <section class="p-4 br" style="text-align: center; width: 22%;">${
                  event.drawArbitrage
                }%</section>
                <section class="p-4" style="text-align: center; width: 22%;">${
                  event.awayTeamArbitrage
                }%</section>
              </div>
              <div class="flex bt">
                <section class="p-4 br" style="width: 25%; font-weight: 600;">Winning Amount</section>
                <section class="p-4 br flex" style="text-align: center; width: 22%; justify-content: space-around; flex-direction: column;">${calculatePayout(
                  event.homeTeamArbitrage,
                  amount
                )}</section>
                <section class="p-4 br flex" style="text-align: center; width: 22%; justify-content: space-around; flex-direction: column;">${calculatePayout(
                  event.drawArbitrage,
                  amount
                )}</section>
                <section class="p-4 flex" style="text-align: center; width: 22%; justify-content: space-around; flex-direction: column;">${calculatePayout(
                  event.awayTeamArbitrage,
                  amount
                )}</section>
              </div>
            </div>
            </div>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
  };

  return (
    <div className="p-4 gap-1.5 border rounded-md hover:rounded-xl transition-all ease-in-out duration-500 group cursor-pointer">
      <p className="text-xs text-muted-foreground">{bet.id.split("-")[0]}</p>
      <div>
        {isOngoing ? (
          <div className="flex items-center gap-1.5">
            <div className="size-2 rounded-full bg-red-600 animate-pulse" />
            <span className="text-muted-foreground italic text-xs">Live</span>
          </div>
        ) : (
          <div className="text-xs">
            <Countdown date={bet.game.start} />
          </div>
        )}
        {isOver && <Badge variant="outline">FT</Badge>}
      </div>
      <h3 className="transition-all ease-in-out duration-500 group-hover:tracking-wider">{`${event.homeTeam} vs ${event.awayTeam}`}</h3>

      <p>{formatDateTime(bet.createdAt)}</p>
      <p className="text-muted-foreground">
        <span className="font-bold">Amount:&nbsp;</span>
        <span className="text-xl">{formatCurrency(Number(bet.amount))}</span>
      </p>
      <p className="text-muted-foreground">
        <span className="font-bold">Expected Payout:&nbsp;</span>
        <span className="text-xl">
          {min}
          &nbsp;-&nbsp;
          {max}
        </span>
      </p>

      <div className="w-full flex">
        <div className="flex-1" />
        <Button variant="secondary" onClick={handlePrint}>
          <Printer />
        </Button>
      </div>
    </div>
  );
}
