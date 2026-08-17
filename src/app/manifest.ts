import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "OddsEdgeX",
    short_name: "OddsEdgeX",
    description: "OddsEdgeX",
    start_url: "/",
    id: "/",
    display: "standalone",
    background_color: "#fff",
    theme_color: "#fff",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/icons/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icons/apple-touch-icon.png",
        sizes: "any",
        type: "image/png",
      },
      {
        src: "/icons/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        src: "/icons/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
    ],
    screenshots: [
      {
        src: "/screenshots/desktop-view.webp",
        sizes: "1280x720",
        type: "image/webp",
        form_factor: "wide",
        label: "Desktop view of the application",
      },
      {
        src: "/screenshots/mobile-view.webp",
        sizes: "1320x2868",
        type: "image/webp",
        form_factor: "narrow",
        label: "Mobile view of the app",
      },
    ],
  };
}
