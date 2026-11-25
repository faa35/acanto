"use client";

import CardWrapper from "@/components/cards/card-wrapper";
import React, { CSSProperties, useEffect, useState } from "react";
import cn from "classnames";
import { FaSpotify } from "react-icons/fa";
import { useActive } from "@/lib/use-active";
import { SideFigure } from "@/components/figures";

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

function Equalizer({ playing, green }: { playing: boolean; green: boolean }) {
  return (
    <span className="flex h-3 items-end gap-[2px]" aria-hidden>
      {[0.9, 0.6, 1.1, 0.75].map((dur, i) => (
        <span
          key={i}
          className={cn("eq-bar w-[3px] rounded-full transition-colors duration-300", green ? "bg-[#1db954]" : "bg-[var(--text)]")}
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

  // Short box (desktop / tablet grid) = cover on the left, song on the right.
  // Tall box (phones) = cover on top, song underneath.
  // (Tailwind needs the full class names written out, hence the long `[@container(...)]:` prefixes.)
  return (
    <CardWrapper className="media-card">
      <div ref={ref} {...handlers} className="h-full w-full [container-type:size]">
        <div className="relative flex h-full flex-row gap-6 p-5 [@container(min-height:360px)]:flex-col [@container(min-height:360px)]:gap-0">
          {/* ---------- album cover in a thin frame ---------- */}
          <div className="relative aspect-square w-[min(42cqw,calc(100cqh-40px))] shrink-0 self-start [@container(min-height:360px)]:w-[min(58cqw,44cqh)]">
            <div className="media-muted relative h-full w-full border-2 border-[var(--border)] bg-[var(--panel)] p-[5px]">
              {song?.albumArtUrl ? (
                <img src={song.albumArtUrl} alt={`${song.albumName || song.songName} cover`} className="h-full w-full object-cover" />
              ) : (
                <div className={cn("flex h-full w-full items-center justify-center bg-[var(--pill)]", !song && !failed && "animate-pulse")}>
                  <FaSpotify className="h-10 w-10 text-[var(--muted)]" />
                </div>
              )}
            </div>
          </div>

          {/* ---------- song info ---------- */}
          <div className="relative z-[2] min-w-0 flex-1 pr-14 pt-1 [@container(min-height:360px)]:mt-auto [@container(min-height:360px)]:flex-none [@container(min-height:360px)]:pr-[118px] [@container(min-height:360px)]:pt-0">
            <p className="mb-1.5 flex items-center gap-2 overflow-hidden whitespace-nowrap text-[13px] text-[var(--muted)]">
              <Equalizer playing={playing} green={active} />
              {song?.isNowPlaying ? "Now playing" : "Last played"}
              {song && !song.isNowPlaying && song.playedAt && <span className="truncate opacity-70">· {timeAgo(song.playedAt)}</span>}
            </p>

            {song ? (
              <>
                <a
                  href={song.trackUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="line-clamp-2 font-serif text-[30px] leading-[1.08] text-[var(--text)] hover:underline [@container(min-height:360px)]:line-clamp-1 [@container(min-height:360px)]:text-[28px]"
                  title={song.songName}
                >
                  {song.songName}
                </a>
                <p className="mt-1.5 truncate text-[14px] text-[var(--muted)]">
                  by <span className="text-[var(--text)]">{song.artistName}</span>
                </p>
                {song.albumName && (
                  <p className="truncate text-[14px] text-[var(--muted)]">
                    on <span className="text-[var(--text)]">{song.albumName}</span>
                  </p>
                )}
              </>
            ) : failed ? (
              <p className="font-serif text-[22px] leading-tight text-[var(--text)]">Music is taking a break</p>
            ) : (
              <div className="flex flex-col gap-2 pt-1">
                <span className="h-6 w-3/4 animate-pulse bg-[var(--border-strong)]" />
                <span className="h-3 w-1/2 animate-pulse bg-[var(--border)]" />
                <span className="h-3 w-2/3 animate-pulse bg-[var(--border)]" />
              </div>
            )}
          </div>

          {/* ---------- Spotify logo (top-right) ---------- */}
          <a
            href={`https://www.last.fm/user/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            title="Open my Last.fm"
            aria-label="Open my Last.fm"
            className={cn(
              "absolute right-4 top-4 z-[3] flex h-11 w-11 items-center justify-center rounded-full transition-colors duration-300",
              active ? "bg-black text-[#1DB954]" : "bg-[var(--chip)] text-[var(--chip-fg)]"
            )}
          >
            <FaSpotify
              className={cn("h-11 w-11 transition-transform duration-300", active ? "scale-100" : "scale-[0.55]")}
            />
          </a>

          {/* ---------- figure: sits in the bottom-right corner, puts on headphones when hovered ---------- */}
          <SideFigure
            active={active}
            className="-bottom-14 right-0 h-[200px] w-[125px] [@container(min-height:360px)]:-bottom-10 [@container(min-height:360px)]:h-[180px] [@container(min-height:360px)]:w-[112px]"
          />
        </div>
      </div>
    </CardWrapper>
  );
};

export default LastfmCard;
