"use client";

import Link from "next/link";
import { LayoutDashboard, ArrowRight, Car } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { CompassCarLogo } from "@/components/CompassCarLogo";

export default function LandingPage() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-navy-900 text-white">
      <header className="mx-auto flex h-16 max-w-6xl items-center px-5">
        <CompassCarLogo />
        <div className="ml-auto">
          <LanguageSwitcher dark />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 pb-20 pt-10 sm:pt-20">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="mt-6 text-3xl font-extrabold leading-tight sm:text-5xl">
            {t("landing.title")}
          </h1>

        </div>

        <div className="mx-auto mt-12 grid max-w-3xl gap-5 sm:grid-cols-2">
          <Link
            href="/search"
            className="group rounded-3xl bg-white/5 p-7 ring-1 ring-white/10 transition-colors hover:bg-white/10"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600">
              <Car className="h-6 w-6" />
            </span>
            <h2 className="mt-5 text-xl font-bold">{t("landing.customer.title")}</h2>
            <p className="mt-2 text-sm text-slate-300">{t("landing.customer.desc")}</p>
            <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-brand-300 group-hover:gap-2.5">
              {t("landing.enter")} <ArrowRight className="h-4 w-4 transition-all" />
            </span>
          </Link>

          <Link
            href="/admin"
            className="group rounded-3xl bg-white/5 p-7 ring-1 ring-white/10 transition-colors hover:bg-white/10"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500">
              <LayoutDashboard className="h-6 w-6" />
            </span>
            <h2 className="mt-5 text-xl font-bold">{t("landing.admin.title")}</h2>
            <p className="mt-2 text-sm text-slate-300">{t("landing.admin.desc")}</p>
            <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-emerald-300 group-hover:gap-2.5">
              {t("landing.enter")} <ArrowRight className="h-4 w-4 transition-all" />
            </span>
          </Link>
        </div>


      </main>
    </div>
  );
}
