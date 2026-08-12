# Desi Radio

Indian vibes. One song at a time.

## Overview

Desi Radio is a collection of small digital experiences inspired by everyday India. Each station is a full-screen, cinematic music experience with custom artwork and curated YouTube playlists.

No login. No ads. No accounts. No database.

## Concept

Desi Radio is not a music streaming platform. It is a digital radio — a simple, beautiful way to listen to Indian music through curated vibes:

- The highway
- The chai tapri
- The salon
- The railway platform
- The streets after dark

Press play. Stay for a while.

## Features

- No login required
- No advertisements
- Full-screen cinematic experiences
- YouTube playlist playback via official IFrame API
- Previous / Play / Next controls
- Shareable station URLs
- Mobile-first responsive design
- Premium glass UI
- Custom station artwork

## Stations

| Station | Vibe |
|---------|------|
| Truck Wala | Highway music. Long roads. No destination. |
| Salon Wala | Old songs. Fresh cut. One more song. |
| Chai Tapri | Chai, conversations and songs that never get old. |
| Auto Wala | Short rides. Long stories. Desi songs. |
| Bus Wala | One seat. One window. One more song. |
| Railway Wala | Platforms, journeys and songs for the wait. |
| Highway Dhaba | One more chai before the next 200 kilometers. |
| Pan Galla | One last stop before heading home. |

## Coming Soon

- Gujarati Truck
- Monsoon Wala
- Night Shift

## Tech Stack

