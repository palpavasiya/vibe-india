import Link from "next/link";

export default function NotFound() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black safe-top safe-bottom safe-left safe-right">
      <div className="text-center animate-in fade-in duration-700">
        <h1 className="text-2xl font-light tracking-tight text-white text-editorial">
          404
        </h1>
        <p className="text-sm text-white/40 mt-2">
          This station doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="inline-block mt-6 text-[11px] font-semibold tracking-[0.2em] uppercase text-white/60 hover:text-white transition-colors"
        >
          Back to Vibe India
        </Link>
      </div>
    </div>
  );
}
