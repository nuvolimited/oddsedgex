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
import { startTransition, useActionState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";
import { createPredictionGameFormSchema } from "./create-prediction-game.schema";
import { createPredictionGame } from "./create-prediction-game.action";

/**
 * A form component for creating prediction games.
 *
 * The component renders a form with fields for the start and end dates of the
 * game, as well as an accordion for entering the details of the two teams and
 * the draw. The form is validated using the zod library and the
 * createPredictionGameFormSchema schema. The form is submitted to the
 * createPredictionGame action which is a function that takes the form data and
 * dispatches an action to create the prediction game.
 *
 * The component also renders a loading indicator when the form is being
 * submitted and displays an error message if the form submission fails.
 *
 * @returns The rendered component
 */
function CreatePredictionGameForm() {
  const [state, dispatch, isPending] = useActionState(
    createPredictionGame,
    undefined
  );

  const form = useForm<z.infer<typeof createPredictionGameFormSchema>>({
    resolver: zodResolver(createPredictionGameFormSchema),
    defaultValues: {
      end: "",
      start: "",
      event: {
        homeTeam: "",
        awayTeam: "",
        homeTeamOdds: "",
        awayTeamOdds: "",
        drawOdds: "",
      },
    },
  });

  /**
   * Handles form submission.
   *
   * The function takes the form data and dispatches an action to create the
   * prediction game.
   *
   * @param {z.infer<typeof createPredictionGameFormSchema>} payload - The form data
   */
  const handleSubmit = form.handleSubmit((payload) => {
    startTransition(() => {
      const formData = new FormData();
      formData.append("start", payload.start);
      formData.append("end", payload.end);
      formData.append("event", JSON.stringify(payload.event));
      dispatch(formData);
    });
  });

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
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Submit button with loading indicator */}
        <Button type="submit" className="w-full mt-4" disabled={isPending}>
          {isPending ? <Loader className="animate-spin" /> : "Submit"}
        </Button>
      </form>
    </Form>
  );
}

export default CreatePredictionGameForm;
