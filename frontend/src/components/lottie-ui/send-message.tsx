"use client";

import { useEffect, useRef } from "react";
import cn from "classnames";
import { useTheme } from "next-themes";
import SendmessageAnimation from "../../lottie/arrow/Iconly-Sendmessage.json";
import SendmessageLightAnimation from "../../lottie/arrow/Iconly-SendmessageLight.json";

/**
 * The animated paper-plane button.
 * - `link`: renders an <a>; omit it when the whole card is already a link.
 * - `active`: lets the parent card play the animation while the card is hovered.
 * - `round`: the filled circle style used in the corner of cards.
 */
const SendmessageIcon = ({
  link,
  lottieName,
  active,
  round = false,
  label,
  className,
}: {
  link?: string;
  lottieName: string;
  active?: boolean;
  round?: boolean;
  label?: string;
  className?: string;
}) => {
  const { resolvedTheme } = useTheme();
  const isLightMode = resolvedTheme === "light";
  const sendMessageContainer = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const lot = await import("lottie-web");
      if (cancelled || !sendMessageContainer.current) return;
      lot.default.loadAnimation({
        name: lottieName,
        renderer: "svg",
        loop: false,
        autoplay: false,
        animationData: isLightMode ? SendmessageAnimation : SendmessageLightAnimation,
        container: sendMessageContainer.current,
        rendererSettings: {
          preserveAspectRatio: "xMinYMin slice",
        },
      });
    })();

    return () => {
      cancelled = true;
      import("lottie-web").then((lot) => lot.default.destroy(lottieName));
    };
  }, [isLightMode, lottieName]);

  // play while the parent card is hovered
  useEffect(() => {
    if (active === undefined) return;
    import("lottie-web").then((lot) => (active ? lot.default.play(lottieName) : lot.default.stop(lottieName)));
  }, [active, lottieName]);

  const play = async () => (await import("lottie-web")).default.play(lottieName);
  const stop = async () => {
    if (active) return;
    (await import("lottie-web")).default.stop(lottieName);
  };

  const LottieContainer = (
    <div
      ref={sendMessageContainer}
      onMouseEnter={play}
      onMouseLeave={stop}
      className={cn(
        "h-8 w-8 transition-opacity",
        round ? (active ? "opacity-100" : "opacity-80") : "opacity-50 hover:opacity-100"
      )}
    />
  );

  const wrapperClass = cn(
    "z-10 flex h-12 w-12 items-center justify-center rounded-full transition-all duration-300",
    round
      ? cn(
          // position comes from the caller (usually absolute in a card corner)
          "bg-[var(--chip)] hover:scale-105",
          active && "scale-105 shadow-[0_6px_18px_-8px_rgba(0,0,0,0.35)]"
        )
      : "relative hover:bg-white dark:hover:bg-zinc-700/25 hover:border border-white/10",
    className
  );

  // Render the <a> tag only if the link prop is provided
  return link ? (
    <a href={link} target="_blank" rel="noreferrer noopener" aria-label={label} title={label} className={wrapperClass}>
      {LottieContainer}
    </a>
  ) : (
    <div className={wrapperClass} aria-hidden={label ? undefined : true}>
      {LottieContainer}
    </div>
  );
};

export default SendmessageIcon;
