import { signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import {
  Bell,
  Cctv,
  CircleUser,
  House,
  Landmark,
  LogOut,
  Radio,
  User,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";
import MobileNav from "./_components/mobile-nav";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const SIDEBAR_NAV_ITEM_CLASSNAMES =
  "flex w-full p-4 hover:bg-secondary hover:text-secondary-foreground items-center gap-2";

function ProtectedLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="w-full h-full flex border-l border-r">
      <MobileNav />
      <div className="h-full hidden md:flex flex-col md:w-1/6 border-r">
        <div className="flex-1 divide-y">
          <Link href="/home" className={SIDEBAR_NAV_ITEM_CLASSNAMES}>
            <User />
            <span className="text-lg">Home</span>
          </Link>
          <Link href="/dashboard" className={SIDEBAR_NAV_ITEM_CLASSNAMES}>
            <House />
            <span className="text-lg">Dashboard</span>
          </Link>
          <Accordion type="single">
            <AccordionItem value="arbitrage">
              <AccordionTrigger className={SIDEBAR_NAV_ITEM_CLASSNAMES}>
                <Radio />
                <span className="text-lg">Arbitrage Games</span>
              </AccordionTrigger>

              <AccordionContent className="flex flex-col pl-8 gap-4 text-lg">
                <Link href="/arbitrage_games">Place Arbitrage Bet</Link>
                <Link href="/bet_history">View Bet History</Link>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="prediction">
              <AccordionTrigger className={SIDEBAR_NAV_ITEM_CLASSNAMES}>
                <Cctv />
                <span className="text-lg">Prediction Games</span>
              </AccordionTrigger>

              <AccordionContent className="flex flex-col pl-8 gap-4 text-lg">
                <Link href="/arbitrage_games">Place prediction Bet</Link>
                <Link href="/bet_history">View Bet History</Link>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <Link href="/deposit_funds" className={SIDEBAR_NAV_ITEM_CLASSNAMES}>
            <Wallet />
            <span className="text-lg">Deposit</span>
          </Link>
          <Link href="/withdraw_funds" className={SIDEBAR_NAV_ITEM_CLASSNAMES}>
            <Landmark />
            <span className="text-lg">Withdraw</span>
          </Link>
          <Link href="/notifications" className={SIDEBAR_NAV_ITEM_CLASSNAMES}>
            <Bell />
            <span className="text-lg">Notifications(0)</span>
          </Link>
          <Link href="/profile" className={SIDEBAR_NAV_ITEM_CLASSNAMES}>
            <CircleUser />
            <span className="text-lg">Profile</span>
          </Link>
        </div>

        <form
          action={async () => {
            "use server";
            await signOut();
          }}
        >
          <Button
            type="submit"
            variant="destructive"
            className="w-full justify-start h-auto py-4 pl-2 cursor-pointer rounded-none"
          >
            <LogOut className="size-6" />
            <span>Logout</span>
          </Button>
        </form>
      </div>
      <div className="flex-1 w-full">{children}</div>
    </div>
  );
}

export default ProtectedLayout;
