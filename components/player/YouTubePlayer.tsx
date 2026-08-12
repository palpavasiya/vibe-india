"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import { loadYouTubeAPI, YouTubePlayerState } from "@/lib/youtube";

export interface YouTubePlayerControls {
  play: () => void;
  pause: () => void;
  nextVideo: () => void;
  previousVideo: () => void;
  seekTo: (seconds: number) => void;
  mute: () => void;
  unmute: () => void;
  setVolume: (volume: number) => void;
  getVolume: () => number;
  containerRef: React.RefObject<HTMLDivElement>;
}

export function useYouTubePlayer(
  playlistId: string,
  autoplay: boolean = true
): YouTubePlayerState & YouTubePlayerControls {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YT.Player | null>(null);
  const [state, setState] = useState<YouTubePlayerState>({
    isReady: false,
    isPlaying: false,
    currentVideoId: null,
    currentTitle: "Now Playing",
    currentAuthor: "",
    currentThumbnail: "",
    hasPlaylist: false,
    currentTime: 0,
    duration: 0,
    isMuted: false,
  });
  const [apiLoaded, setApiLoaded] = useState(false);

  const updateState = useCallback(() => {
    if (!playerRef.current || !playerRef.current.getVideoData) return;
    const data = playerRef.current.getVideoData();
    const title = data.title || "Now Playing";
    const videoId = data.video_id || "";
    setState((prev) => ({
      ...prev,
      currentTitle: title,
      currentVideoId: videoId || null,
      currentThumbnail: videoId ? `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg` : "",
      currentTime: (playerRef.current as any)?.getCurrentTime?.() || 0,
      duration: (playerRef.current as any)?.getDuration?.() || 0,
      isMuted: (playerRef.current as any)?.isMuted?.() || false,
    }));
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      await loadYouTubeAPI();
      if (cancelled) return;
      setApiLoaded(true);
    }

    init();

    return () => {
      cancelled = true;
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch {
          // ignore
        }
        playerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!apiLoaded || !containerRef.current) return;
    if (!playlistId) {
      console.debug('[YouTubePlayer] no playlistId provided; skipping player init');
      setState((prev) => ({ ...prev, hasPlaylist: false, isReady: false }));
      return;
    }

    if (playerRef.current) {
      try {
        playerRef.current.destroy();
      } catch {
        // ignore
      }
      playerRef.current = null;
    }

    console.debug('[YouTubePlayer] initializing player for playlist:', playlistId);
    const player = new (window.YT as any).Player(containerRef.current, {
      height: "100%",
      width: "100%",
      videoId: "",
      playerVars: {
        listType: "playlist",
        list: playlistId,
        autoplay: autoplay ? 1 : 0,
        controls: 0,
        rel: 0,
        modestbranding: 1,
        iv_load_policy: 3,
        disablekb: 1,
        fs: 0,
        playsinline: 1,
      },
      events: {
        onReady: () => {
          console.debug('[YouTubePlayer] onReady');
          setState((prev) => ({ ...prev, isReady: true, hasPlaylist: true }));
          updateState();
          
          // Restore volume from persistent memory
          try {
            const savedVol = localStorage.getItem("yt-player-volume");
            if (savedVol) {
              player.setVolume(parseInt(savedVol, 10));
            }
          } catch {
            // ignore
          }

          if (autoplay) {
            try {
              player.playVideo();
            } catch {
              // Autoplay blocked by browser
            }
          }
        },
        onStateChange: (event: YT.OnStateChangeEvent) => {
          const playing = event.data === window.YT.PlayerState.PLAYING;
          console.debug('[YouTubePlayer] state change', event.data, 'playing=', playing);
          setState((prev) => ({ ...prev, isPlaying: playing }));
          updateState();
        },
        onError: () => {
          console.warn('[YouTubePlayer] player error');
          setState((prev) => ({ ...prev, isPlaying: false }));
        },
      },
    });

    playerRef.current = player;

    return () => {
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch {
          // ignore
        }
        playerRef.current = null;
      }
    };
  }, [apiLoaded, playlistId, autoplay, updateState]);

  useEffect(() => {
    if (!state.isReady || !state.hasPlaylist) return;
    const interval = setInterval(updateState, 1000);
    return () => clearInterval(interval);
  }, [state.isReady, state.hasPlaylist, updateState]);

  const play = useCallback(() => {
    if (!playerRef.current) return;
    try {
      playerRef.current.playVideo();
    } catch {
      // ignore
    }
  }, []);

  const pause = useCallback(() => {
    if (!playerRef.current) return;
    try {
      playerRef.current.pauseVideo();
    } catch {
      // ignore
    }
  }, []);

  const nextVideo = useCallback(() => {
    if (!playerRef.current) return;
    try {
      playerRef.current.nextVideo();
    } catch {
      // ignore
    }
  }, []);

  const previousVideo = useCallback(() => {
    if (!playerRef.current) return;
    try {
      playerRef.current.previousVideo();
    } catch {
      // ignore
    }
  }, []);

  const seekTo = useCallback((seconds: number) => {
    if (!playerRef.current) return;
    try {
      (playerRef.current as any).seekTo(seconds, true);
    } catch {
      // ignore
    }
  }, []);

  const mute = useCallback(() => {
    if (!playerRef.current) return;
    try {
      (playerRef.current as any).mute();
    } catch {
      // ignore
    }
  }, []);

  const unmute = useCallback(() => {
    if (!playerRef.current) return;
    try {
      (playerRef.current as any).unMute();
    } catch {
      // ignore
    }
  }, []);

  const setVolume = useCallback((volume: number) => {
    if (!playerRef.current) return;
    try {
      const vol = Math.max(0, Math.min(100, volume));
      (playerRef.current as any).setVolume(vol);
      localStorage.setItem("yt-player-volume", vol.toString());
    } catch {
      // ignore
    }
  }, []);

  const getVolume = useCallback((): number => {
    if (!playerRef.current) return 100;
    try {
      return (playerRef.current as any).getVolume() || 100;
    } catch {
      return 100;
    }
  }, []);

  return {
    ...state,
    containerRef,
    play,
    pause,
    nextVideo,
    previousVideo,
    seekTo,
    mute,
    unmute,
    setVolume,
    getVolume,
  };
}
