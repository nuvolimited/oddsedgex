import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { AlignJustify, X } from "lucide-react";
import Link from "next/link";
import { Fragment, useState } from "react";

/**
 * The mobile menu dropdown component.
 *
 * @param isAuthenticated - If the user is authenticated
 */
export default function MobileMenuDropdown({
  isAuthenticated,
}: Readonly<{ isAuthenticated: boolean }>) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          {isOpen ? <X /> : <AlignJustify />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="space-y-4">
        <DropdownMenuItem asChild>
          <Link href="/dashboard">Home</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/arbitrage_games">Arbitrage</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/prediction_games">Prediction</Link>
        </DropdownMenuItem>
        {isAuthenticated && (
          <DropdownMenuItem asChild>
            <Link href="/agent_registration">Become an Agent</Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem asChild>
          <Link href="/terms">Terms of Service</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/terms">Privacy Policy</Link>
        </DropdownMenuItem>
        {!isAuthenticated && (
          <Fragment>
            <DropdownMenuItem asChild>
              <Link
                className={cn(buttonVariants({ variant: "defaultOutline" }))}
                href="/"
              >
                Login
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                className={cn(buttonVariants({ variant: "default" }), "ml-2")}
                href="/register"
              >
                Sign Up
              </Link>
            </DropdownMenuItem>
          </Fragment>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
