"use client";

import { forwardRef, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { ZINE } from "@/lib/data";

// StPageFlip touches `window`, so it must never render on the server.
const HTMLFlipBook: any = dynamic(() => import("react-pageflip"), {
  ssr: false,
  loading: () => (
    <div className="font-mono text-xs tracking-brutal text-muted">
      CARGANDO ZINE…
    </div>
  ),
});

// react-pageflip requires each page to forward a ref to a real DOM node.
const Page = forwardRef<HTMLDivElement, { src: string; i: number }>(
  ({ src, i }, ref) => (
    <div ref={ref} className="h-full w-full bg-white">
      {/* white page bg blends with the scanned page margins (no bars) */}
      <img
        src={src}
        alt={`Página ${i}`}
        draggable={false}
        className="h-full w-full select-none object-contain"
      />
    </div>
  )
);
Page.displayName = "Page";

export default function Photobook() {
  const stage = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState<{ w: number; h: number; portrait: boolean }>({
    w: 420,
    h: 588,
    portrait: false,
  });

  useEffect(() => {
    const compute = () => {
      const el = stage.current;
      if (!el) return;
      const W = el.clientWidth;
      const H = el.clientHeight;
      const r = ZINE.ratio; // pageW / pageH
      const portrait = W < 760; // one page on narrow screens
      const cols = portrait ? 1 : 2;
      const padW = 0.96;
      const padH = 0.98;
      // largest page height that fits both width and height limits
      let pageH = Math.min(H * padH, ((W * padW) / cols) / r);
      let pageW = pageH * r;
      // sane floor
      pageH = Math.max(pageH, 280);
      pageW = Math.max(pageW, 280 * r);
      setBox({ w: Math.round(pageW), h: Math.round(pageH), portrait });
    };
    compute();
    const ro = new ResizeObserver(compute);
    if (stage.current) ro.observe(stage.current);
    window.addEventListener("resize", compute);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", compute);
    };
  }, []);

  return (
    <div className="flex h-full w-full flex-col">
      <div
        ref={stage}
        className="flex min-h-0 flex-1 items-center justify-center px-3"
      >
        <div className="flip-shadow">
          <HTMLFlipBook
            // key forces a clean rebuild when the computed size changes
            key={`${box.w}x${box.h}-${box.portrait}`}
            width={box.w}
            height={box.h}
            size="fixed"
            usePortrait={box.portrait}
            showCover
            drawShadow
            maxShadowOpacity={0.5}
            mobileScrollSupport
            flippingTime={700}
            className="cascas-zine"
          >
            {ZINE.pages.map((src, i) => (
              <Page key={i} src={src} i={i} />
            ))}
          </HTMLFlipBook>
        </div>
      </div>

      <div className="flex shrink-0 items-center justify-center gap-4 py-2">
        <span className="font-display text-sm font-black tracking-tight">
          {ZINE.title}
        </span>
        <span className="hidden font-mono text-[10px] tracking-brutal text-muted sm:inline">
          {ZINE.sub}
        </span>
        <span className="font-mono text-[10px] tracking-brutal text-accent">
          ARRASTRA LAS ESQUINAS →
        </span>
      </div>
    </div>
  );
}
