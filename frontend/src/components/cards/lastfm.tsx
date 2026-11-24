"use client";

import CardWrapper from "@/components/cards/card-wrapper";
import React, { CSSProperties, useEffect, useState } from "react";
import cn from "classnames";
import { FaSpotify } from "react-icons/fa";
import { useActive } from "@/lib/use-active";
import { SideFigure } from "@/components/figures";
import SendmessageIcon from "@/components/lottie-ui/send-message";

interface Song {
  songName: string;
  artistName: string;
  albumName: string;
  albumArtUrl: string;
  trackUrl: string;
  isNowPlaying: boolean;
  playedAt: number | null;
}

function timeAgo(ts: number) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function Equalizer({ playing }: { playing: boolean }) {
  return (
    <span className="flex h-3 items-end gap-[2px]" aria-hidden>
      {[0.9, 0.6, 1.1, 0.75].map((dur, i) => (
        <span
          key={i}
          className="eq-bar w-[3px] rounded-full bg-[#1db954]"
          style={
            {
              height: "100%",
              animationDuration: `${dur}s`,
              animationPlayState: playing ? "running" : "paused",
              transform: playing ? undefined : `scaleY(${[0.4, 0.7, 0.3, 0.55][i]})`,
            } as CSSProperties
          }
        />
      ))}
    </span>
  );
}

// Wide box (desktop / tablet) = album on the left, text on the right.
// Narrow box (phone) = album on top, text underneath.
// (Tailwind needs the full class names written out, hence the long `[@container(min-width:480px)]:` prefixes.)

const LastfmCard = () => {
  const { ref, active, handlers } = useActive<HTMLDivElement>();
  const [username, setUsername] = useState("acanto7");
  const [song, setSong] = useState<Song | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    // Key stays on the server: see src/app/api/lastfm/route.ts
    const load = () =>
      fetch("/api/lastfm")
        .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
        .then((data) => {
          if (cancelled) return;
          setUsername(data.username);
          if (data.track) setSong(data.track);
          setFailed(false);
        })
        .catch((error) => {
          console.error("Error fetching Last.fm data:", error);
          if (!cancelled) setFailed(true);
        });
    load();
    const id = setInterval(load, 60_000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  const playing = !!song?.isNowPlaying || active;

  return (
    <CardWrapper className="media-card">
      <div ref={ref} {...handlers} className="h-full w-full [container-type:size]">
        <div className="relative flex h-full flex-col p-5 [@container(min-width:480px)]:flex-row [@container(min-width:480px)]:gap-16 [@container(min-width:480px)]:p-7">
          {/* ---------- album cover (big, like the original card) ---------- */}
          <div className="relative aspect-square w-[min(58cqw,44cqh)] shrink-0 self-start [@container(min-width:480px)]:w-[min(48cqw,calc(100cqh-56px))]">
            {/* cover (stays still) */}
            <div
              className={cn(
                "media-muted relative h-full w-full overflow-hidden rounded-3xl border border-[var(--border)] shadow-[0_12px_30px_-12px_rgba(0,0,0,0.5)]"
              )}
            >
              {song?.albumArtUrl ? (
                <img src={song.albumArtUrl} alt={`${song.albumName || song.songName} cover`} className="h-full w-full object-cover" />
              ) : (
                <div
                  className={cn(
                    "flex h-full w-full items-center justify-center bg-[var(--bg-elevated)] bg-gradient-to-br from-[#1db954]/25 to-violet-500/25",
                    !song && !failed && "animate-pulse"
                  )}
                >
                  <FaSpotify className="h-10 w-10 text-[var(--muted)]" />
                </div>
              )}
            </div>
          </div>

          {/* ---------- song info (right side on wide cards, under the cover on phones) ---------- */}
          <div className="relative z-[2] mt-auto min-w-0 pr-14 [@container(min-width:480px)]:mt-0 [@container(min-width:480px)]:flex-1 [@container(min-width:480px)]:pr-0 [@container(min-width:480px)]:pt-16">
            <p className="mb-1.5 flex items-center gap-2 text-[12px] font-medium text-[var(--muted)]">
              <Equalizer playing={playing} />
              {song?.isNowPlaying ? "Now playing" : "Last played"}
              {song && !song.isNowPlaying && song.playedAt && <span className="opacity-70">· {timeAgo(song.playedAt)}</span>}
            </p>

            {song ? (
              <>
                <a
                  href={song.trackUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block truncate font-serif text-[28px] leading-[1.08] text-[var(--text)] hover:underline [@container(min-width:480px)]:line-clamp-2 [@container(min-width:480px)]:whitespace-normal [@container(min-width:480px)]:text-[36px]"
                  title={song.songName}
                >
                  {song.songName}
                </a>
                <p className="mt-1.5 truncate text-[13px] text-[var(--muted)] [@container(min-width:480px)]:text-[14px]">
                  by <span className="font-medium text-[var(--text)]">{song.artistName}</span>
                </p>
                {song.albumName && (
                  <p className="truncate text-[13px] text-[var(--muted)] [@container(min-width:480px)]:text-[14px]">
                    on <span className="font-medium text-[var(--text)]">{song.albumName}</span>
                  </p>
                )}
              </>
            ) : failed ? (
              <p className="font-serif text-[22px] leading-tight text-[var(--text)]">Music is taking a break</p>
            ) : (
              <div className="flex flex-col gap-2 pt-1">
                <span className="h-6 w-3/4 animate-pulse rounded-md bg-[var(--border-strong)]" />
                <span className="h-3 w-1/2 animate-pulse rounded bg-[var(--border)]" />
                <span className="h-3 w-2/3 animate-pulse rounded bg-[var(--border)]" />
              </div>
            )}
          </div>

          {/* ---------- Spotify logo (top-right, like the original) ---------- */}
          <span
            title="Spotify"
            className="absolute right-5 top-5 z-[3] flex h-12 w-12 items-center justify-center rounded-full bg-[var(--chip)] text-[var(--chip-fg)] shadow-md [@container(min-width:480px)]:right-6 [@container(min-width:480px)]:top-6"
          >
            <FaSpotify className="h-7 w-7" />
          </span>

          {/* ---------- figure: pops up under the song name when hovered ---------- */}
          <SideFigure
            active={active}
            className="right-0 top-[22%] h-[130px] w-[81px] [@container(min-width:480px)]:top-[52%] [@container(min-width:480px)]:h-[160px] [@container(min-width:480px)]:w-[100px]"
          />

          <SendmessageIcon
            link={`https://www.last.fm/user/${username}`}
            lottieName="SendMessageIconLastfm"
            label="Open Last.fm profile"
            active={active}
            round
            className="absolute bottom-5 right-5 [@container(min-width:480px)]:bottom-6 [@container(min-width:480px)]:right-6"
          />
        </div>
      </div>
    </CardWrapper>
  );
};

export default LastfmCard;
