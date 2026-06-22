"use client";

import { useState, useMemo } from "react";
import {
  FileText, Search, Send, CheckCircle2, FileDown,
  TrendingUp, Clock, ArrowRight, CalendarClock,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { AdminShell } from "@/components/admin/AdminShell";
import { Card, Button, Badge } from "@/components/ui/primitives";
import {
  QUOTATIONS,
  type Quotation,
  type QuotationStatus,
} from "@/lib/mock-data";
import { jpy, cn } from "@/lib/utils";

const STATUS_META: Record<QuotationStatus, { label: string; tone: "slate" | "blue" | "green" | "orange" | "red" }> = {
  draft:    { label: "下書き",   tone: "slate" },
  sent:     { label: "送付済み", tone: "blue" },
  accepted: { label: "成約",     tone: "green" },
  expired:  { label: "期限切れ", tone: "red" },
};

const FILTERS: { id: QuotationStatus | "all"; label: string }[] = [
  { id: "all",      label: "すべて" },
  { id: "draft",    label: "下書き" },
  { id: "sent",     label: "送付済み" },
  { id: "accepted", label: "成約" },
  { id: "expired",  label: "期限切れ" },
];

function StatCard({
  icon: Icon, label, value, tone,
}: {
  icon: React.ElementType; label: string; value: string | number; tone: string;
}) {
  return (
    <Card className="flex items-center gap-3 p-4">
      <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", tone)}>
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="text-xl font-extrabold text-slate-800">{value}</p>
        <p className="text-xs text-slate-500">{label}</p>
      </div>
    </Card>
  );
}

const subtotalOf = (q: Quotation) => q.items.reduce((s, i) => s + i.amount, 0);
const taxOf = (q: Quotation) => Math.round(subtotalOf(q) * 0.1);
const totalOf = (q: Quotation) => subtotalOf(q) + taxOf(q);

export default function QuotationsPage() {
  const { t } = useI18n();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<QuotationStatus | "all">("all");
  const [selectedId, setSelectedId] = useState(QUOTATIONS[0].id);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return QUOTATIONS.filter((quo) => {
      if (filter !== "all" && quo.status !== filter) return false;
      if (!q) return true;
      return (
        quo.customer.toLowerCase().includes(q) ||
        quo.customerRoman.toLowerCase().includes(q) ||
        quo.vehicle.toLowerCase().includes(q) ||
        quo.id.toLowerCase().includes(q)
      );
    });
  }, [query, filter]);

  const selected: Quotation =
    filtered.find((q) => q.id === selectedId) ?? filtered[0] ?? QUOTATIONS[0];

  const sentCount = QUOTATIONS.filter((q) => q.status === "sent").length;
  const acceptedCount = QUOTATIONS.filter((q) => q.status === "accepted").length;
  const acceptRate = Math.round((acceptedCount / QUOTATIONS.length) * 100);

  return (
    <AdminShell title={t("anav.quotations")}>
      {/* Header */}
      <div className="mb-4">
        <h2 className="flex items-center gap-2 text-xl font-extrabold text-slate-800">
          <FileText className="h-6 w-6 text-caramel-500" /> 見積管理
        </h2>
        <p className="text-sm text-slate-500">見積依頼の一覧・ステータス管理から予約確定までを行います。</p>
      </div>

      {/* Stats */}
      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard icon={FileText}   label="見積依頼総数" value={QUOTATIONS.length} tone="bg-caramel-400/15 text-caramel-500" />
        <StatCard icon={Send}       label="送付済み"     value={sentCount}         tone="bg-sky-50 text-sky-500" />
        <StatCard icon={CheckCircle2} label="成約"        value={acceptedCount}     tone="bg-emerald-50 text-emerald-500" />
        <StatCard icon={TrendingUp} label="成約率"       value={`${acceptRate}%`}  tone="bg-violet-50 text-violet-500" />
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_400px]">
        {/* ── Left: search + filter + list ── */}
        <div className="space-y-3">
          <Card className="flex flex-col gap-3 p-4">
            <span className="flex items-center gap-2 rounded-xl bg-beige-50 px-3 py-2 ring-1 ring-beige-200 focus-within:ring-caramel-400">
              <Search className="h-4 w-4 shrink-0 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="顧客・車両・見積番号で検索"
                className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
              />
            </span>
            <div className="flex flex-wrap gap-1.5">
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-xs font-bold ring-1 transition-colors",
                    filter === f.id
                      ? "bg-caramel-500 text-white ring-caramel-500"
                      : "bg-white text-slate-600 ring-beige-200 hover:bg-beige-50"
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </Card>

          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/60 text-left text-xs font-bold text-slate-400">
                    <th className="px-4 py-2.5">見積番号 / 顧客</th>
                    <th className="px-4 py-2.5">車両</th>
                    <th className="px-4 py-2.5 text-right">見積金額</th>
                    <th className="px-4 py-2.5">状態</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((q) => {
                    const meta = STATUS_META[q.status];
                    const isSel = q.id === selected.id;
                    return (
                      <tr
                        key={q.id}
                        onClick={() => setSelectedId(q.id)}
                        className={cn(
                          "cursor-pointer border-b border-slate-50 transition-colors hover:bg-beige-50",
                          isSel && "bg-caramel-400/10 hover:bg-caramel-400/10"
                        )}
                      >
                        <td className="px-4 py-3">
                          <p className="font-mono text-[11px] text-slate-400">{q.id}</p>
                          <p className="flex items-center gap-1.5 font-bold text-slate-700">
                            <span>{q.flag}</span>{q.customer}
                          </p>
                        </td>
                        <td className="px-4 py-3 text-slate-500">
                          <p className="truncate">{q.vehicle}</p>
                          <p className="text-[11px] text-slate-400">{q.period}</p>
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-slate-700">{jpy(totalOf(q))}</td>
                        <td className="px-4 py-3"><Badge tone={meta.tone}>{meta.label}</Badge></td>
                      </tr>
                    );
                  })}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-4 py-10 text-center text-sm text-slate-400">
                        条件に合う見積が見つかりませんでした
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* ── Right: quotation detail ── */}
        <div className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          <Card className="p-5">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <p className="font-mono text-[11px] text-slate-400">{selected.id}</p>
                <h3 className="flex items-center gap-1.5 text-lg font-extrabold text-slate-800">
                  <span>{selected.flag}</span>{selected.customer}
                </h3>
                <p className="text-xs text-slate-400">{selected.customerRoman} · {selected.langLabel}</p>
              </div>
              <Badge tone={STATUS_META[selected.status].tone}>{STATUS_META[selected.status].label}</Badge>
            </div>

            {/* Meta */}
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
              <div className="rounded-lg bg-beige-50/70 px-3 py-2">
                <p className="text-[11px] text-slate-400">車両</p>
                <p className="font-medium text-slate-700">{selected.vehicle}</p>
              </div>
              <div className="rounded-lg bg-beige-50/70 px-3 py-2">
                <p className="text-[11px] text-slate-400">利用期間</p>
                <p className="font-medium text-slate-700">{selected.period}</p>
              </div>
              <div className="rounded-lg bg-beige-50/70 px-3 py-2">
                <p className="flex items-center gap-1 text-[11px] text-slate-400"><CalendarClock className="h-3 w-3" />作成日</p>
                <p className="font-medium text-slate-700">{selected.createdAt}</p>
              </div>
              <div className="rounded-lg bg-beige-50/70 px-3 py-2">
                <p className="flex items-center gap-1 text-[11px] text-slate-400"><Clock className="h-3 w-3" />有効期限</p>
                <p className="font-medium text-slate-700">{selected.validUntil}</p>
              </div>
            </div>

            {/* Line items */}
            <div className="mt-4">
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">見積内訳</p>
              <dl className="space-y-1.5 text-sm">
                {selected.items.map((it) => (
                  <div key={it.label} className="flex justify-between">
                    <dt className="text-slate-600">{it.label}</dt>
                    <dd className="font-medium text-slate-700">{jpy(it.amount)}</dd>
                  </div>
                ))}
                <div className="flex justify-between border-t border-slate-100 pt-1.5">
                  <dt className="text-slate-500">小計</dt>
                  <dd className="font-medium text-slate-700">{jpy(subtotalOf(selected))}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">消費税（10%）</dt>
                  <dd className="font-medium text-slate-700">{jpy(taxOf(selected))}</dd>
                </div>
                <div className="flex justify-between border-t border-slate-100 pt-1.5">
                  <dt className="font-bold text-slate-600">見積金額（税込）</dt>
                  <dd className="text-lg font-extrabold text-caramel-500">{jpy(totalOf(selected))}</dd>
                </div>
              </dl>
            </div>
          </Card>

          {/* Actions */}
          <Card className="space-y-2 p-5">
            <p className="mb-1 text-xs font-bold text-slate-600">アクション</p>
            <Button variant="outline" className="w-full justify-start">
              <FileDown className="h-4 w-4" /> 見積書PDFを出力（{selected.langLabel}）
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Send className="h-4 w-4" /> 見積書をメール送付
            </Button>
            <Button className="w-full justify-start">
              <ArrowRight className="h-4 w-4" /> この見積で予約を確定する
            </Button>
            <p className="pt-1 text-center text-[11px] text-slate-400">
              予約確定すると顧客・車両情報が予約管理へ引き継がれます
            </p>
          </Card>
        </div>
      </div>
    </AdminShell>
  );
}
