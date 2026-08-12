"use client";

import { LazyMotion, domAnimation, m } from "framer-motion";
import { stations } from "@/data/stations";
import { Station } from "@/data/stations";

interface VibeSelectorProps {
  activeStation: Station;
  onSelectStation: (station: Station) => void;
}

import { useRef, useState } from "react";

export default function VibeSelector({
  activeStation,
  onSelectStation,
}: VibeSelectorProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hasDragged, setHasDragged] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setHasDragged(false);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed multiplier
    
    // If moved more than 5px, count it as a drag
    if (Math.abs(walk) > 10) {
      setHasDragged(true);
    }
    
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!scrollContainerRef.current) return;
    // Only hijack vertical scrolling to translate to horizontal
    if (e.deltaY !== 0) {
      scrollContainerRef.current.scrollLeft += e.deltaY;
    }
  };

  return (
    <LazyMotion features={domAnimation}>
      <div className="w-full mt-4 sm:mt-8 mb-4 sm:mb-2 flex justify-center select-none relative group">
        
        {/* Dock Container */}
        <div className="relative flex items-center px-1 sm:px-4 rounded-2xl sm:rounded-3xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl max-w-[95vw] sm:max-w-[85vw] md:max-w-full">
          
          {/* Left scroll indicator */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black/80 to-transparent z-20 rounded-l-2xl sm:rounded-l-3xl pointer-events-none opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300" />

          {/* Scrollable Area */}
          <div 
            ref={scrollContainerRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onWheel={handleWheel}
            className={`flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar relative z-10 px-4 sm:px-6 py-4 snap-x ${isDragging ? 'cursor-grabbing select-none scroll-auto' : 'cursor-grab scroll-smooth'}`}
          >
            {stations.map((vibe, i) => {
              const isActive = vibe.slug === activeStation.slug;
              const isLive = vibe.status === "live";

              return (
                <m.div
                  key={vibe.slug}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  onClick={(e) => {
                    if (hasDragged) {
                      e.preventDefault();
                      e.stopPropagation();
                      return;
                    }
                    if (isLive) onSelectStation(vibe);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      if (isLive) onSelectStation(vibe);
                    }
                  }}
                  tabIndex={isLive ? 0 : -1}
                  role="button"
                  aria-pressed={isActive}
                  aria-label={`Select ${vibe.title} station`}
                  className={`relative shrink-0 rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 snap-center focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black/50
                  ${isActive 
                    ? 'w-[140px] h-12 sm:w-[150px] sm:h-[4.5rem] shadow-[0_0_20px_rgba(255,255,255,0.2)] z-10 scale-105' 
                    : 'w-[110px] h-10 sm:w-[130px] sm:h-16 opacity-60 hover:opacity-100 hover:scale-110 z-0'
                  }
                  ${!isLive && 'opacity-20 grayscale hover:opacity-30 cursor-not-allowed'}
                `}
              >
                {/* Image */}
                <img
                  src={vibe.image}
                  alt={vibe.title}
                  className={`w-full h-full object-cover transition-transform duration-500 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}
                />

                {/* Gradients */}
                <div className={`absolute inset-0 bg-gradient-to-t transition-opacity duration-300 ${isActive ? 'from-black/80 to-transparent' : 'from-black/60 to-transparent group-hover:from-black/80'}`} />

                {/* Active Border Overlay (to fix Safari radius clip bug) */}
                {isActive && (
                  <div className="absolute inset-0 rounded-xl sm:rounded-2xl border-[1.5px] border-white pointer-events-none z-30" />
                )}

                {/* Content */}
                <div className="absolute inset-x-0 bottom-0 p-2 flex flex-col items-center justify-end z-20">
                  {isActive && (
                    <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_5px_rgba(34,197,94,0.8)]" />
                  )}
                  
                  <h3 className={`text-white font-bold text-center drop-shadow-md transition-all duration-300 whitespace-nowrap overflow-hidden text-ellipsis w-full px-1 ${isActive ? 'text-[9px] sm:text-xs' : 'text-[8px] sm:text-[11px]'}`}>
                    {vibe.title}
                  </h3>
                </div>
              </m.div>
            );
          })}
          </div>

          {/* Right scroll indicator */}
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-black/80 to-transparent z-20 rounded-r-2xl sm:rounded-r-3xl pointer-events-none animate-pulse sm:animate-none opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-end pr-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/50"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </div>
        </div>
      </div>
    </LazyMotion>
  );
}
