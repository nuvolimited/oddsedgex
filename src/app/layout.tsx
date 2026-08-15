import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "./navbar";
import { SessionProvider } from "next-auth/react";
import Footer from "./footer";
import { MessageCircle } from "lucide-react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OddsEdgeX",
  description: "OddsEdgeX",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen bg-background text-foreground dark flex flex-col items-center select-none relative`}
      >
        <SessionProvider>
          <Navbar />
          <div className="container flex-1 flex flex-col pt-24">{children}</div>
        </SessionProvider>
        <Footer />
        <Toaster position="top-right" />

        <a
          href="https://api.whatsapp.com/send?phone=447521359623"
          aria-label="Chat with us on WhatsApp"
          target="_blank"
          className="size-12 rounded-full fixed bottom-28 right-12 md:right-3 z-50 bg-secondary border hover:border-orange-400 hover:scale-110 hover:shadow-md flex items-center justify-center shadow-secondary-foreground/70 text-orange-500 shadow-xs"
        >
          <MessageCircle className="animate-pulse" />
          <span className="sr-only">Chat with us on WhatsApp</span>
        </a>
      </body>
    </html>
  );
}
