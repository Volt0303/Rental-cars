import { cn } from "@/lib/utils";

/**
 * COMPASS CAR brand logo — works on dark (navy) backgrounds.
 * Renders an SVG compass-and-car icon beside the "COMPASS / CAR" wordmark.
 */
export function CompassCarLogo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5 select-none", className)}>
      {/* Compass + car icon */}
      <svg
        viewBox="0 0 44 44"
        className="h-10 w-10 shrink-0"
        aria-hidden="true"
      >
        {/* Outer compass arc (top half) */}
        <path
          d="M6 26 A16 16 0 0 1 38 26"
          stroke="white"
          strokeWidth="2.8"
          fill="none"
          strokeLinecap="round"
        />
        {/* Diagonal spokes */}
        <line x1="10.5" y1="13.5" x2="33.5" y2="26" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
        <line x1="33.5" y1="13.5" x2="10.5" y2="26" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
        {/* Vertical spoke */}
        <line x1="22" y1="10" x2="22" y2="26" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
        {/* Red north needle */}
        <polygon points="22,9 18.5,22 25.5,22" fill="#ef4444" />
        {/* White south half of needle */}
        <polygon points="22,26 18.5,22 25.5,22" fill="rgba(255,255,255,0.35)" />

        {/* Car silhouette body */}
        <path
          d="M7 34 L10 28 L34 28 L37 34 L37 38 L7 38 Z"
          fill="white"
        />
        {/* Car roof / cabin */}
        <path
          d="M11.5 28 L15 23 L29 23 L32.5 28"
          fill="white"
        />
        {/* Speed lines left */}
        <line x1="2" y1="32" x2="8" y2="32" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="1" y1="35" x2="7" y2="35" stroke="rgba(255,255,255,0.3)" strokeWidth="1"   strokeLinecap="round"/>
        {/* Speed lines right */}
        <line x1="36" y1="32" x2="42" y2="32" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="37" y1="35" x2="43" y2="35" stroke="rgba(255,255,255,0.3)" strokeWidth="1"   strokeLinecap="round"/>
        {/* Wheels (punch-outs) */}
        <circle cx="14" cy="38" r="4" fill="#0b1437" />
        <circle cx="30" cy="38" r="4" fill="#0b1437" />
        {/* Wheel highlight */}
        <circle cx="14" cy="38" r="2" fill="rgba(255,255,255,0.15)" />
        <circle cx="30" cy="38" r="2" fill="rgba(255,255,255,0.15)" />
      </svg>

      {/* Word-mark */}
      <div className="leading-none">
        <div className="text-[15px] font-black uppercase tracking-[0.16em] text-white">
          COMPASS
        </div>
        <div className="mt-0.5 flex items-center gap-1.5 text-[8.5px] font-black uppercase tracking-[0.55em] text-red-400">
          <span className="h-px w-3 bg-red-400/60" />
          CAR
          <span className="h-px w-3 bg-red-400/60" />
        </div>
      </div>
    </div>
  );
}
