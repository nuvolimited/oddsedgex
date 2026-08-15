import { Metadata } from "next";
import { AgentRegistrationForm } from "./agent-registration-form";
import Header from "@/components/ui/header";
import { isAuthenticated } from "@/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Become an Agent - OddsEdgeX",
  description: "Become an agent and start earning money",
};

/**
 * Page for registering an agent.
 *
 * The page has a form that the agent must fill out to become an agent.
 * The form is handled by the `AgentRegistrationForm` component.
 *
 * @returns The JSX for the agent registration page.
 */
export default async function AgentRegistration() {
  if (!(await isAuthenticated())) {
    redirect("/");
  }

  return (
    <div className="w-full flex flex-col items-center">
      <Header title="Agent Registration">
        <p className="italic text-muted-foreground">
          Complete the form below to become an agent
        </p>
      </Header>

      <div className="max-w-sm py-12 w-full px-4">
        <AgentRegistrationForm />
      </div>
    </div>
  );
}
