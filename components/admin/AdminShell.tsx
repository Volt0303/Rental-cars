"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  FileText,
  Car,
  Wrench,
  Users,
  Files,
  TrendingUp,
  BarChart3,
  Settings,
  SlidersHorizontal,
  Bell,
  ChevronDown,
  ChevronsLeft,
  ExternalLink,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { CompassCarLogo } from "@/components/CompassCarLogo";
import { cn } from "@/lib/utils";

const NAV = [
  { key: "anav.dashboard", href: "/admin", icon: LayoutDashboard },
  { key: "anav.reservations", href: "/admin/reservations", icon: CalendarDays },
  { key: "anav.quotations", href: "/admin/quotations", icon: FileText },
  { key: "anav.vehicles", href: "/admin/vehicles", icon: Car },
  { key: "anav.maintenance", href: "/admin/maintenance", icon: Wrench },
  { key: "anav.customers", href: "/admin/customers", icon: Users },
  { key: "anav.documents", href: "/admin/documents", icon: Files },
  { key: "anav.sales", href: "/admin/sales", icon: TrendingUp },
  { key: "anav.reports", href: "/admin/reports", icon: BarChart3 },
  { key: "anav.settings", href: "/admin/settings", icon: Settings },
  { key: "anav.systemSettings", href: "/admin/system", icon: SlidersHorizontal },
];

export function AdminShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const { t } = useI18n();
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-[#f4f7fe]">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-60 flex-col bg-navy-900 text-slate-300 lg:flex">
        <div className="flex h-16 items-center px-4">
          <CompassCarLogo />
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-3 scrollbar-thin">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.key}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-brand-600 text-white shadow-sm"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon className="h-[18px] w-[18px]" />
                {t(item.key)}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 px-3 py-3">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-400 hover:bg-white/5 hover:text-white"
          >
            <ExternalLink className="h-[18px] w-[18px]" />
            {t("anav.backToSite")}
          </Link>
          <button className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-400 hover:bg-white/5 hover:text-white">
            <ChevronsLeft className="h-[18px] w-[18px]" />
            {t("anav.collapse")}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col lg:pl-60">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-slate-200 bg-white/90 px-5 backdrop-blur">
          <h1 className="text-lg font-bold text-slate-800">{title}</h1>
          <div className="ml-auto flex items-center gap-2">
            <LanguageSwitcher />
            <button className="relative flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100">
              <Bell className="h-5 w-5" />
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                5
              </span>
            </button>
            <div className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 hover:bg-slate-100">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
                YS
              </span>
              <span className="hidden leading-tight sm:block">
                <span className="block text-sm font-bold text-slate-700">
                  山田 太郎
                </span>
                <span className="block text-[10px] text-slate-400">
                  {t("anav.owner")}
                </span>
              </span>
              <ChevronDown className="hidden h-4 w-4 text-slate-400 sm:block" />
            </div>
          </div>
        </header>

        <main className="flex-1 p-5">{children}</main>
      </div>
    </div>
  );
}
