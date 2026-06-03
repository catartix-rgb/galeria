"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Nav, { type ViewMode } from "@/components/Nav";
import FloatingCanvas from "@/components/FloatingCanvas";
import CoverFlow from "@/components/CoverFlow";
import Photobook from "@/components/Photobook";

export default function Home() {
  const [view, setView] = useState<ViewMode>("canvas");

  return (
    <main className="grain relative flex h-[100dvh] w-screen flex-col overflow-hidden">
      {/* header */}
      <header className="z-40 flex items-center justify-between border-b border-line px-5 py-3">
        <div className="flex items-baseline gap-3">
          <span className="font-display text-xl font-black tracking-tighter">
            CASCAS
          </span>
          <span className="hidden font-mono text-[10px] tracking-brutal text-muted sm:inline">
            ARCHIVO VISUAL · MODO {view.toUpperCase()}
          </span>
        </div>
        <Nav view={view} onChange={setView} />
      </header>

      {/* stage */}
      <section className="relative flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="absolute inset-0"
          >
            {view === "canvas" && <FloatingCanvas />}
            {view === "coverflow" && <CoverFlow />}
            {view === "book" && <Photobook />}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* footer ticker */}
      <footer className="z-40 flex items-center justify-between border-t border-line px-5 py-2 font-mono text-[10px] tracking-brutal text-muted">
        <span>EST. 2025</span>
        <span className="hidden sm:inline">NO RETOUCH · NO MERCY</span>
        <span>[ 1·2·3 ]</span>
      </footer>
    </main>
  );
}
