"use client";

import { Car } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import {
  WEEK_DAYS,
  SCHEDULE_BARS,
  SCHEDULE_VEHICLES,
  type ScheduleStatus,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const STATUS_BAR: Record<ScheduleStatus, string> = {
  confirmed: "bg-emerald-500",
  inUse: "bg-blue-500",
  returning: "bg-amber-400",
  reserved: "bg-violet-500",
  maintenance: "bg-slate-300 text-slate-600",
};

const VEHICLE_STATUS_TONE: Record<string, string> = {
  available: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  inUse: "bg-blue-50 text-blue-700 ring-blue-200",
  maintenance: "bg-violet-50 text-violet-700 ring-violet-200",
};

const VEHICLE_STATUS_KEY: Record<string, string> = {
  available: "vstatus.available",
  inUse: "vstatus.inUse",
  maintenance: "vstatus.maintenance",
};

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

  return (
    <div className="overflow-x-auto scrollbar-thin">
      <div className="min-w-[760px]">
        {/* Header */}
        <div className="flex border-b border-slate-200">
          <div className="w-[180px] shrink-0 px-3 py-2.5 text-xs font-bold text-slate-500">
            {t("dash.col.vehicle")}
          </div>
          <div className="grid flex-1 grid-cols-7">
            {WEEK_DAYS.map((d, i) => (
              <div
                key={d.date}
                className={cn(
                  "border-l border-slate-100 px-2 py-2.5 text-center text-xs font-bold",
                  i === 5 ? "text-blue-500" : i === 6 ? "text-rose-500" : "text-slate-600"
                )}
              >
                {d.date}（{d.dow}）
              </div>
            ))}
          </div>
        </div>

        {/* Rows */}
        {SCHEDULE_VEHICLES.map((v) => {
          const bars = SCHEDULE_BARS.filter((b) => b.vehicleId === v.id);
          return (
            <div key={v.id} className="flex border-b border-slate-100 last:border-0">
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

              <div className="relative flex-1">
                {/* grid lines */}
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
                {/* bars */}
                <div className="absolute inset-0 flex flex-col justify-center gap-1 py-2">
                  {bars.map((bar) => {
                    const start = (bar.startDay + bar.startFrac) / 7;
                    const end = (bar.endDay + bar.endFrac) / 7;
                    const selected = selectedBarId === bar.id;
                    return (
                      <button
                        key={bar.id}
                        onClick={() => onSelect?.(bar.id)}
                        style={{
                          marginLeft: `${start * 100}%`,
                          width: `${Math.max(end - start, 0.04) * 100}%`,
                        }}
                        className={cn(
                          "group flex h-10 flex-col justify-center overflow-hidden rounded-lg px-2 text-left text-white transition-all",
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
