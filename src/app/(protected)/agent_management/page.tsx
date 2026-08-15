import { isAdmin } from "@/auth";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Header from "@/components/ui/header";
import { db } from "@/drizzle";
import { redirect, RedirectType } from "next/navigation";
import InfoDialog from "./info-dialog";

async function AgentManagementPage() {
  if (!(await isAdmin())) {
    // If the user is not an admin, redirect them to the home page
    redirect("/", RedirectType.replace);
  }

  const agents = await db.query.agents.findMany({
    with: {
      user: {
        columns: {
          id: true,
          name: true,
          email: true,
          referralCode: true,
        },
      },
    },
    orderBy: (fields, { asc }) => [asc(fields.createdAt)],
    where: (fields, { eq }) => eq(fields.status, "pending"),
  });

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <Header title="Agent Management">
        <p className="italic text-muted-foreground">View and manage agents</p>
      </Header>

      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4 w-full px-4 pb-6">
        {agents.map((agent) => (
          <Card key={agent.user.id}>
            <CardContent className="flex flex-col divide-y">
              <div className="py-1">
                <p className="font-thin text-xs">Agent Code</p>
                <p className="font-semibold">{agent.user.referralCode}</p>
              </div>
              <div className="py-1">
                <p className="font-thin text-xs">Full Name</p>
                <p className="font-semibold">{agent.user.name}</p>
              </div>
              <div className="py-1">
                <p className="font-thin text-xs">Email</p>
                <p className="font-semibold overflow-hidden hover:overflow-visible">
                  {agent.user.email}
                </p>
              </div>
            </CardContent>
            <CardFooter className="justify-between">
              <Badge
                variant={agent.status === "verified" ? "success" : "outline"}
                className="uppercase"
              >
                {agent.status}
              </Badge>
              <section className="gap-2">
                <InfoDialog
                  agent={{
                    ...agent,
                    id: agent.user.id,
                    name: agent.user.name,
                    email: agent.user.email,
                  }}
                />
              </section>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default AgentManagementPage;
