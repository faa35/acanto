"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import cn from "classnames";
import { FaDiscord } from "react-icons/fa";
import { useActive, useNearViewport } from "@/lib/use-active";
import SendmessageIcon from "@/components/lottie-ui/send-message";

/* ------------------------------------------------------------------ */
/* Config + snapshot of the profile (so the card paints instantly and */
/* still looks right if the live APIs are slow or down).              */
/* ------------------------------------------------------------------ */

const DISCORD_ID = process.env.NEXT_PUBLIC_DISCORD_USER_ID || "760451623474036766";

// Colours follow the site's light/dark theme (see globals.scss)
const C = {
  bg: "var(--card-solid)", // solid match for the card surface (avatar ring, status ring)
  panel: "var(--panel)",
  pill: "var(--pill)",
  text: "var(--text)",
  textSoft: "var(--text-soft)",
  muted: "var(--muted)",
  time: "var(--discord-time)",
};

const KNOWN_DECORATION = "a_c45abe8c7585fdb41b8d8d4d666f1588";

const SNAPSHOT = {
  username: "acanto7",
  globalName: "Siuuu",
  avatar: "/discord/avatar.png",
  decoration: "/discord/decoration.png",
  decorationAnimated: "/discord/decoration-animated.png",
  guildTag: "PRX",
  guildBadge: "/discord/guild-tag.png",
  bannerColor: "#29a3b3",
  bio: "I wish",
};

type Badge = { id: string; icon: string; description?: string };

// The first four aren't exposed by any public API, so they ship as local images.
const EXTRA_BADGES: Badge[] = [
  { id: "extra-1", icon: "/discord/badge-extra-1.png" },
  { id: "extra-2", icon: "/discord/badge-extra-2.png" },
  { id: "extra-3", icon: "/discord/badge-extra-3.png" },
  { id: "extra-4", icon: "/discord/badge-extra-4.png" },
];

const KNOWN_BADGES: Badge[] = [
  { id: "hypesquad_house_1", description: "HypeSquad Bravery", icon: "/discord/badge-hypesquad-bravery.png" },
  { id: "legacy_username", description: "Originally known as cr7#9824", icon: "/discord/badge-legacy-username.png" },
  { id: "quest_completed", description: "Completed a Quest", icon: "/discord/badge-quest.png" },
  { id: "orb_profile_badge", description: "Collected the Orb Profile Badge", icon: "/discord/badge-orb.png" },
];

const LOCAL_BADGE_ICONS: Record<string, string> = Object.fromEntries(KNOWN_BADGES.map((b) => [b.id, b.icon]));

const APP_ICONS: Record<string, string> = {
  "Visual Studio Code": "/tech-icons/vscode.svg",
  VALORANT: "/tech-icons/valorant.svg",
  Brave: "/tech-icons/brave.svg",
  OneNote: "/tech-icons/onenote.svg",
};

// "the same duck" profile effect (intro plays once, then the loop repeats)
const EFFECT = {
  still: "/discord/effect-reduced.png",
  intro: "/discord/effect-intro.png",
  loop: "/discord/effect-loop.png",
  introMs: 5083,
};

const MAX_VISIBLE_BADGES = 6;


/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */

interface Activity {
  id: string;
  name: string;
  type: number;
  state?: string;
  details?: string;
  application_id?: string;
  timestamps?: { start?: number; end?: number };
  assets?: { large_image?: string; large_text?: string };
  emoji?: { name: string; id?: string; animated?: boolean };
}

interface Spotify {
  song: string;
  artist: string;
  album: string;
  album_art_url: string;
  timestamps: { start: number; end: number };
}

interface Presence {
  username: string;
  globalName: string;
  avatar: string;
  decoration: string | null;
  decorationAnimated: string | null;
  guildTag: string | null;
  guildBadge: string | null;
  status: "online" | "idle" | "dnd" | "offline";
  activities: Activity[];
  spotify: Spotify | null;
}

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

function formatElapsed(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}

function activityImage(a: Activity): string | null {
  const large = a.assets?.large_image;
  if (large) {
    if (large.startsWith("mp:")) return `https://media.discordapp.net/${large.slice(3)}`;
    if (large.startsWith("spotify:")) return `https://i.scdn.co/image/${large.slice(8)}`;
    if (a.application_id) return `https://cdn.discordapp.com/app-assets/${a.application_id}/${large}.png`;
  }
  return APP_ICONS[a.name] ?? null;
}

const SECTION_LABEL: Record<number, string> = {
  0: "Playing",
  1: "Streaming",
  2: "Listening to",
  3: "Watching",
  5: "Competing in",
};

