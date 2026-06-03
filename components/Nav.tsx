"use client";

import { useEffect } from "react";

export type ViewMode = "canvas" | "coverflow" | "book";

const ITEMS: { id: ViewMode; label: string; key: string }[] = [
  { id: "canvas", label: "CANVAS", key: "1" },
  { id: "coverflow", label: "FOLDERS", key: "2" },
  { id: "book", label: "ZINE", key: "3" },
];

export default function Nav({
  view,
  onChange,
}: {
  view: ViewMode;
  onChange: (v: ViewMode) => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const hit = ITEMS.find((i) => i.key === e.key);
      if (hit) onChange(hit.id);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onChange]);

  return (
    <nav className="flex items-center gap-px border border-line">
      {ITEMS.map((it) => {
        const on = view === it.id;
        return (
          <button
            key={it.id}
            onClick={() => onChange(it.id)}
            className={`px-4 py-2 font-mono text-xs tracking-brutal transition-colors ${
              on
                ? "bg-accent text-black"
                : "bg-transparent text-ink hover:bg-line"
            }`}
          >
            <span className="mr-2 opacity-50">{it.key}</span>
            {it.label}
          </button>
        );
      })}
    </nav>
  );
}
