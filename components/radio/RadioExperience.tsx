"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LazyMotion, domAnimation, m, AnimatePresence } from "framer-motion";
import { stations, defaultVibe } from "@/data/stations";
import StationBackground from "@/components/radio/StationBackground";
import RadioPlayer from "@/components/player/RadioPlayer";
import { useYouTubePlayer } from "@/components/player/YouTubePlayer";
import Toast from "@/components/shared/Toast";
import ShutterLoader from "@/components/radio/ShutterLoader";
import VibeSelector from "@/components/radio/VibeSelector";
import { Play, Pause, Moon } from "lucide-react";
import Link from "next/link";
import { useAmbientMixer, AMBIENT_SOUNDS, AmbientSound } from "@/hooks/useAmbientMixer";

export default function RadioExperience() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [toastVisible, setToastVisible] = useState(false);
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
  const [isMixerMenuOpen, setIsMixerMenuOpen] = useState(false);
  const { volumes, handleVolumeChange } = useAmbientMixer();
  const [showShutter, setShowShutter] = useState(() => {
    if (typeof window !== "undefined") {
      return !sessionStorage.getItem("hasSeenLoader");
    }
    return true;
  });
  const [activeSlug, setActiveSlug] = useState<string>(defaultVibe);
  const initializedRef = useRef(false);

  const activeStation = useMemo(
    () => stations.find((s) => s.slug === activeSlug) || stations[0],
    [activeSlug]
  );

  const player = useYouTubePlayer(activeStation?.playlistId || "", true);

  // Time functionality
  const [time, setTime] = useState<string>("");
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }).toLowerCase()
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // Online users synchronization (100% deterministic globally synced random ticks)
  const [onlineCount, setOnlineCount] = useState<number>(34);
  useEffect(() => {
    const getCountForSecond = (s: number) => {
      const wave1 = Math.sin(s / 1000) * 50;
      const wave2 = Math.sin(s / 100) * 20;
      const wave3 = Math.sin(s / 10) * 5;
      return Math.floor(100 + wave1 + wave2 + wave3);
    };

    const isTick = (s: number) => {
      // 15% probability of updating on any given second (avg 1 update per 6.6 seconds)
      const rand = Math.abs(Math.sin(s * 1.234) * 10000);
      return (rand % 100) < 15;
    };

    const updateCount = () => {
      const currentSecond = Math.floor(Date.now() / 1000);

      // Look back in time to find the most recent "tick" second
      let latestTick = currentSecond;
      while (!isTick(latestTick)) {
        latestTick--;
      }

      const newCount = getCountForSecond(latestTick);
      setOnlineCount(prev => prev !== newCount ? newCount : prev);
    };

    updateCount();
    // Check every second if a new global tick has occurred
    const interval = setInterval(updateCount, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      const slug = searchParams.get("vibe") || searchParams.get("station");
      if (slug && stations.find((s) => s.slug === slug)) {
        setActiveSlug(slug);
      } else {
        const savedVibe = localStorage.getItem("lastVibe");
        if (savedVibe && stations.find((s) => s.slug === savedVibe)) {
          setActiveSlug(savedVibe);
        }
      }
    }
  }, [searchParams]);

  useEffect(() => {
    if (initializedRef.current) {
      localStorage.setItem("lastVibe", activeSlug);
    }
  }, [activeSlug]);

  // Media Session & Keyboard Controls
  useEffect(() => {
    if (!player.isReady) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          player.isPlaying ? player.pause() : player.play();
          break;
        case 'ArrowRight':
          e.preventDefault();
          player.nextVideo();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          player.previousVideo();
          break;
        case 'KeyM':
          e.preventDefault();
          player.isMuted ? player.unmute() : player.mute();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: player.currentTitle || activeStation.title,
        artist: player.currentAuthor || "Vibe India",
        artwork: [
          { src: player.currentThumbnail || activeStation.image, sizes: '512x512', type: 'image/jpeg' }
        ]
      });

      navigator.mediaSession.setActionHandler('play', () => player.play());
      navigator.mediaSession.setActionHandler('pause', () => player.pause());
      navigator.mediaSession.setActionHandler('nexttrack', () => player.nextVideo());
      navigator.mediaSession.setActionHandler('previoustrack', () => player.previousVideo());
    }

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [player, activeStation]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (activeSlug && activeSlug !== params.get("vibe")) {
      params.delete("station");
      params.set("vibe", activeSlug);
      router.replace(`/?${params.toString()}`, { scroll: false });
    }
  }, [activeSlug, router, searchParams]);

  const handleSelectStation = (station: any) => {
    if (station.status === "coming-soon") {
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 1500);
      return;
    }
    setActiveSlug(station.slug);
  };

  const handleShutterComplete = () => {
    setShowShutter(false);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("hasSeenLoader", "true");
    }
  };

  // Sleep Timer
  const [sleepTimerMinutes, setSleepTimerMinutes] = useState<number | null>(null);
  const [isSleepTimerMenuOpen, setIsSleepTimerMenuOpen] = useState(false);

  useEffect(() => {
    if (sleepTimerMinutes === null) return;

    let secondsLeft = sleepTimerMinutes * 60;
    const initialVolume = player.getVolume();

    const interval = setInterval(() => {
      secondsLeft -= 1;

      // Fade out volume in the last 60 seconds
      if (secondsLeft <= 60 && secondsLeft > 0) {
        const volumePercentage = Math.floor((secondsLeft / 60) * initialVolume);
        player.setVolume(volumePercentage);
      }

      if (secondsLeft <= 0) {
        player.pause();
        setSleepTimerMinutes(null);
        setIsSleepTimerMenuOpen(false);
        clearInterval(interval);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      player.setVolume(initialVolume);
    };
  }, [sleepTimerMinutes, player]);

  return (
    <div className="fixed inset-0 overflow-hidden bg-black text-white selection:bg-white/20">
      {/* Background Artwork - True edge-to-edge */}
      <StationBackground image={activeStation.image} title={activeStation.title} />

      {/* Grain Overlay */}
      <div className="grain" />

      {/* Top Header */}
      <LazyMotion features={domAnimation}>
        <m.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="absolute top-0 left-0 right-0 z-50 p-4 sm:p-6 md:px-8 flex justify-between items-center text-[11px] sm:text-xs font-bold tracking-widest drop-shadow-md pointer-events-auto"
        >
          <div className="flex-1 flex justify-start items-center gap-3 sm:gap-4">
            <span className="hidden sm:inline">{time}</span>

            <div className="hidden lg:flex items-center gap-1.5 text-green-400">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
              <m.span
                key={onlineCount}
                initial={{ opacity: 0.5, y: -2 }}
                animate={{ opacity: 1, y: 0 }}
                className="tabular-nums"
              >
                {onlineCount} online
              </m.span>
            </div>

            {/* Sleep Timer */}
            <div className="relative">
              <button
                onClick={() => setIsSleepTimerMenuOpen(!isSleepTimerMenuOpen)}
                className={`group flex items-center gap-1.5 transition-all duration-300 ${sleepTimerMinutes ? 'text-blue-400' : 'text-white/60 hover:text-white'}`}
                title="Sleep Timer"
              >
                <Moon size={14} className="group-hover:scale-110 transition-transform" />
                <span className="text-[10px] tracking-widest uppercase">
                  {sleepTimerMinutes ? `${sleepTimerMinutes}m` : "Timer"}
                </span>
              </button>

              <AnimatePresence>
                {isSleepTimerMenuOpen && (
                  <m.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute top-full left-0 mt-2 w-32 bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl flex flex-col z-50"
                  >
                    {[15, 30, 60].map(mins => (
                      <button
                        key={mins}
                        onClick={() => {
                          setSleepTimerMinutes(mins);
                          setIsSleepTimerMenuOpen(false);
                          setToastVisible(true);
                          setTimeout(() => setToastVisible(false), 2000);
                        }}
                        className={`px-4 py-3 text-left text-xs font-medium hover:bg-white/10 transition-colors ${sleepTimerMinutes === mins ? 'text-blue-400' : 'text-white'}`}
                      >
                        {mins} Minutes
                      </button>
                    ))}
                    {sleepTimerMinutes && (
                      <button
                        onClick={() => {
                          setSleepTimerMinutes(null);
                          setIsSleepTimerMenuOpen(false);
                        }}
                        className="px-4 py-3 text-left text-xs font-medium text-red-400 hover:bg-red-400/20 transition-colors border-t border-white/10"
                      >
                        Turn Off
                      </button>
                    )}
                  </m.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          <div className="shrink-0 flex justify-center items-center px-2">
            <img src="/Logo_Horizontal.webp" alt="Vibe India" className="h-14 sm:h-20 opacity-90 drop-shadow-xl object-contain" />
          </div>
          <div className="flex-1 flex justify-end items-center gap-3 sm:gap-6">
            {/* Mixer Menu */}
            <div className="relative">
              <button
                onClick={() => setIsMixerMenuOpen(!isMixerMenuOpen)}
                className={`group flex items-center gap-1.5 transition-all duration-300 ${(volumes.rain > 0 || volumes.traffic > 0 || volumes.train > 0 || volumes.crowd > 0) ? 'text-green-400' : 'text-white/60 hover:text-white'}`}
                title="Ambient Mixer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>
                <span className="hidden sm:inline text-[10px] uppercase">Mixer</span>
              </button>

              <AnimatePresence>
                {isMixerMenuOpen && (
                  <m.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute top-full right-0 mt-2 w-48 bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl flex flex-col z-50 p-4 gap-4"
                  >
                    {(Object.keys(AMBIENT_SOUNDS) as AmbientSound[]).map((key) => (
                      <div key={key} className="flex flex-col gap-2">
                        <div className="flex justify-between items-center text-xs text-white/80 font-medium">
                          <span className="flex items-center gap-2">
                            <span>{AMBIENT_SOUNDS[key].icon}</span>
                            {AMBIENT_SOUNDS[key].name}
                          </span>
                          <span className="text-white/40">{Math.round(volumes[key])}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={volumes[key]}
                          onChange={(e) => handleVolumeChange(key, parseInt(e.target.value))}
                          className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
                        />
                      </div>
                    ))}
                  </m.div>
                )}
              </AnimatePresence>
            </div>

            {/* Share Menu */}
            <div className="relative">
              <button
                onClick={() => setIsShareMenuOpen(!isShareMenuOpen)}
                className="group flex items-center gap-1.5 text-white/60 hover:text-white transition-all duration-300"
                title="Share"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>
                <span className="hidden sm:inline text-[10px] uppercase">Share</span>
              </button>

              <AnimatePresence>
                {isShareMenuOpen && (
                  <m.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute top-full right-0 mt-2 w-36 bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl flex flex-col z-50"
                  >
                    <button
                      onClick={() => {
                        const url = new URL(window.location.href);
                        url.searchParams.set("vibe", activeSlug);
                        window.open(`https://wa.me/?text=Listening to ${activeStation.title} on Vibe India! ${url.toString()}`, '_blank');
                        setIsShareMenuOpen(false);
                      }}
                      className="px-4 py-3 text-left text-xs font-medium text-white hover:bg-white/10 transition-colors flex items-center gap-2"
                    >
                      WhatsApp
                    </button>
                    <button
                      onClick={() => {
                        const url = new URL(window.location.href);
                        url.searchParams.set("vibe", activeSlug);
                        window.open(`https://twitter.com/intent/tweet?text=Listening to ${activeStation.title} on Vibe India!&url=${url.toString()}`, '_blank');
                        setIsShareMenuOpen(false);
                      }}
                      className="px-4 py-3 text-left text-xs font-medium text-white hover:bg-white/10 transition-colors flex items-center gap-2"
                    >
                      X (Twitter)
                    </button>
                    <button
                      onClick={() => {
                        const url = new URL(window.location.href);
                        url.searchParams.set("vibe", activeSlug);
                        navigator.clipboard.writeText(url.toString());
                        setIsShareMenuOpen(false);
                        setToastVisible(true);
                        setTimeout(() => setToastVisible(false), 2000);
                      }}
                      className="px-4 py-3 text-left text-xs font-medium text-white hover:bg-white/10 transition-colors border-t border-white/10"
                    >
                      Copy Link
                    </button>
                  </m.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              href="/info"
              className="group flex items-center gap-2 text-white/60 hover:text-white transition-all duration-300"
            >
              <div className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center group-hover:border-white transition-colors">
                <span className="text-[10px]">i</span>
              </div>
              <span className="hidden sm:inline text-[10px] uppercase">Info</span>
            </Link>
          </div>
        </m.nav>
      </LazyMotion>

      {/* Share Toast */}
      <AnimatePresence>
        {toastVisible && (
          <m.div
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className="fixed top-20 left-1/2 z-50 bg-black/80 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full shadow-2xl flex items-center gap-2"
          >
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-bold tracking-widest uppercase">Link Copied!</span>
          </m.div>
        )}
      </AnimatePresence>

      {/* Massive Centered Title (Moved significantly up) */}
      <div className="absolute inset-x-0 top-[20%] sm:top-[15%] flex flex-col items-center pointer-events-none z-10">
        <h1 className="hero-title premium text-center px-4 max-w-5xl leading-[0.85]">
          {activeStation.hindiTitle || activeStation.title}
        </h1>
      </div>

      {/* Shutter Loader */}
      <AnimatePresence>
        {showShutter && (
          <ShutterLoader
            onComplete={handleShutterComplete}
          />
        )}
      </AnimatePresence>

      {/* Bottom Interface */}
      {activeStation.status !== "coming-soon" && (
        <div className="absolute left-0 right-0 bottom-8 sm:bottom-10 md:bottom-12 z-30 pointer-events-none flex flex-col items-center pb-safe">

          <div className="w-full max-w-[95vw] sm:max-w-3xl md:max-w-5xl px-1 sm:px-6 md:px-8 pointer-events-auto flex flex-col items-center justify-center gap-3 sm:gap-6">
            <RadioPlayer
              stationTitle={activeStation.title}
              stationImage={activeStation.image}
              playlistUrl={activeStation.playlistUrl || undefined}
              containerRef={player.containerRef}
              state={player}
              onPlay={player.play}
              onPause={player.pause}
              onNext={player.nextVideo}
              onPrevious={player.previousVideo}
              onSeekTo={player.seekTo}
              onMute={player.mute}
              onUnmute={player.unmute}
            />

            <VibeSelector
              activeStation={activeStation}
              onSelectStation={handleSelectStation}
            />
          </div>

        </div>
      )}

      {/* Toast */}
      <Toast message="COMING SOON" visible={toastVisible} />
    </div>
  );
}
