"use client";

import CardWrapper from "./card-wrapper";

/**
 * Background photo card: Ronaldo in the stadium, black & white.
 * Dark mode: dimmed. Light mode: blended into the paper colour.
 * A very slow zoom towards him keeps it alive; it brightens a little on hover.
 * Styles live in globals.scss (.goat-*).
 */
const SiuuCard = () => {
  return (
    <CardWrapper>
      <div className="goat-card relative h-full w-full overflow-hidden">
        <img
          src="/siuu/goat.webp"
          alt="Cristiano Ronaldo standing in the Siuuu stance in front of a packed stadium"
          draggable={false}
          className="goat-img absolute inset-0 h-full w-full select-none object-cover"
        />
        {/* soft fade into the card colour at the top and bottom edges */}
        <div aria-hidden className="goat-fade pointer-events-none absolute inset-0" />
      </div>
    </CardWrapper>
  );
};

export default SiuuCard;
