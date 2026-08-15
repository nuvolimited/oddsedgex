"use server";

import { auth } from "@/auth";
import { db } from "@/drizzle";
import { users } from "@/drizzle/schemas/user.schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import UpdateProfileForm from "./update-profile-form";

/**
 * The `UpdateProfile` component renders the update profile form.
 *
 * This component is rendered on the `/profile` route, and it's only accessible
 * if the user is logged in.
 *
 * The component fetches the user's profile data from the database using the
 * `db.select` method. It then passes this data to the `UpdateProfileForm` component
 * as a prop.
 *
 * If the user is not logged in, the component redirects them to the login page.
 */
export default async function UpdateProfile() {
  // Fetch the user's session data
  const session = await auth();

  // If the user is not logged in, redirect them to the login page
  if (!session?.user?.id) {
    redirect("/");
  }

  // Fetch the user's profile data from the database
  const [profileData] = await db
    .select({ name: users.name, username: users.username, email: users.email })
    .from(users)
    .where(eq(users.id, session.user.id));

  // Render the update profile form with the user's profile data
  return (
    <div className="max-w-sm mx-auto">
      <UpdateProfileForm data={profileData} />
    </div>
  );
}