/** Discord account creation date, decoded from the snowflake ID. */
function memberSince(id: string) {
  const ms = Number(BigInt(id) >> BigInt(22)) + 1420070400000;
  return new Date(ms).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

/** Fetch an animated PNG once, then hand out fresh object URLs so it restarts from frame 1 every hover. */
function useReplayableImage(src: string, enabled: boolean) {
  const blobRef = useRef<Blob | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!enabled || blobRef.current) return;
    let cancelled = false;
    fetch(src)
      .then((r) => r.blob())
      .then((b) => {
        if (cancelled) return;
        blobRef.current = b;
        setReady(true);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [src, enabled]);

  const make = () => (blobRef.current ? URL.createObjectURL(blobRef.current) : null);
  return { ready, make };
}

/* ------------------------------------------------------------------ */
/* Small presentational pieces                                        */
/* ------------------------------------------------------------------ */

function StatusDot({ status }: { status: Presence["status"] }) {
  const colors = { online: "#43a25a", idle: "#ca9654", dnd: "#d83a42", offline: "#83838b" };
  const color = colors[status];
  return (
    <span
      className="absolute bottom-[2px] right-[2px] flex h-[22px] w-[22px] items-center justify-center rounded-full"
      style={{ background: C.bg }}
      title={status === "dnd" ? "Do Not Disturb" : status[0].toUpperCase() + status.slice(1)}
    >
      <span className="relative block h-[14px] w-[14px] overflow-hidden rounded-full" style={{ background: color }}>
        {status === "idle" && (
          <span className="absolute -left-[3px] -top-[3px] h-[11px] w-[11px] rounded-full" style={{ background: C.bg }} />
        )}
        {status === "dnd" && (
          <span className="absolute left-[3px] top-[5.5px] h-[3px] w-[8px] rounded-full" style={{ background: C.bg }} />
        )}
        {status === "offline" && (
          <span className="absolute left-[3.5px] top-[3.5px] h-[7px] w-[7px] rounded-full" style={{ background: C.bg }} />
        )}
      </span>
    </span>
  );
}

/** Discord's placeholder icon for games it doesn't have art for. */
function UnknownGameIcon() {
  return (
    <svg viewBox="0 0 60 60" className="h-full w-full">
      <rect width="60" height="60" rx="10" fill="#fff" />
      {[
        [11, 11],
        [49, 11],
        [11, 49],
        [49, 49],
      ].map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="4.5" fill="#1e1f22" />
      ))}
      <path
        d="M23 23.5c0-4.2 3.3-7.2 7.6-7.2 4.4 0 7.4 2.8 7.4 6.6 0 2.8-1.6 4.4-3.6 5.6-1.6 1-2.3 1.7-2.3 3.4v1.2h-4.6v-1.6c0-2.9 1.3-4.3 3.3-5.5 1.6-1 2.5-1.7 2.5-3.1 0-1.6-1.2-2.7-2.9-2.7-1.8 0-3 1.2-3.1 3.3H23Z"
        fill="#1e1f22"
      />
      <circle cx="30.3" cy="40.5" r="2.9" fill="#1e1f22" />
    </svg>
  );
}

function Controller({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M7.5 6h9A5.5 5.5 0 0 1 22 11.5V15a3 3 0 0 1-5.36 1.85L15.4 15.3a1 1 0 0 0-.78-.38H9.38a1 1 0 0 0-.78.38l-1.24 1.55A3 3 0 0 1 2 15v-3.5A5.5 5.5 0 0 1 7.5 6Zm-.5 3.25a.75.75 0 0 0-.75.75v1H5.25a.75.75 0 0 0 0 1.5h1v1a.75.75 0 0 0 1.5 0v-1h1a.75.75 0 0 0 0-1.5h-1v-1A.75.75 0 0 0 7 9.25Zm9.5.25a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm-2 2.25a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z" />
    </svg>
  );
}

function Panel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-lg px-3 py-2", className)} style={{ background: C.panel }}>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Card                                                               */
/* ------------------------------------------------------------------ */

