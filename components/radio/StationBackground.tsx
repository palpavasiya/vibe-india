"use client";

import { LazyMotion, domAnimation, m, AnimatePresence } from "framer-motion";

interface StationBackgroundProps {
  image: string;
  title: string;
}

export default function StationBackground({
  image,
  title,
}: StationBackgroundProps) {

  return (
    <LazyMotion features={domAnimation}>
      <div className="fixed inset-0 z-0 bg-black">
        <AnimatePresence mode="popLayout">
          <m.img
            key={image}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            src={image}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
            loading="eager"
            decoding="sync"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-black/20 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />
      </div>
    </LazyMotion>
  );
}
