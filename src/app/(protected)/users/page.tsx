import { isAdmin } from "@/auth";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Header from "@/components/ui/header";
import { db } from "@/drizzle";
import { users } from "@/drizzle/schemas/user.schema";
import { cn, formatDateTime } from "@/lib/utils";
import { asc } from "drizzle-orm";
import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "User Management - OddsEdgeX",
};

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 12;

/**
 * User Management Page Component
 *
 * This component fetches and displays a paginated list of users from the database.
 * It accepts search parameters to determine the current page for pagination.
 *
 * @param {{ searchParams: Promise<{ [key: string]: string | string[] | undefined }> }} props
 *   The properties for the component, including searchParams which contains query parameters.
 * @returns The rendered user management page component.
 */
async function Users({
  searchParams,
}: Readonly<{
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}>) {
  let page = DEFAULT_PAGE;

  // Extract the 'page' query parameter and parse it as an integer
  const pageParam = (await searchParams).page;
  if (typeof pageParam === "string") {
    const parsedPage = Number.parseInt(pageParam, 10);
    if (!Number.isNaN(parsedPage) && parsedPage > 0) {
      page = parsedPage;
    }
  }

  // Check if the current user is not an admin
  if (!(await isAdmin())) {
    // If the user is not an admin, redirect them to the home page
    redirect("/");
  }

  const pages = Math.ceil((await db.$count(users)) / DEFAULT_PAGE_SIZE);

  // Retrieve a paginated list of users from the database
  const allUsers = await db
    .select({
      name: users.name,
      id: users.id,
      email: users.email,
      phone: users.phone,
      username: users.username,
      dateJoined: users.createdAt,
      role: users.role,
    })
    .from(users)
    .limit(DEFAULT_PAGE_SIZE)
    .offset((page - 1) * DEFAULT_PAGE_SIZE)
    .orderBy(asc(users.name));

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <Header title="User Management">
        <p className="italic text-muted-foreground">View and manage users</p>
      </Header>

      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4 w-full px-4 pb-6">
        {allUsers.map((user) => (
          <Card key={user.id} className="relative">
            <CardHeader>
              <CardTitle>{user.name}</CardTitle>
              <CardDescription className="flex">
                <Badge
                  variant={user.role === "admin" ? "destructive" : "default"}
                >
                  {user.role}
                </Badge>
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 border-t divide-y">
              <div className="space-y-2 w-full py-2">
                <div className="font-thin text-muted-foreground text-xs">
                  Username:
                </div>
                <p className="text-xl">{user.username}</p>
              </div>

              <div className="space-y-2 w-full py-2">
                <div className="font-thin text-muted-foreground text-xs">
                  Email:
                </div>
                <p className="text-xl break-all">{user.email}</p>
              </div>

              <div className="space-y-2 w-full py-2">
                <div className="font-thin text-muted-foreground text-xs">
                  Phone:
                </div>
                <p className="text-xl break-all">{user.phone ?? "N/A"}</p>
              </div>

              <div className="space-y-2 w-full py-2">
                <div className="font-thin text-muted-foreground text-xs">
                  Date Joined:
                </div>
                <p className="text-xl">{formatDateTime(user.dateJoined)}</p>
              </div>
            </CardContent>
            <Link href={`users/user/${user.id}`} className="absolute inset-0" />
          </Card>
        ))}
      </div>
      {pages > 1 && (
        <div className="flex gap-2 mb-4">
          {Array.from({ length: pages }, (_, index) => index + 1).map(
            (userListPage) => (
              <Link
                key={userListPage}
                href={`users?page=${userListPage}`}
                className={cn(
                  buttonVariants({
                    variant: page === userListPage ? "default" : "outline",
                    size: "sm",
                  }),
                )}
              >
                {userListPage}
              </Link>
            ),
          )}
        </div>
      )}
    </div>
  );
}

export default Users;
