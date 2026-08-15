import { isAdmin } from "@/auth";
import Header from "@/components/ui/header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { db } from "@/drizzle";
import { notFound, redirect } from "next/navigation";
import PersonalInfo from "./personal-info";
import DepositHistory from "@/app/(protected)/_components/deposit-history";
import WithdrawalHistory from "@/app/(protected)/_components/withdrawal-history";
import AgentInfo from "./agent-info";
import { Badge } from "@/components/ui/badge";
import { JSX } from "react";
import BetHistory from "./bet-history";
import Settings from "./settings";
import Referrals from "./referrals";
import DebitUserForm from "./debit-user-form";
import CreditUserForm from "./credit-user-form";

/**
 * Fetches user data from the database based on the provided user ID.
 *
 * @param {string} userId - The ID of the user to retrieve data for.
 * @returns A promise that resolves to the user data object or null if an error occurs.
 */
async function fetchUserData(userId: string) {
  try {
    // Query the database to find the user with the specified ID
    const userData = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, userId),
      with: {
        agent: {
          columns: {
            address: true,
            state: true,
            city: true,
            phone: true,
            status: true,
            kyc: true,
          },
        },
        referrer: {
          columns: {
            id: true,
            name: true,
          },
        },
        funds: {
          columns: {
            amount: true,
          },
        },
      },
    });

    // Return the retrieved user data
    return userData;
  } catch (error) {
    // Log any errors that occur during the database query
    console.error("Error fetching user data:", error);
    return null;
  }
}

/**
 * A page component to display user information.
 *
 * @param {{ params: Promise<{ id: string }> }} props - The properties for the component.
 * @param {Promise<{ id: string }>} props.params - A promise that resolves to an object containing the user ID.
 * @returns {JSX.Element} The rendered page component.
 */
async function UserPage({
  params,
}: Readonly<{ params: Promise<{ id: string }> }>): Promise<JSX.Element> {
  const id = (await params).id;

  // Check if the current user is not an admin
  if (!(await isAdmin())) {
    // If the user is not an admin, redirect them to the home page
    redirect("/");
  }

  // Input validation
  if (!id || typeof id !== "string") {
    notFound();
  }

  const user = await fetchUserData(id);

  if (!user) {
    notFound();
  }

  return (
    <div className="flex w-full flex-col gap-6">
      {/* Header component with user name and role */}
      <Header title={user.name}>
        <div className="flex gap-2 items-center">
          <p className="italic text-muted-foreground">
            View and manage user details
          </p>
          <Badge variant={user.role === "admin" ? "destructive" : "default"}>
            {user.role}
          </Badge>
        </div>
      </Header>

      {/* Tabbed content to display user information */}
      <div className="px-4 w-full">
        <Tabs defaultValue="personal_info">
          <TabsList className="flex-wrap h-auto">
            {/* Tab for personal information */}
            <TabsTrigger value="personal_info">Personal Info</TabsTrigger>
            {/* Tab for deposit history */}
            <TabsTrigger value="deposit_history">Deposit History</TabsTrigger>
            {/* Tab for withdrawal history */}
            <TabsTrigger value="withdrawal_history">
              Withdrawal History
            </TabsTrigger>
            {/* Tab for agent information (if user is an agent) */}
            {user.agent && (
              <TabsTrigger value="agent_info">Agent Info</TabsTrigger>
            )}
            <TabsTrigger value="referrals">Referrals</TabsTrigger>
            {/* Tab for bet history */}
            <TabsTrigger value="bet_history">Bet History</TabsTrigger>
            {/* Tab for settings */}
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          {/* Content for personal information tab */}
          <TabsContent value="personal_info">
            <PersonalInfo
              userId={id}
              info={{
                ...user,
                dateJoined: user.createdAt,
                referrer: user.referrer
                  ? { id: user.referrer.id, name: user.referrer.name }
                  : undefined,
                funds: user.funds
                  ? { amount: parseFloat(user.funds.amount) }
                  : { amount: 0 },
              }}
            />
          </TabsContent>
          {/* Content for deposit history tab */}
          <TabsContent value="deposit_history">
            <CreditUserForm userId={id} />
            <DepositHistory userId={id} />
          </TabsContent>
          {/* Content for withdrawal history tab */}
          <TabsContent value="withdrawal_history">
            <DebitUserForm userId={id} />
            <WithdrawalHistory userId={id} />
          </TabsContent>
          {/* Content for agent information tab (if user is an agent) */}
          {user.agent && (
            <TabsContent value="agent_info">
              <AgentInfo details={user.agent} />
            </TabsContent>
          )}
          {/* Content for referrals tab */}
          <TabsContent value="referrals">
            <Referrals userId={id} />
          </TabsContent>
          {/* Content for bet history tab */}
          <TabsContent value="bet_history">
            <BetHistory userId={user.id} />
          </TabsContent>
          {/* Content for settings tab */}
          <TabsContent value="settings">
            <Settings userId={user.id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default UserPage;
