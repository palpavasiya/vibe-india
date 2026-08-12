"use client";

import { useCallback, useRef } from "react";
import { LazyMotion, domAnimation, m } from "framer-motion";
import { stations } from "@/data/stations";
import { Station } from "@/data/stations";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface StationCarouselProps {
  activeStation: Station;
  onSelectStation: (station: Station) => void;
}

export default function StationCarousel({
  activeStation,
  onSelectStation,
}: StationCarouselProps) {
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const activeIndex = stations.findIndex((s) => s.slug === activeStation.slug);
  const prevStation = activeIndex > 0 ? stations[activeIndex - 1] : null;
  const nextStation =
    activeIndex < stations.length - 1 ? stations[activeIndex + 1] : null;

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(() => {
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 50;
    if (Math.abs(diff) > threshold) {
      if (diff > 0 && nextStation && nextStation.status === "live") {
        onSelectStation(nextStation);
      } else if (diff < 0 && prevStation && prevStation.status === "live") {
        onSelectStation(prevStation);
      }
    }
    touchStartX.current = 0;
    touchEndX.current = 0;
  }, [nextStation, prevStation, onSelectStation]);

  const handlePrev = useCallback(() => {
    if (prevStation && prevStation.status === "live") {
      onSelectStation(prevStation);
    }
  }, [prevStation, onSelectStation]);

  const handleNext = useCallback(() => {
    if (nextStation && nextStation.status === "live") {
      onSelectStation(nextStation);
    }
  }, [nextStation, onSelectStation]);

  return (
    <LazyMotion features={domAnimation}>
      <div
        className="glass-panel flex items-center justify-center gap-3 sm:gap-4 w-full select-none overflow-hidden rounded-[2rem] border-white/10 bg-black/30 p-3 shadow-[0_24px_80px_rgba(0,0,0,0.35)]"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Previous */}
        <m.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: prevStation ? 1 : 0.3, x: 0 }}
          transition={{ duration: 0.4 }}
          onClick={handlePrev}
          disabled={!prevStation || prevStation.status === "coming-soon"}
          className={`
            glass-button flex items-center gap-1.5 px-4 py-2.5 rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95
            ${prevStation && prevStation.status === "live"
              ? "text-white/70 hover:text-white hover:bg-white/10 hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] cursor-pointer"
              : "text-white/20 cursor-not-allowed hover:scale-100"
            }
          `}
          aria-label="Previous station"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          {prevStation && (
            <span className="text-[10px] sm:text-xs font-medium tracking-[0.15em] uppercase whitespace-nowrap">
              {prevStation.title}
            </span>
          )}
        </m.button>

        {/* Active Station */}
        <div className="flex flex-col items-center min-w-[120px]">
          <span className="text-sm sm:text-base font-bold tracking-[0.2em] uppercase text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.8)]">
            {activeStation.title}
          </span>
          <m.span
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="h-[2px] bg-white rounded-full mt-2 shadow-[0_0_10px_rgba(255,255,255,0.8)]"
            style={{ width: "60px" }}
          />
          {activeStation.hindiTitle && (
            <span className="text-[10px] sm:text-xs text-white/40 mt-1.5 font-light">
              {activeStation.hindiTitle}
            </span>
          )}
        </div>

        {/* Next */}
        <m.button
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: nextStation ? 1 : 0.3, x: 0 }}
          transition={{ duration: 0.4 }}
          onClick={handleNext}
          disabled={!nextStation || nextStation.status === "coming-soon"}
          className={`
            glass-button flex items-center gap-1.5 px-4 py-2.5 rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95
            ${nextStation && nextStation.status === "live"
              ? "text-white/70 hover:text-white hover:bg-white/10 hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] cursor-pointer"
              : "text-white/20 cursor-not-allowed hover:scale-100"
            }
          `}
          aria-label="Next station"
        >
          {nextStation && (
            <span className="text-[10px] sm:text-xs font-medium tracking-[0.15em] uppercase whitespace-nowrap">
              {nextStation.title}
            </span>
          )}
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </m.button>
      </div>
    </LazyMotion>
  );
}
