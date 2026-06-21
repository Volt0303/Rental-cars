"use client";

import { useState } from "react";
import {
  CalendarDays,
  ListChecks,
  PlusCircle,
  Ban,
  CornerDownLeft,
  ChevronLeft,
  ChevronRight,
  List,
  Filter,
  Plus,
  MapPin,
  Car,
  Building2,
  RotateCcw,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { AdminShell } from "@/components/admin/AdminShell";
import { ScheduleGantt, ScheduleLegend } from "@/components/admin/ScheduleGantt";
import { Card, Button, Badge } from "@/components/ui/primitives";
import {
  SCHEDULE_BARS,
  SCHEDULE_VEHICLES,
  type ScheduleStatus,
} from "@/lib/mock-data";
import { jpy, cn } from "@/lib/utils";

const SIDE_NAV = [
  { key: "res.calendar", icon: CalendarDays, active: true },
  { key: "res.list", icon: ListChecks, active: false },
  { key: "res.new", icon: PlusCircle, active: false },
  { key: "res.blockMgmt", icon: Ban, active: false },
  { key: "res.returnList", icon: CornerDownLeft, active: false },
];

const STATUS_BADGE: Record<ScheduleStatus, { key: string; tone: "blue" | "green" | "orange" | "violet" | "slate" }> = {
  inUse: { key: "vstatus.inUse", tone: "blue" },
  confirmed: { key: "vstatus.available", tone: "green" },
  returning: { key: "vstatus.reserved", tone: "orange" },
  reserved: { key: "vstatus.reserved", tone: "violet" },
  maintenance: { key: "vstatus.maintenance", tone: "slate" },
};

function FilterSelect({ label, value }: { label: string; value: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-slate-500">{label}</span>
      <div className="flex items-center justify-between rounded-lg bg-white px-3 py-2 text-sm text-slate-600 ring-1 ring-slate-200">
        {value}
        <span className="text-slate-400">▾</span>
      </div>
    </label>
  );
}

export default function ReservationsPage() {
  const { t } = useI18n();
  const [selectedId, setSelectedId] = useState("b3");

  const bar = SCHEDULE_BARS.find((b) => b.id === selectedId) ?? SCHEDULE_BARS[2];
  const vehicle = SCHEDULE_VEHICLES.find((v) => v.id === bar.vehicleId)!;
  const isCorporate = bar.label.includes("株式会社");
  const badge = STATUS_BADGE[bar.status];

  // representative pricing for the panel
  const days = Math.max(1, Math.round(bar.endDay - bar.startDay));
  const base = 6000 * days;
  const option = 2200;
  const cdw = 2200;
  const total = base + option + cdw;

  return (
    <AdminShell title={t("anav.reservations")}>
      <div className="mb-4">
        <h2 className="text-xl font-extrabold text-slate-800">{t("res.title")}</h2>
        <p className="text-sm text-slate-500">{t("res.subtitle")}</p>
      </div>

      <div className="grid gap-5 xl:grid-cols-[210px_1fr_300px]">
        {/* Side nav + filters */}
        <div className="space-y-4">
          <Card className="p-2">
            {SIDE_NAV.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.key}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                    item.active ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-slate-50"
                  )}
                >
                  <Icon className="h-[18px] w-[18px]" />
                  {t(item.key)}
                </button>
              );
            })}
          </Card>

          <Card className="space-y-3 p-4">
            <p className="text-sm font-bold text-slate-700">{t("res.quickFilter")}</p>
            <FilterSelect label={t("res.store")} value={t("res.allStores")} />
            <FilterSelect label={t("res.category")} value={t("type.all")} />
            <FilterSelect label={t("res.vehicle")} value={t("type.all")} />
            <FilterSelect label={t("res.status")} value={t("type.all")} />
            <div>
              <span className="mb-1 block text-xs font-medium text-slate-500">
                {t("res.displayPeriod")}
              </span>
              <div className="flex rounded-lg ring-1 ring-slate-200">
                {["common.day", "common.week", "common.month"].map((k, i) => (
                  <button
                    key={k}
                    className={cn(
                      "flex-1 py-1.5 text-xs font-bold",
                      i === 1 ? "bg-brand-600 text-white" : "text-slate-500"
                    )}
                  >
                    {t(k)}
                  </button>
                ))}
              </div>
            </div>
            <button className="flex w-full items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-medium text-slate-500 ring-1 ring-slate-200 hover:bg-slate-50">
              <RotateCcw className="h-3.5 w-3.5" /> {t("res.clearFilter")}
            </button>
          </Card>
        </div>

        {/* Calendar */}
        <Card className="p-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center rounded-lg ring-1 ring-slate-200">
                <button className="px-2 py-1.5 text-slate-400 hover:text-slate-600">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button className="border-x border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600">
                  {t("common.today")}
                </button>
                <button className="px-2 py-1.5 text-slate-400 hover:text-slate-600">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              <span className="hidden text-sm font-medium text-slate-600 sm:inline">
                2024年5月20日 (月) 〜 5月26日 (日)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-500 ring-1 ring-slate-200">
                <List className="h-3.5 w-3.5" /> {t("res.listView")}
              </button>
              <button className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-500 ring-1 ring-slate-200">
                <Filter className="h-3.5 w-3.5" /> {t("common.filter")}
              </button>
              <Button className="px-3 py-1.5 text-xs">
                <Plus className="h-3.5 w-3.5" /> {t("res.new")}
              </Button>
            </div>
          </div>

          <div className="rounded-xl ring-1 ring-slate-100">
            <ScheduleGantt
              onSelect={setSelectedId}
              selectedBarId={selectedId}
              showStatusBadge
            />
          </div>
          <ScheduleLegend
            items={[
              { key: "res.legend.inUse", color: "bg-blue-500" },
              { key: "res.legend.available", color: "bg-emerald-500" },
              { key: "res.legend.reserved", color: "bg-amber-400" },
              { key: "res.legend.maintenance", color: "bg-violet-500" },
              { key: "res.legend.cleaning", color: "bg-slate-300" },
              { key: "res.legend.blocked", color: "bg-rose-500" },
            ]}
          />
        </Card>

        {/* Detail panel */}
        <Card className="h-fit p-5">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-bold text-slate-800">{t("res.detail")}</h3>
          </div>

          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="font-mono text-sm text-slate-500">
              ID: RES-2024-00{58 - SCHEDULE_BARS.indexOf(bar)}
            </span>
            <Badge tone={badge.tone === "violet" ? "purple" : badge.tone}>
              {t(badge.key)}
            </Badge>
          </div>

          <div className="flex items-center gap-2 py-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100">
              {isCorporate ? (
                <Building2 className="h-4 w-4 text-slate-500" />
              ) : (
                <MapPin className="h-4 w-4 text-slate-500" />
              )}
            </span>
            <span className="font-bold text-slate-700">
              {bar.label} 様
              {isCorporate && (
                <span className="ml-2 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-500">
                  {t("res.corporate")}
                </span>
              )}
            </span>
          </div>

          <div className="border-t border-slate-100 py-3">
            <p className="mb-1 text-xs font-medium text-slate-400">{t("res.vehicleInfo")}</p>
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-12 items-center justify-center rounded-md bg-slate-100">
                <Car className="h-4 w-4 text-slate-400" />
              </span>
              <div>
                <p className="text-sm font-bold text-slate-700">{vehicle.name}</p>
                <p className="text-[11px] text-slate-400">{vehicle.plate}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 py-3 text-sm">
            <p className="mb-2 text-xs font-medium text-slate-400">{t("res.rentalInfo")}</p>
            <dl className="space-y-1.5">
              <div className="flex justify-between">
                <dt className="text-slate-400">{t("summary.pickupDateTime")}</dt>
                <dd className="font-medium text-slate-700">{bar.timeLabel.split(" - ")[0]}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-400">{t("summary.returnDateTime")}</dt>
                <dd className="font-medium text-slate-700">{bar.timeLabel.split(" - ")[1] ?? "—"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-400">{t("search.pickupStore")}</dt>
                <dd className="font-medium text-slate-700">成田空港店</dd>
              </div>
            </dl>
          </div>

          <div className="border-t border-slate-100 py-3 text-sm">
            <p className="mb-2 text-xs font-medium text-slate-400">{t("res.priceInfo")}</p>
            <dl className="space-y-1.5">
              <div className="flex justify-between">
                <dt className="text-slate-400">
                  {t("summary.base")}（{days}
                  {t("summary.days")}）
                </dt>
                <dd className="font-medium text-slate-700">{jpy(base)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-400">{t("res.option")}</dt>
                <dd className="font-medium text-slate-700">{jpy(option)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-400">{t("res.cdw")}</dt>
                <dd className="font-medium text-slate-700">{jpy(cdw)}</dd>
              </div>
              <div className="flex justify-between border-t border-slate-100 pt-1.5">
                <dt className="font-bold text-slate-600">{t("summary.total")}</dt>
                <dd className="font-extrabold text-brand-600">{jpy(total)}</dd>
              </div>
            </dl>
          </div>

          <div className="border-t border-slate-100 py-3 text-sm">
            <p className="mb-1 text-xs font-medium text-slate-400">{t("res.remarks")}</p>
            <p className="text-slate-600">{t("res.airportPickup")}</p>
            <p className="text-slate-600">{t("res.childSeat1")}</p>
          </div>

          <div className="space-y-2 pt-2">
            <Button variant="outline" className="w-full">{t("res.viewDetail")}</Button>
            <Button variant="danger" className="w-full">{t("res.cancel")}</Button>
          </div>
        </Card>
      </div>
    </AdminShell>
  );
}
