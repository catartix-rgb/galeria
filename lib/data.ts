// =============================================================
//  CASCAS · data layer
//  Swap these Unsplash URLs for your own files later.
//  Everything (positions, depth) is deterministic so the
//  server and client render identically (no hydration drift).
// =============================================================

export type Photo = {
  id: string;
  src: string;
  caption: string;
  // canvas placement (deterministic, asymmetric)
  x: number; // % from center, can be negative
  y: number; // % from center, can be negative
  depth: number; // 0.2 (far) .. 1 (near) -> parallax + scale
  rotate: number; // base tilt in deg
};

const u = (id: string, w = 900) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

// Stable, long-lived Unsplash photo IDs used purely as placeholders.
const RAW = [
  "1506744038136-46273834b3fb",
  "1469474968028-56623f02e42e",
  "1470071459604-3b5ec3a7fe05",
  "1447752875215-b2761acb3c5d",
  "1518837695005-2083093ee35b",
  "1441974231531-c6227db76b6e",
  "1426604966848-d7adac402bff",
  "1472214103451-9374bd1c798e",
  "1500530855697-b586d89ba3ee",
  "1490750967868-88aa4486c946",
  "1501785888041-af3ef285b470",
  "1444703686981-a3abbc4d4fe3",
];

// Hand-placed scatter so the canvas feels composed, not random.
const PLACEMENT: Array<Pick<Photo, "x" | "y" | "depth" | "rotate">> = [
  { x: -34, y: -22, depth: 1.0, rotate: -4 },
  { x: 18, y: -30, depth: 0.65, rotate: 3 },
  { x: 40, y: 6, depth: 0.9, rotate: -2 },
  { x: -8, y: 14, depth: 0.5, rotate: 5 },
  { x: -42, y: 24, depth: 0.78, rotate: 2 },
  { x: 30, y: 32, depth: 0.42, rotate: -6 },
  { x: 6, y: -6, depth: 0.34, rotate: 1 },
  { x: -22, y: -40, depth: 0.55, rotate: -3 },
  { x: 48, y: -16, depth: 0.3, rotate: 4 },
  { x: -50, y: -4, depth: 0.46, rotate: -5 },
  { x: 22, y: 18, depth: 0.7, rotate: 2 },
  { x: -16, y: 38, depth: 0.38, rotate: -2 },
];

export const PHOTOS: Photo[] = RAW.map((id, i) => ({
  id: `ph-${i}`,
  src: u(id),
  caption: `CSC_${String(i + 1).padStart(3, "0")}`,
  ...PLACEMENT[i % PLACEMENT.length],
}));

// -------------------------------------------------------------
//  Cover Flow folders / categories
// -------------------------------------------------------------
export type Folder = {
  id: string;
  title: string;
  count: number;
  cover: string;
};

export const FOLDERS: Folder[] = [
  { id: "f1", title: "ASFALTO", count: 24, cover: u(RAW[0]) },
  { id: "f2", title: "RUIDO", count: 18, cover: u(RAW[1]) },
  { id: "f3", title: "NEÓN MUERTO", count: 31, cover: u(RAW[4]) },
  { id: "f4", title: "SUBSUELO", count: 12, cover: u(RAW[7]) },
  { id: "f5", title: "ANALÓGICO", count: 27, cover: u(RAW[9]) },
  { id: "f6", title: "RESIDUO", count: 9, cover: u(RAW[2]) },
  { id: "f7", title: "ESTÁTICA", count: 21, cover: u(RAW[10]) },
];

// -------------------------------------------------------------
//  Photobook / Zine — real pages exported from the PDF.
//  Front cover, 45 interior pages, back cover. All trimmed to
//  the print TrimBox (no crop/registration marks). Files live
//  in /public/zine/. Aspect ratio of an interior page = 5:7.
// -------------------------------------------------------------
export const ZINE = {
  // page aspect ratio (width / height) used to size the book
  ratio: 827 / 1157,
  title: "LO QUE SE OLVIDA",
  sub: "EDICIÓN 2025 · ISSUE 01 — JUAN PABLO CASTRO",
  pages: [
    "/zine/cover-front.jpg",
    ...Array.from(
      { length: 45 },
      (_, i) => `/zine/page-${String(i + 1).padStart(2, "0")}.jpg`
    ),
    "/zine/cover-back.jpg",
  ] as string[],
};
