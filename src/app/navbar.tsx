"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { buttonVariants } from "@/components/ui/button";
import MobileMenuDropdown from "./mobile-menu-dropdown";
import { Fragment } from "react";

/**
 * The top navigation bar component.
 *
 * This component is rendered on every page and shows the navigation menu,
 * logo, and login/register links.
 */
function Navbar() {
  const { data: session } = useSession();
  return (
    <div className="fixed w-full bg-background text-foreground py-6 shadow-2xl border-b flex justify-center z-50">
      <div className="container flex items-center px-4">
        {/* Logo */}
        <Link href="/" className="flex gap-2">
          <div className="h-12 w-32 relative border-secondary-foreground/50">
            <Image
              src={"/logo.png"}
              fill
              alt="OddsEdgeX logo"
              className="object-contain"
            />
          </div>
        </Link>
        {/* Navigation menu */}
        <NavigationMenu className="md:ml-6">
          {/* Navigation menu items */}
          <NavigationMenuList>
            {/* Home page */}
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={cn(
                  navigationMenuTriggerStyle(),
                  "hidden md:inline-flex"
                )}
              >
                <Link href="/home">Home</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={cn(
                  navigationMenuTriggerStyle(),
                  "hidden md:inline-flex"
                )}
              >
                <Link href="/arbitrage_games">Arbitrage</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={cn(
                  navigationMenuTriggerStyle(),
                  "hidden md:inline-flex"
                )}
              >
                <Link href="/prediction_games">Prediction</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            {/* Terms of Service page */}
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={cn(
                  navigationMenuTriggerStyle(),
                  "hidden md:inline-flex"
                )}
              >
                <Link href="/terms">Terms of Service</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={cn(
                  navigationMenuTriggerStyle(),
                  "hidden md:inline-flex"
                )}
              >
                <Link href="/terms">Privacy Policy</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <div className="flex-1" />

        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList className="gap-4">
            {!session?.user ? (
              <Fragment>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    asChild
                    className={cn("hidden md:inline-flex")}
                  >
                    <Link
                      className={cn(
                        buttonVariants({ variant: "defaultOutline" })
                      )}
                      href="/"
                    >
                      Login
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    asChild
                    className={cn("hidden md:inline-flex")}
                  >
                    <Link
                      className={cn(buttonVariants({ variant: "default" }))}
                      href="/register"
                    >
                      Sign Up
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </Fragment>
            ) : (
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "hidden md:inline-flex"
                  )}
                >
                  <Link
                    href="/agent_registration"
                    className={cn(
                      buttonVariants({ variant: "defaultOutline" })
                    )}
                  >
                    Become an Agent
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            )}
          </NavigationMenuList>
        </NavigationMenu>
        <MobileMenuDropdown isAuthenticated={!!session?.user} />
      </div>
    </div>
  );
}

export default Navbar;
