import { isAuthenticated } from "@/auth";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { redirect } from "next/navigation";
import React from "react";
import UpdateProfile from "./update-profile";
import { Metadata } from "next";
import ChangePasswordForm from "./change-password-form";
import Header from "@/components/ui/header";

export const metadata: Metadata = {
  title: "Profile - OddsEdgeX",
  description:
    "Manage your account settings and update your profile information",
};

/**
 * The Profile page component.
 *
 * This component is rendered on the `/profile` route. It displays a tabbed
 * interface with two tabs: "Account Information" and "Settings".
 *
 * The "Account Information" tab displays the UpdateProfile component, which
 * allows the user to update their profile information.
 *
 * The "Settings" tab is currently empty and will be implemented later.
 *
 * If the user is not logged in, the component redirects them to the login page.
 *
 * @returns A JSX.Element representing the Profile page component.
 */
export default async function Profile() {
  if (!(await isAuthenticated())) redirect("/");

  return (
    <div className="w-full space-y-6">
      <Header title="Profile" />
      <div className="flex w-full flex-col gap-6 px-4">
        <Tabs defaultValue="update_profile">
          <TabsList>
            {/* The first tab displays the UpdateProfile component */}
            <TabsTrigger value="update_profile">
              Account Information
            </TabsTrigger>
            {/* The second tab is currently empty and will be implemented later */}
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="update_profile" className="pt-12">
            <UpdateProfile />
          </TabsContent>
          <TabsContent value="settings" className="pt-12">
            <ChangePasswordForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
