import PreviewDialog from "@/components/ui/preview-dialog";
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

type DepositHistoryProps = {
  userId: string;
};

async function DepositHistory({ userId }: Readonly<DepositHistoryProps>) {
  const depositHistory = (
    await db.query.userDepositHistory.findMany({
      where: (deposits, { eq }) => eq(deposits.userId, userId),
      orderBy: (deposits, { desc }) => desc(deposits.createdAt),
    })
  ).map((deposit) => ({
    id: deposit.id,
    amount: parseFloat(deposit.amount),
    date: deposit.createdAt,
    status: deposit.status,
    proof: deposit.proof,
  }));

  return (
    <div className="py-6 flex flex-col gap-6 w-full">
      <h3>Your Recent Deposits</h3>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Proof</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {depositHistory.map((deposit) => (
            <TableRow key={deposit.id}>
              <TableCell>{formatCurrency(deposit.amount)}</TableCell>
              <TableCell
                className={cn(
                  deposit.status === "success" && "text-green-500",
                  deposit.status === "failed" && "text-red-500",
                  deposit.status === "pending" && "text-yellow-500",
                  "uppercase"
                )}
              >
                {deposit.status}
              </TableCell>
              <TableCell>{formatDateTime(deposit.date)}</TableCell>
              <TableCell>
                <PreviewDialog previewUrl={deposit.proof} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default DepositHistory;
