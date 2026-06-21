"use client";

import { useState } from "react";
import {
  Files,
  FileText,
  FileSignature,
  ClipboardCheck,
  ShieldCheck,
  Sparkles,
  Download,
  Eye,
  Check,
  ArrowRight,
  Lightbulb,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { AdminShell } from "@/components/admin/AdminShell";
import { Card, Button, Badge } from "@/components/ui/primitives";
import { DOC_RESERVATION, type DocKind } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const DOC_META: { kind: DocKind; key: string; icon: React.ElementType; tone: string }[] = [
  { kind: "order", key: "docs.order", icon: FileText, tone: "text-blue-500" },
  { kind: "contract", key: "docs.contract", icon: FileSignature, tone: "text-violet-500" },
  { kind: "inspection", key: "docs.inspection", icon: ClipboardCheck, tone: "text-emerald-500" },
  { kind: "consent", key: "docs.consent", icon: ShieldCheck, tone: "text-amber-500" },
];

const SHARED_FIELDS = [
  { key: "docs.field.customer", value: DOC_RESERVATION.customer },
  { key: "docs.field.passport", value: DOC_RESERVATION.passport },
  { key: "docs.field.license", value: DOC_RESERVATION.license },
  { key: "docs.field.vehicle", value: DOC_RESERVATION.vehicle },
  { key: "docs.field.period", value: DOC_RESERVATION.period },
  { key: "docs.field.reservationNo", value: DOC_RESERVATION.no },
];

function DocCard({
  meta,
  generated,
}: {
  meta: (typeof DOC_META)[number];
  generated: boolean;
}) {
  const { t } = useI18n();
  const Icon = meta.icon;
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <span className="flex items-center gap-2 font-bold text-slate-700">
          <Icon className={cn("h-5 w-5", meta.tone)} />
          {t(meta.key)}
        </span>
        {generated && (
          <Badge tone="green">
            <Check className="h-3 w-3" /> {t("docs.generated")}
          </Badge>
        )}
      </div>

      {/* mini preview */}
      <div className="relative p-4">
        <div
          className={cn(
            "space-y-2 rounded-lg bg-white p-3 ring-1 ring-slate-200 transition",
            !generated && "blur-[2px] opacity-50 select-none"
          )}
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
            <span className="text-[11px] font-bold text-slate-700">{t(meta.key)}</span>
            <span className="text-[9px] text-slate-400">{DOC_RESERVATION.no}</span>
          </div>
          {SHARED_FIELDS.slice(0, 4).map((f) => (
            <div key={f.key} className="flex justify-between gap-2 text-[10px]">
              <span className="shrink-0 text-slate-400">{t(f.key)}</span>
              <span className="truncate font-medium text-slate-600">{f.value}</span>
            </div>
          ))}
          <div className="mt-1 h-5 rounded bg-slate-50" />
        </div>
        {!generated && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="rounded-full bg-slate-800/80 px-3 py-1 text-[11px] font-bold text-white">
              {t("docs.autoGenerate")}
            </span>
          </div>
        )}
      </div>

      <div className="flex gap-2 border-t border-slate-100 px-4 py-3">
        <Button variant="outline" className="flex-1 py-2 text-xs" disabled={!generated}>
          <Eye className="h-3.5 w-3.5" /> {t("docs.preview")}
        </Button>
        <Button className="flex-1 py-2 text-xs" disabled={!generated}>
          <Download className="h-3.5 w-3.5" /> {t("docs.download")}
        </Button>
      </div>
    </Card>
  );
}

export default function DocumentsPage() {
  const { t } = useI18n();
  const [generated, setGenerated] = useState(false);

  return (
    <AdminShell title={t("anav.documents")}>
      <div className="mb-4">
        <h2 className="flex items-center gap-2 text-xl font-extrabold text-slate-800">
          <Files className="h-6 w-6 text-brand-600" /> {t("docs.title")}
        </h2>
        <p className="text-sm text-slate-500">{t("docs.subtitle")}</p>
      </div>

      {/* Insight banner */}
      <div className="mb-5 flex items-start gap-3 rounded-2xl bg-brand-50 p-4 ring-1 ring-brand-100">
        <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
        <p className="text-sm text-slate-600">{t("docs.point")}</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[340px_1fr]">
        {/* Shared fields */}
        <div className="space-y-4">
          <Card className="p-5">
            <p className="mb-1 text-xs font-medium text-slate-400">{t("docs.selectReservation")}</p>
            <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2.5 text-sm font-bold text-slate-700 ring-1 ring-slate-200">
              {DOC_RESERVATION.no} / {DOC_RESERVATION.customer.split(" / ")[0]}
              <span className="text-slate-400">▾</span>
            </div>

            <p className="mb-2 mt-4 text-xs font-bold text-slate-600">{t("docs.sharedFields")}</p>
            <dl className="space-y-2">
              {SHARED_FIELDS.map((f) => (
                <div key={f.key} className="rounded-lg bg-slate-50/70 px-3 py-2">
                  <dt className="text-[11px] text-slate-400">{t(f.key)}</dt>
                  <dd className="text-sm font-medium text-slate-700">{f.value}</dd>
                </div>
              ))}
            </dl>

            <Button
              className="mt-4 w-full"
              onClick={() => setGenerated(true)}
              disabled={generated}
            >
              {generated ? (
                <>
                  <Check className="h-4 w-4" /> {t("docs.generated")}
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" /> {t("docs.autoGenerate")}
                </>
              )}
            </Button>
          </Card>

          {/* flow hint */}
          <Card className="flex items-center justify-center gap-2 p-4 text-xs font-medium text-slate-500">
            <span className="rounded-md bg-slate-100 px-2 py-1">{t("step.info")}</span>
            <ArrowRight className="h-3.5 w-3.5 text-brand-500" />
            <span className="rounded-md bg-brand-100 px-2 py-1 text-brand-700">4 {t("anav.documents")}</span>
          </Card>
        </div>

        {/* Generated docs */}
        <div className="grid gap-4 sm:grid-cols-2">
          {DOC_META.map((meta) => (
            <DocCard key={meta.kind} meta={meta} generated={generated} />
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
