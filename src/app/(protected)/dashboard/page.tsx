import { auth } from "@/auth";
import { db } from "@/drizzle";
import Link from "next/link";
import { redirect } from "next/navigation";
import UserView from "./user-view";
import {
  agents,
  arbitrageGames,
  paymentOptions,
  predictionGames,
  userDepositHistory,
  users,
  userwithdrawalHistory,
} from "@/drizzle/schemas";
import { eq, gte, isNull, or } from "drizzle-orm";

export const dynamic = "force-dynamic";
export const fetchCache = "default-no-store";

export default async function Dashboard() {
  const userId = (await auth())?.user.id;
  if (!userId) redirect("/");

  const user = await db.query.users.findFirst({
    columns: {
      referralCode: true,
      name: true,
      role: true,
    },
    with: {
      funds: {
        columns: {
          amount: true,
        },
      },
    },
    where: (fields, { eq }) => eq(fields.id, userId),
  });

  if (!user) return redirect("/");

  const isUserAdmin = user.role === "admin";

  if (!isUserAdmin)
    return (
      <UserView
        user={{ ...user, id: userId, funds: user.funds ?? { amount: "0" } }}
      />
    );

  const pendingDepositsCount = await db.$count(
    userDepositHistory,
    eq(userDepositHistory.status, "pending")
  );

  const pendingWithdrawalCount = await db.$count(
    userwithdrawalHistory,
    eq(userwithdrawalHistory.status, "pending")
  );

  const userCount = await db.$count(users);

  const paymentOptionsCount = await db.$count(paymentOptions);

  const arbitrageGamesCount = await db.$count(
    arbitrageGames,
    or(eq(arbitrageGames.outcome, ""), isNull(arbitrageGames.outcome))
  );

  const predictionGamesCount = await db.$count(
    predictionGames,
    gte(predictionGames.end, new Date())
  );

  const agentCount = await db.$count(agents, eq(agents.status, "pending"));

  return (
    <div className="w-full pt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 px-4 gap-4">
      <div className="p-4 flex flex-col gap-2 border rounded-xl relative">
        <p className="text-xs">Pending Deposits</p>
        <h4>{pendingDepositsCount}</h4>
        <Link href="/deposit_management" className="inset-0 absolute" />
      </div>
      <div className="p-4 flex flex-col gap-2 border rounded-xl relative">
        <p className="text-xs">Pending Withdrawal</p>
        <h4>{pendingWithdrawalCount}</h4>
        <Link href="/withdrawal_management" className="inset-0 absolute" />
      </div>

      <div className="p-4 flex flex-col gap-2 border rounded-xl relative">
        <p className="text-xs">Payment Options</p>
        <h4>{paymentOptionsCount}</h4>
        <Link href="/payment_options" className="inset-0 absolute" />
      </div>

      <div className="p-4 flex flex-col gap-2 border rounded-xl relative">
        <p className="text-xs">Users</p>
        <h4>{userCount}</h4>
        <Link href="/users" className="inset-0 absolute" />
      </div>

      <div className="p-4 flex flex-col gap-2 border rounded-xl relative">
        <p className="text-xs">Agent Management</p>
        <h4>{agentCount}</h4>
        <Link href="/agent_management" className="inset-0 absolute" />
      </div>

      <div className="p-4 flex flex-col gap-2 border rounded-xl relative">
        <p className="text-xs">Arbitrage Games</p>
        <h4>{arbitrageGamesCount}</h4>
        <Link href="/arbitrage_game_management" className="inset-0 absolute" />
      </div>

      <div className="p-4 flex flex-col gap-2 border rounded-xl relative">
        <p className="text-xs">Prediction Games</p>
        <h4>{predictionGamesCount}</h4>
        <Link href="/prediction_game_management" className="inset-0 absolute" />
      </div>
    </div>
  );
}
