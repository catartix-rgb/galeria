"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FOLDERS } from "@/lib/data";

const SPACING = 200; // px between adjacent covers
const ROT = 58; // deg tilt for side covers
const COVER = 300; // px cover size

export default function CoverFlow() {
  const [active, setActive] = useState(Math.floor(FOLDERS.length / 2));

  const clamp = useCallback(
    (i: number) => Math.max(0, Math.min(FOLDERS.length - 1, i)),
    []
  );
  const go = useCallback((dir: number) => setActive((a) => clamp(a + dir)), [clamp]);

  // keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  const current = FOLDERS[active];

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <div
        className="relative flex h-[60%] w-full items-center justify-center"
        style={{ perspective: 1400 }}
      >
        {/* swipe surface */}
        <motion.div
          className="absolute inset-0 z-50"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={(_, info) => {
            if (info.offset.x < -60) go(1);
            else if (info.offset.x > 60) go(-1);
          }}
          style={{ cursor: "grab" }}
        />

        <div
          className="relative"
          style={{ transformStyle: "preserve-3d", width: COVER, height: COVER }}
        >
          {FOLDERS.map((f, i) => {
            const offset = i - active;
            const abs = Math.abs(offset);
            const isCenter = offset === 0;

            const x =
              offset === 0
                ? 0
                : Math.sign(offset) * (SPACING + (abs - 1) * 90);
            const rotateY = isCenter ? 0 : offset > 0 ? -ROT : ROT;
            const z = isCenter ? 120 : -abs * 60;

            return (
              <motion.button
                key={f.id}
                onClick={() => setActive(i)}
                className="absolute left-0 top-0 origin-center outline-none"
                style={{
                  width: COVER,
                  height: COVER,
                  transformStyle: "preserve-3d",
                  zIndex: 100 - abs,
                }}
                animate={{
                  x,
                  rotateY,
                  z,
                  scale: isCenter ? 1 : 0.86,
                  opacity: abs > 3 ? 0 : 1,
                }}
                transition={{ type: "spring", stiffness: 220, damping: 28 }}
              >
                {/* cover */}
                <div
                  className="relative h-full w-full border border-line"
                  style={{ filter: isCenter ? "none" : "brightness(0.5)" }}
                >
                  <img
                    src={f.cover}
                    alt={f.title}
                    draggable={false}
                    className="h-full w-full select-none object-cover"
                    style={{ filter: "grayscale(0.4) contrast(1.1)" }}
                  />
                  <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-black/70 px-2 py-1 font-mono text-[10px] tracking-brutal">
                    <span>{f.title}</span>
                    <span className="text-accent">{f.count}</span>
                  </div>
                </div>

                {/* reflection — the iconic Cover Flow mirror */}
                <div
                  className="absolute left-0 top-full w-full overflow-hidden"
                  style={{
                    height: COVER,
                    transform: "scaleY(-1)",
                    maskImage:
                      "linear-gradient(to bottom, rgba(0,0,0,0.5), transparent 55%)",
                    WebkitMaskImage:
                      "linear-gradient(to bottom, rgba(0,0,0,0.5), transparent 55%)",
                  }}
                >
                  <img
                    src={f.cover}
                    alt=""
                    aria-hidden
                    draggable={false}
                    className="h-full w-full select-none object-cover opacity-40"
                    style={{ filter: "grayscale(0.6) brightness(0.4)" }}
                  />
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* readout */}
      <div className="mt-4 flex flex-col items-center gap-3">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="text-center"
          >
            <h2 className="font-display text-3xl font-black tracking-tight">
              {current.title}
            </h2>
            <p className="mt-1 font-mono text-[11px] tracking-brutal text-muted">
              {current.count} FOTOGRAFÍAS · CARPETA {active + 1}/{FOLDERS.length}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center gap-px">
          <button
            onClick={() => go(-1)}
            className="border border-line px-4 py-2 font-mono text-xs hover:bg-accent hover:text-black"
          >
            ◄ PREV
          </button>
          <button
            onClick={() => go(1)}
            className="border border-line px-4 py-2 font-mono text-xs hover:bg-accent hover:text-black"
          >
            NEXT ►
          </button>
        </div>
        <p className="font-mono text-[10px] tracking-brutal text-muted">
          ← → · CLIC · ARRASTRA
        </p>
      </div>
    </div>
  );
}
