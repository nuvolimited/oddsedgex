import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Metadata } from "next";
import Link from "next/link";
import RegisterForm from "./register-form";

export const metadata: Metadata = {
  title: "Register - OddsEdgeX",
  description: "Create your account",
};

export default function RegisterPage() {
  return (
    <div className="h-full flex flex-col items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>
            <h3>Create Your Account</h3>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RegisterForm />
        </CardContent>
        <CardFooter className="justify-center">
          <div className="inline-flex items-center">
            <span>Already have an account?</span>
            <Link
              className={cn(
                buttonVariants({ variant: "link" }),
                "p-0 pl-1 text-orange-500",
              )}
              href="/"
            >
              Login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
