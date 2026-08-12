"use client";

import { useEffect, useState } from "react";
import { m, domAnimation, LazyMotion } from "framer-motion";

interface ShutterLoaderProps {
  onComplete: () => void;
}

export default function ShutterLoader({ onComplete }: ShutterLoaderProps) {
  useEffect(() => {
    // Safety fallback: if framer-motion fails to trigger onAnimationComplete
    const timer = setTimeout(() => {
      onComplete();
    }, 4500); // 1.5s delay + 2.5s duration = 4s total (adding 0.5s buffer)
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <LazyMotion features={domAnimation}>
      <m.div 
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="fixed inset-0 z-50 overflow-hidden bg-black flex items-center justify-center pointer-events-auto"
      >
        {/* The master background image that we will zoom "through" to see */}
        <img 
          src="/master.png" 
          alt="Loading Background"
          className="absolute inset-0 w-full h-full object-cover" 
        />
        
        {/* The SVG Mask that scales up infinitely */}
        <m.svg
            initial={{ scale: 1 }}
            animate={{ scale: 300 }}
            transition={{ duration: 2.5, ease: [0.76, 0, 0.24, 1], delay: 1.5 }}
            onAnimationComplete={onComplete}
            className="absolute w-full h-full origin-center"
            style={{ transformOrigin: "center center", willChange: "transform" }}
          >
            <defs>
              <mask id="text-mask">
                <rect width="100%" height="100%" fill="white" />
                <text 
                  x="50%" 
                  y="50%" 
                  textAnchor="middle" 
                  dominantBaseline="middle" 
                  fontSize="12vw" 
                  fontWeight="900" 
                  fill="black"
                  className="font-sans"
                  style={{ letterSpacing: "-0.05em" }}
                >
                  VIBE INDIA
                </text>
              </mask>
            </defs>
            <rect 
              width="100%" 
              height="100%" 
              fill="black" 
              mask="url(#text-mask)" 
            />
          </m.svg>
      </m.div>
    </LazyMotion>
  );
}
