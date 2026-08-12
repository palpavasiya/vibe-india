"use client";

import { LazyMotion, domAnimation, m } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Radio, Disc3, MonitorPlay, Zap } from "lucide-react";

export default function InfoPage() {
  return (
    <div className="min-h-[100svh] min-h-[100dvh] bg-black text-white relative flex flex-col selection:bg-white/20">
      
      {/* Cinematic Background */}
      <div className="fixed inset-0 z-0">
        <m.img 
          src="/master.webp" 
          alt="Background" 
          className="w-full h-full object-cover opacity-30 mix-blend-screen"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, ease: "easeOut" }}
        />
        {/* Deep, rich gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/95 to-black z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)] z-10" />
        {/* Grain */}
        <div className="grain z-10 opacity-70" />
      </div>

      {/* Top Header */}
      <LazyMotion features={domAnimation}>
        <m.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-0 left-0 right-0 z-40 p-6 md:p-8 flex justify-between items-center"
        >
          <Link
            href="/"
            className="group flex items-center gap-2 text-white/60 hover:text-white transition-all duration-300"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-bold tracking-[0.2em] uppercase">Return</span>
          </Link>

          <div className="flex items-center gap-2 text-white/40">
            <Radio size={16} className="animate-pulse text-green-500" />
            <span className="text-xs font-bold tracking-[0.2em] uppercase">Vibe India</span>
          </div>
        </m.nav>
      </LazyMotion>

      {/* Main Content Area */}
      <div className="relative z-20 flex-1 w-full max-w-6xl mx-auto px-6 sm:px-12 md:px-16 flex flex-col justify-center py-24 sm:py-16 md:py-0">
        <LazyMotion features={domAnimation}>
          
          <m.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl mb-12 sm:mb-20"
          >
            <h1 className="hero-title text-4xl sm:text-6xl md:text-7xl lg:text-8xl premium leading-[0.9] tracking-tighter drop-shadow-2xl">
              Immersive <br/> Audio
            </h1>
            <p className="mt-6 text-base sm:text-lg text-white/50 leading-relaxed font-medium max-w-xl">
              Vibe India is a curated collection of cinematic Indian radio experiences. We blend breathtaking visuals with endless audio streams to transport you.
            </p>
          </m.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full">
            
            <m.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
              className="bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 backdrop-blur-md rounded-3xl p-6 sm:p-8 transition-all duration-500 hover:-translate-y-2 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 text-white/60 group-hover:text-white">
                <Disc3 size={24} />
              </div>
              <h2 className="text-lg font-bold tracking-tight mb-2">Curated Stations</h2>
              <p className="text-sm text-white/40 leading-relaxed font-medium">
                From the open highways with Truck Driver to midnight tea at Chai Tapri, every station has a unique mood.
              </p>
            </m.div>

            <m.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
              className="bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 backdrop-blur-md rounded-3xl p-6 sm:p-8 transition-all duration-500 hover:-translate-y-2 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 text-white/60 group-hover:text-white">
                <MonitorPlay size={24} />
              </div>
              <h2 className="text-lg font-bold tracking-tight mb-2">Cinematic Design</h2>
              <p className="text-sm text-white/40 leading-relaxed font-medium">
                Vibrant 4K backgrounds, sleek glass UI, and subtle micro-animations that make the interface feel alive.
              </p>
            </m.div>

            <m.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
              className="bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 backdrop-blur-md rounded-3xl p-6 sm:p-8 transition-all duration-500 hover:-translate-y-2 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 text-white/60 group-hover:text-white">
                <Zap size={24} />
              </div>
              <h2 className="text-lg font-bold tracking-tight mb-2">YouTube Engine</h2>
              <p className="text-sm text-white/40 leading-relaxed font-medium">
                Powered silently by the YouTube IFrame API, ensuring lightning-fast streaming without the heavy video UI.
              </p>
            </m.div>

            <m.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
              className="bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 backdrop-blur-md rounded-3xl p-6 sm:p-8 transition-all duration-500 hover:-translate-y-2 group flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-white/30 block mb-3">Engineered By</span>
                <h2 className="text-2xl font-black tracking-tighter mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/50">
                  TRINEX
                </h2>
                <p className="text-sm text-white/40 leading-relaxed font-medium mb-6">
                  A global software agency building premium digital experiences.
                </p>
              </div>
              <a 
                href="https://trinex.tech" 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center justify-center px-4 py-2.5 rounded-full bg-white/10 hover:bg-white text-white hover:text-black font-bold text-xs uppercase tracking-widest transition-all duration-300"
              >
                Visit Site
              </a>
            </m.div>

          </div>

        </LazyMotion>
      </div>
      
    </div>
  );
}
