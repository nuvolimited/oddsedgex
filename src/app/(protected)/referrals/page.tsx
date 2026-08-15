import { auth } from "@/auth";
import Header from "@/components/ui/header";
import { db } from "@/drizzle";
import { formatDateTime } from "@/lib/utils";
import { redirect } from "next/navigation";
import React from "react";

/**
 * The Referrals page component.
 *
 * This component displays the user's referral code and the list of users that have joined using that code.
 */
async function Referrals() {
  /**
   * Get the user ID from the authentication module.
   * If the user is not logged in, redirect them to the login page.
   */
  const userId = (await auth())?.user.id;
  if (!userId) redirect("/");

  /**
   * Fetch the user from the database.
   * If the user is not found, redirect them to the login page.
   */
  const user = await db.query.users.findFirst({
    columns: {
      referralCode: true,
    },
    with: {
      referrals: {
        columns: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
        },
      },
    },
    where: (fields, { eq }) => eq(fields.id, userId),
  });

  if (!user) return redirect("/");

  return (
    <div className="w-full flex flex-col gap-6 divide-y">
      <Header title="Referrals" />

      <div className="w-full flex flex-col items-center justify-center">
        <p className="text-lg">
          Your referral code is:{" "}
          <span className="select-text font-bold">{user.referralCode}</span>
        </p>
        <p className="text-sm text-muted-foreground">
          Share this code with your friends to earn rewards!
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 px-4">
        {user.referrals.map((referral) => (
          <div
            key={referral.id}
            className="flex flex-col gap-2 border rounded-md p-4"
          >
            <p className="text-lg font-bold">{referral.name}</p>
            <p className="text-sm text-muted-foreground">{referral.email}</p>
            <p className="text-sm text-muted-foreground">
              Joined on: {formatDateTime(referral.createdAt)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Referrals;
