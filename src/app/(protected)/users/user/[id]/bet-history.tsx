import BetCard from "@/app/(protected)/_components/bet-card";
import { db } from "@/drizzle";

type BetHistoryProps = {
  userId: string;
};

/**
 * A component to render a user's bet history.
 *
 * The component takes a userId as a prop and renders a list of bet cards
 * associated with the user.
 *
 * @param {BetHistoryProps} props - The props for the component
 * @returns {JSX.Element} The rendered component
 */
async function BetHistory({ userId }: Readonly<BetHistoryProps>) {
  const bets = await db.query.arbitrageGameBets.findMany({
    // Find all the bets associated with the user
    where: (arbitrageGameBets, { eq }) => eq(arbitrageGameBets.userId, userId),
    // Sort the bets in descending order by the created at date
    orderBy: (arbitrageGameBets, { desc }) => desc(arbitrageGameBets.createdAt),
    // Fetch the game details for each bet
    with: {
      game: {
        columns: {
          // Fetch the game outcome, start date, end date, and event
          outcome: true,
          start: true,
          end: true,
          event: true,
        },
      },
    },
  });

  // If there are no bets, render a message
  if (bets.length === 0) {
    return <div className="w-full py-12 text-center italic">No bets found</div>;
  }

  // Render a list of bet cards
  return (
    <div className="w-full flex flex-col gap-4">
      {bets.map((bet) => (
        // Render a bet card for each bet
        <BetCard key={bet.id} bet={bet} />
      ))}
    </div>
  );
}

export default BetHistory;
