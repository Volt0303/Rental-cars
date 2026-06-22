"use client";

import { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Calendar,
  Clock,
  Search,
  Users,
  Heart,
  Info,
  ArrowRight,
  X,
  Car,
  Bus,
  Truck,
  Crown,
  Gauge,
  Fuel,
  Settings2,
  Headphones,
  ShieldCheck,
  Zap,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useBooking } from "@/lib/booking-context";
import { SiteHeader } from "@/components/customer/SiteHeader";
import { BookingSteps } from "@/components/customer/BookingSteps";
import { CarThumb } from "@/components/CarThumb";
import { Card, Button, Badge } from "@/components/ui/primitives";
import { SEARCH_VEHICLES, type Vehicle } from "@/lib/mock-data";
import { jpy, cn } from "@/lib/utils";

// ---- Constants ----

const STORES = ["成田空港店", "羽田空港店", "新宿店", "渋谷店", "横浜店", "大阪店", "名古屋店"];
const TIMES  = ["06:00","07:00","08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00"];
const PASSENGER_OPTIONS = [
  { label: "指定なし", value: "all" },
  { label: "2名以上",  value: "2" },
  { label: "4名以上",  value: "4" },
  { label: "6名以上",  value: "6" },
  { label: "8名以上",  value: "8" },
  { label: "10名以上", value: "10" },
];
const PER_PAGE = 8;

const TYPES = [
  { id: "all",     icon: Car,   labelKey: "type.all" },
  { id: "compact", icon: Car,   labelKey: "type.compact" },
  { id: "minivan", icon: Bus,   labelKey: "type.minivan" },
  { id: "suv",     icon: Truck, labelKey: "type.suv" },
  { id: "wagon",   icon: Car,   labelKey: "type.wagon" },
  { id: "luxury",  icon: Crown, labelKey: "type.luxury" },
];

const FEATURE_LABEL: Record<string, string> = {
  carNavi:    "カーナビ",
  etc:        "ETC",
  backCamera: "バックカメラ",
  bluetooth:  "Bluetooth",
};

// ---- Sub-components ----

function SelectField({
  label,
  icon: Icon,
  value,
  onChange,
  children,
}: {
  label?: string;
  icon: React.ElementType;
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      {label && <span className="mb-1 block text-xs font-medium text-slate-500">{label}</span>}
      <span className="flex items-center gap-2 rounded-xl bg-beige-50 px-3 py-2.5 ring-1 ring-beige-200 transition-shadow focus-within:ring-caramel-400">
        <Icon className="h-4 w-4 shrink-0 text-slate-400" />
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 cursor-pointer bg-transparent text-sm text-slate-700 outline-none"
        >
          {children}
        </select>
        <ChevronDown className="h-4 w-4 shrink-0 pointer-events-none text-slate-400" />
      </span>
    </label>
  );
}

function DateTimeRow({
  label,
  dateValue,
  onDateChange,
  timeValue,
  onTimeChange,
}: {
  label: string;
  dateValue: string;
  onDateChange: (v: string) => void;
  timeValue: string;
  onTimeChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-slate-500">{label}</span>
      <span className="flex items-center gap-2 rounded-xl bg-beige-50 px-3 py-2.5 ring-1 ring-beige-200 transition-shadow focus-within:ring-caramel-400">
        <Calendar className="h-4 w-4 shrink-0 text-slate-400" />
        <input
          type="date"
          value={dateValue}
          onChange={(e) => onDateChange(e.target.value)}
          className="min-w-0 flex-1 bg-transparent text-sm text-slate-700 outline-none"
        />
        <Clock className="h-3.5 w-3.5 shrink-0 text-slate-400" />
        <select
          value={timeValue}
          onChange={(e) => onTimeChange(e.target.value)}
          className="cursor-pointer bg-transparent text-sm text-slate-700 outline-none"
        >
          {TIMES.map((t) => <option key={t}>{t}</option>)}
        </select>
      </span>
    </label>
  );
}

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="h-32 w-full shrink-0 rounded-xl bg-slate-200 sm:w-48" />
        <div className="flex-1 space-y-3 py-1">
          <div className="h-5 w-2/3 rounded bg-slate-200" />
          <div className="h-3 w-1/3 rounded bg-slate-100" />
          <div className="flex gap-3">
            <div className="h-3 w-16 rounded bg-slate-100" />
            <div className="h-3 w-16 rounded bg-slate-100" />
            <div className="h-3 w-12 rounded bg-slate-100" />
          </div>
          <div className="flex gap-2 pt-1">
            <div className="h-5 w-16 rounded bg-slate-100" />
            <div className="h-5 w-16 rounded bg-slate-100" />
            <div className="h-5 w-20 rounded bg-slate-100" />
          </div>
          <div className="h-4 w-28 rounded bg-slate-100" />
        </div>
        <div className="hidden sm:flex sm:w-44 sm:shrink-0 sm:flex-col sm:gap-3">
          <div className="h-4 w-full rounded bg-slate-100" />
          <div className="h-8 w-full rounded-xl bg-slate-200" />
          <div className="h-9 w-full rounded-xl bg-caramel-400/20" />
          <div className="h-9 w-full rounded-xl bg-slate-100" />
        </div>
      </div>
    </div>
  );
}

