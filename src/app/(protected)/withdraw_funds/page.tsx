import { auth } from "@/auth";
import Header from "@/components/ui/header";
import { redirect } from "next/navigation";
import React, { JSX } from "react";
import WithdrawFundsForm from "./withdraw-funds-form";
import WithdrawalHistory from "./withdawal-history";

/**
 * The WithdrawFunds component renders a form for the user to withdraw funds from their account to their bank account.
 *
 * @returns {JSX.Element} The rendered WithdrawFunds component.
 */
async function WithdrawFunds(): Promise<JSX.Element> {
  const userId = (await auth())?.user.id;

  if (!userId) redirect("/");

  return (
    <div className="w-full flex flex-col items-center gap-6">
      <Header title="Withdraw Funds">
        <p className="text-muted-foreground">
          {/* The text-muted-foreground class is used to make the text color muted */}
          Withdraw funds from your account to your bank account.
        </p>
      </Header>
      <div className="w-full max-w-sm px-4 flex flex-col gap-4 pt-6">
        {/* The WithdrawFundsForm component renders a form for the user to withdraw funds */}
        <WithdrawFundsForm />
      </div>

      <div className="w-full px-4">
        <WithdrawalHistory userId={userId} />
      </div>
    </div>
  );
}

export default WithdrawFunds;
