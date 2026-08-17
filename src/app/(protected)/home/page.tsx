import React from "react";
import SlidingImages from "../_components/sliding-images";
import { Cctv, Radio } from "lucide-react";
import SlidingArbitrageGames from "./sliding-arbitrage-games";
import { db } from "@/drizzle";
import { FootBallArbitrageEventType } from "@/lib/types";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import PredictionGames from "../_components/prediction-games";
import Image from "next/image";

async function Home() {
  const userId = (await auth())?.user.id;
  if (!userId) redirect("/");

  const games = (
    await db.query.arbitrageGames.findMany({
      orderBy: (arbitrageGames, { desc }) => desc(arbitrageGames.start),
      limit: 5,
    })
  ).map((game) => ({
    ...game,
    event: game.event as FootBallArbitrageEventType,
  }));

  return (
    <div className="w-full flex flex-col h-full">
      <SlidingArbitrageGames games={games} />
      <div className="w-full px-4 space-y-6">
        <div className="py-6 w-full">
          <h2 className="inline-flex items-center gap-2">
            <Radio /> Arbitrage Games
          </h2>
        </div>
        <div className="w-full flex-col gap-6 flex items-center justify-center">
          <a
            href="https://www.edgeandodds.com/"
            target="_blank"
            className="block font-black tracking-widest text-center text-grey-500 hover:text-gray-7 relative h-16 border rounded-md w-sm p-4 shadow shadow-sidebar-accent-foreground text-2xl"
            aria-label="Go to EdgeAndOdds website"
          >
            EdgeAndOdds
          </a>
          <a
            href="https://www.livescore.com/en/"
            target="_blank"
            className="block relative h-16 border rounded-md w-sm p-4 shadow shadow-sidebar-accent-foreground"
            aria-label="Go to LiveScores website"
          >
            <Image
              src="/images/live-score.webp"
              className="object-contain animate-pulse"
              alt="LiveScore"
              fill
            />
          </a>
        </div>
        <div className="py-6 flex flex-col gap-4 w-full">
          <h2 className="inline-flex items-center gap-2">
            <Cctv /> Prediction Games
          </h2>

          <PredictionGames />
        </div>
      </div>
      <div className="flex-1" />
      <SlidingImages />
    </div>
  );
}

export default Home;
