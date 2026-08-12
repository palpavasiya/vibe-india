export {};

declare global {
  interface Window {
    YT: {
      Player: new (
        element_id: string | HTMLDivElement,
        config: {
          height: string | number;
          width: string | number;
          videoId?: string;
          playerVars?: {
            listType?: string;
            list?: string;
            autoplay?: number;
            controls?: number;
            rel?: number;
            modestbranding?: number;
            iv_load_policy?: number;
            disablekb?: number;
            fs?: number;
            playsinline?: number;
          };
          events?: {
            onReady?: (event: { target: YT.Player }) => void;
            onStateChange?: (event: { data: number; target: YT.Player }) => void;
            onError?: (event: { data: number; target: YT.Player }) => void;
          };
        }
      ) => YT.Player;
      PlayerState: {
        UNSTARTED: number;
        ENDED: number;
        PLAYING: number;
        PAUSED: number;
        BUFFERING: number;
        CUED: number;
      };
    };
    onYouTubeIframeAPIReady: () => void;
  }

  namespace YT {
    export interface Player {
      playVideo: () => void;
      pauseVideo: () => void;
      nextVideo: () => void;
      previousVideo: () => void;
      getVideoData: () => { title: string; video_id: string };
      getCurrentTime: () => number;
      getDuration: () => number;
      destroy: () => void;
    }

    export interface OnStateChangeEvent {
      data: number;
      target: Player;
    }
  }
}
