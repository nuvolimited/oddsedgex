import TransactionDetailCard from "@/components/ui/transaction-card";
import { db } from "@/drizzle";
import { JSX } from "react";

type WithdrawalHistoryProps = {
  userId: string;
};

/**
 * Fetches the withdrawal history for a given user.
 *
 * @param {string} userId - The ID of the user whose withdrawal history is to be fetched.
 * @returns A promise that resolves to an array of withdrawal history objects.
 */
async function fetchWithdrawalHistory(userId: string) {
  try {
    // Query the database for the user's withdrawal history, ordered by creation date descending
    const withdrawalHistory = await db.query.userwithdrawalHistory.findMany({
      where: (userwithdrawalHistory, { eq }) =>
        eq(userwithdrawalHistory.userId, userId),
      orderBy: (userwithdrawalHistory, { desc }) =>
        desc(userwithdrawalHistory.createdAt),
    });

    // Map the database records to the desired format
    return withdrawalHistory.map((withdrawal) => ({
      id: withdrawal.id,
      amount: parseFloat(withdrawal.amount),
      details: withdrawal.details,
      date: withdrawal.createdAt,
      status: withdrawal.status,
    }));
  } catch (error) {
    // Log an error if there's a problem fetching the withdrawal history
    console.error("Error fetching deposit history:", error);
    // Return an empty array if there's an error
    return [];
  }
}

/**
 * The WithdrawalHistory component displays a list of withdrawal history records for a given user.
 *
 * @param {WithdrawalHistoryProps} props - The component props.
 * @returns {JSX.Element} The component element.
 */
export default async function WithdrawalHistory({
  userId,
}: Readonly<WithdrawalHistoryProps>): Promise<JSX.Element> {
  // Fetch the withdrawal history for the specified user
  const withdrawalHistory = await fetchWithdrawalHistory(userId);

  // Display a message if there is no withdrawal history
  if (withdrawalHistory.length === 0) {
    return (
      <div className="w-full flex flex-col gap-6 items-center h-80 justify-center">
        <p className="italic text-muted-foreground">
          No withdrawal history found
        </p>
      </div>
    );
  }

  // Display the withdrawal history as a list of TransactionDetailCards
  return (
    <div className="w-full flex flex-col gap-6 pt-6">
      <div className="grid w-full md:grid-cols-2 lg:grid-cols-3 gap-4">
        {withdrawalHistory.map((withdrawal) => (
          <TransactionDetailCard
            key={withdrawal.id}
            transactionDetail={withdrawal}
          />
        ))}
      </div>
    </div>
  );
}