const DiscordCard = () => {
  const { ref: activeRef, active, handlers } = useActive<HTMLDivElement>();
  const { ref: nearRef, near } = useNearViewport<HTMLDivElement>();

  const [presence, setPresence] = useState<Presence>({
    username: SNAPSHOT.username,
    globalName: SNAPSHOT.globalName,
    avatar: SNAPSHOT.avatar,
    decoration: SNAPSHOT.decoration,
    decorationAnimated: SNAPSHOT.decorationAnimated,
    guildTag: SNAPSHOT.guildTag,
    guildBadge: SNAPSHOT.guildBadge,
    status: "offline",
    activities: [],
    spotify: null,
  });
  const [bio, setBio] = useState(SNAPSHOT.bio);
  const [badges, setBadges] = useState<Badge[]>([...EXTRA_BADGES, ...KNOWN_BADGES]);
  const [now, setNow] = useState(() => Date.now());
  const [showAllBadges, setShowAllBadges] = useState(false);

  /* ---------- live presence (Lanyard), refreshed every 30s ---------- */
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`);
        const json = await res.json();
        if (!json.success || cancelled) return;
        const d = json.data;
        const u = d.discord_user;
        const deco = u.avatar_decoration_data?.asset as string | undefined;
        const decoIsKnown = deco === KNOWN_DECORATION;
        const guild = u.primary_guild;
        setPresence({
          username: u.username,
          globalName: u.global_name || u.display_name || u.username,
          avatar: u.avatar
            ? `https://cdn.discordapp.com/avatars/${u.id}/${u.avatar}.${u.avatar.startsWith("a_") ? "gif" : "png"}?size=256`
            : SNAPSHOT.avatar,
          decoration: deco
            ? decoIsKnown
              ? SNAPSHOT.decoration
              : `https://cdn.discordapp.com/avatar-decoration-presets/${deco}.png?size=240&passthrough=false`
            : null,
          decorationAnimated: deco
            ? decoIsKnown
              ? SNAPSHOT.decorationAnimated
              : `https://cdn.discordapp.com/avatar-decoration-presets/${deco}.png?size=240&passthrough=true`
            : null,
          guildTag: guild?.identity_enabled ? guild.tag : null,
          guildBadge:
            guild?.identity_enabled && guild.badge
              ? `https://cdn.discordapp.com/guild-tag-badges/${guild.identity_guild_id}/${guild.badge}.png?size=32`
              : null,
          status: d.discord_status,
          activities: d.activities ?? [],
          spotify: d.spotify,
        });
      } catch (err) {
        console.error("Error fetching Discord presence:", err);
      }
    };
    load();
    const id = setInterval(load, 30_000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  /* ---------- profile extras (bio, badges) ---------- */
  useEffect(() => {
    fetch(`https://dcdn.dstn.to/profile/${DISCORD_ID}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((p) => {
        if (!p) return;
        if (typeof p.user_profile?.bio === "string") setBio(p.user_profile.bio);
        if (Array.isArray(p.badges) && p.badges.length) {
          setBadges([
            ...EXTRA_BADGES,
            ...p.badges.map((b: Badge) => ({
              id: b.id,
              description: b.description,
              icon: LOCAL_BADGE_ICONS[b.id] ?? `https://cdn.discordapp.com/badge-icons/${b.icon}.png`,
            })),
          ]);
        }
      })
      .catch(() => {});
  }, []);

  /* ---------- pick what to show in the activity panel ---------- */
  const custom = presence.activities.find((a) => a.type === 4);
  const activity = useMemo(() => {
    const list = presence.activities.filter((a) => a.type !== 4);
    // Prefer apps/games over Spotify, like before
    return list.find((a) => a.name !== "Spotify") ?? list[0] ?? null;
  }, [presence.activities]);

  const isSpotify = activity?.name === "Spotify" && presence.spotify;
  const start = isSpotify ? presence.spotify!.timestamps.start : activity?.timestamps?.start;

  useEffect(() => {
    if (!start) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [start]);

  /* ---------- profile effect: still frame -> intro -> loop on hover ---------- */
  const intro = useReplayableImage(EFFECT.intro, near);
  const loop = useReplayableImage(EFFECT.loop, near);
  const [phase, setPhase] = useState<"still" | "intro" | "loop">("still");
  const [introUrl, setIntroUrl] = useState<string | null>(null);
  const [loopUrl, setLoopUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!active || !intro.ready) {
      setPhase("still");
      return;
    }
    const iu = intro.make();
    setIntroUrl(iu);
    setPhase("intro");
    const t = setTimeout(() => {
      if (loop.ready) {
        setLoopUrl(loop.make());
        setPhase("loop");
      }
    }, EFFECT.introMs);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, intro.ready, loop.ready]);

  // free blob URLs we no longer need
  useEffect(() => () => void (introUrl && URL.revokeObjectURL(introUrl)), [introUrl]);
  useEffect(() => () => void (loopUrl && URL.revokeObjectURL(loopUrl)), [loopUrl]);

  // warm the animated decoration so the swap on hover is instant
  useEffect(() => {
    if (near && presence.decorationAnimated) {
      const img = new Image();
      img.src = presence.decorationAnimated;
    }
  }, [near, presence.decorationAnimated]);

  const visibleBadges = showAllBadges ? badges : badges.slice(0, MAX_VISIBLE_BADGES);
  const hiddenCount = badges.length - MAX_VISIBLE_BADGES;

  return (
    <div
      ref={(el) => {
        (activeRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
        (nearRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
      }}
      {...handlers}
      className={cn(
        "media-card relative h-full w-full overflow-hidden rounded-[28px] border border-[var(--border)] bg-[var(--surface)] backdrop-blur-xl transition-[border-color,box-shadow] duration-500 hover:border-[var(--border-strong)]",
        "shadow-[0_10px_30px_-12px_rgba(0,0,0,0.25)]",
        active && "shadow-[0_20px_60px_-20px_rgba(41,163,179,0.45)]"
      )}
      style={{ fontFamily: '"gg sans","Noto Sans","Helvetica Neue",Helvetica,Arial,sans-serif' }}
    >
      {/* ---------- banner ---------- */}
      <div className="relative h-[80px]">
        <div aria-hidden className="media-muted absolute inset-0" style={{ background: SNAPSHOT.bannerColor }} />
        <span
          title="Discord"
          className="absolute right-3 top-3 z-30 flex h-11 w-11 items-center justify-center rounded-full bg-[var(--chip)] text-[var(--chip-fg)] shadow-md"
        >
          <FaDiscord className="h-6 w-6" />
        </span>
      </div>

      {/* paper plane: message me on Discord */}
      <SendmessageIcon
        link={`https://discord.com/users/${DISCORD_ID}`}
        lottieName="SendMessageIconDiscord"
        label="Message me on Discord"
        active={active}
        round
        className="absolute right-3 top-[90px] z-30"
      />

      {/* ---------- avatar + decoration ---------- */}
      <div className="absolute left-[12px] top-[34px] z-20">
        <div className="relative h-[92px] w-[92px] rounded-full p-[6px]" style={{ background: C.bg }}>
          <img src={presence.avatar} alt="Discord avatar" className="media-muted h-[80px] w-[80px] rounded-full object-cover" />
          {presence.decoration && (
            <img
              src={active && presence.decorationAnimated ? presence.decorationAnimated : presence.decoration}
              alt=""
              aria-hidden
              className="media-muted pointer-events-none absolute left-1/2 top-1/2 h-[96px] w-[96px] max-w-none -translate-x-1/2 -translate-y-1/2"
            />
          )}
          <StatusDot status={presence.status} />
        </div>
      </div>

      {/* custom status bubble (only when one is set) */}
      {custom && (custom.state || custom.emoji) && (
        <div
          className="absolute left-[110px] top-[88px] z-20 flex max-w-[calc(100%-176px)] items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-[12px] shadow-lg"
          style={{ background: C.panel, color: C.textSoft }}
        >
          {custom.emoji?.id ? (
            <img
              src={`https://cdn.discordapp.com/emojis/${custom.emoji.id}.${custom.emoji.animated ? "gif" : "png"}?size=32`}
              alt={custom.emoji.name}
              className="h-4 w-4"
            />
          ) : (
            custom.emoji?.name && <span>{custom.emoji.name}</span>
          )}
          {custom.state && <span className="truncate">{custom.state}</span>}
        </div>
      )}

      {/* ---------- body ---------- */}
      <div className="relative z-10 flex flex-col gap-2 px-4 pb-2 pt-[50px]">
        {/* names */}
        <div className="flex flex-col gap-0.5">
          <h3
            className="font-pixel text-[20px] font-bold uppercase leading-6 tracking-[0.02em]"
            style={{ color: C.text }}
          >
            {presence.globalName}
          </h3>
          <div className="flex flex-wrap items-center gap-2 text-[14px]" style={{ color: C.textSoft }}>
            <span>{presence.username}</span>
            {presence.guildTag && (
              <span
                className="inline-flex items-center gap-1 rounded-md px-1.5 py-[2px] text-[12px] font-semibold"
                style={{ background: C.pill }}
                title="Server Tag"
              >
                {presence.guildBadge && <img src={presence.guildBadge} alt="" className="h-[14px] w-[14px]" />}
                {presence.guildTag}
              </span>
            )}
          </div>
        </div>

        {/* badges */}
        <div
          className="media-muted flex w-fit max-w-full flex-wrap items-center gap-[3px] rounded-lg px-1.5 py-1"
          style={{ background: C.pill }}
        >
          {visibleBadges.map((b) => (
            <span key={b.id} className="group/badge relative flex h-[22px] w-[22px] items-center justify-center">
              <img src={b.icon} alt={b.description ?? "Discord badge"} className="h-[20px] w-[20px] object-contain" />
              {b.description && (
                <span className="pointer-events-none absolute bottom-full left-1/2 z-40 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#111214] px-2 py-1 text-[11px] font-medium text-white opacity-0 shadow-lg transition-opacity group-hover/badge:opacity-100">
                  {b.description}
                </span>
              )}
            </span>
          ))}
          {!showAllBadges && hiddenCount > 0 && (
            <button
              type="button"
              onClick={() => setShowAllBadges(true)}
              className="px-1 text-[13px] font-semibold transition-colors hover:text-white"
              style={{ color: C.textSoft }}
              aria-label={`Show ${hiddenCount} more badges`}
            >
              +{hiddenCount}
            </button>
          )}
        </div>

        {/* bio */}
        {bio && (
          <p className="whitespace-pre-line text-[14px] leading-[18px]" style={{ color: C.textSoft }}>
            {bio}
          </p>
        )}

        {/* activity */}
        {activity ? (
          <Panel className="relative overflow-hidden pb-2.5">
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-[12px] font-semibold" style={{ color: C.textSoft }}>
                {SECTION_LABEL[activity.type] ?? "Playing"}
                {activity.type === 2 && ` ${activity.name}`}
              </span>
              <span className="flex gap-[3px] pr-1" aria-hidden>
                {[0, 1, 2].map((i) => (
                  <span key={i} className="h-[3px] w-[3px] rounded-full" style={{ background: C.textSoft }} />
                ))}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="media-muted relative h-[52px] w-[52px] shrink-0 overflow-hidden rounded-[10px]">
                {isSpotify ? (
                  <img src={presence.spotify!.album_art_url} alt={presence.spotify!.album} className="h-full w-full object-cover" />
                ) : activityImage(activity) ? (
                  <img
                    src={activityImage(activity)!}
                    alt={activity.name}
                    className="h-full w-full bg-[var(--pill)] object-contain p-1.5"
                  />
                ) : (
                  <UnknownGameIcon />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-bold leading-[18px]" style={{ color: C.text }}>
                  {isSpotify ? presence.spotify!.song : activity.name}
                </p>
                {(isSpotify ? presence.spotify!.artist : activity.details) && (
                  <p className="truncate text-[12px] leading-4" style={{ color: C.textSoft }}>
                    {isSpotify ? `by ${presence.spotify!.artist}` : activity.details}
                  </p>
                )}
                {!isSpotify && activity.state && (
                  <p className="truncate text-[12px] leading-4" style={{ color: C.textSoft }}>
                    {activity.state}
                  </p>
                )}
                {start && (
                  <p
                    className="mt-0.5 flex items-center gap-1 font-mono text-[13px] font-semibold leading-4"
                    style={{ color: C.time }}
                  >
                    <Controller className="h-[14px] w-[14px]" />
                    {formatElapsed(now - start)}
                  </p>
                )}
              </div>
            </div>
          </Panel>
        ) : (
          <Panel className="relative overflow-hidden pb-2.5">
            <span className="text-[12px] font-semibold" style={{ color: C.textSoft }}>
              Member Since
            </span>
            <p className="mt-1 flex items-center gap-1.5 text-[14px]" style={{ color: C.textSoft }}>
              <FaDiscord className="h-4 w-4" style={{ color: C.muted }} />
              {memberSince(DISCORD_ID)}
            </p>
            <p className="mt-0.5 text-[12px]" style={{ color: C.muted }}>
              Not doing anything right now
            </p>
          </Panel>
        )}
      </div>

      {/* ---------- profile effect overlay ---------- */}
      <div className="media-muted pointer-events-none absolute inset-x-0 top-0 z-[25] aspect-[450/880]">
        <img
          src={EFFECT.still}
          alt=""
          aria-hidden
          className={cn(
            "absolute inset-0 h-full w-full transition-opacity duration-300",
            phase === "still" ? "opacity-100" : "opacity-0"
          )}
        />
        {phase !== "still" && introUrl && (
          <img
            src={introUrl}
            alt=""
            aria-hidden
            className={cn("absolute inset-0 h-full w-full", phase === "loop" && "opacity-0")}
          />
        )}
        {phase === "loop" && loopUrl && (
          <img src={loopUrl} alt="" aria-hidden className="absolute inset-0 h-full w-full" />
        )}
      </div>
    </div>
  );
};

export default DiscordCard;
