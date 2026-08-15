import { buttonVariants } from "@/components/ui/button";
import { cn, formatCurrency } from "@/lib/utils";
import { Banknote, Landmark, Notebook, Users, Wallet } from "lucide-react";
import Link from "next/link";
import React from "react";
import SlidingImages from "../_components/sliding-images";
import { and, eq } from "drizzle-orm";
import {
  arbitrageGameBets,
  userDepositHistory,
  users,
} from "@/drizzle/schemas";
import { db } from "@/drizzle";

type UserViewProps = {
  user: {
    id: string;
    name: string;
    referralCode: string;
    role: "user" | "admin";
    funds: {
      amount: string;
    };
  };
};

async function UserView({ user }: Readonly<UserViewProps>) {
  const betCount = await db.$count(
    arbitrageGameBets,
    eq(arbitrageGameBets.userId, user.id)
  );

  const successfulDepositCount = await db.$count(
    userDepositHistory,
    and(
      eq(userDepositHistory.userId, user.id),
      eq(userDepositHistory.status, "success")
    )
  );

  const referralCount = await db.$count(users, eq(users.referrerId, user.id));

  return (
    <div className="w-full flex flex-col gap-6 items-center">
      <div className="w-full space-y-8 px-4 py-6 gap-4 bg-secondary text-secondary-foreground">
        <h3 className="inline-flex items-center">
          <Banknote className="mr-2" />
          Welcome to Your Dashboard
        </h3>

        <div className="border flex w-full md:w-1/3 rounded-md py-2 justify-center items-center">
          <p>Your UserID: {user.referralCode}</p>
        </div>

        <div className="w-full grid grid-cols-2 gap-2 md:gap-4">
          <div className="flex flex-col py-4 gap-6 items-center justify-center border-2 rounded-md">
            <p>Available Balance</p>
            <p className="font-semibold text-xl">
              {formatCurrency(Number(user.funds?.amount ?? 0))}
            </p>
          </div>
          <div className="flex flex-col py-4 gap-6 items-center justify-center border-2 rounded-md">
            <p>Total Bets Placed</p>
            <p className="font-semibold text-xl">{betCount}</p>
          </div>
          <div className="flex flex-col py-4 gap-6 items-center justify-center border-2 rounded-md">
            <p>Total Successful Deposits</p>
            <p className="font-semibold text-xl">{successfulDepositCount}</p>
          </div>
          <div className="flex flex-col py-4 gap-6 items-center justify-center border-2 rounded-md">
            <p>Referrals</p>
            <p className="font-semibold text-xl">{referralCount}</p>
          </div>
        </div>

        <div className="flex flex-col gap-4 md:flex-row items-center justify-center flex-wrap pt-6">
          <Link
            href="/bet_history"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            <Notebook /> View Arbitrage History
          </Link>
          <Link
            href="/bet_history"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            <Notebook /> View Prediction History
          </Link>
          <Link
            href="/deposit_funds"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            <Wallet /> Deposit Funds
          </Link>
          <Link
            href="/withdraw_funds"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            <Landmark /> Withdraw Funds
          </Link>
          <Link
            href="/referrals"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            <Users /> View Referrals
          </Link>
        </div>
      </div>
      <SlidingImages />
    </div>
  );
}

export default UserView;
