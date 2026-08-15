"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { FootBallArbitrageEventType } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { Loader, Lock } from "lucide-react";
import {
  startTransition,
  useActionState,
  useState,
  useEffect,
  useCallback,
} from "react";
import { placeArbitrageBet } from "./arbitrage-games.action";
import { placeArbitrageFormSchema } from "./arbitrage-games.schema";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type PlaceBetDrawerProps = {
  event: FootBallArbitrageEventType & { id: string };
  disabled?: boolean;
};

/**
 * A component to render a dialog for placing a bet on an arbitrage game.
 *
 * The component takes an event prop which is an object containing the details
 * of the arbitrage game. The event object should have the following properties:
 *
 * - id: The ID of the arbitrage game
 * - homeTeam: The name of the home team
 * - awayTeam: The name of the away team
 * - homeTeamArbitrage: The arbitrage percentage for the home team
 * - awayTeamArbitrage: The arbitrage percentage for the away team
 * - drawArbitrage: The arbitrage percentage for the draw
 *
 * The component also takes a disabled prop which is a boolean indicating whether
 * the dialog should be disabled or not.
 *
 * The component renders a dialog with a form that allows the user to enter the
 * amount they want to bet. The form is validated using the zod library and the
 * placeArbitrageFormSchema schema. The form is submitted to the placeArbitrageBet
 * action which is a function that takes the form data and dispatches an action
 * to place the bet.
 *
 * The component also renders a table that shows the payouts for each outcome of
 * the game. The payouts are calculated by multiplying the amount entered by the
 * user with the arbitrage percentage for each outcome.
 *
 * The component also renders a button that when clicked, opens the dialog.
 *
 * @param {PlaceBetDrawerProps} props - The props for the component
 * @returns {JSX.Element} The rendered component
 */
function PlaceBetDrawer({ disabled, event }: PlaceBetDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const [state, dispatch, isPending] = useActionState(
    placeArbitrageBet,
    undefined
  );

  const router = useRouter();

  const form = useForm<z.infer<typeof placeArbitrageFormSchema>>({
    resolver: zodResolver(placeArbitrageFormSchema),
    defaultValues: {
      amount: "",
    },
  });

  /**
   * Calculates the payout for a given arbitrage percentage
   *
   * @param {number} arbitrage - The arbitrage percentage
   * @returns {string} The calculated payout
   */
  const calculatePayout = useCallback(
    (arbitrage: number) => {
      const amount = Number(form.watch("amount"));
      return formatCurrency((arbitrage / 100) * amount + amount);
    },
    [form]
  );

  const handleSubmit = form.handleSubmit(async (values) => {
    startTransition(() => {
      const formData = new FormData();
      formData.append("amount", values.amount);
      formData.append("gameId", event.id);

      dispatch(formData);
    });
  });

  useEffect(() => {
    if (state && "success" in state) {
      form.reset();
      toast.success("Bet placed successfully");
      router.push("/bet_history");
      setIsOpen(false);
    }

    if (state && "error" in state) {
      toast.error("Error placing bet", {
        description: state.error,
      });
    }
  }, [state, form, router]);

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="w-full" disabled={disabled}>
          {!disabled ? "Place Bet" : <Lock />}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm pb-6">
          <DrawerHeader>
            <DrawerTitle>{`${event.homeTeam} vs ${event.awayTeam}`}</DrawerTitle>
            <DrawerDescription>
              Are you sure you want to place a bet on this match?
            </DrawerDescription>
          </DrawerHeader>

          <div className="w-full pt-6 grid grid-cols-2 grid-rows-4 gap-4 px-4">
            <div className="text-lg font-semibold">Outcome</div>
            <div className="text-right text-lg font-semibold">Payout</div>
            <div>
              Home <span className="text-xs">{event.homeTeamArbitrage}%</span>
            </div>
            <div className="text-right">
              {calculatePayout(event.homeTeamArbitrage)}
            </div>

            <div>
              Draw <span className="text-xs">{event.drawArbitrage}%</span>
            </div>
            <div className="text-right">
              {calculatePayout(event.drawArbitrage)}
            </div>

            <div>
              Away <span className="text-xs">{event.awayTeamArbitrage}%</span>
            </div>
            <div className="text-right">
              {calculatePayout(event.awayTeamArbitrage)}
            </div>
          </div>

          <Form {...form}>
            <form
              className="flex gap-2 px-4 mt-6 items-center justify-center"
              autoComplete="off"
              onSubmit={handleSubmit}
            >
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input
                        placeholder="Amount"
                        type="number"
                        {...field}
                        autoFocus
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isPending}>
                {isPending ? <Loader className="animate-spin" /> : "Place Bet"}
              </Button>
            </form>
          </Form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default PlaceBetDrawer;
