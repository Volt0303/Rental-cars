"use client";

import Link from "next/link";
import {
  CalendarDays,
  Car,
  CarFront,
  Wrench,
  FileText,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Droplet,
  ShieldCheck,
  Filter,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { AdminShell } from "@/components/admin/AdminShell";
import { ScheduleGantt, ScheduleLegend } from "@/components/admin/ScheduleGantt";
import { Card, IconTile, Badge } from "@/components/ui/primitives";
import {
  DASH_STATS,
  INQUIRIES,
  ALERTS,
  RETURNS,
  type QuoteStatus,
  type AlertKind,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const QUOTE_TONE: Record<QuoteStatus, "orange" | "green" | "blue"> = {
  waiting: "orange",
  sent: "green",
  new: "blue",
};
const QUOTE_KEY: Record<QuoteStatus, string> = {
  waiting: "qstatus.waiting",
  sent: "qstatus.sent",
  new: "qstatus.new",
};

const ALERT_ICON: Record<AlertKind, React.ElementType> = {
  inspectionSoon: AlertTriangle,
  periodicInspection: Wrench,
  oilChange: Droplet,
  insuranceExpiry: ShieldCheck,
};
const ALERT_KEY: Record<AlertKind, string> = {
  inspectionSoon: "dash.alert.inspectionSoon",
  periodicInspection: "dash.alert.periodicInspection",
  oilChange: "dash.alert.oilChange",
  insuranceExpiry: "dash.alert.insuranceExpiry",
};

function StatCard({
  tone,
  icon: Icon,
  label,
  value,
  unit,
}: {
  tone: "blue" | "green" | "purple" | "orange" | "teal";
  icon: React.ElementType;
  label: string;
  value: number;
  unit: string;
}) {
  const { t } = useI18n();
  return (
    <Card className="p-4">
      <div className="flex items-start gap-3">
        <IconTile tone={tone}>
          <Icon className="h-6 w-6" />
        </IconTile>
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-slate-500">{label}</p>
          <p className="text-2xl font-extrabold text-slate-800">
            {value}
            <span className="ml-1 text-sm font-bold text-slate-400">{unit}</span>
          </p>
        </div>
      </div>
      <Link
        href="#"
        className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5 text-xs font-medium text-brand-600"
      >
        {t("common.viewDetail")}
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </Card>
  );
}

export default function DashboardPage() {
  const { t } = useI18n();

  return (
    <AdminShell title={t("dash.title")}>
      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatCard tone="blue" icon={CalendarDays} label={t("dash.todayReservations")} value={DASH_STATS.todayReservations} unit={t("dash.cases")} />
        <StatCard tone="green" icon={Car} label={t("dash.activeReservations")} value={DASH_STATS.activeReservations} unit={t("dash.cases")} />
        <StatCard tone="purple" icon={CarFront} label={t("dash.availableVehicles")} value={DASH_STATS.availableVehicles} unit={t("dash.units")} />
        <StatCard tone="orange" icon={Wrench} label={t("dash.inMaintenance")} value={DASH_STATS.inMaintenance} unit={t("dash.units")} />
        <StatCard tone="teal" icon={FileText} label={t("dash.pendingQuotes")} value={DASH_STATS.pendingQuotes} unit={t("dash.cases")} />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_330px]">
        {/* Left column */}
        <div className="space-y-5">
          {/* Schedule */}
          <Card className="p-5">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-base font-bold text-slate-800">{t("dash.schedule")}</h3>
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
                  2024年5月20日 – 5月26日
                </span>
                <div className="ml-auto flex items-center rounded-lg ring-1 ring-slate-200">
                  {["common.day", "common.week", "common.month"].map((k, i) => (
                    <button
                      key={k}
                      className={cn(
                        "px-3 py-1.5 text-xs font-bold",
                        i === 1 ? "bg-brand-600 text-white" : "text-slate-500"
                      )}
                    >
                      {t(k)}
                    </button>
                  ))}
                </div>
                <button className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-500 ring-1 ring-slate-200">
                  <Filter className="h-3.5 w-3.5" /> {t("common.filter")}
                </button>
              </div>
            </div>

            <div className="rounded-xl ring-1 ring-slate-100">
              <ScheduleGantt />
            </div>
            <ScheduleLegend
              items={[
                { key: "dash.legend.confirmed", color: "bg-emerald-500" },
                { key: "dash.legend.inUse", color: "bg-blue-500" },
                { key: "dash.legend.returning", color: "bg-amber-400" },
                { key: "dash.legend.maintenance", color: "bg-rose-500" },
                { key: "dash.legend.blocked", color: "bg-slate-300" },
              ]}
            />
          </Card>

          {/* Inquiries table */}
          <Card className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-800">{t("dash.recentInquiries")}</h3>
              <Link href="#" className="text-xs font-bold text-brand-600 hover:underline">
                {t("common.viewAll")}
              </Link>
            </div>
            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full min-w-[720px] text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-xs text-slate-400">
                    <th className="py-2 pr-3 font-medium">{t("dash.col.inquiryNo")}</th>
                    <th className="py-2 pr-3 font-medium">{t("dash.col.customer")}</th>
                    <th className="py-2 pr-3 font-medium">{t("dash.col.language")}</th>
                    <th className="py-2 pr-3 font-medium">{t("dash.col.vehicle")}</th>
                    <th className="py-2 pr-3 font-medium">{t("dash.col.period")}</th>
                    <th className="py-2 pr-3 font-medium">{t("dash.col.status")}</th>
                    <th className="py-2 font-medium">{t("dash.col.receivedAt")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {INQUIRIES.map((iq) => (
                    <tr key={iq.no} className="hover:bg-slate-50/60">
                      <td className="py-2.5 pr-3 font-mono text-xs text-slate-500">{iq.no}</td>
                      <td className="py-2.5 pr-3 font-medium text-slate-700">{iq.customer}</td>
                      <td className="py-2.5 pr-3">
                        <span className="inline-flex items-center gap-1 text-slate-600">
                          <span className="text-base">{iq.flag}</span>
                          <span className="text-xs">{iq.langLabel}</span>
                        </span>
                      </td>
                      <td className="py-2.5 pr-3 text-slate-600">{iq.vehicle}</td>
                      <td className="py-2.5 pr-3 text-xs text-slate-500">{iq.period}</td>
                      <td className="py-2.5 pr-3">
                        <Badge tone={QUOTE_TONE[iq.status]}>{t(QUOTE_KEY[iq.status])}</Badge>
                      </td>
                      <td className="py-2.5 text-xs text-slate-400">{iq.receivedAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          <Card className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-800">{t("dash.maintenanceAlerts")}</h3>
              <Link href="#" className="text-xs font-bold text-brand-600 hover:underline">
                {t("common.viewAll")}
              </Link>
            </div>
            <div className="space-y-3">
              {ALERTS.map((al, i) => {
                const Icon = ALERT_ICON[al.kind];
                return (
                  <div key={i} className="flex items-start gap-3 rounded-xl bg-slate-50/70 p-3">
                    <span
                      className={cn(
                        "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                        al.severity === "red" ? "bg-rose-100 text-rose-500" : "bg-amber-100 text-amber-500"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-slate-700">{t(ALERT_KEY[al.kind])}</p>
                      <p className="truncate text-xs text-slate-500">{al.vehicle}</p>
                      <p className="text-xs text-slate-400">
                        {al.dateKind === "expiry" ? t("dash.alert.expiry") : t("dash.alert.scheduled")}：
                        <span className={al.severity === "red" ? "font-bold text-rose-500" : ""}>{al.date}</span>
                      </p>
                    </div>
                    <Badge tone={al.severity === "red" ? "red" : "orange"}>
                      {al.daysLater}
                      {t("dash.daysLater")}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-800">{t("dash.todayReturns")}</h3>
              <Link href="#" className="text-xs font-bold text-brand-600 hover:underline">
                {t("common.viewAll")}
              </Link>
            </div>
            <div className="space-y-2.5">
              {RETURNS.map((r, i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl p-2 hover:bg-slate-50">
                  <span className="flex h-9 w-12 shrink-0 items-center justify-center rounded-md bg-slate-100">
                    <Car className="h-4 w-4 text-slate-400" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-slate-700">{r.customer} 様</p>
                    <p className="truncate text-xs text-slate-400">{r.vehicle}</p>
                  </div>
                  <span className="text-sm font-bold text-slate-600">{r.time}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </AdminShell>
  );
}
