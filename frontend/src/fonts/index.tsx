import localFont from "next/font/local";
import { Instrument_Serif, JetBrains_Mono, Silkscreen } from "next/font/google";

export const silka = localFont({
  preload: true,
  variable: '--font-silka',
  src: [
    {
      path: './Silka Thin Webfont.woff2',
      weight: '100',
      style: 'normal',
    },
    {
      path: './Silka Extralight.woff2',
      weight: '200',
      style: 'normal',
    },
    {
      path: './Silka Light Webfont.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: './Silka Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './Silka Medium Webfont.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: './Silka Semibold Webfont.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: './Silka Bold Webfont.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: './Silka Black Webfont.woff2',
      weight: '800',
      style: 'normal',
    },
  ],
})

// Accent serif for headlines / song titles
export const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

// Code font for the GitHub card's background snippet (ligatures on)
export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-code",
  display: "swap",
});

// Pixel font used by the Discord display-name style on the profile
export const silkscreen = Silkscreen({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-pixel",
  display: "swap",
});
