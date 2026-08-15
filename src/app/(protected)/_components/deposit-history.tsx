import { db } from "@/drizzle";
import TransactionDetailCard from "@/components/ui/transaction-card";
import { ReactElement } from "react";

type DepositHistoryProps = {
  userId: string;
};

/**
 * Fetches the deposit history for a given user.
 *
 * @param {string} userId - The ID of the user whose deposit history is to be fetched.
 * @returns {Promise<Array>} A promise that resolves to an array of deposit history objects.
 */
async function fetchDepositHistory(userId: string) {
  try {
    // Query the database for the user's deposit history, ordered by creation date descending
    const depositHistory = await db.query.userDepositHistory.findMany({
      where: (deposits, { eq }) => eq(deposits.userId, userId),
      orderBy: (deposits, { desc }) => desc(deposits.createdAt),
    });

    // Map the database records to the desired format
    return depositHistory.map((deposit) => ({
      id: deposit.id,
      amount: parseFloat(deposit.amount),
      details: deposit.details,
      date: deposit.createdAt,
      status: deposit.status,
    }));
  } catch (error) {
    console.error("Error fetching deposit history:", error);
    return [];
  }
}

/**
 * The DepositHistory component displays a list of deposit history records for a given user.
 *
 * @param {DepositHistoryProps} props - The component props.
 * @returns {ReactElement} The component element.
 */
export default async function DepositHistory({
  userId,
}: Readonly<DepositHistoryProps>): Promise<ReactElement> {
  const depositHistory = await fetchDepositHistory(userId);

  // Display a message if there is no deposit history
  if (depositHistory.length === 0) {
    return (
      <div className="w-full flex flex-col gap-6 items-center h-80 justify-center">
        <p className="italic text-muted-foreground">
          No deposit history found for the specified user.
        </p>
      </div>
    );
  }

  // Display the deposit history as a list of TransactionDetailCards
  return (
    <div className="w-full flex flex-col gap-6 pt-6">
      <div className="grid w-full md:grid-cols-2 lg:grid-cols-3 gap-4">
        {depositHistory.map((deposit) => (
          <TransactionDetailCard key={deposit.id} transactionDetail={deposit} />
        ))}
      </div>
    </div>
  );
}
