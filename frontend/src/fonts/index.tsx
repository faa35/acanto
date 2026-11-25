import localFont from "next/font/local";

// All fonts are stored in this folder (no Google Fonts download at dev/build time,
// so the site still starts when fonts.googleapis.com is slow or blocked).

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

// Main text font: a calm reading serif (like the old site). Variable font, 300-700.
export const newsreader = localFont({
  src: [
    { path: "./Newsreader-Variable.woff2", weight: "300 700", style: "normal" },
    { path: "./Newsreader-Italic-Variable.woff2", weight: "300 700", style: "italic" },
  ],
  variable: "--font-text",
  display: "swap",
  adjustFontFallback: "Times New Roman",
});

// Accent serif for headlines / song titles
export const instrumentSerif = localFont({
  src: [
    { path: "./InstrumentSerif-Regular.woff2", weight: "400", style: "normal" },
    { path: "./InstrumentSerif-Italic.woff2", weight: "400", style: "italic" },
  ],
  variable: "--font-serif",
  display: "swap",
  adjustFontFallback: "Times New Roman",
});

// Code font for the GitHub card's background snippet (ligatures on)
export const jetbrainsMono = localFont({
  src: [{ path: "./JetBrainsMono-Regular.woff2", weight: "400", style: "normal" }],
  variable: "--font-code",
  display: "swap",
  preload: false,
});

// Pixel font used by the Discord display-name style on the profile
export const silkscreen = localFont({
  src: [
    { path: "./Silkscreen-Regular.woff2", weight: "400", style: "normal" },
    { path: "./Silkscreen-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-pixel",
  display: "swap",
  preload: false,
});
