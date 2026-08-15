import {
  Table,
  TableCell,
  TableBody,
  TableHeader,
  TableRow,
  TableHead,
} from "@/components/ui/table";
import { db } from "@/drizzle";
import { cn, formatCurrency, formatDateTime } from "@/lib/utils";

type WithdrawalHistoryProps = {
  userId: string;
};

/**
 * The WithdrawalHistory component displays a list of withdrawal history records
 * for a given user.
 *
 * @param {WithdrawalHistoryProps} props - The component props.
 * @returns The component element.
 */
async function WithdrawalHistory({ userId }: Readonly<WithdrawalHistoryProps>) {
  /**
   * Fetch the withdrawal history for the specified user. The records are
   * ordered by the created date in descending order.
   */
  const withdrawalHistory = (
    await db.query.userwithdrawalHistory.findMany({
      where: (withdrawal, { eq }) => eq(withdrawal.userId, userId),
      orderBy: (withdrawal, { desc }) => desc(withdrawal.createdAt),
    })
  ).map((withdrawal) => ({
    id: withdrawal.id,
    amount: parseFloat(withdrawal.amount),
    date: withdrawal.createdAt,
    status: withdrawal.status,
  }));

  return (
    <div className="py-6 flex flex-col gap-6 w-full">
      <h3>Your Recent Withdrawals</h3>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {withdrawalHistory.map((withdrawal) => (
            <TableRow key={withdrawal.id}>
              <TableCell>{formatCurrency(withdrawal.amount)}</TableCell>
              <TableCell
                className={cn(
                  withdrawal.status === "success" && "text-green-500",
                  withdrawal.status === "failed" && "text-red-500",
                  withdrawal.status === "pending" && "text-yellow-500",
                  "uppercase"
                )}
              >
                {withdrawal.status}
              </TableCell>
              <TableCell>{formatDateTime(withdrawal.date)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default WithdrawalHistory;
