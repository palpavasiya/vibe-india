"use client";

import { useState, useEffect, useRef } from "react";

export type AmbientSound = "rain" | "traffic" | "train" | "crowd";

export const AMBIENT_SOUNDS: Record<AmbientSound, { name: string; icon: string; src: string }> = {
  rain: { name: "Rain", icon: "🌧️", src: "/sounds/rain.mp3" },
  traffic: { name: "Highway", icon: "🚗", src: "/sounds/traffic.mp3" },
  train: { name: "Train", icon: "🚂", src: "/sounds/train.mp3" },
  crowd: { name: "Cafe", icon: "🗣️", src: "/sounds/crowd.mp3" },
};

export function useAmbientMixer() {
  const [volumes, setVolumes] = useState<Record<AmbientSound, number>>({
    rain: 0,
    traffic: 0,
    train: 0,
    crowd: 0,
  });

  const audioRefs = useRef<Record<AmbientSound, HTMLAudioElement | null>>({
    rain: null,
    traffic: null,
    train: null,
    crowd: null,
  });

  useEffect(() => {
    // Initialize audio objects
    (Object.keys(AMBIENT_SOUNDS) as AmbientSound[]).forEach((key) => {
      if (!audioRefs.current[key]) {
        const audio = new Audio(AMBIENT_SOUNDS[key].src);
        audio.loop = true;
        audio.volume = 0;
        audioRefs.current[key] = audio;
      }
    });

    // Load persisted volumes
    try {
      const savedVolumes = localStorage.getItem("vibe-india-ambient-volumes");
      if (savedVolumes) {
        const parsed = JSON.parse(savedVolumes);
        setVolumes(parsed);
        // We do not auto-play here due to browser restrictions on autoplay. 
        // It will start playing when the user interacts or we can try to play muted.
      }
    } catch {
      // ignore
    }

    return () => {
      // Cleanup
      (Object.keys(audioRefs.current) as AmbientSound[]).forEach((key) => {
        const audio = audioRefs.current[key];
        if (audio) {
          audio.pause();
          audio.src = "";
          audioRefs.current[key] = null;
        }
      });
    };
  }, []);

  const handleVolumeChange = (sound: AmbientSound, value: number) => {
    const audio = audioRefs.current[sound];
    if (!audio) return;

    audio.volume = value / 100;

    // If setting volume > 0 and it's paused, play it
    if (value > 0 && audio.paused) {
      audio.play().catch(() => {
        // Handle autoplay block
        console.warn(`Could not play ${sound} ambient sound. Requires user interaction.`);
      });
    } else if (value === 0 && !audio.paused) {
      audio.pause();
    }

    const newVolumes = { ...volumes, [sound]: value };
    setVolumes(newVolumes);

    try {
      localStorage.setItem("vibe-india-ambient-volumes", JSON.stringify(newVolumes));
    } catch {
      // ignore
    }
  };

  return { volumes, handleVolumeChange };
}