function SkeletonList() {
  return (
    <div className="space-y-4">
      {[0, 1, 2, 3].map((i) => <SkeletonCard key={i} />)}
    </div>
  );
}

function Pagination({
  page,
  total,
  onChange,
}: {
  page: number;
  total: number;
  onChange: (p: number) => void;
}) {
  const [input, setInput] = useState(String(page));
  const [error, setError] = useState(false);

  // Keep input in sync when page changes via prev/next/page-button clicks
  useEffect(() => {
    setInput(String(page));
    setError(false);
  }, [page]);

  if (total <= 1) return null;

  const getPages = (): (number | "…")[] => {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const pages: (number | "…")[] = [1];
    if (page > 3) pages.push("…");
    const lo = Math.max(2, page - 1);
    const hi = Math.min(total - 1, page + 1);
    for (let i = lo; i <= hi; i++) pages.push(i);
    if (page < total - 2) pages.push("…");
    pages.push(total);
    return pages;
  };

  const commit = () => {
    const n = parseInt(input, 10);
    if (!isNaN(n) && n >= 1 && n <= total) {
      onChange(n);
      // input is reset by the useEffect that fires when `page` changes
    } else {
      setError(true);
      setTimeout(() => {
        setError(false);
        setInput(String(page)); // revert to current page on invalid entry
      }, 1200);
    }
  };

  return (
    <div className="mt-6 space-y-3">
      {/* Page buttons row */}
      <div className="flex items-center justify-center gap-1">
        <button
          onClick={() => onChange(page - 1)}
          disabled={page === 1}
          className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 ring-1 ring-slate-200 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-30"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {getPages().map((p, i) =>
          p === "…" ? (
            <span key={`e${i}`} className="flex h-9 w-9 items-center justify-center text-sm text-slate-400">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onChange(p as number)}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-xl text-sm font-medium transition-colors",
                p === page
                  ? "bg-caramel-500 text-white shadow-sm"
                  : "text-warm-700 ring-1 ring-beige-200 hover:bg-beige-50"
              )}
            >
              {p}
            </button>
          )
        )}

        <button
          onClick={() => onChange(page + 1)}
          disabled={page === total}
          className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 ring-1 ring-slate-200 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-30"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Jump-to-page row */}
      <div className="flex items-center justify-center gap-2 text-sm">
        <span className="text-slate-400">ページへ移動:</span>
        <input
          type="text"
          inputMode="numeric"
          value={input}
          onChange={(e) => {
            setError(false);
            setInput(e.target.value.replace(/[^0-9]/g, ""));
          }}
          onKeyDown={(e) => e.key === "Enter" && commit()}
          onFocus={(e) => e.target.select()}
          className={cn(
            "w-14 rounded-lg px-2 py-1.5 text-center text-sm font-medium outline-none ring-1 transition-colors",
            error
              ? "ring-rose-400 bg-rose-50 text-rose-600"
              : "ring-beige-200 bg-beige-50 text-warm-700 focus:ring-caramel-400"
          )}
        />
        <span className="text-slate-400">/ {total}</span>
        <button
          onClick={commit}
          className="rounded-lg bg-beige-200 px-3 py-1.5 text-sm font-medium text-warm-700 hover:bg-beige-300 active:bg-beige-300 transition-colors"
        >
          移動
        </button>
        {error && (
          <span className="text-xs text-rose-500">1〜{total} を入力してください</span>
        )}
      </div>
    </div>
  );
}

