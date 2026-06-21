"use client";

import { useState, useMemo, useEffect } from "react";
import {
  CalendarDays, ListChecks, PlusCircle, Ban, CornerDownLeft,
  ChevronLeft, ChevronRight, List, Filter, Plus,
  MapPin, Car, Building2, RotateCcw, CheckCircle2,
  Clock, AlertTriangle, Trash2, X,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { AdminShell } from "@/components/admin/AdminShell";
import { ScheduleGantt, ScheduleLegend } from "@/components/admin/ScheduleGantt";
import { Card, Button, Badge } from "@/components/ui/primitives";
import {
  SCHEDULE_BARS, SCHEDULE_VEHICLES, SCHEDULE_STORES,
  type ScheduleStatus, type ScheduleBar,
} from "@/lib/mock-data";
import { jpy, cn } from "@/lib/utils";

// ── Types ──────────────────────────────────────────────────────────────────
type ViewMode = "calendar" | "list" | "new" | "block" | "return";
type Period   = "day" | "week" | "month";
type BlockReason = "maintenance" | "cleaning" | "inspection" | "other";

type LocalBlock = {
  id: string;
  vehicleId: string;
  startDate: string; startTime: string;
  endDate: string;   endTime: string;
  reason: BlockReason;
};

// ── Constants ──────────────────────────────────────────────────────────────
const SIDE_NAV = [
  { key: "res.calendar",   icon: CalendarDays,   mode: "calendar" as ViewMode },
  { key: "res.list",       icon: ListChecks,     mode: "list"     as ViewMode },
  { key: "res.new",        icon: PlusCircle,     mode: "new"      as ViewMode },
  { key: "res.blockMgmt",  icon: Ban,            mode: "block"    as ViewMode },
  { key: "res.returnList", icon: CornerDownLeft, mode: "return"   as ViewMode },
];

const PERIOD_TABS: { label: string; value: Period }[] = [
  { label: "日", value: "day" },
  { label: "週", value: "week" },
  { label: "月", value: "month" },
];

const STATUS_BADGE: Record<ScheduleStatus, { key: string; tone: "blue" | "green" | "orange" | "violet" | "slate" }> = {
  inUse:       { key: "vstatus.inUse",       tone: "blue" },
  confirmed:   { key: "vstatus.available",   tone: "green" },
  returning:   { key: "vstatus.reserved",    tone: "orange" },
  reserved:    { key: "vstatus.reserved",    tone: "violet" },
  maintenance: { key: "vstatus.maintenance", tone: "slate" },
};

const BLOCK_REASON_LABEL: Record<BlockReason, string> = {
  maintenance: "定期整備",
  cleaning:    "清掃・クリーニング",
  inspection:  "車両検査",
  other:       "その他",
};

const WEEK_DATE_LABELS = ["5/20(月)", "5/21(火)", "5/22(水)", "5/23(木)", "5/24(金)", "5/25(土)", "5/26(日)"];

function resId(bar: ScheduleBar) {
  return `RES-2024-00${58 - SCHEDULE_BARS.indexOf(bar)}`;
}

// ── Sub-components ─────────────────────────────────────────────────────────
function FilterSelect({
  label, value, onChange, children, disabled,
}: {
  label: string; value: string; onChange: (v: string) => void;
  children: React.ReactNode; disabled?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-slate-500">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full appearance-none rounded-lg bg-white px-3 py-2 text-sm text-slate-600 ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {children}
      </select>
    </label>
  );
}

function FormField({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-slate-600">{label}</label>
      {children}
      {error && <p className="mt-0.5 text-[11px] text-rose-500">{error}</p>}
    </div>
  );
}

function inputCls(error?: boolean) {
  return cn(
    "w-full rounded-lg bg-white px-3 py-2 text-sm text-slate-700 ring-1 focus:outline-none focus:ring-2 focus:ring-brand-500",
    error ? "ring-rose-300" : "ring-slate-200"
  );
}

// ── Main page ──────────────────────────────────────────────────────────────
export default function ReservationsPage() {
  const { t } = useI18n();

  // View state
  const [viewMode, setViewMode] = useState<ViewMode>("calendar");
  const [period,   setPeriod]   = useState<Period>("week");

  // Filter state
  const [storeFilter,    setStoreFilter]    = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [vehicleFilter,  setVehicleFilter]  = useState("all");
  const [statusFilter,   setStatusFilter]   = useState<ScheduleStatus | "all">("all");

  // Detail panel selection
  const [selectedId, setSelectedId] = useState("b3");

  // ── New reservation form ─────────────────────────────────────────────────
  const [newForm, setNewForm] = useState({
    customerType: "individual" as "individual" | "corporate",
    customerName: "", companyName: "", phone: "",
    store: "", vehicleId: "",
    pickupDate: "2024-05-27", pickupTime: "10:00",
    returnDate: "2024-05-29", returnTime: "18:00",
    childSeat: false, etc: false, navigation: false,
    notes: "",
  });
  const [newErrors, setNewErrors] = useState<Record<string, string>>({});
  const [newSubmitted, setNewSubmitted] = useState(false);

  // ── Block management ─────────────────────────────────────────────────────
  const [showAddBlock, setShowAddBlock] = useState(false);
  const [localBlocks,  setLocalBlocks]  = useState<LocalBlock[]>([]);
  const [newBlock, setNewBlock] = useState<Omit<LocalBlock,"id">>({
    vehicleId: "", startDate: "2024-05-27", startTime: "09:00",
    endDate: "2024-05-28", endTime: "18:00", reason: "maintenance",
  });
  const [blockErrors, setBlockErrors] = useState<Record<string, string>>({});

  // ── Filtered data ────────────────────────────────────────────────────────
  const vehicleMatches = useMemo(() => {
    return [...SCHEDULE_VEHICLES].filter((v) => {
      if (storeFilter    !== "all" && v.store    !== storeFilter)    return false;
      if (categoryFilter !== "all" && v.category !== categoryFilter) return false;
      if (vehicleFilter  !== "all" && v.id       !== vehicleFilter)  return false;
      return true;
    });
  }, [storeFilter, categoryFilter, vehicleFilter]);

  const allFilteredBars = useMemo<ScheduleBar[]>(() => {
    const ids = new Set<string>(vehicleMatches.map((v) => v.id));
    return SCHEDULE_BARS.filter((b) => {
      if (!ids.has(b.vehicleId)) return false;
      if (statusFilter !== "all" && b.status !== statusFilter) return false;
      if (period === "day" && !(b.startDay <= 0 && b.endDay >= 0)) return false;
      return true;
    });
  }, [vehicleMatches, statusFilter, period]);

  const ganttVehicles = useMemo(() => {
    const ids = new Set(allFilteredBars.map((b) => b.vehicleId));
    return vehicleMatches.filter((v) => ids.has(v.id));
  }, [vehicleMatches, allFilteredBars]);

  useEffect(() => {
    if (allFilteredBars.length > 0 && !allFilteredBars.find((b) => b.id === selectedId)) {
      setSelectedId(allFilteredBars[0].id);
    }
  }, [allFilteredBars, selectedId]);

  const clearFilters = () => {
    setStoreFilter("all"); setCategoryFilter("all");
    setVehicleFilter("all"); setStatusFilter("all");
  };
  const hasActiveFilter = storeFilter !== "all" || categoryFilter !== "all"
    || vehicleFilter !== "all" || statusFilter !== "all";
  const activeFilterCount = [storeFilter, categoryFilter, vehicleFilter, statusFilter]
    .filter((v) => v !== "all").length;

  // ── Detail panel ─────────────────────────────────────────────────────────
  const bar = allFilteredBars.find((b) => b.id === selectedId)
    ?? SCHEDULE_BARS.find((b) => b.id === selectedId)
    ?? SCHEDULE_BARS[2];
  const vehicle = SCHEDULE_VEHICLES.find((v) => v.id === bar.vehicleId)!;
  const badge = STATUS_BADGE[bar.status];
  const isCorporate = bar.label.includes("株式会社");
  const days  = Math.max(1, Math.round(bar.endDay - bar.startDay));
  const base  = 6000 * days;
  const total = base + 2200 + 2200;

  // ── Return list data ─────────────────────────────────────────────────────
  const returnBars = useMemo(() =>
    SCHEDULE_BARS
      .filter((b) => b.status === "inUse" || b.status === "returning")
      .sort((a, b) => a.endDay - b.endDay || a.endFrac - b.endFrac),
  []);

  // ── New-form helpers ─────────────────────────────────────────────────────
  const newFormVehicles = useMemo(
    () => [...SCHEDULE_VEHICLES].filter((v) => !newForm.store || v.store === newForm.store),
    [newForm.store]
  );

  function validateNewForm() {
    const e: Record<string, string> = {};
    if (!newForm.customerName.trim()) e.customerName = "氏名は必須です";
    if (newForm.customerType === "corporate" && !newForm.companyName.trim()) e.companyName = "法人名は必須です";
    if (!newForm.store)     e.store     = "店舗を選択してください";
    if (!newForm.vehicleId) e.vehicleId = "車両を選択してください";
    if (!newForm.pickupDate) e.pickupDate = "貸出日は必須です";
    if (!newForm.returnDate) e.returnDate = "返却日は必須です";
    if (newForm.pickupDate && newForm.returnDate && newForm.returnDate < newForm.pickupDate)
      e.returnDate = "返却日は貸出日以降にしてください";
    return e;
  }

  function submitNewReservation() {
    const e = validateNewForm();
    setNewErrors(e);
    if (Object.keys(e).length === 0) setNewSubmitted(true);
  }

  // ── Block-form helpers ───────────────────────────────────────────────────
  function submitBlock() {
    const e: Record<string, string> = {};
    if (!newBlock.vehicleId)  e.vehicleId  = "車両を選択してください";
    if (!newBlock.startDate)  e.startDate  = "開始日は必須です";
    if (!newBlock.endDate)    e.endDate    = "終了日は必須です";
    if (newBlock.startDate && newBlock.endDate && newBlock.endDate < newBlock.startDate)
      e.endDate = "終了日は開始日以降にしてください";
    setBlockErrors(e);
    if (Object.keys(e).length === 0) {
      const v = SCHEDULE_VEHICLES.find((sv) => sv.id === newBlock.vehicleId)!;
      setLocalBlocks((prev) => [
        ...prev,
        { ...newBlock, id: `lb-${Date.now()}` },
      ]);
      setNewBlock({ vehicleId: "", startDate: "2024-05-27", startTime: "09:00", endDate: "2024-05-28", endTime: "18:00", reason: "maintenance" });
      setShowAddBlock(false);
      setBlockErrors({});
    }
  }

  // ── Layout helpers ───────────────────────────────────────────────────────
  const wideCenter = ["new", "block", "return"].includes(viewMode);

  return (
    <AdminShell title={t("anav.reservations")}>
      <div className="mb-4">
        <h2 className="text-xl font-extrabold text-slate-800">{t("res.title")}</h2>
        <p className="text-sm text-slate-500">{t("res.subtitle")}</p>
      </div>

      <div className={cn("grid gap-5", wideCenter ? "xl:grid-cols-[210px_1fr]" : "xl:grid-cols-[210px_1fr_300px]")}>

        {/* ══ Left col ══════════════════════════════════════════════════════ */}
        <div className="space-y-4">
          {/* Side nav */}
          <Card className="p-2">
            {SIDE_NAV.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.key}
                  onClick={() => setViewMode(item.mode)}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                    viewMode === item.mode
                      ? "bg-brand-50 text-brand-700"
                      : "text-slate-600 hover:bg-slate-50"
                  )}
                >
                  <Icon className="h-[18px] w-[18px]" />
                  {t(item.key)}
                </button>
              );
            })}
          </Card>

          {/* Quick filter */}
          <Card className="space-y-3 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-slate-700">{t("res.quickFilter")}</p>
              {hasActiveFilter && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-[10px] font-bold text-white">
                  {activeFilterCount}
                </span>
              )}
            </div>

            <FilterSelect label={t("res.store")} value={storeFilter} onChange={(v) => { setStoreFilter(v); setVehicleFilter("all"); }}>
              <option value="all">{t("res.allStores")}</option>
              {SCHEDULE_STORES.map((s) => <option key={s} value={s}>{s}</option>)}
            </FilterSelect>

            <FilterSelect label={t("res.category")} value={categoryFilter} onChange={setCategoryFilter}>
              <option value="all">{t("type.all")}</option>
              <option value="luxury">{t("type.luxury")}</option>
              <option value="minivan">{t("type.minivan")}</option>
              <option value="suv">{t("type.suv")}</option>
            </FilterSelect>

            <FilterSelect label={t("res.vehicle")} value={vehicleFilter} onChange={setVehicleFilter}>
              <option value="all">{t("type.all")}</option>
              {vehicleMatches.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
            </FilterSelect>

            <FilterSelect label={t("res.status")} value={statusFilter} onChange={(v) => setStatusFilter(v as ScheduleStatus | "all")}>
              <option value="all">{t("type.all")}</option>
              <option value="confirmed">{t("vstatus.available")}</option>
              <option value="inUse">{t("vstatus.inUse")}</option>
              <option value="returning">{t("vstatus.reserved")}</option>
              <option value="reserved">VIP</option>
              <option value="maintenance">{t("vstatus.maintenance")}</option>
            </FilterSelect>

            {/* Period toggle */}
            <div>
              <span className="mb-1 block text-xs font-medium text-slate-500">{t("res.displayPeriod")}</span>
              <div className="flex rounded-lg ring-1 ring-slate-200 overflow-hidden">
                {PERIOD_TABS.map((p, i) => (
                  <button
                    key={p.value}
                    onClick={() => setPeriod(p.value)}
                    className={cn(
                      "flex-1 py-1.5 text-xs font-bold transition-colors",
                      period === p.value ? "bg-brand-600 text-white" : "text-slate-500 hover:bg-slate-50"
                    )}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
              {period === "day" && (
                <p className="mt-1 text-[10px] text-slate-400">5/20（月）の予約を表示中</p>
              )}
              {period === "month" && (
                <p className="mt-1 text-[10px] text-slate-400">デモデータは1週間分です</p>
              )}
            </div>

            <button
              onClick={clearFilters}
              disabled={!hasActiveFilter}
              className={cn(
                "flex w-full items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-medium ring-1 ring-slate-200 transition-colors",
                hasActiveFilter ? "text-brand-600 hover:bg-brand-50" : "cursor-not-allowed text-slate-300"
              )}
            >
              <RotateCcw className="h-3.5 w-3.5" /> {t("res.clearFilter")}
            </button>
          </Card>
        </div>

        {/* ══ Center col ════════════════════════════════════════════════════ */}
        <div className="min-w-0">

          {/* ── Calendar view ──────────────────────────────────────────── */}
          {viewMode === "calendar" && (
            <Card className="p-5">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="flex items-center rounded-lg ring-1 ring-slate-200">
                    <button className="px-2 py-1.5 text-slate-400 hover:text-slate-600"><ChevronLeft className="h-4 w-4" /></button>
                    <button className="border-x border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600">{t("common.today")}</button>
                    <button className="px-2 py-1.5 text-slate-400 hover:text-slate-600"><ChevronRight className="h-4 w-4" /></button>
                  </div>
                  <span className="hidden text-sm font-medium text-slate-600 sm:inline">2024年5月20日 (月) 〜 5月26日 (日)</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode("list")}
                    className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-500 ring-1 ring-slate-200 hover:bg-slate-50"
                  >
                    <List className="h-3.5 w-3.5" /> {t("res.listView")}
                  </button>
                  <button className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-500 ring-1 ring-slate-200 hover:bg-slate-50">
                    <Filter className="h-3.5 w-3.5" /> {t("common.filter")}
                    {hasActiveFilter && (
                      <span className="ml-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-600 text-[9px] font-bold text-white">{activeFilterCount}</span>
                    )}
                  </button>
                  <Button onClick={() => setViewMode("new")} className="px-3 py-1.5 text-xs">
                    <Plus className="h-3.5 w-3.5" /> {t("res.new")}
                  </Button>
                </div>
              </div>

              {allFilteredBars.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                  <Car className="mb-3 h-10 w-10 opacity-30" />
                  <p className="text-sm font-medium">該当する予約がありません</p>
                  <button onClick={clearFilters} className="mt-3 text-xs text-brand-600 hover:underline">フィルターをクリア</button>
                </div>
              ) : (
                <>
                  <div className="rounded-xl ring-1 ring-slate-100">
                    <ScheduleGantt onSelect={setSelectedId} selectedBarId={selectedId} showStatusBadge vehicles={ganttVehicles} bars={allFilteredBars} />
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
                </>
              )}
            </Card>
          )}

          {/* ── List view ──────────────────────────────────────────────── */}
          {viewMode === "list" && (
            <Card className="p-5">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-bold text-slate-800">{t("res.list")} ({allFilteredBars.length}件)</h3>
                <div className="flex gap-2">
                  <button onClick={() => setViewMode("calendar")} className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-500 ring-1 ring-slate-200 hover:bg-slate-50">
                    <CalendarDays className="h-3.5 w-3.5" /> カレンダー
                  </button>
                  <Button onClick={() => setViewMode("new")} className="px-3 py-1.5 text-xs">
                    <Plus className="h-3.5 w-3.5" /> {t("res.new")}
                  </Button>
                </div>
              </div>

              {allFilteredBars.length === 0 ? (
                <div className="py-16 text-center text-slate-400">
                  <p className="text-sm">該当する予約がありません</p>
                  <button onClick={clearFilters} className="mt-2 text-xs text-brand-600 hover:underline">フィルターをクリア</button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 text-left text-xs font-bold text-slate-400">
                        <th className="pb-2 pr-4">予約ID</th>
                        <th className="pb-2 pr-4">顧客名</th>
                        <th className="pb-2 pr-4">車両</th>
                        <th className="pb-2 pr-4">店舗</th>
                        <th className="pb-2 pr-4">貸出日時</th>
                        <th className="pb-2 pr-4">返却日時</th>
                        <th className="pb-2">ステータス</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allFilteredBars.map((b) => {
                        const sv = SCHEDULE_VEHICLES.find((v) => v.id === b.vehicleId);
                        const [pickup, ret] = b.timeLabel.split(" - ");
                        const bdg = STATUS_BADGE[b.status];
                        return (
                          <tr
                            key={b.id}
                            onClick={() => setSelectedId(b.id)}
                            className={cn(
                              "cursor-pointer border-b border-slate-50 transition-colors hover:bg-slate-50",
                              selectedId === b.id && "bg-brand-50"
                            )}
                          >
                            <td className="py-2.5 pr-4 font-mono text-xs text-slate-400">{resId(b)}</td>
                            <td className="py-2.5 pr-4 font-medium text-slate-700">{b.label}</td>
                            <td className="py-2.5 pr-4 text-slate-500">{sv?.name ?? "—"}</td>
                            <td className="py-2.5 pr-4 text-slate-500">{sv?.store ?? "—"}</td>
                            <td className="py-2.5 pr-4 text-slate-500">{pickup ?? "—"}</td>
                            <td className="py-2.5 pr-4 text-slate-500">{ret ?? "—"}</td>
                            <td className="py-2.5">
                              <Badge tone={bdg.tone === "violet" ? "purple" : bdg.tone}>{t(bdg.key)}</Badge>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          )}

          {/* ── New reservation ────────────────────────────────────────── */}
          {viewMode === "new" && (
            <Card className="p-6">
              <div className="mb-5 flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-800">新規予約登録</h3>
                <button onClick={() => setViewMode("calendar")} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>
              </div>

              {newSubmitted ? (
                <div className="flex flex-col items-center py-16 text-center">
                  <CheckCircle2 className="mb-4 h-16 w-16 text-emerald-500" />
                  <h4 className="mb-2 text-lg font-bold text-slate-800">予約を登録しました</h4>
                  <p className="mb-1 text-sm text-slate-500">
                    {newForm.customerType === "corporate" ? newForm.companyName : newForm.customerName} 様の予約が完了しました。
                  </p>
                  <p className="mb-6 font-mono text-xs text-slate-400">ID: RES-2024-{String(Math.floor(Math.random() * 900) + 100)}</p>
                  <Button onClick={() => { setNewSubmitted(false); setNewForm({ ...newForm, customerName: "", companyName: "", phone: "", vehicleId: "" }); }}>
                    続けて登録する
                  </Button>
                  <button onClick={() => setViewMode("list")} className="mt-3 text-sm text-slate-500 hover:underline">予約一覧へ戻る</button>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2">
                  {/* 顧客情報 */}
                  <div className="space-y-4">
                    <h4 className="border-b border-slate-100 pb-2 text-xs font-bold uppercase tracking-wider text-slate-400">顧客情報</h4>

                    <div className="flex gap-3">
                      {(["individual", "corporate"] as const).map((type) => (
                        <label key={type} className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
                          <input
                            type="radio"
                            name="customerType"
                            value={type}
                            checked={newForm.customerType === type}
                            onChange={() => setNewForm((f) => ({ ...f, customerType: type, companyName: "" }))}
                            className="accent-brand-600"
                          />
                          {type === "individual" ? "個人" : "法人"}
                        </label>
                      ))}
                    </div>

                    {newForm.customerType === "corporate" && (
                      <FormField label="法人名 *" error={newErrors.companyName}>
                        <input value={newForm.companyName} onChange={(e) => setNewForm((f) => ({ ...f, companyName: e.target.value }))} placeholder="株式会社〇〇" className={inputCls(!!newErrors.companyName)} />
                      </FormField>
                    )}

                    <FormField label="氏名 *" error={newErrors.customerName}>
                      <input value={newForm.customerName} onChange={(e) => setNewForm((f) => ({ ...f, customerName: e.target.value }))} placeholder="山田 太郎" className={inputCls(!!newErrors.customerName)} />
                    </FormField>

                    <FormField label="電話番号">
                      <input value={newForm.phone} onChange={(e) => setNewForm((f) => ({ ...f, phone: e.target.value }))} placeholder="090-0000-0000" className={inputCls()} />
                    </FormField>
                  </div>

                  {/* 貸出内容 */}
                  <div className="space-y-4">
                    <h4 className="border-b border-slate-100 pb-2 text-xs font-bold uppercase tracking-wider text-slate-400">貸出内容</h4>

                    <FormField label="店舗 *" error={newErrors.store}>
                      <select
                        value={newForm.store}
                        onChange={(e) => setNewForm((f) => ({ ...f, store: e.target.value, vehicleId: "" }))}
                        className={inputCls(!!newErrors.store) + " appearance-none"}
                      >
                        <option value="">店舗を選択</option>
                        {SCHEDULE_STORES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </FormField>

                    <FormField label="車両 *" error={newErrors.vehicleId}>
                      <select
                        value={newForm.vehicleId}
                        onChange={(e) => setNewForm((f) => ({ ...f, vehicleId: e.target.value }))}
                        disabled={!newForm.store}
                        className={inputCls(!!newErrors.vehicleId) + " appearance-none disabled:opacity-50"}
                      >
                        <option value="">{newForm.store ? "車両を選択" : "先に店舗を選択"}</option>
                        {newFormVehicles.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
                      </select>
                    </FormField>

                    <div className="grid grid-cols-2 gap-3">
                      <FormField label="貸出日 *" error={newErrors.pickupDate}>
                        <input type="date" value={newForm.pickupDate} onChange={(e) => setNewForm((f) => ({ ...f, pickupDate: e.target.value }))} className={inputCls(!!newErrors.pickupDate)} />
                      </FormField>
                      <FormField label="貸出時刻">
                        <select value={newForm.pickupTime} onChange={(e) => setNewForm((f) => ({ ...f, pickupTime: e.target.value }))} className={inputCls() + " appearance-none"}>
                          {["08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00"].map((h) => <option key={h}>{h}</option>)}
                        </select>
                      </FormField>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <FormField label="返却日 *" error={newErrors.returnDate}>
                        <input type="date" value={newForm.returnDate} onChange={(e) => setNewForm((f) => ({ ...f, returnDate: e.target.value }))} className={inputCls(!!newErrors.returnDate)} />
                      </FormField>
                      <FormField label="返却時刻">
                        <select value={newForm.returnTime} onChange={(e) => setNewForm((f) => ({ ...f, returnTime: e.target.value }))} className={inputCls() + " appearance-none"}>
                          {["08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00"].map((h) => <option key={h}>{h}</option>)}
                        </select>
                      </FormField>
                    </div>
                  </div>

                  {/* Options + notes (full width) */}
                  <div className="space-y-4 md:col-span-2">
                    <h4 className="border-b border-slate-100 pb-2 text-xs font-bold uppercase tracking-wider text-slate-400">オプション</h4>
                    <div className="flex flex-wrap gap-4">
                      {(["childSeat", "etc", "navigation"] as const).map((opt) => (
                        <label key={opt} className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
                          <input type="checkbox" checked={newForm[opt]} onChange={(e) => setNewForm((f) => ({ ...f, [opt]: e.target.checked }))} className="accent-brand-600" />
                          {{ childSeat: "チャイルドシート", etc: "ETC車載器", navigation: "カーナビ（ポータブル）" }[opt]}
                        </label>
                      ))}
                    </div>

                    <FormField label="備考">
                      <textarea value={newForm.notes} onChange={(e) => setNewForm((f) => ({ ...f, notes: e.target.value }))} rows={3} placeholder="フライト番号・要望など" className={inputCls() + " resize-none"} />
                    </FormField>

                    <div className="flex justify-end gap-3 pt-2">
                      <Button variant="outline" onClick={() => setViewMode("calendar")}>キャンセル</Button>
                      <Button onClick={submitNewReservation}>予約を登録する</Button>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          )}

          {/* ── Block management ───────────────────────────────────────── */}
          {viewMode === "block" && (
            <div className="space-y-4">
              <Card className="p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-bold text-slate-800">ブロック管理</h3>
                  <Button onClick={() => { setShowAddBlock((s) => !s); setBlockErrors({}); }} className="px-3 py-1.5 text-xs">
                    {showAddBlock ? <><X className="h-3.5 w-3.5" /> 閉じる</> : <><Plus className="h-3.5 w-3.5" /> ブロック追加</>}
                  </Button>
                </div>

                {showAddBlock && (
                  <div className="mb-5 rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
                    <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-500">新規ブロック</h4>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <FormField label="車両 *" error={blockErrors.vehicleId}>
                        <select value={newBlock.vehicleId} onChange={(e) => setNewBlock((b) => ({ ...b, vehicleId: e.target.value }))} className={inputCls(!!blockErrors.vehicleId) + " appearance-none"}>
                          <option value="">車両を選択</option>
                          {SCHEDULE_VEHICLES.map((v) => <option key={v.id} value={v.id}>{v.name} ({v.store})</option>)}
                        </select>
                      </FormField>

                      <FormField label="理由">
                        <select value={newBlock.reason} onChange={(e) => setNewBlock((b) => ({ ...b, reason: e.target.value as BlockReason }))} className={inputCls() + " appearance-none"}>
                          {Object.entries(BLOCK_REASON_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                        </select>
                      </FormField>

                      <FormField label="開始日時 *" error={blockErrors.startDate}>
                        <div className="flex gap-2">
                          <input type="date" value={newBlock.startDate} onChange={(e) => setNewBlock((b) => ({ ...b, startDate: e.target.value }))} className={inputCls(!!blockErrors.startDate) + " flex-1"} />
                          <select value={newBlock.startTime} onChange={(e) => setNewBlock((b) => ({ ...b, startTime: e.target.value }))} className={inputCls() + " w-24 appearance-none"}>
                            {["08:00","09:00","10:00","12:00","14:00","18:00"].map((h) => <option key={h}>{h}</option>)}
                          </select>
                        </div>
                      </FormField>

                      <FormField label="終了日時 *" error={blockErrors.endDate}>
                        <div className="flex gap-2">
                          <input type="date" value={newBlock.endDate} onChange={(e) => setNewBlock((b) => ({ ...b, endDate: e.target.value }))} className={inputCls(!!blockErrors.endDate) + " flex-1"} />
                          <select value={newBlock.endTime} onChange={(e) => setNewBlock((b) => ({ ...b, endTime: e.target.value }))} className={inputCls() + " w-24 appearance-none"}>
                            {["08:00","09:00","10:00","12:00","14:00","18:00"].map((h) => <option key={h}>{h}</option>)}
                          </select>
                        </div>
                      </FormField>
                    </div>
                    <div className="mt-4 flex justify-end gap-3">
                      <Button variant="outline" onClick={() => { setShowAddBlock(false); setBlockErrors({}); }}>キャンセル</Button>
                      <Button onClick={submitBlock}>ブロックを追加</Button>
                    </div>
                  </div>
                )}

                {/* Existing blocks (from mock data) */}
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">現在のブロック</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 text-left text-xs font-bold text-slate-400">
                        <th className="pb-2 pr-4">車両</th>
                        <th className="pb-2 pr-4">店舗</th>
                        <th className="pb-2 pr-4">期間</th>
                        <th className="pb-2 pr-4">理由</th>
                        <th className="pb-2">操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Fixed maintenance blocks from mock data */}
                      {SCHEDULE_BARS.filter((b) => b.status === "maintenance").map((b) => {
                        const sv = SCHEDULE_VEHICLES.find((v) => v.id === b.vehicleId)!;
                        return (
                          <tr key={b.id} className="border-b border-slate-50">
                            <td className="py-2.5 pr-4 font-medium text-slate-700">{sv.name}</td>
                            <td className="py-2.5 pr-4 text-slate-500">{sv.store}</td>
                            <td className="py-2.5 pr-4 text-slate-500">{b.timeLabel}</td>
                            <td className="py-2.5 pr-4"><span className="rounded bg-violet-50 px-2 py-0.5 text-[11px] font-medium text-violet-700">定期整備</span></td>
                            <td className="py-2.5"><span className="text-xs text-slate-300">固定</span></td>
                          </tr>
                        );
                      })}
                      {/* Locally added blocks */}
                      {localBlocks.map((lb) => {
                        const sv = SCHEDULE_VEHICLES.find((v) => v.id === lb.vehicleId)!;
                        return (
                          <tr key={lb.id} className="border-b border-slate-50">
                            <td className="py-2.5 pr-4 font-medium text-slate-700">{sv?.name ?? "—"}</td>
                            <td className="py-2.5 pr-4 text-slate-500">{sv?.store ?? "—"}</td>
                            <td className="py-2.5 pr-4 text-slate-500">{lb.startDate} {lb.startTime} 〜 {lb.endDate} {lb.endTime}</td>
                            <td className="py-2.5 pr-4"><span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">{BLOCK_REASON_LABEL[lb.reason]}</span></td>
                            <td className="py-2.5">
                              <button onClick={() => setLocalBlocks((prev) => prev.filter((b) => b.id !== lb.id))} className="text-rose-400 hover:text-rose-600">
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                      {SCHEDULE_BARS.filter((b) => b.status === "maintenance").length === 0 && localBlocks.length === 0 && (
                        <tr><td colSpan={5} className="py-8 text-center text-sm text-slate-400">ブロックなし</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {/* ── Return list ─────────────────────────────────────────────── */}
          {viewMode === "return" && (
            <div className="space-y-4">
              {/* Summary */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "本日返却",   count: returnBars.filter((b) => b.endDay === 0).length, icon: AlertTriangle, color: "text-rose-500 bg-rose-50" },
                  { label: "明日返却",   count: returnBars.filter((b) => b.endDay === 1).length, icon: Clock,         color: "text-amber-500 bg-amber-50" },
                  { label: "今週合計",   count: returnBars.length,                                icon: CheckCircle2,  color: "text-slate-500 bg-slate-50" },
                ].map((s) => (
                  <Card key={s.label} className="flex items-center gap-3 p-4">
                    <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", s.color)}>
                      <s.icon className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-xl font-extrabold text-slate-800">{s.count}<span className="ml-1 text-sm font-medium text-slate-400">件</span></p>
                      <p className="text-xs text-slate-500">{s.label}</p>
                    </div>
                  </Card>
                ))}
              </div>

              <Card className="p-5">
                <h3 className="mb-4 font-bold text-slate-800">返却予定一覧</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 text-left text-xs font-bold text-slate-400">
                        <th className="pb-2 pr-4">予約ID</th>
                        <th className="pb-2 pr-4">顧客名</th>
                        <th className="pb-2 pr-4">車両</th>
                        <th className="pb-2 pr-4">店舗</th>
                        <th className="pb-2 pr-4">返却予定日時</th>
                        <th className="pb-2">状況</th>
                      </tr>
                    </thead>
                    <tbody>
                      {returnBars.map((b) => {
                        const sv = SCHEDULE_VEHICLES.find((v) => v.id === b.vehicleId)!;
                        const isToday    = b.endDay === 0;
                        const isTomorrow = b.endDay === 1;
                        return (
                          <tr key={b.id} className={cn("border-b border-slate-50 transition-colors hover:bg-slate-50", isToday && "bg-rose-50/40")}>
                            <td className="py-2.5 pr-4 font-mono text-xs text-slate-400">{resId(b)}</td>
                            <td className="py-2.5 pr-4 font-medium text-slate-700">{b.label}</td>
                            <td className="py-2.5 pr-4 text-slate-500">{sv?.name ?? "—"}</td>
                            <td className="py-2.5 pr-4 text-slate-500">{sv?.store ?? "—"}</td>
                            <td className="py-2.5 pr-4 text-slate-500">
                              {WEEK_DATE_LABELS[b.endDay]} {Math.round(b.endFrac * 24).toString().padStart(2,"0")}:00
                            </td>
                            <td className="py-2.5">
                              {isToday ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-0.5 text-[11px] font-bold text-rose-600">
                                  <AlertTriangle className="h-3 w-3" /> 本日返却
                                </span>
                              ) : isTomorrow ? (
                                <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-bold text-amber-600">明日返却</span>
                              ) : (
                                <Badge tone="blue">{t("vstatus.inUse")}</Badge>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}
        </div>

        {/* ══ Right col — detail panel (calendar + list only) ═══════════ */}
        {!wideCenter && (
          <Card className="h-fit p-5">
            <div className="mb-3">
              <h3 className="font-bold text-slate-800">{t("res.detail")}</h3>
            </div>

            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="font-mono text-sm text-slate-500">{resId(bar)}</span>
              <Badge tone={badge.tone === "violet" ? "purple" : badge.tone}>{t(badge.key)}</Badge>
            </div>

            <div className="flex items-center gap-2 py-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100">
                {isCorporate ? <Building2 className="h-4 w-4 text-slate-500" /> : <MapPin className="h-4 w-4 text-slate-500" />}
              </span>
              <span className="font-bold text-slate-700">
                {bar.label} 様
                {isCorporate && (
                  <span className="ml-2 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-500">{t("res.corporate")}</span>
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
                  <p className="text-[11px] text-slate-400">{vehicle.store}</p>
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
                  <dd className="font-medium text-slate-700">{vehicle.store}</dd>
                </div>
              </dl>
            </div>

            <div className="border-t border-slate-100 py-3 text-sm">
              <p className="mb-2 text-xs font-medium text-slate-400">{t("res.priceInfo")}</p>
              <dl className="space-y-1.5">
                <div className="flex justify-between">
                  <dt className="text-slate-400">{t("summary.base")}（{days}{t("summary.days")}）</dt>
                  <dd className="font-medium text-slate-700">{jpy(base)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-400">{t("res.option")}</dt>
                  <dd className="font-medium text-slate-700">{jpy(2200)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-400">{t("res.cdw")}</dt>
                  <dd className="font-medium text-slate-700">{jpy(2200)}</dd>
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
              <Button variant="danger"  className="w-full">{t("res.cancel")}</Button>
            </div>
          </Card>
        )}
      </div>
    </AdminShell>
  );
}
