"use client";

import { LazyMotion, domAnimation, m } from "framer-motion";

interface NowPlayingProps {
  stationTitle: string;
  stationHindiTitle: string;
  currentTitle: string;
  currentAuthor: string;
}

export default function NowPlaying({
  stationTitle,
  stationHindiTitle,
  currentTitle,
  currentAuthor,
}: NowPlayingProps) {
  return (
    <LazyMotion features={domAnimation}>
      <m.div
        key={currentTitle || stationTitle}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center"
      >
        <p className="text-[10px] font-semibold tracking-[0.35em] uppercase text-white/40 mb-2">
          Now Playing
        </p>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-tight text-white text-editorial text-shadow-md leading-tight">
          {currentTitle || stationTitle}
        </h2>
        <p className="text-sm sm:text-base text-white/50 mt-3 font-light text-shadow-sm max-w-2xl mx-auto">
          {currentAuthor || stationHindiTitle}
        </p>
        <p className="text-[10px] uppercase tracking-[0.35em] text-white/40 mt-5">
          Station
        </p>
        <p className="text-sm text-white/55 mt-1">
          {stationTitle}
        </p>
      </m.div>
    </LazyMotion>
  );
}