// ---- Vehicle detail modal ----

function VehicleDetailModal({
  vehicle,
  onClose,
  onSelect,
}: {
  vehicle: Vehicle;
  onClose: () => void;
  onSelect: () => void;
}) {
  const { t } = useI18n();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const fuelLabel =
    vehicle.fuel === "ev" ? "EV" :
    vehicle.fuel === "diesel" ? t("spec.diesel") :
    t("spec.gas");

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-end justify-center bg-black/50 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 className="font-extrabold text-slate-800">{t("search.vehicleDetail")}</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Image */}
        <div className="px-5 pt-5">
          <CarThumb
            accent={vehicle.accent}
            src={vehicle.image}
            className="h-52 w-full rounded-xl"
          />
        </div>

        {/* Info */}
        <div className="px-5 py-4">
          <div className="flex items-start justify-between">
            <div>
              {vehicle.recommended && (
                <span className="mb-1.5 inline-block rounded-md bg-emerald-500 px-2 py-0.5 text-[11px] font-bold text-white">
                  {t("search.recommended")}
                </span>
              )}
              <h3 className="text-xl font-extrabold text-slate-800">{vehicle.name}</h3>
              <p className="text-sm text-slate-500">{vehicle.nameJa}</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] text-slate-400">{t("search.basePrice")}（2{t("search.days")}）</p>
              <p className="text-2xl font-extrabold text-slate-800">
                {jpy(vehicle.basePrice2Days)}
                <span className="ml-1 text-xs font-normal text-slate-400">（税込）</span>
              </p>
            </div>
          </div>

          {/* Specs */}
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-slate-600">
            <span className="flex items-center gap-1.5">
              <Users className="h-4 w-4 text-slate-400" />
              {vehicle.seats}{t("spec.seats")}
            </span>
            <span className="flex items-center gap-1.5">
              <Settings2 className="h-4 w-4 text-slate-400" />
              {t("spec.auto")}
            </span>
            <span className="flex items-center gap-1.5">
              {vehicle.fuel === "ev"
                ? <Zap className="h-4 w-4 text-slate-400" />
                : <Fuel className="h-4 w-4 text-slate-400" />}
              {fuelLabel}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-slate-400" />
              {vehicle.store}
            </span>
          </div>

          {/* Features */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {vehicle.features.map((f) => (
              <span
                key={f}
                className="rounded-md bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600"
              >
                {FEATURE_LABEL[f] ?? f}
              </span>
            ))}
          </div>

          {/* Availability */}
          <div className="mt-3">
            {vehicle.stockNote === "last" ? (
              <span className="inline-flex items-center gap-1.5">
                <Badge tone="orange">{t("search.lastOne")}</Badge>
                <span className="text-xs text-slate-500">{t("search.bookEarly")}</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5">
                <Badge tone="green">{t("common.available")}</Badge>
                <span className="text-xs text-slate-500">{t("common.instantBook")}</span>
              </span>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2 border-t border-slate-100 px-5 py-4">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
          >
            {t("common.back")}
          </button>
          <Button className="flex-1" onClick={onSelect}>
            {t("common.select")} <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ---- Vehicle card ----

function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const { t } = useI18n();
  const router = useRouter();
  const { setVehicleId } = useBooking();
  const [showDetail, setShowDetail] = useState(false);

  const select = () => {
    setVehicleId(vehicle.id);
    router.push("/booking/options");
  };

  return (
    <>
    <Card className="relative p-4">
      {vehicle.recommended && (
        <span className="absolute left-4 top-4 z-10 rounded-md bg-emerald-500 px-2 py-0.5 text-[11px] font-bold text-white">
          {t("search.recommended")}
        </span>
      )}
      <div className="flex flex-col gap-4 sm:flex-row">
        <CarThumb accent={vehicle.accent} src={vehicle.image} className="h-32 w-full shrink-0 sm:w-48" iconClassName="h-12 w-12" />

        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-bold text-slate-800">{vehicle.name}</h3>
          <p className="text-sm text-slate-500">{vehicle.nameJa}</p>

          <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
            <span className="inline-flex items-center gap-1">
              <Users className="h-3.5 w-3.5 text-slate-400" />
              {vehicle.seats}{t("spec.seats")}
            </span>
            <span className="inline-flex items-center gap-1">
              <Settings2 className="h-3.5 w-3.5 text-slate-400" />
              {t("spec.auto")}
            </span>
            <span className="inline-flex items-center gap-1">
              {vehicle.fuel === "ev" ? (
                <Zap className="h-3.5 w-3.5 text-slate-400" />
              ) : (
                <Fuel className="h-3.5 w-3.5 text-slate-400" />
              )}
              {vehicle.fuel === "ev" ? "EV" : vehicle.fuel === "diesel" ? t("spec.diesel") : t("spec.gas")}
            </span>
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {vehicle.features.map((f) => (
              <span key={f} className="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-600">
                {FEATURE_LABEL[f] ?? f}
              </span>
            ))}
          </div>

          <div className="mt-3">
            {vehicle.stockNote === "last" ? (
              <span className="inline-flex items-center gap-1.5">
                <Badge tone="orange">{t("search.lastOne")}</Badge>
                <span className="text-xs text-slate-500">{t("search.bookEarly")}</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5">
                <Badge tone="green">{t("common.available")}</Badge>
                <span className="text-xs text-slate-500">{t("common.instantBook")}</span>
              </span>
            )}
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-end justify-between gap-3 sm:w-44">
          <button className="text-slate-300 hover:text-rose-400">
            <Heart className="h-5 w-5" />
          </button>
          <div className="text-right">
            <p className="text-xs text-slate-400">
              {t("search.basePrice")}（2{t("search.days")}）
            </p>
            <p className="text-2xl font-extrabold text-slate-800">
              {jpy(vehicle.basePrice2Days)}
              <span className="ml-1 text-xs font-normal text-slate-400">（税込）</span>
            </p>
            <span className="mt-0.5 block text-xs text-caramel-500 hover:underline cursor-pointer">
              {t("search.priceDetail")}
            </span>
          </div>
          <div className="w-full space-y-2">
            <Button className="w-full" onClick={select}>
              {t("common.select")} <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="w-full" onClick={() => setShowDetail(true)}>
              <Info className="h-4 w-4" /> {t("search.vehicleDetail")}
            </Button>
          </div>
        </div>
      </div>
    </Card>

    {showDetail && (
      <VehicleDetailModal
        vehicle={vehicle}
        onClose={() => setShowDetail(false)}
        onSelect={() => { setShowDetail(false); select(); }}
      />
    )}
    </>
  );
}

// ---- Main page ----

export default function SearchPage() {
  const { t } = useI18n();
  // filter form state
  const [store,      setStore]      = useState("成田空港店");
  const [pickupDate, setPickupDate] = useState("2024-06-15");
  const [pickupTime, setPickupTime] = useState("10:00");
  const [returnDate, setReturnDate] = useState("2024-06-17");
  const [returnTime, setReturnTime] = useState("18:00");
  const [type,       setType]       = useState("all");
  const [passengers, setPassengers] = useState("all");

  // committed (applied) filters
  const [applied, setApplied] = useState({
    store, pickupDate, pickupTime, returnDate, returnTime, type, passengers,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [page,      setPage]      = useState(1);

  const doSearch = () => {
    setIsLoading(true);
    setPage(1);
    setTimeout(() => {
      setApplied({ store, pickupDate, pickupTime, returnDate, returnTime, type, passengers });
      setIsLoading(false);
    }, 900);
  };

  const doClear = () => {
    setStore("成田空港店");
    setPickupDate("2024-06-15");
    setPickupTime("10:00");
    setReturnDate("2024-06-17");
    setReturnTime("18:00");
    setType("all");
    setPassengers("all");
  };

  const goToPage = (p: number) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Deterministic per-vehicle date availability:
  // shifts which ~20% of vehicles are "booked out" as the date changes.
  const isDateAvailable = (vehicleId: string, pickupDate: string): boolean => {
    const catIdx = vehicleId.startsWith("cat-") ? parseInt(vehicleId.slice(4), 10) : -1;
    if (catIdx < 0) return true;
    const day   = parseInt(pickupDate.slice(8, 10), 10);
    const month = parseInt(pickupDate.slice(5, 7),  10);
    return (catIdx * 7 + day + month * 31) % 5 !== 0;
  };

  const filtered = useMemo(() => {
    return SEARCH_VEHICLES.filter((v) => {
      if (!v.available) return false;
      if (v.store !== applied.store) return false;
      if (!isDateAvailable(v.id, applied.pickupDate)) return false;
      if (applied.type !== "all" && v.type !== applied.type) return false;
      if (applied.passengers !== "all" && v.seats < parseInt(applied.passengers)) return false;
      return true;
    });
  }, [applied]);

  const totalPages   = Math.ceil(filtered.length / PER_PAGE);
  const pageVehicles = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const fmtDate      = (d: string) => d.replace(/-/g, "/");

  return (
    <div className="min-h-screen bg-beige-50">
      <SiteHeader active="cnav.vehicles" />
      <BookingSteps current={0} />

      <div className="mx-auto max-w-[1400px] px-5 py-6">
        <div className="mb-5">
          <h1 className="text-2xl font-extrabold text-slate-800">{t("search.title")}</h1>
          <p className="text-sm text-slate-500">{t("search.subtitle")}</p>
        </div>

        {/* ── Results toolbar — full width, above the grid ── */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-slate-600">
            <span className="font-bold text-slate-800">{t("search.results")}: </span>
            <span className="font-extrabold text-caramel-500">{filtered.length}</span>{" "}
            {t("search.found")}
          </p>
          <div className="flex items-center gap-2 text-sm">
            <span className="hidden text-slate-400 sm:inline">{t("search.sort")}:</span>
            <button className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 font-medium text-slate-600 ring-1 ring-slate-200">
              {t("search.sortRecommended")}
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[260px_1fr] xl:grid-cols-[260px_1fr_300px]">

          {/* ── Filter sidebar ── */}
          <Card className="h-fit p-4">
            <div className="mb-3 border-b border-slate-100 pb-3">
              <p className="mb-2.5 text-sm font-bold text-slate-700">{t("search.storeBox")}</p>
              <SelectField label={t("search.pickupStore")} icon={MapPin} value={store} onChange={setStore}>
                {STORES.map((s) => <option key={s}>{s}</option>)}
              </SelectField>
              <label className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                <input type="checkbox" className="accent-caramel-500" />
                {t("search.changeReturn")}
              </label>
            </div>

            <div className="space-y-2.5 border-b border-slate-100 pb-3">
              <DateTimeRow
                label={t("search.pickupDate")}
                dateValue={pickupDate}
                onDateChange={setPickupDate}
                timeValue={pickupTime}
                onTimeChange={setPickupTime}
              />
              <DateTimeRow
                label={t("search.returnDate")}
                dateValue={returnDate}
                onDateChange={setReturnDate}
                timeValue={returnTime}
                onTimeChange={setReturnTime}
              />
            </div>

            <div className="border-b border-slate-100 py-3">
              <p className="mb-2 text-xs font-medium text-slate-500">{t("search.type")}</p>
              <div className="grid grid-cols-3 gap-2">
                {TYPES.map((tp) => {
                  const Icon   = tp.icon;
                  const active = type === tp.id;
                  return (
                    <button
                      key={tp.id}
                      onClick={() => setType(tp.id)}
                      className={cn(
                        "flex flex-col items-center gap-1 rounded-xl px-2 py-2.5 text-[11px] font-medium ring-1 transition-colors",
                        active
                          ? "bg-caramel-500 text-white ring-caramel-500"
                          : "bg-white text-warm-700 ring-beige-200 hover:bg-beige-50"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {t(tp.labelKey)}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="py-3">
              <SelectField label={t("search.passengers")} icon={Users} value={passengers} onChange={setPassengers}>
                {PASSENGER_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </SelectField>
            </div>

            <Button className="w-full" onClick={doSearch}>
              <Search className="h-4 w-4" /> {t("common.search")}
            </Button>
            <Button variant="ghost" className="mt-2 w-full" onClick={doClear}>
              {t("common.clear")}
            </Button>
          </Card>

          {/* ── Results column ── */}
          <div>
            {isLoading ? (
              <SkeletonList />
            ) : filtered.length === 0 ? (
              <Card className="flex flex-col items-center gap-3 py-16 text-center">
                <Car className="h-12 w-12 text-slate-200" />
                <p className="font-bold text-slate-600">条件に合う車両が見つかりませんでした</p>
                <p className="text-sm text-slate-400">絞り込み条件を変更してもう一度お試しください</p>
                <Button variant="outline" onClick={doClear}>条件をリセット</Button>
              </Card>
            ) : (
              <>
                <div className="space-y-4">
                  {pageVehicles.map((v) => <VehicleCard key={v.id} vehicle={v} />)}
                </div>
                <Pagination page={page} total={totalPages} onChange={goToPage} />
                <p className="mt-3 text-center text-xs text-slate-400">
                  {filtered.length} 件中 {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} 件を表示
                </p>
              </>
            )}
          </div>

          {/* ── Right sidebar (xl only) ── */}
          <div className="hidden space-y-4 xl:block">
            <Card className="p-5">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-bold text-slate-800">{t("search.confirmTitle")}</h3>
                <button
                  onClick={doSearch}
                  className="text-xs font-bold text-caramel-500 hover:underline"
                >
                  {t("search.edit")}
                </button>
              </div>
              <dl className="space-y-3 text-sm">
                {[
                  [t("search.pickupStore"),  applied.store],
                  [t("search.returnStore"),  applied.store],
                  [t("search.pickupDate"),   `${fmtDate(applied.pickupDate)} ${applied.pickupTime}`],
                  [t("search.returnDate"),   `${fmtDate(applied.returnDate)} ${applied.returnTime}`],
                  [t("search.passengers"),   PASSENGER_OPTIONS.find((o) => o.value === applied.passengers)?.label ?? "指定なし"],
                  [t("search.type"),         t(TYPES.find((tp) => tp.id === applied.type)?.labelKey ?? "type.all")],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-xs text-slate-400">{k}</dt>
                    <dd className="font-medium text-slate-700">{v}</dd>
                  </div>
                ))}
              </dl>
            </Card>

            <Card className="p-5">
              <p className="text-sm font-bold text-slate-700">{t("search.help")}</p>
              <p className="mb-3 text-xs text-slate-400">{t("search.helpDesc")}</p>
              <div className="space-y-2">
                <a className="flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold text-caramel-500 ring-1 ring-caramel-400/40 hover:bg-caramel-400/10 cursor-pointer">
                  03-1234-5678
                </a>
                <a className="flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50 cursor-pointer">
                  {t("search.inquiryForm")}
                </a>
              </div>
            </Card>

            <Card className="space-y-4 p-5">
              {([
                { icon: Headphones, key: "search.feature1", desc: "search.feature1desc", tone: "text-blue-500" },
                { icon: ShieldCheck, key: "search.feature2", desc: "search.feature2desc", tone: "text-emerald-500" },
                { icon: Gauge, key: "search.feature3", desc: "search.feature3desc", tone: "text-violet-500" },
              ] as const).map((f) => {
                const Icon = f.icon;
                return (
                  <div key={f.key} className="flex items-start gap-3">
                    <Icon className={cn("mt-0.5 h-5 w-5", f.tone)} />
                    <div>
                      <p className="text-sm font-bold text-slate-700">{t(f.key)}</p>
                      <p className="text-xs text-slate-400">{t(f.desc)}</p>
                    </div>
                  </div>
                );
              })}
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}
