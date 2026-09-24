// The Salt & Blade mark: a straight razor over a single sea swell, inside a ring.
// Drawn in currentColor so it recolours for dark and light sections.
export function LogoMark({ className = "h-10 w-10", title }) {
  return (
    <svg viewBox="0 0 64 64" className={className} role={title ? "img" : undefined} aria-hidden={title ? undefined : true} aria-label={title}>
      <circle cx="32" cy="32" r="29" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="32" cy="32" r="24.5" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.45" />
      <g transform="rotate(-32 32 30)">
        <path d="M22 26.5h20.5c3.6 0 6 2.2 6 4.6v1.4H22z" fill="currentColor" />
        <path d="M22 26.5h26.2" stroke="var(--logo-bg, #13201f)" strokeWidth="0.9" opacity="0.5" />
        <rect x="9" y="28.4" width="14.5" height="3.4" rx="1.7" fill="currentColor" />
        <circle cx="22.3" cy="30.1" r="2.3" fill="var(--logo-bg, #13201f)" stroke="currentColor" strokeWidth="1.4" />
      </g>
      <path d="M15 45.5c3-2.8 6-2.8 9 0s6 2.8 9 0 6-2.8 9 0 5.2 2.4 7.5.6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({ className = "", compact = false }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark className="h-10 w-10 shrink-0 text-brass" />
      <span className="flex flex-col leading-none">
        <span className="font-display text-[1.35rem] font-semibold tracking-tight text-salt">Salt &amp; Blade</span>
        {!compact && <span className="mt-1 text-[0.7rem] font-medium tracking-[0.18em] text-rope">BARBER CO.</span>}
      </span>
    </span>
  );
}
