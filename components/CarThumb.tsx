import Image from "next/image";
import { Car } from "lucide-react";
import { cn } from "@/lib/utils";

export function CarThumb({
  accent,
  src,
  className,
  iconClassName,
}: {
  accent: string;
  src?: string;
  className?: string;
  iconClassName?: string;
}) {
  if (src) {
    return (
      <div className={cn("relative overflow-hidden rounded-xl", className)}>
        <Image src={src} alt="" fill sizes="(max-width: 640px) 100vw, 12rem" className="object-cover" />
      </div>
    );
  }
  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br",
        accent,
        className
      )}
    >
      <Car className={cn("text-white/90 drop-shadow", iconClassName)} strokeWidth={1.5} />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/10 to-transparent" />
    </div>
  );
}
