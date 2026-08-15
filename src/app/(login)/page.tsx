import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LoginForm from "./login-form";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { isAuthenticated } from "@/auth";
import { redirect } from "next/navigation";

/**
 * The login page component.
 *
 * This component renders a login form and handles user authentication.
 * If the user is already authenticated, it redirects them to the dashboard.
 */
export default async function Login() {
  // If the user is already authenticated, redirect them to the dashboard
  // This prevents users from accessing the login page when they're already signed in
  if (await isAuthenticated()) {
    redirect("/dashboard");
  }

  // Define the JSX for the login page
  return (
    <div className="h-full flex flex-col items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>
            <h3 className="text-center">Login to your account</h3>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
        <CardFooter className="justify-center">
          <div className="inline-flex items-center">
            <span>Don&apos;t have an account?</span>
            <Link
              className={cn(
                buttonVariants({ variant: "link" }),
                "p-0 pl-1 text-orange-500"
              )}
              href="/register"
            >
              Sign Up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
