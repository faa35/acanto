import { NextResponse } from "next/server";

// Runs on the server (Vercel function) so the Last.fm key never reaches the browser.
export const dynamic = "force-dynamic";

// Last.fm returns this star image when it has no artwork for a track
const PLACEHOLDER_ART = "2a96cbd8b46e442fc41c2b86b821562f";

export async function GET() {
  const key = process.env.LASTFM_API_KEY;
  const username = process.env.LASTFM_USERNAME || "acanto7";

  if (!key) {
    return NextResponse.json({ error: "LASTFM_API_KEY is not configured" }, { status: 500 });
  }

  const url =
    `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks` +
    `&user=${encodeURIComponent(username)}&api_key=${key}&format=json&limit=1`;

  try {
    const res = await fetch(url, { cache: "no-store" });
    const data = await res.json();
    if (!res.ok || data.error) {
      return NextResponse.json({ error: data.message || "Last.fm request failed" }, { status: 502 });
    }

    const track = data.recenttracks?.track?.[0];
    const art: string = track?.image?.[3]?.["#text"] || "";

    return NextResponse.json(
      {
        username,
        track: track
          ? {
              songName: track.name,
              artistName: track.artist?.["#text"] ?? "",
              albumName: track.album?.["#text"] ?? "",
              albumArtUrl: art.includes(PLACEHOLDER_ART) ? "" : art,
              trackUrl: track.url,
              isNowPlaying: track["@attr"]?.nowplaying === "true",
              playedAt: track.date?.uts ? Number(track.date.uts) * 1000 : null,
            }
          : null,
      },
      // let Vercel's edge cache it briefly so every visitor doesn't hit Last.fm
      { headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60" } }
    );
  } catch {
    return NextResponse.json({ error: "Could not reach Last.fm" }, { status: 502 });
  }
}
