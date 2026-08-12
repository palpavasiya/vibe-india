export interface Station {
  id: string;
  title: string;
  hindiTitle: string;
  slug: string;
  status: "live" | "coming-soon";
  image: string;
  playlistId: string | null;
  playlistUrl: string | null;
}

const getPlaylistId = (url: string | undefined): string | null => {
  if (!url) return null;
  try {
    const urlObj = new URL(url);
    return urlObj.searchParams.get("list");
  } catch {
    return null;
  }
};

const allStations: Station[] = [
  {
    id: "1",
    title: "Truck Driver",
    hindiTitle: "ट्रक ड्राइवर",
    slug: "truck-driver",
    status: "live",
    image: "/truck.webp",
    playlistUrl: process.env.NEXT_PUBLIC_PLAYLIST_TRUCK_DRIVER || null,
    playlistId: getPlaylistId(process.env.NEXT_PUBLIC_PLAYLIST_TRUCK_DRIVER),
  },
  {
    id: "2",
    title: "Deluxe Saloon",
    hindiTitle: "डीलक्स सैलून",
    slug: "deluxe-saloon",
    status: "live",
    image: "/salon.webp",
    playlistUrl: process.env.NEXT_PUBLIC_PLAYLIST_DELUXE_SALOON || null,
    playlistId: getPlaylistId(process.env.NEXT_PUBLIC_PLAYLIST_DELUXE_SALOON),
  },
  {
    id: "5",
    title: "Auto Rickshaw",
    hindiTitle: "ऑटो रिक्शा",
    slug: "auto-rickshaw",
    status: "live",
    image: "/auto-wala.webp",
    playlistUrl: process.env.NEXT_PUBLIC_PLAYLIST_AUTO_RICKSHAW || null,
    playlistId: getPlaylistId(process.env.NEXT_PUBLIC_PLAYLIST_AUTO_RICKSHAW),
  },
  {
    id: "3",
    title: "Highway Dhaba",
    hindiTitle: "हाईवे ढाबा",
    slug: "highway-dhaba",
    status: "live",
    image: "/highway-dhaba.webp",
    playlistUrl: process.env.NEXT_PUBLIC_PLAYLIST_HIGHWAY_DHABA || null,
    playlistId: getPlaylistId(process.env.NEXT_PUBLIC_PLAYLIST_HIGHWAY_DHABA),
  },
  {
    id: "4",
    title: "Chai Tapri",
    hindiTitle: "चाय टपरी",
    slug: "chai-tapri",
    status: "live",
    image: "/chai-tapri.webp",
    playlistUrl: process.env.NEXT_PUBLIC_PLAYLIST_CHAI_TAPRI || null,
    playlistId: getPlaylistId(process.env.NEXT_PUBLIC_PLAYLIST_CHAI_TAPRI),
  },
  {
    id: "7",
    title: "Pan Shop",
    hindiTitle: "पान की दुकान",
    slug: "pan-shop",
    status: "live",
    image: "/pan-galla.webp",
    playlistUrl: process.env.NEXT_PUBLIC_PLAYLIST_PAN_SHOP || null,
    playlistId: getPlaylistId(process.env.NEXT_PUBLIC_PLAYLIST_PAN_SHOP),
  },
  {
    id: "6",
    title: "Local Bus",
    hindiTitle: "लोकल बस",
    slug: "local-bus",
    status: "live",
    image: "/bus-wala.webp",
    playlistUrl: process.env.NEXT_PUBLIC_PLAYLIST_LOCAL_BUS || null,
    playlistId: getPlaylistId(process.env.NEXT_PUBLIC_PLAYLIST_LOCAL_BUS),
  },
  {
    id: "8",
    title: "Railway Station",
    hindiTitle: "रेलवे स्टेशन",
    slug: "railway-station",
    status: "live",
    image: "/railway.webp",
    playlistUrl: process.env.NEXT_PUBLIC_PLAYLIST_RAILWAY_STATION || null,
    playlistId: getPlaylistId(process.env.NEXT_PUBLIC_PLAYLIST_RAILWAY_STATION),
  },
];

export const getStations = (): Station[] => {
  return allStations;
};

export const getStationBySlug = (slug: string): Station | undefined => {
  return allStations.find((station) => station.slug === slug);
};
export const stations = allStations;
export const defaultVibe = process.env.NEXT_PUBLIC_DEFAULT_VIBE || "truck-driver";
