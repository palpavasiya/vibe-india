export type YouTubePlayerState = {
  isReady: boolean;
  isPlaying: boolean;
  currentVideoId: string | null;
  currentTitle: string;
  currentAuthor: string;
  currentThumbnail: string;
  hasPlaylist: boolean;
  currentTime: number;
  duration: number;
  isMuted: boolean;
};

export type YouTubePlayerAPI = {
  loadPlaylist: (playlistId: string) => void;
  play: () => void;
  pause: () => void;
  nextVideo: () => void;
  previousVideo: () => void;
  seekTo: (seconds: number) => void;
  mute: () => void;
  unmute: () => void;
  getState: () => YouTubePlayerState;
  destroy: () => void;
};

export type YouTubePlayerRef = {
  play: () => void;
  pause: () => void;
  nextVideo: () => void;
  previousVideo: () => void;
  mute: () => void;
  unmute: () => void;
  getState: () => YouTubePlayerState;
};

let ytReadyPromise: Promise<void> | null = null;

function loadYouTubeAPI(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.YT && window.YT.Player) return Promise.resolve();

  if (!ytReadyPromise) {
    ytReadyPromise = new Promise((resolve) => {
      const existing = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (existing) existing();
        resolve();
      };

      if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
        const script = document.createElement("script");
        script.src = "https://www.youtube.com/iframe_api";
        script.async = true;
        document.head.appendChild(script);
      }
    });
  }

  return ytReadyPromise;
}

export { loadYouTubeAPI };
