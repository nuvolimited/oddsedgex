import Header from "@/components/ui/header";
import { Metadata } from "next";
import { JSX } from "react";
import CreateArbitrageGameForm from "./create-arbitrage-game-form";

export const metadata: Metadata = {
  title:
    "Create Arbitrage Game - Arbitrage Game Management - OddsEdgeX",
};

/**
 * Page for creating an arbitrage game.
 *
 * This component renders a page with a header and a form
 * for creating a new arbitrage game.
 *
 * @returns {JSX.Element} The rendered component
 */
function CreateArbitrageGame(): JSX.Element {
  return (
    <div className="w-full flex flex-col gap-6 items-center">
      {/* Header for the page */}
      <Header title="Create Arbitrage Game" />

      {/* Container for the form */}
      <div className="w-full max-w-sm">
        {/* Create Arbitrage Game Form component */}
        <CreateArbitrageGameForm />
      </div>
    </div>
  );
}

export default CreateArbitrageGame;
