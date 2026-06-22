"use client";

import Link from "next/link";
import { ShieldCheck, Phone, Mail } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useBooking } from "@/lib/booking-context";
import { CarThumb } from "@/components/CarThumb";
import { Card } from "@/components/ui/primitives";
import { jpy } from "@/lib/utils";
import {
  INSURANCE_OPTIONS,
  ADDITIONAL_OPTIONS,
} from "@/lib/mock-data";

export function BookingSummary({
  changeHref,
  showTax = false,
  showHelp = false,
}: {
  changeHref?: string;
  showTax?: boolean;
  showHelp?: boolean;
}) {
  const { t } = useI18n();
  const b = useBooking();

  const lineItems = [
    {
      label: `${t("summary.base")}（${b.rentalDays}${t("summary.days")}）`,
      value: b.base,
    },
    ...(b.insuranceId
      ? [
          {
            label: t(
              INSURANCE_OPTIONS.find((o) => o.id === b.insuranceId)!.nameKey
            ),
            value: b.insuranceCost,
          },
        ]
      : []),
    ...b.options.map((id) => {
      const opt = ADDITIONAL_OPTIONS.find((o) => o.id === id)!;
      return { label: t(opt.nameKey), value: opt.price * b.rentalDays };
    }),
  ];

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5">
          <h3 className="font-bold text-slate-800">{t("summary.title")}</h3>
          {changeHref && (
            <Link
              href={changeHref}
              className="text-xs font-bold text-brand-600 hover:underline"
            >
              {t("summary.change")}
            </Link>
          )}
        </div>

        <div className="flex gap-3 px-5 py-4">
          <CarThumb accent={b.vehicle.accent} src={b.vehicle.image} className="h-14 w-20 shrink-0" iconClassName="h-7 w-7" />
          <div className="min-w-0">
            <p className="truncate font-bold text-slate-800">{b.vehicle.name}</p>
            <p className="truncate text-xs text-slate-500">{b.vehicle.nameJa}</p>
          </div>
        </div>

        <dl className="space-y-2.5 px-5 pb-4 text-sm">
          <div>
            <dt className="text-xs text-slate-400">{t("summary.pickupDateTime")}</dt>
            <dd className="font-medium text-slate-700">
              {b.pickup.date}（土） {b.pickup.time}
              <span className="block text-xs text-slate-400">{b.pickup.store}</span>
            </dd>
          </div>
          <div>
            <dt className="text-xs text-slate-400">{t("summary.returnDateTime")}</dt>
            <dd className="font-medium text-slate-700">
              {b.dropoff.date}（月） {b.dropoff.time}
              <span className="block text-xs text-slate-400">{b.dropoff.store}</span>
            </dd>
          </div>
          <div>
            <dt className="text-xs text-slate-400">{t("summary.rentalDays")}</dt>
            <dd className="font-medium text-slate-700">
              {b.rentalDays}
              {t("summary.days")}
            </dd>
          </div>
        </dl>

        <div className="space-y-2 border-t border-slate-100 px-5 py-4 text-sm">
          {lineItems.map((item, i) => (
            <div key={i} className="flex justify-between">
              <span className="text-slate-500">{item.label}</span>
              <span className="font-medium text-slate-700">
                {item.value === 0 ? "¥ 0" : jpy(item.value)}
              </span>
            </div>
          ))}
          <div className="flex justify-between border-t border-slate-100 pt-2">
            <span className="font-bold text-slate-600">{t("summary.subtotal")}</span>
            <span className="font-bold text-slate-800">{jpy(b.subtotal)}</span>
          </div>
          {showTax && (
            <div className="flex justify-between">
              <span className="text-slate-500">{t("summary.tax")}</span>
              <span className="font-medium text-slate-700">{jpy(b.tax)}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between bg-brand-50 px-5 py-3.5">
          <span className="font-bold text-slate-700">{t("summary.total")}</span>
          <span className="text-2xl font-extrabold text-brand-600">
            {jpy(showTax ? b.total : b.subtotal)}
          </span>
        </div>

        <div className="flex items-center gap-2 border-t border-emerald-100 bg-emerald-50/60 px-5 py-3">
          <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-600" />
          <span className="leading-tight">
            <span className="block text-xs font-bold text-emerald-700">
              {t("summary.freeCancel")}
            </span>
            <span className="block text-[11px] text-emerald-600">
              {t("summary.freeCancelDesc")}
            </span>
          </span>
        </div>
      </Card>

      {showHelp && (
        <Card className="p-5">
          <p className="text-sm font-bold text-slate-700">{t("search.help")}</p>
          <p className="mb-3 text-xs text-slate-400">{t("search.helpDesc")}</p>
          <div className="space-y-2">
            <a className="flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold text-brand-600 ring-1 ring-brand-200 hover:bg-brand-50">
              <Phone className="h-4 w-4" /> 03-1234-5678
            </a>
            <a className="flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50">
              <Mail className="h-4 w-4" /> {t("search.inquiryForm")}
            </a>
          </div>
        </Card>
      )}
    </div>
  );
}
