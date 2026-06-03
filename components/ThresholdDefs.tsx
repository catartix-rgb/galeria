// Hidden SVG that defines reusable filters. Mounted once in layout.
// The "threshold" filter crushes the image to a near 1-bit, high-contrast
// silkscreen stamp. Referenced from CSS via filter: url(#cascas-threshold).
export default function ThresholdDefs() {
  return (
    <svg
      aria-hidden
      width="0"
      height="0"
      style={{ position: "absolute", pointerEvents: "none" }}
    >
      <defs>
        <filter id="cascas-threshold" colorInterpolationFilters="sRGB">
          {/* 1. desaturate */}
          <feColorMatrix type="saturate" values="0" />
          {/* 2. push contrast hard before crushing */}
          <feComponentTransfer>
            <feFuncR type="linear" slope="2.4" intercept="-0.7" />
            <feFuncG type="linear" slope="2.4" intercept="-0.7" />
            <feFuncB type="linear" slope="2.4" intercept="-0.7" />
          </feComponentTransfer>
          {/* 3. quantize to a stamped, screen-printed range */}
          <feComponentTransfer>
            <feFuncR type="discrete" tableValues="0 0 1 1" />
            <feFuncG type="discrete" tableValues="0 0 1 1" />
            <feFuncB type="discrete" tableValues="0 0 1 1" />
          </feComponentTransfer>
        </filter>
      </defs>
    </svg>
  );
}
