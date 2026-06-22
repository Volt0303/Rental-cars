import { cn } from "@/lib/utils";

/**
 * COMPASS CAR brand logo.
 * variant="dark"  (default) → white text, for dark/navy backgrounds
 * variant="light"           → dark text, for white/light backgrounds
 */
export function CompassCarLogo({
  className,
  variant = "dark",
}: {
  className?: string;
  variant?: "dark" | "light";
}) {
  const d = variant === "dark";

  const arcStroke      = d ? "white"                   : "#0b1437";
  const spokeStroke    = d ? "rgba(255,255,255,0.25)"  : "rgba(0,0,0,0.15)";
  const spokeFaint     = d ? "rgba(255,255,255,0.2)"   : "rgba(0,0,0,0.10)";
  const needleSouth    = d ? "rgba(255,255,255,0.35)"  : "rgba(0,0,0,0.15)";
  const carFill        = d ? "white"                   : "#0b1437";
  const speedStroke    = d ? "rgba(255,255,255,0.5)"   : "rgba(0,0,0,0.25)";
  const speedStrokeFnt = d ? "rgba(255,255,255,0.3)"   : "rgba(0,0,0,0.12)";
  const wheelPunch     = d ? "#0b1437"                 : "white";
  const wheelGlow      = d ? "rgba(255,255,255,0.15)"  : "rgba(0,0,0,0.10)";
  const wordmark       = d ? "text-white"              : "text-navy-900";

  return (
    <div className={cn("flex select-none items-center gap-2.5", className)}>
      <svg viewBox="0 0 44 44" className="h-10 w-10 shrink-0" aria-hidden="true">
        <path d="M6 26 A16 16 0 0 1 38 26" stroke={arcStroke} strokeWidth="2.8" fill="none" strokeLinecap="round" />
        <line x1="10.5" y1="13.5" x2="33.5" y2="26" stroke={spokeStroke} strokeWidth="1.5" />
        <line x1="33.5" y1="13.5" x2="10.5" y2="26" stroke={spokeStroke} strokeWidth="1.5" />
        <line x1="22"   y1="10"   x2="22"   y2="26" stroke={spokeFaint}  strokeWidth="1.5" />
        <polygon points="22,9 18.5,22 25.5,22" fill="#ef4444" />
        <polygon points="22,26 18.5,22 25.5,22" fill={needleSouth} />
        <path d="M7 34 L10 28 L34 28 L37 34 L37 38 L7 38 Z" fill={carFill} />
        <path d="M11.5 28 L15 23 L29 23 L32.5 28" fill={carFill} />
        <line x1="2"  y1="32" x2="8"  y2="32" stroke={speedStroke}    strokeWidth="1.5" strokeLinecap="round" />
        <line x1="1"  y1="35" x2="7"  y2="35" stroke={speedStrokeFnt} strokeWidth="1"   strokeLinecap="round" />
        <line x1="36" y1="32" x2="42" y2="32" stroke={speedStroke}    strokeWidth="1.5" strokeLinecap="round" />
        <line x1="37" y1="35" x2="43" y2="35" stroke={speedStrokeFnt} strokeWidth="1"   strokeLinecap="round" />
        <circle cx="14" cy="38" r="4" fill={wheelPunch} />
        <circle cx="30" cy="38" r="4" fill={wheelPunch} />
        <circle cx="14" cy="38" r="2" fill={wheelGlow} />
        <circle cx="30" cy="38" r="2" fill={wheelGlow} />
      </svg>

      <div className="leading-none">
        <div className={cn("text-[15px] font-black uppercase tracking-[0.16em]", wordmark)}>
          COMPASS
        </div>
        <div className="mt-0.5 flex items-center gap-1.5 text-[8.5px] font-black uppercase tracking-[0.55em] text-red-500">
          <span className="h-px w-3 bg-red-400/60" />
          CAR
          <span className="h-px w-3 bg-red-400/60" />
        </div>
      </div>
    </div>
  );
}
