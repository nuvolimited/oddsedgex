import { isAdmin } from "@/auth";
import AdminTransactionManagamentCard from "@/components/ui/admin-transaction-management-card";
import Header from "@/components/ui/header";
import { db } from "@/drizzle";
import { redirect } from "next/navigation";
import { Fragment, JSX } from "react";
import ApproveWithdrawalTransaction from "./approve-withdrawal-transaction";
import RejectWithdrawalTransaction from "./reject-withdrawal-transaction";

/**
 * The WithdrawalManagement component displays a list of pending withdrawal
 * transactions. It also provides action buttons to approve or reject the
 * transactions.
 *
 * @returns {JSX.Element} The rendered WithdrawalManagement component.
 */
async function WithdrawalManagement(): Promise<JSX.Element> {
  // Check if the current user is not an admin
  if (!(await isAdmin())) {
    // If the user is not an admin, redirect them to the home page
    redirect("/");
  }

  // Fetch the list of pending withdrawal transactions from the database
  const pendingWithdrawals = await db.query.userwithdrawalHistory.findMany({
    where: (userWithdrawHistory, { eq }) =>
      eq(userWithdrawHistory.status, "pending"),
    orderBy: (userWithdrawHistory, { desc }) => [
      desc(userWithdrawHistory.createdAt),
    ],
    with: {
      user: {
        columns: {
          name: true,
        },
      },
    },
  });

  // Render the component
  return (
    <div className="w-full flex flex-col">
      <Header title="Withdrawal Management">
        <p className="text-muted-foreground">
          Manage pending client withdrawals.
        </p>
      </Header>

      {/* If there are no pending withdrawals, display a message*/}
      {!pendingWithdrawals.length && (
        <div className="w-full flex flex-col gap-6 items-center h-80 justify-center">
          <p className="italic text-muted-foreground">
            No pending withdrawals found.
          </p>
        </div>
      )}

      {/* Display the list of pending withdrawals */}
      {pendingWithdrawals.length > 0 && (
        <div className="w-full grid md:grid-cols- lg:grid-cols-3 gap-4 pt-6 px-4">
          {pendingWithdrawals.map((deposit) => (
            <AdminTransactionManagamentCard
              key={deposit.id}
              transaction={{
                id: deposit.id,
                amount: Number(deposit.amount),
                details: deposit.details,
                date: deposit.createdAt,
                user: {
                  id: deposit.userId,
                  name: deposit.user.name,
                },
              }}
              extra={
                <Fragment>
                  {/* Action buttons to approve or reject the transaction */}
                  <ApproveWithdrawalTransaction
                    transactionId={deposit.id}
                    userId={deposit.userId}
                  />
                  <RejectWithdrawalTransaction
                    transactionId={deposit.id}
                    userId={deposit.userId}
                  />
                </Fragment>
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default WithdrawalManagement;
