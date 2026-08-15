import { isAdmin } from "@/auth";
import AdminTransactionManagamentCard from "@/components/ui/admin-transaction-management-card";
import Header from "@/components/ui/header";
import { db } from "@/drizzle";
import { redirect } from "next/navigation";
import { Fragment, JSX } from "react";
import ApproveDepositTransaction from "./approve-deposit-transaction";
import RejectDepositTransaction from "./reject-deposit-transaction";

/**
 * The DepositManagement component displays a list of pending deposit
 * transactions. It also provides action buttons to approve or reject the
 * transactions.
 *
 * @returns {JSX.Element} The rendered DepositManagement component.
 */
async function DepositManagement(): Promise<JSX.Element> {
  // Check if the current user is not an admin
  if (!(await isAdmin())) {
    // If the user is not an admin, redirect them to the home page
    redirect("/");
  }

  // Fetch the list of pending deposit transactions from the database
  const pendingDeposits = await db.query.userDepositHistory.findMany({
    where: (userDepositHistory, { eq }) =>
      eq(userDepositHistory.status, "pending"),
    orderBy: (userDepositHistory, { desc }) => [
      desc(userDepositHistory.createdAt),
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
      <Header title="Deposit Management">
        <p className="text-muted-foreground">
          Manage pending client deposits.
        </p>
      </Header>

      {/* If there are no pending deposits, display a message*/}
      {!pendingDeposits.length && (
        <div className="w-full flex flex-col gap-6 items-center h-80 justify-center">
          <p className="italic text-muted-foreground">
            No pending deposits found.
          </p>
        </div>
      )}

      {/* Display the list of pending deposits */}
      {pendingDeposits.length > 0 && (
        <div className="w-full grid md:grid-cols- lg:grid-cols-3 gap-4 pt-6">
          {pendingDeposits.map((deposit) => (
            <AdminTransactionManagamentCard
              key={deposit.id}
              transaction={{
                id: deposit.id,
                amount: Number(deposit.amount),
                details: deposit.details,
                date: deposit.createdAt,
                proof: deposit.proof,
                user: {
                  id: deposit.userId,
                  name: deposit.user.name,
                },
              }}
              // Provide approve and reject action buttons
              extra={
                <Fragment>
                  <ApproveDepositTransaction
                    transactionId={deposit.id}
                    userId={deposit.userId}
                  />
                  <RejectDepositTransaction
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

export default DepositManagement;
