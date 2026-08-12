"use client";

import { LazyMotion, domAnimation, m } from "framer-motion";
import { useState, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Loader2 } from "lucide-react";

interface RadioPlayerProps {
  stationTitle: string;
  stationImage: string;
  playlistUrl?: string;
  containerRef?: React.RefObject<HTMLDivElement | null>;
  state: {
    isReady: boolean;
    isPlaying: boolean;
    currentTitle: string;
    currentAuthor: string;
    currentThumbnail: string;
    hasPlaylist: boolean;
    currentTime: number;
    duration: number;
    isMuted: boolean;
  };
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSeekTo: (seconds: number) => void;
  onMute: () => void;
  onUnmute: () => void;
  onOpenPlaylist?: () => void;
}

function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function RadioPlayer({
  stationTitle,
  stationImage,
  playlistUrl,
  containerRef,
  state,
  onPlay,
  onPause,
  onNext,
  onPrevious,
  onSeekTo,
  onMute,
  onUnmute,
}: RadioPlayerProps) {
  const [tapToTune, setTapToTune] = useState(false);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverX, setHoverX] = useState<number>(0);

  useEffect(() => {
    if (state.isReady && state.hasPlaylist && !state.isPlaying) {
      setTapToTune(true);
    } else {
      setTapToTune(false);
    }
  }, [state.isReady, state.hasPlaylist, state.isPlaying]);

  const handlePrimaryAction = () => {
    if (!state.isReady || !state.hasPlaylist) return;
    if (!state.isPlaying) {
      onPlay();
      setTapToTune(false);
    } else {
      onPause();
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!state.duration || !state.isReady) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    onSeekTo(percentage * state.duration);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!state.duration || !state.isReady) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    setHoverTime(percentage * state.duration);
    setHoverX(x);
  };

  const handleMouseLeave = () => {
    setHoverTime(null);
  };

  return (
    <LazyMotion features={domAnimation}>
      {/* Hidden YouTube player container */}
      {containerRef && <div ref={containerRef as any} className="hidden" />}
      
      <div className="glass-panel mx-auto w-[95vw] sm:w-[500px] md:w-[600px] max-w-2xl rounded-full px-3 py-2.5 sm:px-6 sm:py-4 flex items-center gap-2.5 sm:gap-6 shadow-2xl backdrop-blur-3xl">
        {!state.isReady ? (
          <div className="flex-1 flex items-center justify-center gap-3 py-2">
            <Loader2 className="w-5 h-5 text-white/50 animate-spin" />
            <span className="text-[12px] text-white/60 font-medium tracking-wide">Loading vibe...</span>
          </div>
        ) : (
          <>
            {/* Vinyl Record Thumbnail */}
            <div className="relative w-10 h-10 sm:w-16 sm:h-16 shrink-0 rounded-full bg-black/50 shadow-[0_4px_10px_rgba(0,0,0,0.5)] border border-white/5 flex items-center justify-center overflow-hidden">
              <img
                src={state.currentThumbnail || stationImage}
                alt="Thumbnail"
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ${
                  state.isPlaying ? "animate-spin-slow scale-110" : "scale-100"
                }`}
                style={{ animationDuration: '10s' }}
              />
              {/* Vinyl Hole */}
              <div className="absolute w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-black shadow-[inset_0_1px_3px_rgba(0,0,0,0.8)] z-10 border border-white/10" />
            </div>

            {/* Middle: Info and Progress */}
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <div className="flex items-baseline justify-between mb-0.5">
                <span className="text-sm sm:text-base text-white font-medium truncate drop-shadow-md">
                  {state.currentTitle || stationTitle}
                </span>
              </div>
              <div className="text-[11px] sm:text-xs text-white/70 truncate drop-shadow-sm">
                {state.currentAuthor || "Vibe India Live"}
              </div>
              
              {/* Progress bar and Equalizer */}
              <div className="flex flex-col mt-2">
                <div 
                  className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden relative cursor-pointer group mb-1.5"
                  onClick={handleSeek}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                >
                  {/* Hover tooltip logic handled outside overflow-hidden */}
                  <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div 
                    className="h-full bg-white/80 rounded-full transition-all duration-[1000ms] ease-linear" 
                    style={{ 
                      width: state.duration ? `${(state.currentTime / state.duration) * 100}%` : '0%' 
                    }} 
                  />
                </div>

                {/* Hover Tooltip - Positioned relative to the track but outside overflow-hidden */}
                {hoverTime !== null && (
                  <div 
                    className="absolute z-10 pointer-events-none transform -translate-x-1/2 -translate-y-6"
                    style={{ left: `calc(3rem + 1.5rem + ${hoverX}px)` }} // Offset for thumbnail (3rem) and gap (1.5rem)
                  >
                    <div className="bg-black/80 backdrop-blur-md px-1.5 py-0.5 rounded text-[9px] text-white font-mono shadow-lg border border-white/10">
                      {formatTime(hoverTime)}
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center px-1">
                  <span className="text-[10px] text-white/50 font-mono tracking-wider">
                    {state.duration ? `${formatTime(state.currentTime)} / ${formatTime(state.duration)}` : "--:-- / --:--"}
                  </span>
                  
                  <div className="flex items-center gap-1.5 shrink-0 justify-end">
                    <span className={`text-[9px] sm:text-[10px] tracking-widest font-mono font-medium ${state.isPlaying ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'text-white/40'}`}>
                      {state.isPlaying ? "LIVE" : tapToTune ? "READY" : "PAUSED"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Controls */}
            <div className="flex items-center gap-1.5 sm:gap-4 shrink-0 pl-0.5 sm:pl-1">
              
              <div className="flex items-center gap-0.5 sm:gap-2 mr-0.5 sm:mr-2">
                <button
                  onClick={onPrevious}
                  disabled={!state.hasPlaylist}
                  className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-white/60 hover:text-white disabled:opacity-30 transition-colors hover:scale-110 active:scale-95"
                  aria-label="Previous"
                >
                  <SkipBack size={18} className="fill-current" />
                </button>

                <button
                  onClick={handlePrimaryAction}
                  disabled={!state.hasPlaylist}
                  className={`relative w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-white text-black flex items-center justify-center transition-all duration-300 disabled:opacity-30 ${
                    tapToTune 
                      ? 'animate-pulse-glow ring-4 ring-white/20 shadow-[0_0_30px_rgba(255,255,255,0.4)]' 
                      : state.isPlaying 
                        ? 'shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_35px_rgba(255,255,255,0.5)] hover:scale-105 active:scale-95'
                        : 'shadow-[0_4px_14px_rgba(255,255,255,0.25)] hover:shadow-[0_6px_20px_rgba(255,255,255,0.4)] hover:scale-105 active:scale-95'
                  }`}
                  aria-label={state.isPlaying ? "Pause" : "Play"}
                >
                  {state.isPlaying ? (
                    <Pause size={20} className="fill-current sm:w-6 sm:h-6" />
                  ) : (
                    <Play size={20} className="fill-current ml-1 sm:w-6 sm:h-6" />
                  )}
                </button>

                <button
                  onClick={onNext}
                  disabled={!state.hasPlaylist}
                  className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-white/60 hover:text-white disabled:opacity-30 transition-colors hover:scale-110 active:scale-95"
                  aria-label="Next"
                >
                  <SkipForward size={18} className="fill-current" />
                </button>
              </div>

              {/* Secondary Controls (Mute & Fullscreen) */}
              <div className="flex flex-col gap-0.5 sm:gap-1 border-l border-white/10 pl-1.5 sm:pl-3">
                <button
                  onClick={state.isMuted ? onUnmute : onMute}
                  className="w-6 h-6 flex items-center justify-center text-white/40 hover:text-white transition-colors hover:scale-110 active:scale-95"
                  title={state.isMuted ? "Unmute" : "Mute"}
                >
                  {state.isMuted ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
                  )}
                </button>
                <button
                  onClick={() => {
                    if (!document.fullscreenElement) {
                      document.documentElement.requestFullscreen().catch(err => console.log(err));
                    } else {
                      document.exitFullscreen().catch(err => console.log(err));
                    }
                  }}
                  className="w-6 h-6 flex items-center justify-center text-white/40 hover:text-white transition-colors hover:scale-110 active:scale-95"
                  title="Fullscreen"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </LazyMotion>
  );
}
