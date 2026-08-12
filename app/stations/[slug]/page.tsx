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
  return {
    title: `${station.title} — Vibe India`,
    description: `Listen to ${station.title} (${station.hindiTitle}) on Vibe India`,
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
  redirect(`/?station=${station.slug}`);
}
