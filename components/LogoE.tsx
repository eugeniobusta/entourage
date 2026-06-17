interface LogoEProps {
  size?: number;
  className?: string;
  /* white on transparent (default) or black on white */
  inverted?: boolean;
}

/*
  Faithful recreation of the ENTOURAGE E mark:
  - Bold italic serif E with high contrast strokes
  - 4-pointed star (sparkle) embedded in the E's interior
  SVG paths hand-traced from the brand reference image.
*/
export function LogoE({ size = 40, className = "", inverted = false }: LogoEProps) {
  const fg = inverted ? "#000000" : "#ffffff";
  const bg = inverted ? "#ffffff" : "transparent";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ background: bg, borderRadius: "50%" }}
    >
      {/*
        Bold italic serif E
        Left vertical stroke: thick, italic (skewed ~12°)
        Three horizontal bars top / middle / bottom
        Thin terminals on horizontal bars (contrast)
      */}

      {/* ── Left vertical stroke (thick, slightly italic lean) ── */}
      <path
        d="M 42 28 L 55 28 L 38 192 L 25 192 Z"
        fill={fg}
      />

      {/* ── Top horizontal bar ── */}
      <path
        d="M 50 28 L 148 28 L 145 47 L 138 55 L 60 55 Z"
        fill={fg}
      />

      {/* ── Middle horizontal bar (slightly shorter) ── */}
      <path
        d="M 40 100 L 128 100 L 125 117 L 119 124 L 46 124 Z"
        fill={fg}
      />

      {/* ── Bottom horizontal bar ── */}
      <path
        d="M 30 173 L 152 173 L 150 192 L 143 200 L 33 200 Z"
        fill={fg}
      />

      {/*
        4-pointed sparkle star — sits in the E's counter space
        (the upper interior space between top bar and middle bar)
        Thin elongated diamond points crossing at center
      */}
      <g transform="translate(105, 82)">
        {/* Vertical arm */}
        <path
          d="M 0 -28 C 3 -8, 3 -8, 0 0 C -3 -8, -3 -8, 0 -28 Z"
          fill={fg}
        />
        <path
          d="M 0 28 C 3 8, 3 8, 0 0 C -3 8, -3 8, 0 28 Z"
          fill={fg}
        />
        {/* Horizontal arm */}
        <path
          d="M -28 0 C -8 3, -8 3, 0 0 C -8 -3, -8 -3, -28 0 Z"
          fill={fg}
        />
        <path
          d="M 28 0 C 8 3, 8 3, 0 0 C 8 -3, 8 -3, 28 0 Z"
          fill={fg}
        />
      </g>
    </svg>
  );
}
