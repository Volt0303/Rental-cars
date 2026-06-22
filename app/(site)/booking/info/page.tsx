"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  IdCard,
  MapPin,
  ArrowRight,
  ArrowLeft,
  CreditCard,
  Banknote,
  ShieldCheck,
  Check,
} from "lucide-react";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { SiteHeader } from "@/components/customer/SiteHeader";
import { BookingSteps } from "@/components/customer/BookingSteps";
import { BookingSummary } from "@/components/customer/BookingSummary";
import { Card, Button } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

function Input({
  label,
  required,
  defaultValue,
  disabled,
  type = "text",
}: {
  label: string;
  required?: boolean;
  defaultValue?: string;
  disabled?: boolean;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-slate-600">
        {label} {required && <span className="text-rose-500">*</span>}
      </span>
      <input
        type={type}
        defaultValue={defaultValue}
        disabled={disabled}
        className={cn(
          "w-full rounded-xl px-3 py-2.5 text-sm ring-1 outline-none focus:ring-2 focus:ring-caramel-400",
          disabled
            ? "bg-slate-100 text-slate-400 ring-slate-200"
            : "bg-white text-slate-700 ring-slate-300"
        )}
      />
    </label>
  );
}

function Select({
  label,
  required,
  value,
}: {
  label: string;
  required?: boolean;
  value: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-slate-600">
        {label} {required && <span className="text-rose-500">*</span>}
      </span>
      <div className="flex items-center justify-between rounded-xl bg-white px-3 py-2.5 text-sm text-slate-700 ring-1 ring-slate-300">
        {value}
        <span className="text-slate-400">▾</span>
      </div>
    </label>
  );
}

function Section({
  icon: Icon,
  title,
  action,
  children,
}: {
  icon: React.ElementType;
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Card className="p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-bold text-slate-800">
          <Icon className="h-5 w-5 text-caramel-500" /> {title}
        </h3>
        {action}
      </div>
      <div className="grid gap-4 sm:grid-cols-3">{children}</div>
    </Card>
  );
}

export default function InfoPage() {
  const { t } = useI18n();
  const router = useRouter();
  const [sameAsBooker, setSameAsBooker] = useState(true);

  return (
    <div className="min-h-screen">
      <SiteHeader active="cnav.vehicles" />
      <BookingSteps current={2} />

      <div className="mx-auto max-w-[1400px] px-5 py-6">
        <div className="mb-5">
          <h1 className="text-2xl font-extrabold text-slate-800">{t("info.title")}</h1>
          <p className="text-sm text-slate-500">{t("info.subtitle")}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="space-y-5">
            <Section icon={User} title={t("info.bookerSection")}>
              <Input label={t("info.nameKanji")} required defaultValue="山田 太郎" />
              <Input label={t("info.nameRomaji")} required defaultValue="Taro Yamada" />
              <Input label={t("info.email")} required defaultValue="taro.yamada@example.com" />
              <Input label={t("info.phone")} required defaultValue="080-1234-5678" />
              <Select label={t("info.nationality")} required value="日本 (Japan)" />
              <Select label={t("info.langPref")} required value="日本語" />
            </Section>

            <Section
              icon={IdCard}
              title={t("info.driverSection")}
              action={
                <label className="flex items-center gap-2 text-xs font-medium text-slate-600">
                  <button
                    onClick={() => setSameAsBooker((v) => !v)}
                    className={cn(
                      "flex h-5 w-5 items-center justify-center rounded-md border",
                      sameAsBooker ? "border-caramel-500 bg-caramel-500 text-white" : "border-slate-300"
                    )}
                  >
                    {sameAsBooker && <Check className="h-3.5 w-3.5" />}
                  </button>
                  {t("info.sameAsBooker")}
                </label>
              }
            >
              <Input label={t("info.driverNameKanji")} required defaultValue="山田 太郎" disabled={sameAsBooker} />
              <Input label={t("info.driverNameRomaji")} required defaultValue="Taro Yamada" />
              <Input label={t("info.birthday")} required defaultValue="1990/05/15" />
              <Input label={t("info.licenseNo")} required defaultValue="123456789012" />
              <Select label={t("info.licenseCountry")} required value="日本 (Japan)" />
              <Input label={t("info.licenseIssued")} required defaultValue="2010/06/01" />
            </Section>

            <Section icon={MapPin} title={t("info.pickupSection")}>
              <Select label={t("info.purpose")} required value={t("info.purposeTour")} />
              <Input label={t("info.flight")} defaultValue="JL123 / 2024/06/15 08:30" />
              <Input label={t("info.arrival")} defaultValue="2024/06/15 09:30" />
              <label className="block sm:col-span-3">
                <span className="mb-1 block text-xs font-medium text-slate-600">
                  {t("info.otherRequest")}
                </span>
                <textarea
                  rows={3}
                  maxLength={300}
                  placeholder={t("info.requestPlaceholder")}
                  className="w-full resize-none rounded-xl bg-white p-3 text-sm text-slate-700 ring-1 ring-slate-300 outline-none focus:ring-2 focus:ring-caramel-400"
                />
              </label>
            </Section>

            <div className="flex items-center justify-between gap-3">
              <Link href="/booking/options">
                <Button variant="outline">
                  <ArrowLeft className="h-4 w-4" /> {t("common.back")}
                </Button>
              </Link>
              <Button className="px-6" onClick={() => router.push("/booking/confirm")}>
                {t("info.toConfirm")} <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-4 lg:sticky lg:top-20 lg:self-start">
            <BookingSummary changeHref="/booking/options" showTax />

            <Card className="p-5">
              <p className="mb-3 text-sm font-bold text-slate-700">{t("info.payMethods")}</p>
              <div className="space-y-2 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-slate-400" />
                  {t("info.creditCard")}
                  <span className="ml-auto flex gap-1">
                    {["VISA", "MC", "JCB", "AMEX"].map((c) => (
                      <span key={c} className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold text-slate-500">
                        {c}
                      </span>
                    ))}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-bold text-[#003087]">Pay</span>
                  <span className="-ml-1 text-[13px] font-bold text-[#009cde]">Pal</span>
                  <span className="text-slate-600">PayPal</span>
                </div>
                <div className="flex items-center gap-2">
                  <Banknote className="h-4 w-4 text-slate-400" />
                  {t("info.bankTransfer")}
                </div>
              </div>
            </Card>

            <Card className="p-5">
              <p className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-700">
                <ShieldCheck className="h-5 w-5 text-emerald-500" /> {t("info.safety")}
              </p>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500" /> {t("info.ssl")}
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500" /> {t("info.privacy")}
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
