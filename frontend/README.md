### Hello, I am Fardin Abdulla.


This is a basic portfolio built with Next.js, Tailwind CSS, and Framer Motion.

## Environment variables

API keys are no longer fetched from the Render backend. They live in environment
variables and the secret ones are only used by the server routes in `src/app/api/`.

| Variable | Where it's used | Secret? |
| --- | --- | --- |
| `LASTFM_API_KEY`, `LASTFM_USERNAME` | `/api/lastfm` (Spotify card) | yes |
| `OPENAI_API_KEY` (optional `OPENAI_MODEL`) | `/api/chat` (AI chat bubble) | yes |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | 3D map in the browser | no, but restrict it by HTTP referrer in Google Cloud |
| `NEXT_PUBLIC_DISCORD_USER_ID` | Discord card (optional) | no |

- Local dev: copy `.env.example` to `.env.local` and fill it in.
- Production: add the same variables in Vercel → Project → Settings → Environment Variables, then redeploy.
