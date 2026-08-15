import Header from "@/components/ui/header";
import { Metadata } from "next";
import CreatePredictionGameForm from "./create-prediction-game-form";
import { JSX } from "react";

export const metadata: Metadata = {
  title:
    "Create Prediction Game - Prediction Game Management - OddsEdgeX",
};

/**
 * Page for creating a prediction game.
 *
 * @returns JSX.Element
 */
function CreatePredictionGame(): JSX.Element {
  return (
    <div className="w-full flex flex-col gap-6 items-center">
      {/* Header for the page */}
      <Header title="Create Prediction Game" />

      {/* Container for the form */}
      <div className="w-full max-w-sm">
        {/* Create Prediction Game Form component */}
        <CreatePredictionGameForm />
      </div>
    </div>
  );
}

export default CreatePredictionGame;
