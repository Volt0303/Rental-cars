import { cn } from "@/lib/utils";

export function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/70",
        className
      )}
    >
      {children}
    </div>
  );
}

export function SectionTitle({
  children,
  action,
  className,
}: {
  children: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      <h3 className="text-base font-bold text-slate-800">{children}</h3>
      {action}
    </div>
  );
}

type BtnVariant = "primary" | "outline" | "ghost" | "danger";

const btnStyles: Record<BtnVariant, string> = {
  primary:
    "bg-caramel-500 text-white hover:bg-caramel-600 shadow-sm shadow-caramel-500/20",
  outline:
    "bg-white text-slate-700 ring-1 ring-slate-300 hover:bg-slate-50",
  ghost: "text-slate-600 hover:bg-slate-100",
  danger: "bg-white text-rose-600 ring-1 ring-rose-200 hover:bg-rose-50",
};

export function Button({
  variant = "primary",
  className,
  children,
  type = "button",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: BtnVariant }) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-colors disabled:opacity-50",
        btnStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

type BadgeTone =
  | "blue"
  | "green"
  | "orange"
  | "red"
  | "purple"
  | "slate"
  | "teal";

const badgeTones: Record<BadgeTone, string> = {
  blue: "bg-blue-50 text-blue-700 ring-blue-200",
  green: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  orange: "bg-amber-50 text-amber-700 ring-amber-200",
  red: "bg-rose-50 text-rose-700 ring-rose-200",
  purple: "bg-violet-50 text-violet-700 ring-violet-200",
  slate: "bg-slate-100 text-slate-600 ring-slate-200",
  teal: "bg-teal-50 text-teal-700 ring-teal-200",
};

export function Badge({
  tone = "slate",
  className,
  children,
}: {
  tone?: BadgeTone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ring-1 ring-inset",
        badgeTones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

const tileTones: Record<string, string> = {
  blue: "bg-blue-500",
  green: "bg-emerald-500",
  purple: "bg-violet-500",
  orange: "bg-amber-500",
  teal: "bg-teal-500",
  red: "bg-rose-500",
};

export function IconTile({
  tone,
  children,
  className,
}: {
  tone: keyof typeof tileTones;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-sm",
        tileTones[tone],
        className
      )}
    >
      {children}
    </div>
  );
}
