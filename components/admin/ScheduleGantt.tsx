"use client";

import { useState } from "react";
import { Car } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import {
  WEEK_DAYS,
  SCHEDULE_BARS,
  SCHEDULE_VEHICLES,
  type ScheduleStatus,
  type ScheduleBar,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const STATUS_BAR: Record<ScheduleStatus, string> = {
  confirmed:   "bg-emerald-500",
  inUse:       "bg-blue-500",
  returning:   "bg-amber-400",
  reserved:    "bg-violet-500",
  maintenance: "bg-slate-300 text-slate-600",
};

const STATUS_LABEL: Record<ScheduleStatus, string> = {
  confirmed:   "予約確定",
  inUse:       "使用中",
  returning:   "返却中",
  reserved:    "VIP予約",
  maintenance: "整備中",
};

const STATUS_DOT: Record<ScheduleStatus, string> = {
  confirmed:   "bg-emerald-400",
  inUse:       "bg-blue-400",
  returning:   "bg-amber-300",
  reserved:    "bg-violet-400",
  maintenance: "bg-slate-400",
};

const VEHICLE_STATUS_TONE: Record<string, string> = {
  available:   "bg-emerald-50 text-emerald-700 ring-emerald-200",
  inUse:       "bg-blue-50 text-blue-700 ring-blue-200",
  maintenance: "bg-violet-50 text-violet-700 ring-violet-200",
};

const VEHICLE_STATUS_KEY: Record<string, string> = {
  available:   "vstatus.available",
  inUse:       "vstatus.inUse",
  maintenance: "vstatus.maintenance",
};

// Major hour ticks displayed in the timeline ruler (0-based, 24h)
const MAJOR_HOURS = [0, 6, 12, 18];
const MINOR_HOURS = [3, 9, 15, 21];

type TooltipState = { bar: ScheduleBar; x: number; y: number } | null;

export function ScheduleGantt({
  onSelect,
  selectedBarId,
  showStatusBadge = false,
}: {
  onSelect?: (barId: string) => void;
  selectedBarId?: string;
  showStatusBadge?: boolean;
}) {
  const { t } = useI18n();
  const [tooltip, setTooltip] = useState<TooltipState>(null);

  const showTip = (bar: ScheduleBar, e: React.MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setTooltip({ bar, x: r.left + r.width / 2, y: r.top });
  };

  return (
    <>
      <div className="overflow-x-auto scrollbar-thin">
        <div className="min-w-[760px]">

          {/* ── Date header ── */}
          <div className="flex border-b border-slate-200">
            <div className="w-[180px] shrink-0 px-3 py-2 text-xs font-bold text-slate-500">
              {t("dash.col.vehicle")}
            </div>
            <div className="grid flex-1 grid-cols-7">
              {WEEK_DAYS.map((d, i) => (
                <div
                  key={d.date}
                  className={cn(
                    "border-l border-slate-100 px-2 py-2 text-center text-xs font-bold",
                    i === 5 ? "text-blue-500" : i === 6 ? "text-rose-500" : "text-slate-600"
                  )}
                >
                  {d.date}（{d.dow}）
                </div>
              ))}
            </div>
          </div>

          {/* ── Timeline ruler ── */}
          <div className="flex border-b border-slate-200 bg-slate-50/70">
            {/* left gutter — matches vehicle column */}
            <div className="w-[180px] shrink-0 border-r border-slate-100" />

            <div className="grid flex-1 grid-cols-7">
              {WEEK_DAYS.map((d) => (
                <div key={d.date} className="relative h-7 border-l border-slate-100">
                  {/* Hour labels (6h, 12h, 18h) */}
                  {[6, 12, 18].map((h) => (
                    <span
                      key={h}
                      className="absolute top-0.5 select-none text-[9px] leading-none text-slate-400"
                      style={{
                        left:      `${(h / 24) * 100}%`,
                        transform: "translateX(-50%)",
                      }}
                    >
                      {h}h
                    </span>
                  ))}

                  {/* Major tick marks (0h, 6h, 12h, 18h) */}
                  {MAJOR_HOURS.map((h) => (
                    <span
                      key={h}
                      className="absolute bottom-0 w-px bg-slate-300"
                      style={{ left: `${(h / 24) * 100}%`, height: "7px" }}
                    />
                  ))}

                  {/* Minor tick marks (3h, 9h, 15h, 21h) */}
                  {MINOR_HOURS.map((h) => (
                    <span
                      key={h}
                      className="absolute bottom-0 w-px bg-slate-200"
                      style={{ left: `${(h / 24) * 100}%`, height: "4px" }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* ── Vehicle rows ── */}
          {SCHEDULE_VEHICLES.map((v) => {
            const bars = SCHEDULE_BARS.filter((b) => b.vehicleId === v.id);
            return (
              <div key={v.id} className="flex h-[60px] border-b border-slate-100 last:border-0">

                {/* Vehicle label */}
                <div className="flex w-[180px] shrink-0 items-center gap-2.5 px-3 py-3">
                  <span className="flex h-9 w-12 shrink-0 items-center justify-center rounded-md bg-slate-100">
                    <Car className="h-4 w-4 text-slate-400" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-bold text-slate-700">{v.name}</p>
                    <p className="truncate text-[10px] text-slate-400">{v.plate}</p>
                    {showStatusBadge && (
                      <span
                        className={cn(
                          "mt-0.5 inline-block rounded px-1.5 py-0.5 text-[9px] font-bold ring-1 ring-inset",
                          VEHICLE_STATUS_TONE[v.status]
                        )}
                      >
                        {t(VEHICLE_STATUS_KEY[v.status])}
                      </span>
                    )}
                  </div>
                </div>

                {/* Gantt track */}
                <div className="relative flex-1">
                  {/* Day column backgrounds / grid lines */}
                  <div className="grid h-full grid-cols-7">
                    {WEEK_DAYS.map((_, i) => (
                      <div
                        key={i}
                        className={cn(
                          "border-l border-slate-100",
                          i === 6 && "bg-rose-50/40"
                        )}
                      />
                    ))}
                  </div>

                  {/* Hour sub-grid lines (6h, 12h, 18h marks aligned with ruler) */}
                  {SCHEDULE_VEHICLES.length > 0 && WEEK_DAYS.map((_, di) => (
                    [6, 12, 18].map((h) => {
                      const pct = ((di + h / 24) / 7) * 100;
                      return (
                        <span
                          key={`${di}-${h}`}
                          className="absolute inset-y-0 w-px bg-slate-100"
                          style={{ left: `${pct}%` }}
                        />
                      );
                    })
                  ))}

                  {/* Reservation bars — stretch to nearly fill row height */}
                  <div className="absolute inset-0">
                    {bars.map((bar) => {
                      const start    = (bar.startDay + bar.startFrac) / 7;
                      const end      = (bar.endDay   + bar.endFrac)   / 7;
                      const selected = selectedBarId === bar.id;
                      return (
                        <button
                          key={bar.id}
                          onClick={() => onSelect?.(bar.id)}
                          onMouseEnter={(e) => showTip(bar, e)}
                          onMouseLeave={() => setTooltip(null)}
                          style={{
                            left:   `${start * 100}%`,
                            width:  `${Math.max(end - start, 0.04) * 100}%`,
                            top:    "1px",
                            bottom: "1px",
                          }}
                          className={cn(
                            "absolute flex flex-col justify-center overflow-hidden px-2 text-left text-white transition-all",
                            STATUS_BAR[bar.status],
                            onSelect && "hover:brightness-105",
                            selected && "ring-2 ring-slate-800 ring-offset-1"
                          )}
                        >
                          <span className="truncate text-[11px] font-bold leading-tight">
                            {bar.label}
                          </span>
                          <span className="truncate text-[9px] leading-tight opacity-90">
                            {bar.timeLabel}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}

        </div>
      </div>

      {/* Fixed-position tooltip — outside the overflow container to avoid clipping */}
      {tooltip && (
        <div
          className="pointer-events-none fixed z-[9999]"
          style={{
            left:      tooltip.x,
            top:       tooltip.y - 8,
            transform: "translate(-50%, -100%)",
          }}
        >
          <div className="relative min-w-[160px] rounded bg-slate-800 px-3 py-2 shadow-xl">
            <div className="mb-1 flex items-center gap-1.5">
              <span className={cn("h-2 w-2 rounded-full", STATUS_DOT[tooltip.bar.status])} />
              <span className="text-[10px] font-medium text-slate-400">
                {STATUS_LABEL[tooltip.bar.status]}
              </span>
            </div>
            <p className="text-[12px] font-bold text-white">{tooltip.bar.label}</p>
            <p className="mt-0.5 text-[10px] text-slate-300">{tooltip.bar.timeLabel}</p>
            <span className="absolute -bottom-[5px] left-1/2 h-2.5 w-2.5 -translate-x-1/2 rotate-45 bg-slate-800" />
          </div>
        </div>
      )}
    </>
  );
}

export function ScheduleLegend({
  items,
}: {
  items: { key: string; color: string }[];
}) {
  const { t } = useI18n();
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-1 py-3 text-xs text-slate-500">
      {items.map((it) => (
        <span key={it.key} className="inline-flex items-center gap-1.5">
          <span className={cn("h-2.5 w-2.5 rounded-full", it.color)} />
          {t(it.key)}
        </span>
      ))}
    </div>
  );
}
