interface LogoEProps {
  size?: number;
  className?: string;
}

export function LogoE({ size = 36, className = "" }: LogoEProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer circle */}
      <circle cx="50" cy="50" r="48" stroke="white" strokeWidth="2.5" />

      {/* Bold italic E — drawn as path so no font dependency */}
      {/* Left vertical stroke */}
      <rect x="22" y="20" width="9" height="60" fill="white" />
      {/* Top horizontal */}
      <rect x="22" y="20" width="38" height="9" fill="white" />
      {/* Middle horizontal */}
      <rect x="22" y="45" width="30" height="8" fill="white" />
      {/* Bottom horizontal */}
      <rect x="22" y="71" width="38" height="9" fill="white" />

      {/* 4-pointed sparkle star — top right area of the E */}
      {/* Positioned at approx (58, 24) */}
      <g transform="translate(62, 22)">
        {/* vertical arm */}
        <ellipse cx="0" cy="0" rx="2" ry="9" fill="white" />
        {/* horizontal arm */}
        <ellipse cx="0" cy="0" rx="9" ry="2" fill="white" />
        {/* diagonal arms */}
        <ellipse cx="0" cy="0" rx="1.3" ry="6.5" fill="white" transform="rotate(45)" />
        <ellipse cx="0" cy="0" rx="1.3" ry="6.5" fill="white" transform="rotate(-45)" />
      </g>
    </svg>
  );
}
