"use client";

import { forwardRef } from "react";
import dynamic from "next/dynamic";
import { BOOK, type BookPage } from "@/lib/data";

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
const Page = forwardRef<HTMLDivElement, { page: BookPage; index: number }>(
  ({ page, index }, ref) => {
    return (
      <div
        ref={ref}
        className="relative h-full w-full overflow-hidden bg-[#0c0c0c] text-ink"
      >
        <div className="flex h-full w-full flex-col border border-line">
          {page.kind === "cover" && (
            <div className="flex h-full flex-col items-center justify-center gap-3 bg-black">
              <span className="font-display text-5xl font-black tracking-tighter">
                {page.title}
              </span>
              <span className="font-mono text-[10px] tracking-brutal text-accent">
                {page.sub}
              </span>
            </div>
          )}

          {page.kind === "back" && (
            <div className="flex h-full flex-col items-center justify-center gap-2 bg-black">
              <span className="font-display text-2xl font-black tracking-tighter">
                {page.title}
              </span>
              <span className="font-mono text-[9px] tracking-brutal text-muted">
                {page.sub}
              </span>
            </div>
          )}

          {page.kind === "text" && (
            <div className="flex h-full flex-col justify-between p-6">
              <span className="font-mono text-[11px] tracking-brutal text-accent">
                {page.title}
              </span>
              <p className="font-mono text-sm leading-relaxed text-ink">
                {page.body}
              </p>
              <span className="font-mono text-[10px] text-muted">
                — CASCAS
              </span>
            </div>
          )}

          {page.kind === "photo" && (
            <div className="flex h-full flex-col">
              <img
                src={page.src}
                alt={page.caption}
                draggable={false}
                className="min-h-0 w-full flex-1 select-none object-cover"
                style={{ filter: "grayscale(0.5) contrast(1.1)" }}
              />
              <div className="flex items-center justify-between border-t border-line px-3 py-2 font-mono text-[10px] tracking-brutal">
                <span>{page.caption}</span>
                <span className="text-muted">{index}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);
Page.displayName = "Page";

export default function Photobook() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-5">
      <div className="flip-shadow">
        <HTMLFlipBook
          width={400}
          height={533}
          size="stretch"
          minWidth={260}
          maxWidth={520}
          minHeight={360}
          maxHeight={700}
          drawShadow
          maxShadowOpacity={0.6}
          showCover
          mobileScrollSupport
          className="cascas-book"
        >
          {BOOK.map((page, i) => (
            <Page key={i} page={page} index={i} />
          ))}
        </HTMLFlipBook>
      </div>
      <p className="font-mono text-[10px] tracking-brutal text-muted">
        ARRASTRA LAS ESQUINAS PARA PASAR LA PÁGINA
      </p>
    </div>
  );
}
