"use client";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { FootBallArbitrageEventType } from "@/lib/types";
import { formatDateTime } from "@/lib/utils";
import Autoplay from "embla-carousel-autoplay";
import { Volleyball } from "lucide-react";
import Link from "next/link";

function ArbitrageGameCard({
  game,
  start,
}: {
  game: FootBallArbitrageEventType;
  start: Date;
}) {
  return (
    <CarouselItem className="flex flex-col gap-2 max-w-sm border rounded-xl p-4 relative">
      <div className="flex justify-between text-xs text-muted-foreground">
        <div>Arbitrage Games</div>
        <div>{formatDateTime(start)}</div>
      </div>
      <div className="flex gap-2 items-stretch justify-center">
        <div className="flex flex-col gap-2">
          <Volleyball className="size-4" />
          <p className="font-semibold">{game.homeTeam}</p>
          <Button size="sm" variant="secondary">
            <span className="text-muted-foreground text-xs">1</span>
            <span className="font-semibold">{game.homeTeamOdds}</span>
          </Button>
        </div>
        <div className="flex flex-col flex-1 items-center justify-around">
          <div className="flex-1"></div>
          <div className="font-semibold p-2 size-8 rounded-full border flex items-center justify-center">
            <p>vs</p>
          </div>
          <div className="flex-1"></div>
          <Button size="sm" variant="secondary" className="w-full">
            <span className="text-muted-foreground text-xs">x</span>
            <span className="font-semibold">{game.drawOdds}</span>
          </Button>
        </div>
        <div className="flex flex-col gap-2">
          <Volleyball className="size-4 ml-auto" />
          <p className="font-semibold">{game.awayTeam}</p>
          <Button size="sm" variant="secondary">
            <span className="text-muted-foreground text-xs">2</span>
            <span className="font-semibold">{game.awayTeamOdds}</span>
          </Button>
        </div>
      </div>

      <Link href="/arbitrage_games" className="inset-0 absolute" />
    </CarouselItem>
  );
}

type SlidingArbitrageGame = {
  event: FootBallArbitrageEventType;
  id: string;
  end: Date;
  eventType: string;
  start: Date;
  minBet: string;
  maxBet: string | null;
  outcome: string | null;
};

type SlidingArbitrageGamesProps = {
  games: SlidingArbitrageGame[];
};

function SlidingArbitrageGames({
  games,
}: Readonly<SlidingArbitrageGamesProps>) {
  return (
    <Carousel
      plugins={[
        Autoplay({
          delay: 2000,
          stopOnFocusIn: false,
          stopOnInteraction: false,
          stopOnMouseEnter: false,
        }),
      ]}
      opts={{
        loop: true,
      }}
      className="w-full my-6 px-4"
    >
      <CarouselContent className="gap-2">
        {games.map((game) => (
          <ArbitrageGameCard
            key={game.id}
            game={game.event}
            start={game.start}
          />
        ))}
      </CarouselContent>
    </Carousel>
  );
}

export default SlidingArbitrageGames;
