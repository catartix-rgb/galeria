"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { PHOTOS, type Photo } from "@/lib/data";
import ThresholdImage from "./ThresholdImage";

// One floating photo. Reads the shared pointer motion values and offsets
// itself by its own depth -> nearer photos travel further (parallax).
function FloatingPhoto({
  photo,
  px,
  py,
}: {
  photo: Photo;
  px: MotionValue<number>;
  py: MotionValue<number>;
}) {
  const range = 60 * photo.depth; // px of parallax travel
  const tx = useTransform(px, [-1, 1], [range, -range]);
  const ty = useTransform(py, [-1, 1], [range, -range]);

  const size = 150 + photo.depth * 230; // depth -> visual hierarchy

  return (
    <motion.figure
      className="absolute"
      style={{
        left: `calc(50% + ${photo.x}vw)`,
        top: `calc(50% + ${photo.y}vh)`,
        x: tx,
        y: ty,
        zIndex: Math.round(photo.depth * 100),
        width: size,
      }}
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: photo.depth * 0.25 }}
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{
          duration: 6 + photo.depth * 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          rotate: photo.rotate,
          filter: `brightness(${0.55 + photo.depth * 0.45})`,
        }}
        whileHover={{ scale: 1.06, rotate: 0, filter: "brightness(1)" }}
      >
        <div className="border border-line/70">
          <ThresholdImage
            src={photo.src}
            alt={photo.caption}
            className="aspect-[4/5]"
          />
        </div>
        <figcaption className="mt-1 font-mono text-[10px] tracking-brutal text-muted">
          {photo.caption}
        </figcaption>
      </motion.div>
    </motion.figure>
  );
}

export default function FloatingCanvas() {
  const wrap = useRef<HTMLDivElement>(null);

  // raw pointer -1..1, smoothed by a spring
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const px = useSpring(rawX, { stiffness: 60, damping: 18, mass: 0.6 });
  const py = useSpring(rawY, { stiffness: 60, damping: 18, mass: 0.6 });

  const onMove = (e: React.PointerEvent) => {
    const r = wrap.current?.getBoundingClientRect();
    if (!r) return;
    rawX.set(((e.clientX - r.left) / r.width) * 2 - 1);
    rawY.set(((e.clientY - r.top) / r.height) * 2 - 1);
  };

  return (
    <div
      ref={wrap}
      onPointerMove={onMove}
      className="relative h-full w-full cursor-grab overflow-hidden active:cursor-grabbing"
      style={{ perspective: 1200 }}
    >
      {/* drag plane — larger than the viewport for an "infinite" pan */}
      <motion.div
        className="absolute left-0 top-0 h-full w-full"
        drag
        dragElastic={0.12}
        dragTransition={{ power: 0.2, timeConstant: 200 }}
        dragConstraints={{ left: -400, right: 400, top: -300, bottom: 300 }}
      >
        {PHOTOS.map((p) => (
          <FloatingPhoto key={p.id} photo={p} px={px} py={py} />
        ))}
      </motion.div>

      {/* hint */}
      <div className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-brutal text-muted">
        ARRASTRA PARA NAVEGAR · HOVER = THRESHOLD
      </div>
    </div>
  );
}
