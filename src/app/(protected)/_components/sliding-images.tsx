"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";

/**
 * A component that renders a carousel with images.
 */
function SlidingImages() {
  /**
   * The carousel component.
   */
  return (
    <Carousel
      plugins={[
        Autoplay({
          delay: 1200,
          stopOnFocusIn: false,
          stopOnInteraction: false,
          stopOnMouseEnter: false,
        }),
      ]}
      opts={{
        loop: true,
      }}
      className="w-full my-6"
    >
      <CarouselContent>
        {Array.from({ length: 19 }).map((_, index) => (
          <CarouselItem
            key={`slider-image-${index + 1}`}
            className="basis-4/5 md:basis-3/5"
          >
            <div className="relative h-56">
              <Image
                src={`/slider/img${index + 1}.jpeg`}
                alt={`Image ${index + 1}`}
                className="object-cover object-top"
                fill
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}

export default SlidingImages;
