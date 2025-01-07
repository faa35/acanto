// D:\Fall 24\my website\personalweb\frontend\src\app\layout.tsx

import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.scss";
import { silka } from "@/fonts";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${silka.className}`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={true}>    {/* defaultTheme="dark" enableSystem={true} */}
          <div style={{
            flex: "none",
            height: "100%",
            left: "calc(50.00000000000002% - 100% / 2)",
            pointerEvents: "none",
            position: "fixed",
            top: "0",
            width: "100%",
            zIndex: "4",
          }}>
            <div
              style={{
                width: "100%",
                height: "100%",
                backgroundSize: "64px",
                backgroundRepeat: "repeat",
                backgroundImage: "url(/Static.png)",
                opacity: "0.06",
                borderRadius: "0px",
              }}
            />
          </div>
          {children}
        </ThemeProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
