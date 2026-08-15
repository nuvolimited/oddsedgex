"use client";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import React, {
  startTransition,
  useActionState,
  useEffect,
  useState,
} from "react";
import { updateArbitrageGame } from "./arbitrage-game-management.action";
import { toast } from "sonner";

type UpdateArbitrageGameOutcomeProps = {
  gameId: string;
  end: Date;
};

/**
 * A component to update the outcome of an arbitrage game.
 *
 * This component displays a ToggleGroup with three options: Home, Draw, and Away.
 * When a user selects one of the options, the component will update the outcome
 * of the arbitrage game with the selected option.
 *
 * @param {UpdateArbitrageGameOutcomeProps} props - The props for the component.
 * @returns {JSX.Element} The rendered component.
 */
function UpdateArbitrageGameOutcome({
  end,
  gameId,
}: Readonly<UpdateArbitrageGameOutcomeProps>) {
  /**
   * The current selected outcome
   */
  const [outcome, setOutcome] = useState<"home" | "draw" | "away">();

  /**
   * The current state of the updateArbitrageGame action
   */
  const [state, dispatch, isPending] = useActionState(
    updateArbitrageGame,
    undefined
  );

  useEffect(() => {
    if (state) {
      if ("error" in state) {
        // On error, show error toast
        toast.error("Arbitrage game update failed", {
          description: state.error,
        });
      }
    }
  }, [state]);

  // If the game has not ended, do not render this component
  if (new Date() < end) return null;

  /**
   * Handles the submission of the form
   */
  const handleSubmit = () => {
    startTransition(() => {
      const formData = new FormData();
      formData.append("gameId", gameId);
      formData.append("outcome", outcome as string);
      dispatch(formData);
    });
  };

  return (
    <div className="flex flex-col gap-2 pt-4">
      <ToggleGroup
        type="single"
        className="w-full"
        value={outcome}
        onValueChange={(v) =>
          setOutcome(v as "home" | "draw" | "away" | undefined)
        }
      >
        <ToggleGroupItem value="home">Home</ToggleGroupItem>
        <ToggleGroupItem value="draw">Draw</ToggleGroupItem>
        <ToggleGroupItem value="away">Away</ToggleGroupItem>
      </ToggleGroup>
      <Button onClick={handleSubmit} disabled={!outcome || isPending}>
        Update Outcome
      </Button>
    </div>
  );
}

export default UpdateArbitrageGameOutcome;
