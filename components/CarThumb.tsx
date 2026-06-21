import { Car } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Stylised vehicle thumbnail. Real photos would replace this in production;
 * for the demo we use a clean gradient tile with a car glyph so no external
 * image assets are required.
 */
export function CarThumb({
  accent,
  className,
  iconClassName,
}: {
  accent: string;
  className?: string;
  iconClassName?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br",
        accent,
        className
      )}
    >
      <Car
        className={cn("text-white/90 drop-shadow", iconClassName)}
        strokeWidth={1.5}
      />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/10 to-transparent" />
    </div>
  );
}