- [Next.js](https://nextjs.org/) 15 — React framework
- [TypeScript](https://www.typescriptlang.org/) — type safety
- [Tailwind CSS](https://tailwindcss.com/) — styling
- [Framer Motion](https://www.framer.com/motion/) — animations
- [Lucide React](https://lucide.dev/) — icons
- [YouTube IFrame Player API](https://developers.google.com/youtube/iframe_api_reference) — playback

## Project Structure

```
desi-radio/
├── app/
│   ├── page.tsx              # Homepage
│   ├── layout.tsx            # Root layout & metadata
│   ├── globals.css           # Global styles
│   ├── not-found.tsx         # 404 page
│   ├── info/
│   │   └── page.tsx          # Info / editorial page
│   ├── truck/
│   │   └── page.tsx          # Truck Wala station
│   ├── salon/
│   │   └── page.tsx          # Salon Wala station
│   ├── chai-tapri/
│   │   └── page.tsx          # Chai Tapri station
│   ├── auto-wala/
│   │   └── page.tsx          # Auto Wala station
│   ├── bus-wala/
│   │   └── page.tsx          # Bus Wala station
│   ├── railway-wala/
│   │   └── page.tsx          # Railway Wala station
│   ├── highway-dhaba/
│   │   └── page.tsx          # Highway Dhaba station
│   └── pan-galla/
│       └── page.tsx          # Pan Galla station
├── components/
│   ├── home/
│   │   └── StationGrid.tsx   # Homepage station list
│   ├── station/
│   │   └── StationExperience.tsx  # Station page wrapper
│   ├── player/
│   │   ├── YouTubePlayer.tsx # YouTube IFrame API hook
│   │   └── RadioPlayer.tsx   # Player controls UI
│   ├── shared/
│   │   ├── NavBar.tsx        # Shared navigation
│   │   └── Toast.tsx         # Link copied toast
│   └── ui/
│       └── ImageWithFallback.tsx  # Image with dark fallback
├── data/
│   └── stations.ts           # Station configurations
├── lib/
│   ├── youtube.ts            # YouTube API utilities
│   └── utils.ts              # Shared utilities
├── public/
│   ├── master.png            # Homepage artwork
│   ├── truck.png             # Truck Wala artwork
│   ├── salon.png             # Salon Wala artwork
│   ├── chai-tapri.png        # Chai Tapri artwork
│   ├── auto-wala.png         # Auto Wala artwork
│   ├── bus-wala.png          # Bus Wala artwork
│   ├── railway.png           # Railway Wala artwork
│   ├── highway-dhaba.png     # Highway Dhaba artwork
│   ├── pan-galla.png         # Pan Galla artwork
│   ├── gujarati-truck.png    # Gujarati Truck (coming soon)
│   ├── monsoon.png           # Monsoon Wala (coming soon)
│   └── night-shift.png       # Night Shift (coming soon)
├── types/
│   └── youtube.d.ts          # YouTube IFrame API types
├── README.md
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
└── postcss.config.js
```

## Artwork

Place your AI-generated images in `public/` using these exact filenames:

- `master.png`
- `truck.png`
- `salon.png`
- `chai-tapri.png`
- `auto-wala.png`
- `bus-wala.png`
- `railway.png`
- `highway-dhaba.png`
- `pan-galla.png`
- `gujarati-truck.png`
- `monsoon.png`
- `night-shift.png`

If an image is missing, the page shows a tasteful dark fallback instead of breaking.

## YouTube Playlists

Each station can have an optional YouTube playlist configured via environment variables in `.env`:

```env
NEXT_PUBLIC_PLAYLIST_TRUCK="https://www.youtube.com/playlist?list=PLAYLIST_ID"
NEXT_PUBLIC_PLAYLIST_SALON="https://www.youtube.com/playlist?list=PLAYLIST_ID"
NEXT_PUBLIC_PLAYLIST_CHAI_TAPRI="https://www.youtube.com/playlist?list=PLAYLIST_ID"
NEXT_PUBLIC_PLAYLIST_AUTO_WALA="https://www.youtube.com/playlist?list=PLAYLIST_ID"
NEXT_PUBLIC_PLAYLIST_BUS_WALA="https://www.youtube.com/playlist?list=PLAYLIST_ID"
NEXT_PUBLIC_PLAYLIST_RAILWAY_WALA="https://www.youtube.com/playlist?list=PLAYLIST_ID"
NEXT_PUBLIC_PLAYLIST_HIGHWAY_DHABA="https://www.youtube.com/playlist?list=PLAYLIST_ID"
NEXT_PUBLIC_PLAYLIST_PAN_GALLA="https://www.youtube.com/playlist?list=PLAYLIST_ID"
NEXT_PUBLIC_PLAYLIST_GUJARATI_TRUCK=""
NEXT_PUBLIC_PLAYLIST_MONSOON_WALA=""
NEXT_PUBLIC_PLAYLIST_NIGHT_SHIFT=""
```

- The full URL is used for the **"Open playlist on YouTube"** button.
- The `list=` ID is extracted automatically for embedded playback.
- Empty values are supported. Stations with no playlist still render and will show a coming-soon state.

### How to update playlists

1. Find a YouTube playlist for the station
2. Copy the full playlist URL
3. Paste it into `.env` under the matching station variable
4. Restart the dev server

**.env.example** is included in the repo for reference.

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production Build

```bash
npm run build
```

## Vercel Deployment

This project is ready to deploy on Vercel.

1. Push the repository to GitHub or another Git provider.
2. Connect the repo to Vercel.
3. Set the same environment variables under the Vercel dashboard.
4. Deploy using the default `npm run build` command.

Vercel will automatically detect the Next.js app and build it correctly.

npm run build
npm start
```

## Deployment

Deploy to Vercel or any standard Next.js-compatible platform.

For Vercel:
1. Push to GitHub
2. Import the repository in Vercel
3. Deploy

No environment variables or build settings are required.

## Copyright / Music

Desi Radio does not host music.

Music on Desi Radio is played through official YouTube embedded players and playlists. Desi Radio does not download, extract, host, or redistribute YouTube audio.

Music, recordings, compositions, artwork, trademarks, and other third-party content remain the property of their respective copyright owners.

Desi Radio does not claim ownership of third-party music.

Links and embedded playback may direct users to or interact with YouTube. Please refer to YouTube and the respective rights holders for applicable content rights.

## Content Ownership

The Desi Radio interface, application code, typography system, layout, and original project artwork are created for Desi Radio.

Third-party names, trademarks, music, recordings, and other copyrighted material belong to their respective owners.

## Disclaimer

Desi Radio is an independent project. It does not claim ownership of any third-party music, recordings, or content played through YouTube embeds.

## Future Ideas

- More Indian vibes / stations
- PWA / installable experience
- More station playlists
- Optional multilingual station metadata
