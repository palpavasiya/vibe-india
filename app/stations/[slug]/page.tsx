import { redirect } from "next/navigation";
import { stations } from "@/data/stations";

export const dynamic = "force-static";

export function generateStaticParams() {
  return stations.map((station) => ({ slug: station.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const station = stations.find((s) => s.slug === slug);
  if (!station) return {};
  
  const title = `${station.title} — Vibe India`;
  const description = `Listen to ${station.title} (${station.hindiTitle}) on Vibe India. Continuous 24/7 curated playlist.`;
  const url = `https://vibe-india.vercel.app/stations/${station.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type: "music.radio_station",
      images: [
        {
          url: station.image,
          width: 1200,
          height: 630,
          alt: station.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [station.image],
    },
  };
}

export default async function StationRedirectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const station = stations.find((s) => s.slug === slug);
  if (!station) return null;
  
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MusicPlaylist",
    "name": station.title,
    "description": `Curated Indian music experience: ${station.title}`,
    "image": `https://vibe-india.vercel.app${station.image}`,
    "url": `https://vibe-india.vercel.app/stations/${station.slug}`,
    "numTracks": 25,
    "genre": "Indian Music"
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {redirect(`/?station=${station.slug}`)}
    </>
  );
}
