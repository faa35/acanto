// D:\Fall 24\my website\personalweb\frontend\src\app\layout.tsx

import type { Metadata, Viewport } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.scss";
import { silka, instrumentSerif, silkscreen, jetbrainsMono } from "@/fonts";
import { ThemeProvider } from "next-themes";

export const metadata: Metadata = {
  title: "Fardin Abdulla - Portfolio",
  description: "A portfolio of Fardin Abdulla.",
  authors: [
    { name: "Fardin Abdulla", url: " " },
  ],
  openGraph: {
    title: "Fardin Abdulla - Portfolio",
    description: "A portfolio of Fardin Abdulla.",
    url: " ",
    siteName: "Fardin Abdulla - Portfolio",
    type: "website",
    images: [
      {
        url: "https://acanto7.vercel.app/Screenshot2.png",
        width: 3410,
        height: 2072,
        alt: "Fardin Abdulla - Portfolio",
      },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#07070b" },
    { media: "(prefers-color-scheme: light)", color: "#f3f1ec" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${silka.className} ${silka.variable} ${instrumentSerif.variable} ${silkscreen.variable} ${jetbrainsMono.variable}`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={true}>
          {/* Ambient background: soft drifting color + faint grid + grain */}
          <div className="ambient" aria-hidden>
            <div className="blob blob-1" />
            <div className="blob blob-2" />
            <div className="blob blob-3" />
            <div className="ambient-grid" />
            <div className="noise" />
          </div>
          <div className="relative z-[1]">{children}</div>
        </ThemeProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
