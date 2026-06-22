"use client";

import { Search, SlidersHorizontal, User, FileText, CheckCircle2, Lock } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const STEPS = [
  { key: "step.search", icon: Search },
  { key: "step.options", icon: SlidersHorizontal },
  { key: "step.info", icon: User },
  { key: "step.confirm", icon: FileText },
  { key: "step.complete", icon: CheckCircle2 },
];

export function BookingSteps({ current }: { current: number }) {
  const { t } = useI18n();
  return (
    <div className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-[1400px] items-center gap-3 px-5 py-3.5">
        <div className="flex flex-1 items-center">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            const done = i < current;
            const active = i === current;
            return (
              <div key={step.key} className="flex flex-1 items-center last:flex-none">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold",
                      active
                        ? "bg-caramel-500 text-white"
                        : done
                        ? "bg-caramel-400/20 text-caramel-500"
                        : "bg-slate-100 text-slate-400"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span
                    className={cn(
                      "whitespace-nowrap text-sm font-bold",
                      active
                        ? "text-caramel-500"
                        : done
                        ? "text-slate-600"
                        : "text-slate-400"
                    )}
                  >
                    {i + 1}. {t(step.key)}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={cn(
                      "mx-3 h-px flex-1",
                      done ? "bg-caramel-400/40" : "bg-beige-300"
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>
        <div className="ml-3 hidden items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 ring-1 ring-emerald-200 xl:flex">
          <Lock className="h-4 w-4 text-emerald-600" />
          <span className="leading-tight">
            <span className="block text-xs font-bold text-emerald-700">
              {t("secure.title")}
            </span>
            <span className="block text-[10px] text-emerald-600">
              {t("secure.desc")}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
