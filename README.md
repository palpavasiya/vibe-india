# Vibe India

Indian vibes. One song at a time.

## Overview

Vibe India is a collection of small digital experiences inspired by everyday India. Each station is a full-screen, cinematic music experience with custom artwork, ambient sounds, and curated YouTube playlists.

No login. No ads. No accounts. No database.

## Concept

Vibe India is not a music streaming platform. It is a digital radio — a simple, beautiful way to listen to Indian music through curated vibes:

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
- Ambient sound mixers (rain, traffic, crowd, train)
- YouTube playlist playback via official IFrame API
- Previous / Play / Next controls
- Shareable station URLs
- Mobile-first responsive design
- PWA support (installable on mobile and desktop)
- Custom station artwork

## Stations

| Station | Vibe |
|---------|------|
| Truck Driver | Highway music. Long roads. No destination. |
| Deluxe Saloon | Old songs. Fresh cut. One more song. |
| Auto Rickshaw | Short rides. Long stories. Desi songs. |
| Highway Dhaba | One more chai before the next 200 kilometers. |
| Chai Tapri | Chai, conversations and songs that never get old. |
| Pan Shop | One last stop before heading home. |
| Local Bus | One seat. One window. One more song. |
| Railway Station | Platforms, journeys and songs for the wait. |

## Tech Stack

- [Next.js](https://nextjs.org/) 15 — React framework
- [TypeScript](https://www.typescriptlang.org/) — type safety
- [Tailwind CSS v4](https://tailwindcss.com/) — styling
- [Framer Motion](https://www.framer.com/motion/) — animations
- [Lucide React](https://lucide.dev/) — icons
- [YouTube IFrame Player API](https://developers.google.com/youtube/iframe_api_reference) — playback

## Project Structure

```
vibe-india/
├── app/
│   ├── page.tsx                  # Homepage
│   ├── layout.tsx                # Root layout & metadata
│   ├── globals.css               # Global styles
│   ├── not-found.tsx             # 404 page
│   ├── info/page.tsx             # Info / editorial page
│   └── stations/[slug]/page.tsx  # Dynamic station page
├── components/
│   ├── player/
│   │   ├── YouTubePlayer.tsx     # YouTube IFrame API hook
│   │   └── RadioPlayer.tsx       # Player controls UI
│   ├── radio/
│   │   ├── RadioExperience.tsx   # Main experience wrapper
│   │   ├── StationCarousel.tsx   # Station selection carousel
│   │   ├── StationBackground.tsx # Cinematic background layer
│   │   ├── NowPlaying.tsx        # Track info display
│   │   ├── VibeSelector.tsx      # Ambient sounds mixer
│   │   └── ShutterLoader.tsx     # Loading animation
│   ├── shared/
│   │   └── Toast.tsx             # Notifications toast
│   └── ui/
│       └── ImageWithFallback.tsx # Image with dark fallback
├── data/
│   └── stations.ts               # Station configurations
├── hooks/
│   └── useAmbientMixer.ts        # Ambient sounds controller hook
├── lib/
│   ├── youtube.ts                # YouTube API utilities
│   └── utils.ts                  # Shared utilities
├── public/
│   ├── master.png                # Master artwork
│   ├── truck.png                 # Truck Driver artwork
│   ├── salon.png                 # Deluxe Saloon artwork
│   ├── chai-tapri.png            # Chai Tapri artwork
│   ├── auto-wala.png             # Auto Rickshaw artwork
│   ├── bus-wala.png              # Local Bus artwork
│   ├── railway.png               # Railway Station artwork
│   ├── highway-dhaba.png         # Highway Dhaba artwork
│   ├── pan-galla.png             # Pan Shop artwork
│   ├── sounds/                   # Ambient audio files
│   │   ├── rain.mp3
│   │   ├── traffic.mp3
│   │   ├── train.mp3
│   │   └── crowd.mp3
│   ├── manifest.json             # PWA manifest
│   └── sw.js                     # Service worker
└── ...config files
```

## YouTube Playlists

Each station can have an optional YouTube playlist configured via environment variables in `.env`:

```env
NEXT_PUBLIC_PLAYLIST_TRUCK_DRIVER="https://www.youtube.com/playlist?list=PLAYLIST_ID"
NEXT_PUBLIC_PLAYLIST_DELUXE_SALOON="https://www.youtube.com/playlist?list=PLAYLIST_ID"
NEXT_PUBLIC_PLAYLIST_AUTO_RICKSHAW="https://www.youtube.com/playlist?list=PLAYLIST_ID"
NEXT_PUBLIC_PLAYLIST_HIGHWAY_DHABA="https://www.youtube.com/playlist?list=PLAYLIST_ID"
NEXT_PUBLIC_PLAYLIST_CHAI_TAPRI="https://www.youtube.com/playlist?list=PLAYLIST_ID"
NEXT_PUBLIC_PLAYLIST_PAN_SHOP="https://www.youtube.com/playlist?list=PLAYLIST_ID"
NEXT_PUBLIC_PLAYLIST_LOCAL_BUS="https://www.youtube.com/playlist?list=PLAYLIST_ID"
NEXT_PUBLIC_PLAYLIST_RAILWAY_STATION="https://www.youtube.com/playlist?list=PLAYLIST_ID"
```

- The full URL is used for the **"Open playlist on YouTube"** button.
- The `list=` ID is extracted automatically for embedded playback.
- Empty values are supported. Stations with no playlist still render and will show a coming-soon state.

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Vercel Deployment

This project is ready to deploy on Vercel.

1. Push the repository to GitHub.
2. Connect the repo to Vercel.
3. Set the environment variables in the Vercel dashboard.
4. Deploy using the default `npm run build` command.

## Copyright / Music

Vibe India does not host music.

Music is played through official YouTube embedded players and playlists. Vibe India does not download, extract, host, or redistribute YouTube audio.

Music, recordings, compositions, artwork, trademarks, and other third-party content remain the property of their respective copyright owners.

## Disclaimer

Vibe India is an independent project. It does not claim ownership of any third-party music, recordings, or content played through YouTube embeds.
