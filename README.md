# CASCAS — Archivo Visual

Portafolio fotográfico interactivo. Estética brutalista / minimalista / underground.
Tres modos de visualización conmutables desde un único menú:

1. **CANVAS** — Lienzo flotante con profundidad. Las fotos se reparten de forma
   asimétrica, hacen parallax con el cursor y se pueden arrastrar (espacio "infinito").
   En *hover* cada foto pasa por un filtro **threshold** (serigrafía cruda 1-bit).
2. **FOLDERS** — Carrusel **Cover Flow** estilo iPod clásico: carpeta central frontal,
   laterales inclinadas en perspectiva 3D, con reflejo. Navega con ← → / clic / swipe.
3. **ZINE** — Fotolibro con pasado de página realista (física de papel) vía `react-pageflip`.

## Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** (tokens brutalistas en `app/globals.css`)
- **Framer Motion** (parallax, Cover Flow, transiciones)
- **react-pageflip** (StPageFlip) para el zine
- Efecto threshold con **filtro SVG** (`components/ThresholdDefs.tsx`)

> No se usó React Three Fiber: el "espacio 3D" se logra con `perspective` + parallax
> por profundidad, más ligero y sin riesgo de SSR. Si en el futuro quieres geometría
> real (texturas, luces), el `FloatingCanvas` es el componente a migrar a R3F.

## Estructura

```
app/
  layout.tsx        # fuentes (Space Mono + Archivo), defs SVG globales
  page.tsx          # orquesta las 3 vistas + header/footer
  globals.css       # tokens, grain, scrollbar, resets
components/
  Nav.tsx           # menú + atajos de teclado 1 / 2 / 3
  FloatingCanvas.tsx# Vista 1 — parallax + drag
  CoverFlow.tsx     # Vista 2 — carrusel 3D iPod
  Photobook.tsx     # Vista 3 — page flip
  ThresholdImage.tsx# imagen base + overlay con threshold (crossfade en hover)
  ThresholdDefs.tsx # filtro SVG reutilizable
lib/
  data.ts           # TODAS las imágenes y textos viven aquí
```

## Desarrollo

```bash
npm install
npm run dev      # http://localhost:3000
```

## Cambiar las fotos

Todo está centralizado en **`lib/data.ts`**:

- `PHOTOS` → canvas flotante (incluye posición `x/y`, `depth` y `rotate` por foto). *Placeholders de Unsplash, cámbialos por tus fotos.*
- `FOLDERS` → carpetas del Cover Flow. *Placeholders de Unsplash.*
- `ZINE` → el fotolibro real. Las páginas están en `/public/zine/`
  (`cover-front.jpg`, `page-01.jpg` … `page-45.jpg`, `cover-back.jpg`),
  exportadas del PDF y recortadas a la caja de corte (sin marcas de imprenta).

### Regenerar el zine desde un PDF nuevo
Las páginas del zine son imágenes en `/public/zine/`. Para reemplazarlas con
otro PDF, exporta cada página a JPG (por ejemplo con `pdftoppm -jpeg -r 140 libro.pdf page`)
y reemplaza los archivos en `/public/zine/` con los mismos nombres. Si tu PDF
trae marcas de corte, recórtalas a la TrimBox. El orden y la lista de páginas
se controlan en el objeto `ZINE.pages` de `lib/data.ts`.

Para el canvas y el Cover Flow, sustituye las URLs de Unsplash por las tuyas
(locales en `/public` o un CDN). Si una URL falla, `ThresholdImage` cae a un
placeholder automáticamente.

## Desplegar en Vercel

1. Sube este repo a GitHub.
2. En [vercel.com](https://vercel.com) → *New Project* → importa el repo.
3. Framework: **Next.js** (autodetectado). Sin variables de entorno. Deploy.

Las fuentes de Google se descargan automáticamente en el build de Vercel.

---

### Atajos

| Tecla | Acción |
|-------|--------|
| `1` `2` `3` | Cambiar de vista |
| `← →` | Navegar Cover Flow |
| arrastrar | Pan en el canvas / pasar página en el zine |
