"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Car, User, IdCard, SlidersHorizontal, ArrowLeft, Check } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useBooking } from "@/lib/booking-context";
import { SiteHeader } from "@/components/customer/SiteHeader";
import { BookingSteps } from "@/components/customer/BookingSteps";
import { BookingSummary } from "@/components/customer/BookingSummary";
import { Card, Button } from "@/components/ui/primitives";
import { INSURANCE_OPTIONS, ADDITIONAL_OPTIONS } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 py-1.5 text-sm">
      <dt className="text-slate-400">{label}</dt>
      <dd className="text-right font-medium text-slate-700">{value}</dd>
    </div>
  );
}

function Block({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="p-5">
      <h3 className="mb-2 flex items-center gap-2 font-bold text-slate-800">
        <Icon className="h-5 w-5 text-brand-600" /> {title}
      </h3>
      <dl className="divide-y divide-slate-100">{children}</dl>
    </Card>
  );
}

export default function ConfirmPage() {
  const { t } = useI18n();
  const router = useRouter();
  const b = useBooking();
  const [agreed, setAgreed] = useState(true);

  const optionNames = [
    ...(b.insuranceId
      ? [t(INSURANCE_OPTIONS.find((o) => o.id === b.insuranceId)!.nameKey)]
      : []),
    ...b.options.map((id) => t(ADDITIONAL_OPTIONS.find((o) => o.id === id)!.nameKey)),
  ];

  return (
    <div className="min-h-screen">
      <SiteHeader active="cnav.vehicles" />
      <BookingSteps current={3} />

      <div className="mx-auto max-w-[1400px] px-5 py-6">
        <div className="mb-5">
          <h1 className="text-2xl font-extrabold text-slate-800">{t("confirm.title")}</h1>
          <p className="text-sm text-slate-500">{t("confirm.subtitle")}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="space-y-5">
            <Block icon={Car} title={t("confirm.vehicle")}>
              <Row label={t("dash.col.vehicle")} value={`${b.vehicle.name}（${b.vehicle.nameJa}）`} />
              <Row label={t("summary.pickupDateTime")} value={`${b.pickup.date} ${b.pickup.time} / ${b.pickup.store}`} />
              <Row label={t("summary.returnDateTime")} value={`${b.dropoff.date} ${b.dropoff.time} / ${b.dropoff.store}`} />
            </Block>

            <Block icon={User} title={t("confirm.booker")}>
              <Row label={t("info.nameKanji")} value="山田 太郎 (Taro Yamada)" />
              <Row label={t("info.email")} value="taro.yamada@example.com" />
              <Row label={t("info.phone")} value="080-1234-5678" />
              <Row label={t("info.nationality")} value="日本 (Japan)" />
            </Block>

            <Block icon={IdCard} title={t("confirm.driver")}>
              <Row label={t("info.driverNameRomaji")} value="Taro Yamada" />
              <Row label={t("info.birthday")} value="1990/05/15" />
              <Row label={t("info.licenseNo")} value="123456789012" />
            </Block>

            <Block icon={SlidersHorizontal} title={t("confirm.options")}>
              <Row label={t("confirm.options")} value={optionNames.join(" / ") || "—"} />
            </Block>

            <Card className="p-5">
              <label className="flex items-start gap-3">
                <button
                  onClick={() => setAgreed((v) => !v)}
                  className={cn(
                    "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border",
                    agreed ? "border-brand-600 bg-brand-600 text-white" : "border-slate-300"
                  )}
                >
                  {agreed && <Check className="h-3.5 w-3.5" />}
                </button>
                <span className="text-sm text-slate-700">{t("confirm.agree")}</span>
              </label>
            </Card>

            <div className="flex items-center justify-between gap-3">
              <Link href="/booking/info">
                <Button variant="outline">
                  <ArrowLeft className="h-4 w-4" /> {t("common.back")}
                </Button>
              </Link>
              <Button
                className="px-6"
                disabled={!agreed}
                onClick={() => router.push("/booking/complete")}
              >
                {t("confirm.submit")}
              </Button>
            </div>
            <p className="text-center text-xs text-slate-400">{t("confirm.demoNote")}</p>
          </div>

          <div className="lg:sticky lg:top-20 lg:self-start">
            <BookingSummary changeHref="/booking/options" showTax />
          </div>
        </div>
      </div>
    </div>
  );
}
