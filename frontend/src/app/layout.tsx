// D:\Fall 24\my website\personalweb\frontend\src\app\layout.tsx

import type { Metadata, Viewport } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.scss";
import { silka, instrumentSerif, silkscreen, jetbrainsMono, newsreader } from "@/fonts";
import { ThemeProvider } from "next-themes";
import SiteShell from "@/components/site-shell";

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
    { media: "(prefers-color-scheme: dark)", color: "#11100e" },
    { media: "(prefers-color-scheme: light)", color: "#faf4ed" },
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
        className={`${newsreader.className} ${newsreader.variable} ${silka.variable} ${instrumentSerif.variable} ${silkscreen.variable} ${jetbrainsMono.variable}`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={true}>
          {/* sidebar (Siuuu / Projects / theme) + page content + footer */}
          <SiteShell>{children}</SiteShell>
        </ThemeProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
