"use client";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Bell,
  Cctv,
  CircleUser,
  House,
  Landmark,
  LogOut,
  Radio,
  Settings2,
  User,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { signOut } from "next-auth/react";

const NAV_ITEM_CLASSNAMES =
  "flex w-full p-4 hover:bg-secondary hover:text-secondary-foreground items-center gap-2";

function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button size="icon" className="md:hidden fixed top-40 opacity-75 z-50">
          <Settings2 />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <div className="sr-only">
          <SheetTitle>Mobile Navigation</SheetTitle>
          <SheetDescription>Navigate through the app</SheetDescription>
        </div>
        <div className="pt-12 h-full flex flex-col divide-y">
          <div className="flex-1 divide-y">
            <Link
              href="/home"
              className={NAV_ITEM_CLASSNAMES}
              onClick={() => setIsOpen(false)}
            >
              <User />
              <span className="text-lg">Home</span>
            </Link>
            <Link
              href="/dashboard"
              className={NAV_ITEM_CLASSNAMES}
              onClick={() => setIsOpen(false)}
            >
              <House />
              <span className="text-lg">Dashboard</span>
            </Link>
            <Accordion type="single">
              <AccordionItem value="arbitrage">
                <AccordionTrigger className="flex px-4 justify-baseline gap-4">
                  <Radio />
                  <span className="text-lg">Arbitrage Games</span>
                </AccordionTrigger>

                <AccordionContent className="flex flex-col pl-8 gap-4 text-lg">
                  <Link
                    href="/arbitrage_games"
                    onClick={() => setIsOpen(false)}
                  >
                    Place Arbitrage Bet
                  </Link>
                  <Link href="/bet_history" onClick={() => setIsOpen(false)}>
                    View Bet History
                  </Link>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="prediction">
                <AccordionTrigger className="flex px-4 justify-baseline gap-4">
                  <Cctv />
                  <span className="text-lg">Prediction Games</span>
                </AccordionTrigger>

                <AccordionContent className="flex flex-col pl-8 gap-4 text-lg">
                  <Link
                    href="/arbitrage_games"
                    onClick={() => setIsOpen(false)}
                  >
                    Place prediction Bet
                  </Link>
                  <Link href="/bet_history" onClick={() => setIsOpen(false)}>
                    View Bet History
                  </Link>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <Link
              href="/deposit_funds"
              className={NAV_ITEM_CLASSNAMES}
              onClick={() => setIsOpen(false)}
            >
              <Wallet />
              <span className="text-lg">Deposit</span>
            </Link>
            <Link
              href="/withdraw_funds"
              className={NAV_ITEM_CLASSNAMES}
              onClick={() => setIsOpen(false)}
            >
              <Landmark />
              <span className="text-lg">Withdraw</span>
            </Link>
            <Link
              href="/notifications"
              className={NAV_ITEM_CLASSNAMES}
              onClick={() => setIsOpen(false)}
            >
              <Bell />
              <span className="text-lg">Notifications(0)</span>
            </Link>
            <Link
              href="/profile"
              className={NAV_ITEM_CLASSNAMES}
              onClick={() => setIsOpen(false)}
            >
              <CircleUser />
              <span className="text-lg">Profile</span>
            </Link>
          </div>
          <Button
            type="submit"
            variant="destructive"
            className="w-full justify-start h-auto py-4 pl-2 cursor-pointer rounded-none"
            onClick={() => {
              signOut();
              setIsOpen(false);
            }}
          >
            <LogOut className="size-6" />
            <span>Logout</span>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default MobileNav;
