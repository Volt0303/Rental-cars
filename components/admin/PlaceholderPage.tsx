"use client";

import { Hammer, Check } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { AdminShell } from "@/components/admin/AdminShell";
import { Card } from "@/components/ui/primitives";

export function PlaceholderPage({
  titleKey,
  features,
}: {
  titleKey: string;
  features: string[];
}) {
  const { t } = useI18n();
  return (
    <AdminShell title={t(titleKey)}>
      <div className="mx-auto max-w-2xl py-10">
        <Card className="p-8 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
            <Hammer className="h-7 w-7" />
          </span>
          <h2 className="mt-5 text-xl font-extrabold text-slate-800">{t("ph.title")}</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">{t("ph.desc")}</p>

          <ul className="mx-auto mt-6 max-w-sm space-y-2 text-left">
            {features.map((f) => (
              <li
                key={f}
                className="flex items-center gap-3 rounded-xl bg-slate-50/70 px-4 py-2.5 text-sm text-slate-600"
              >
                <Check className="h-4 w-4 shrink-0 text-emerald-500" />
                {f}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </AdminShell>
  );
}
