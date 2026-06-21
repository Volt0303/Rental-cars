"use client";

import Link from "next/link";
import { CheckCircle2, Mail, MessageCircle, FileSignature, Home } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useBooking } from "@/lib/booking-context";
import { SiteHeader } from "@/components/customer/SiteHeader";
import { BookingSteps } from "@/components/customer/BookingSteps";
import { Card, Button } from "@/components/ui/primitives";

export default function CompletePage() {
  const { t } = useI18n();
  const b = useBooking();

  const steps = [
    { icon: Mail, text: t("complete.next1") },
    { icon: MessageCircle, text: t("complete.next2") },
    { icon: FileSignature, text: t("complete.next3") },
  ];

  return (
    <div className="min-h-screen">
      <SiteHeader active="cnav.vehicles" />
      <BookingSteps current={4} />

      <div className="mx-auto max-w-xl px-5 py-12">
        <Card className="p-8 text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle2 className="h-9 w-9 text-emerald-600" />
          </span>
          <h1 className="mt-5 text-2xl font-extrabold text-slate-800">{t("complete.title")}</h1>
          <p className="mt-2 text-sm text-slate-500">{t("complete.subtitle")}</p>

          <div className="mt-5 rounded-2xl bg-brand-50 px-5 py-4">
            <p className="text-xs text-slate-500">{t("complete.reservationNo")}</p>
            <p className="text-2xl font-extrabold tracking-wide text-brand-600">
              {b.reservationNo}
            </p>
          </div>

          <div className="mt-6 text-left">
            <p className="mb-3 font-bold text-slate-700">{t("complete.nextTitle")}</p>
            <ul className="space-y-3">
              {steps.map((s, i) => {
                const Icon = s.icon;
                return (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-brand-600">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="pt-1.5 text-sm text-slate-600">{s.text}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="mt-7 space-y-2">
            <a className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3 text-sm font-bold text-white hover:opacity-90">
              <MessageCircle className="h-4 w-4" /> {t("complete.contactWhatsApp")}
            </a>
            <Link href="/">
              <Button variant="outline" className="w-full">
                <Home className="h-4 w-4" /> {t("complete.backHome")}
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
