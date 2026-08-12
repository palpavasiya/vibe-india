"use client";

import { LazyMotion, domAnimation, m } from "framer-motion";
import { Check } from "lucide-react";

interface ToastProps {
  message: string;
  visible: boolean;
}

export default function Toast({ message, visible }: ToastProps) {
  if (!visible) return null;

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        initial={{ opacity: 0, y: 12, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.95 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50"
      >
        <div className="glass-panel rounded-full px-5 py-2.5 flex items-center gap-2">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-xs font-medium tracking-wide text-white/90">
            {message}
          </span>
        </div>
      </m.div>
    </LazyMotion>
  );
}
