"use client";

import { useState } from "react";

type Props = {
  src: string;
  alt?: string;
  /** force the threshold on regardless of hover */
  active?: boolean;
  className?: string;
  /** disable the hover behaviour (used inside coverflow / book) */
  hover?: boolean;
};

/**
 * Renders the photo twice: a clean(ish) desaturated base and an overlay
 * crushed through the #cascas-threshold SVG filter. We can't smoothly
 * tween an SVG filter, so instead we crossfade the overlay's opacity —
 * giving a smooth dissolve into the harsh silkscreen stamp.
 */
export default function ThresholdImage({
  src,
  alt = "",
  active = false,
  className = "",
  hover = true,
}: Props) {
  const [hovered, setHovered] = useState(false);
  const on = active || (hover && hovered);

  // Graceful fallback if an Unsplash placeholder ever 404s.
  const onError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (!img.dataset.fallback) {
      img.dataset.fallback = "1";
      const seed = encodeURIComponent(alt || src.slice(-12));
      img.src = `https://picsum.photos/seed/${seed}/900/1100`;
    }
  };

  return (
    <div
      className={`relative overflow-hidden bg-[#111] ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* base */}
      <img
        src={src}
        alt={alt}
        draggable={false}
        onError={onError}
        className="block h-full w-full select-none object-cover transition-[filter,opacity] duration-300"
        style={{
          filter: "grayscale(0.35) contrast(1.05)",
          opacity: on ? 0 : 1,
        }}
      />
      {/* thresholded overlay */}
      <img
        src={src}
        alt=""
        aria-hidden
        draggable={false}
        onError={onError}
        className="pointer-events-none absolute inset-0 block h-full w-full select-none object-cover transition-opacity duration-300"
        style={{
          filter: "url(#cascas-threshold)",
          opacity: on ? 1 : 0,
        }}
      />
    </div>
  );
}
