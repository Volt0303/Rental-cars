"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Users,
  Settings2,
  Fuel,
  Zap,
  Calendar,
  Shield,
  ShieldCheck,
  Navigation,
  CreditCard,
  Baby,
  Disc,
  Check,
  ArrowRight,
  ArrowLeft,
  MessageSquare,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useBooking } from "@/lib/booking-context";
import { SiteHeader } from "@/components/customer/SiteHeader";
import { BookingSteps } from "@/components/customer/BookingSteps";
import { BookingSummary } from "@/components/customer/BookingSummary";
import { CarThumb } from "@/components/CarThumb";
import { Card, Button } from "@/components/ui/primitives";
import { INSURANCE_OPTIONS, ADDITIONAL_OPTIONS } from "@/lib/mock-data";
import { jpy, cn } from "@/lib/utils";

const OPT_ICON: Record<string, React.ElementType> = {
  carNavi: Navigation,
  etc: CreditCard,
  childSeat: Baby,
  juniorSeat: Baby,
  babySeat: Baby,
  snowTire: Disc,
};

export default function OptionsPage() {
  const { t } = useI18n();
  const router = useRouter();
  const b = useBooking();

  return (
    <div className="min-h-screen">
      <SiteHeader active="cnav.vehicles" />
      <BookingSteps current={1} />

      <div className="mx-auto max-w-[1400px] px-5 py-6">
        <div className="mb-5">
          <h1 className="text-2xl font-extrabold text-slate-800">{t("options.title")}</h1>
          <p className="text-sm text-slate-500">{t("options.subtitle")}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="space-y-5">
            {/* Vehicle banner */}
            <Card className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
              <CarThumb accent={b.vehicle.accent} src={b.vehicle.image} className="h-24 w-full shrink-0 sm:w-40" iconClassName="h-10 w-10" />
              <div className="flex-1">
                <h2 className="text-lg font-bold text-slate-800">{b.vehicle.name}</h2>
                <p className="text-sm text-slate-500">{b.vehicle.nameJa}</p>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600">
                  <span className="inline-flex items-center gap-1">
                    <Users className="h-3.5 w-3.5 text-slate-400" />
                    {b.vehicle.seats}
                    {t("spec.seats")}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Settings2 className="h-3.5 w-3.5 text-slate-400" />
                    {t("spec.auto")}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    {b.vehicle.fuel === "ev" ? (
                      <Zap className="h-3.5 w-3.5 text-slate-400" />
                    ) : (
                      <Fuel className="h-3.5 w-3.5 text-slate-400" />
                    )}
                    {b.vehicle.fuel === "ev" ? "EV" : b.vehicle.fuel === "diesel" ? t("spec.diesel") : t("spec.gas")}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm sm:w-72">
                <div>
                  <p className="text-xs text-slate-400">{t("summary.pickupDateTime")}</p>
                  <p className="inline-flex items-center gap-1 font-medium text-slate-700">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    {b.pickup.date} {b.pickup.time}
                  </p>
                  <p className="text-xs text-slate-400">{b.pickup.store}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">{t("summary.returnDateTime")}</p>
                  <p className="inline-flex items-center gap-1 font-medium text-slate-700">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    {b.dropoff.date} {b.dropoff.time}
                  </p>
                  <p className="text-xs text-slate-400">{b.dropoff.store}</p>
                </div>
              </div>
            </Card>

            {/* Insurance */}
            <Card className="p-5">
              <h3 className="mb-3 flex items-center gap-2 font-bold text-slate-800">
                <Shield className="h-5 w-5 text-caramel-500" /> {t("options.insurance")}
              </h3>
              <div className="space-y-3">
                {INSURANCE_OPTIONS.map((opt) => {
                  const active = b.insuranceId === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => b.setInsuranceId(active ? null : opt.id)}
                      className={cn(
                        "flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition-colors",
                        active
                          ? "border-caramel-400 bg-caramel-400/10 ring-1 ring-caramel-400"
                          : "border-slate-200 hover:bg-slate-50"
                      )}
                    >
                      <span
                        className={cn(
                          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border",
                          active ? "border-caramel-500 bg-caramel-500 text-white" : "border-slate-300"
                        )}
                      >
                        {active && <Check className="h-3.5 w-3.5" />}
                      </span>
                      <ShieldCheck className={cn("mt-0.5 h-5 w-5 shrink-0", active ? "text-caramel-500" : "text-slate-400")} />
                      <div className="flex-1">
                        <p className="flex items-center gap-2 font-bold text-slate-800">
                          {t(opt.nameKey)}
                          {opt.recommended && (
                            <span className="rounded bg-emerald-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                              {t("search.recommended")}
                            </span>
                          )}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-500">{t(opt.descKey)}</p>
                        <span className="mt-1 block text-xs text-caramel-500 hover:underline cursor-pointer">
                          {t("options.coverageDetail")}
                        </span>
                      </div>
                      <span className="shrink-0 font-bold text-slate-800">
                        {jpy(opt.price)}
                        <span className="text-xs font-normal text-slate-400">{t("options.perDay")}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </Card>

            {/* Additional options */}
            <Card className="p-5">
              <h3 className="mb-3 font-bold text-slate-800">{t("options.additional")}</h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {ADDITIONAL_OPTIONS.map((opt) => {
                  const Icon = OPT_ICON[opt.id];
                  const active = b.options.includes(opt.id);
                  return (
                    <button
                      key={opt.id}
                      onClick={() => b.toggleOption(opt.id)}
                      className={cn(
                        "flex items-start gap-3 rounded-2xl border p-3.5 text-left transition-colors",
                        active
                          ? "border-caramel-400 bg-caramel-400/10 ring-1 ring-caramel-400"
                          : "border-slate-200 hover:bg-slate-50"
                      )}
                    >
                      <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", active ? "text-caramel-500" : "text-slate-400")} />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-slate-800">{t(opt.nameKey)}</p>
                        <p className="text-[11px] text-slate-500">{t(opt.descKey)}</p>
                        <p className="mt-1 text-xs font-bold text-slate-700">
                          {jpy(opt.price)}
                          <span className="font-normal text-slate-400">{t("options.perDay")}</span>
                        </p>
                      </div>
                      <span
                        className={cn(
                          "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border",
                          active ? "border-caramel-500 bg-caramel-500 text-white" : "border-slate-300"
                        )}
                      >
                        {active && <Check className="h-3.5 w-3.5" />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </Card>

            {/* Remarks */}
            <Card className="p-5">
              <h3 className="mb-2 flex items-center gap-2 font-bold text-slate-800">
                <MessageSquare className="h-5 w-5 text-caramel-500" /> {t("options.remarks")}
                <span className="text-xs font-normal text-slate-400">（{t("options.optional")}）</span>
              </h3>
              <textarea
                value={b.remarks}
                onChange={(e) => b.setRemarks(e.target.value)}
                maxLength={300}
                rows={3}
                placeholder={t("options.remarksPlaceholder")}
                className="w-full resize-none rounded-xl bg-slate-50 p-3 text-sm text-slate-700 ring-1 ring-slate-200 outline-none focus:ring-caramel-400"
              />
              <p className="mt-1 text-right text-xs text-slate-400">{b.remarks.length} / 300</p>
            </Card>

            <div className="flex items-center justify-between gap-3">
              <Link href="/search">
                <Button variant="outline">
                  <ArrowLeft className="h-4 w-4" /> {t("common.back")}
                </Button>
              </Link>
              <Button className="px-6" onClick={() => router.push("/booking/info")}>
                {t("options.toInfo")} <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:sticky lg:top-20 lg:self-start">
            <BookingSummary changeHref="/search" showHelp />
          </div>
        </div>
      </div>
    </div>
  );
}
