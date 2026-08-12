export function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

export function extractYouTubePlaylistId(url: string): string {
  if (!url) return "";
  const regex =
    /[?&]list=([^&#]+)/;
  const match = url.match(regex);
  return match ? match[1] : "";
}
