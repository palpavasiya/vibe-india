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
        className="fixed top-0 left-0 w-screen h-[100vh] z-50 overflow-hidden bg-black flex items-center justify-center pointer-events-auto"
      >
        {/* The master background image that we will zoom "through" to see */}
        <img 
          src="/master.png" 
          alt="Loading Background"
          className="absolute inset-0 w-full h-full object-cover" 
        />
        
        {/* Container for SVG to scale safely on iOS */}
        <m.div
          initial={{ scale: 1 }}
          animate={{ scale: 300 }}
          transition={{ duration: 2.5, ease: [0.76, 0, 0.24, 1], delay: 1.5 }}
          onAnimationComplete={onComplete}
          className="absolute inset-0 origin-center pointer-events-none flex items-center justify-center"
          style={{ willChange: "transform" }}
        >
          <svg className="w-full h-full absolute inset-0">
            <defs>
              <mask id="text-mask">
                <rect width="100%" height="100%" fill="white" />
                <text 
                  x="50%" 
                  y="50%" 
                  textAnchor="middle" 
                  dominantBaseline="central" 
                  className="font-sans font-black"
                  fill="black"
                  fontSize="11vw"
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
          </svg>
        </m.div>
      </m.div>
    </LazyMotion>
  );
}
