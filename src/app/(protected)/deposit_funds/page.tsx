import { auth } from "@/auth";
import Header from "@/components/ui/header";
import { db } from "@/drizzle";
import { redirect } from "next/navigation";
import DepositFundsForm from "./deposit-funds-form";
import { PaymentOptionDetails } from "@/lib/types";
import { JSX } from "react";
import DepositHistory from "./deposit-history";

/**
 * DepositFunds component.
 *
 * This component renders a form for the user to deposit funds to their
 * account. The form includes a list of payment options that the user can
 * use to deposit funds.
 *
 * @returns {JSX.Element} The rendered DepositFunds component.
 */
async function DepositFunds(): Promise<JSX.Element> {
  const userId = (await auth())?.user.id;

  if (!userId) redirect("/");

  // Fetch the list of payment options from the database
  const paymentOptions = await db.query.paymentOptions.findMany();

  // Map the payment options to include the details object
  const paymentOptionsWithDetails = paymentOptions.map((option) => ({
    ...option,
    details: option.details as PaymentOptionDetails,
  }));

  // Return the rendered DepositFunds component
  return (
    <div className="w-full flex flex-col items-center gap-6">
      <Header title="Deposit Funds">
        <p className="text-muted-foreground">
          Deposit funds to your account to start betting.
        </p>
      </Header>

      <div className="w-full max-w-sm px-4 flex flex-col gap-4">
        <DepositFundsForm
          // Pass the payment options with details to the DepositFundsForm
          // component
          paymentOptions={paymentOptionsWithDetails}
        />
      </div>

      <div className="w-full px-4">
        <DepositHistory userId={userId} />
      </div>
    </div>
  );
}

export default DepositFunds;
