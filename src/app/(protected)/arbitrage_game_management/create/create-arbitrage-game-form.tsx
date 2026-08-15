"use client";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader } from "lucide-react";
import { startTransition, useActionState, useEffect, JSX } from "react";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { createArbitrageGame } from "./create-arbitrage-game.action";
import { createArbitrageGameFormSchema } from "./create-arbitrage-game.schema";
import { EXPIRY_TIMES } from "./create-arbitrage-game.type";

function CreateArbitrageForm(): JSX.Element {
  // Manage action state for creating arbitrage game
  const [state, dispatch, isPending] = useActionState(
    createArbitrageGame,
    undefined
  );

  // Initialize form using react-hook-form with Zod schema validation
  const form = useForm<z.infer<typeof createArbitrageGameFormSchema>>({
    resolver: zodResolver(createArbitrageGameFormSchema),
    defaultValues: {
      end: "",
      start: "",
      expiry: "",
      minBet: "",
      maxBet: "",
      event: {
        homeTeam: "",
        awayTeam: "",
        homeTeamOdds: "",
        awayTeamOdds: "",
        drawOdds: "",
        homeTeamArbitrage: "",
        awayTeamArbitrage: "",
        drawArbitrage: "",
      },
    },
  });

  // Handler for form submission
  const handleSubmit = form.handleSubmit((payload) => {
    startTransition(() => {
      const formData = new FormData();
      formData.append("start", payload.start);
      formData.append("end", payload.end);
      formData.append("minBet", payload.minBet.toString());
      formData.append("maxBet", payload.maxBet.toString());
      formData.append("expiry", payload.expiry);
      formData.append("event", JSON.stringify(payload.event));
      dispatch(formData);
    });
  });

  // Effect to handle action state changes
  useEffect(() => {
    if (state?.success) {
      form.reset();
      toast.success("Game created successfully");
    }

    if (state && "error" in state) {
      toast.error("Error creating game", {
        description: state.error,
      });
    }
  }, [state, form]);

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {Object.values(form.formState.errors).length > 0 && (
          <div className="mb-4 text-red-600">
            <ul>
              {Object.entries(form.formState.errors).map(([field, error]) => (
                <li key={field}>
                  {error?.message || `Invalid value for ${field}`}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Form fields for start and end dates */}
        <FormField
          control={form.control}
          name="start"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start</FormLabel>
              <FormControl>
                <Input type="datetime-local" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="end"
          render={({ field }) => (
            <FormItem>
              <FormLabel>End</FormLabel>
              <FormControl>
                <Input type="datetime-local" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="expiry"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expiry Time</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl className="w-full">
                  <SelectTrigger>
                    <SelectValue placeholder="Select expiry time" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {EXPIRY_TIMES.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Accordion for event details */}
        <Accordion type="single">
          <AccordionItem value="homeTeam">
            <AccordionTrigger>Home Team</AccordionTrigger>
            <AccordionContent className="space-y-4">
              <FormField
                control={form.control}
                name="event.homeTeam"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="event.homeTeamOdds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Odds</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="event.homeTeamArbitrage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Arbitrage (%)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="awayTeam">
            <AccordionTrigger>Away Team</AccordionTrigger>
            <AccordionContent className="space-y-4">
              <FormField
                control={form.control}
                name="event.awayTeam"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="event.awayTeamOdds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Odds</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="event.awayTeamArbitrage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Arbitrage (%)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="Draw">
            <AccordionTrigger>Draw</AccordionTrigger>
            <AccordionContent className="space-y-4">
              <FormField
                control={form.control}
                name="event.drawOdds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Odds</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="event.drawArbitrage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Arbitrage</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Form fields for minimum and maximum bets */}
        <FormField
          control={form.control}
          name="minBet"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Minimum Bet</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="maxBet"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Maximum Bet</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit button with loading indicator */}
        <Button type="submit" className="w-full mt-4" disabled={isPending}>
          {isPending ? <Loader className="animate-spin" /> : "Submit"}
        </Button>
      </form>
    </Form>
  );
}

export default CreateArbitrageForm;
