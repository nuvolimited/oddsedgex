"use client";

import Image from "next/image";

function CopyRight() {
  return (
    <section className="w-full text-center py-4 text-sm border-t text-muted-foreground">
      © {new Date().getFullYear()} OddsEdgeX. All rights reserved.
    </section>
  );
}

function MarqueeImageItem({
  src,
  alt,
}: Readonly<{ src: string; alt: string }>) {
  return (
    <div className="w-28 h-8 relative">
      <Image src={src} alt={alt} fill className="object-contain" />
    </div>
  );
}

function MarqueeSlide() {
  return (
    <div className="flex gap-4">
      <MarqueeImageItem src="/sliding_images/debit.png" alt="Debit logo" />
      <MarqueeImageItem src="/sliding_images/gamomat.png" alt="Gamomat logo" />
      <MarqueeImageItem src="/sliding_images/maestro.png" alt="maestro logo" />
      <MarqueeImageItem
        src="/sliding_images/mastercard.png"
        alt="mastercard logo"
      />
      <MarqueeImageItem
        src="/sliding_images/neteller.png"
        alt="neteller logo"
      />
      <MarqueeImageItem src="/sliding_images/netent.png" alt="netent logo" />
      <MarqueeImageItem
        src="/sliding_images/paysafecard.png"
        alt="pay safe card logo"
      />
      <MarqueeImageItem src="/sliding_images/play-go.png" alt="play-go logo" />
      <MarqueeImageItem
        src="/sliding_images/pragmathic-play.png"
        alt="pragmathic-play logo"
      />
      <MarqueeImageItem src="/sliding_images/skrill.png" alt="skrill logo" />
      <MarqueeImageItem src="/sliding_images/visa.png" alt="visa logo" />
      <MarqueeImageItem
        src="/sliding_images/webmoney.png"
        alt="webmoney logo"
      />
    </div>
  );
}

function PaymentOptionMarquee() {
  return (
    <section className="w-full p-4 bg-secondary h-20 overflow-x-hidden">
      <div className="flex animate-marquee gap-4 pt-2">
        <MarqueeSlide />
        <MarqueeSlide />
      </div>
    </section>
  );
}

export default function Footer() {
  return (
    <footer className="w-full">
      <PaymentOptionMarquee />
      <CopyRight />
    </footer>
  );
}
