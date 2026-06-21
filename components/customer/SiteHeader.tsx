"use client";

import Link from "next/link";
import { Car, User, ChevronDown } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

const NAV: { key: string; href: string }[] = [
  { key: "cnav.home", href: "/" },
  { key: "cnav.vehicles", href: "/search" },
  { key: "cnav.guide", href: "/search" },
  { key: "cnav.pricing", href: "/search" },
  { key: "cnav.stores", href: "/search" },
  { key: "cnav.contact", href: "/search" },
];

export function SiteHeader({ active = "cnav.vehicles" }: { active?: string }) {
  const { t } = useI18n();
  return (
    <header className="sticky top-0 z-40 bg-navy-900 text-white">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-6 px-5">
        <Link href="/search" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600">
            <Car className="h-5 w-5" />
          </span>
          <span className="leading-tight">
            <span className="block text-lg font-extrabold">Rentacar Pro</span>
            <span className="block text-[10px] tracking-wide text-slate-300">
              {t("brand.tagline.site")}
            </span>
          </span>
        </Link>

        <nav className="ml-4 hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={
                "rounded-lg px-3 py-2 text-sm font-medium transition-colors " +
                (item.key === active
                  ? "text-white"
                  : "text-slate-300 hover:text-white")
              }
            >
              <span className="relative">
                {t(item.key)}
                {item.key === active && (
                  <span className="absolute -bottom-[18px] left-0 right-0 h-0.5 rounded bg-brand-500" />
                )}
              </span>
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <LanguageSwitcher dark />
          <button className="hidden items-center gap-1 rounded-lg px-2.5 py-1.5 text-sm text-slate-200 hover:bg-white/10 sm:inline-flex">
            JPY (¥)
            <ChevronDown className="h-3.5 w-3.5 opacity-70" />
          </button>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
            <User className="h-4.5 w-4.5" />
          </span>
        </div>
      </div>
    </header>
  );
}
