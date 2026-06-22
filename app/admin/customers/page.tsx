"use client";

import { useState, useMemo } from "react";
import {
  Users, Search, Globe2, Repeat, IdCard, Mail, Phone,
  CalendarClock, MessageCircle, FileText, BadgeCheck,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { AdminShell } from "@/components/admin/AdminShell";
import { Card, Badge } from "@/components/ui/primitives";
import {
  CUSTOMERS,
  type Customer,
  type CustomerReservationStatus,
} from "@/lib/mock-data";
import { jpy, cn } from "@/lib/utils";

const STATUS_META: Record<CustomerReservationStatus, { label: string; tone: "slate" | "blue" | "green" | "red" }> = {
  completed: { label: "完了",     tone: "slate" },
  active:    { label: "利用中",   tone: "blue" },
  upcoming:  { label: "予約中",   tone: "green" },
  cancelled: { label: "キャンセル", tone: "red" },
};

function StatCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  tone: string;
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

export default function CustomersPage() {
  const { t } = useI18n();
  const [query, setQuery] = useState("");
  const [nationality, setNationality] = useState("all");
  const [selectedId, setSelectedId] = useState(CUSTOMERS[0].id);

  const nationalities = useMemo(
    () => Array.from(new Set(CUSTOMERS.map((c) => c.nationality))),
    []
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CUSTOMERS.filter((c) => {
      if (nationality !== "all" && c.nationality !== nationality) return false;
      if (!q) return true;
      return (
        c.nameJa.toLowerCase().includes(q) ||
        c.nameRoman.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q)
      );
    });
  }, [query, nationality]);

  const selected: Customer =
    filtered.find((c) => c.id === selectedId) ?? filtered[0] ?? CUSTOMERS[0];

  const repeaters = CUSTOMERS.filter((c) => c.reservations.filter((r) => r.status !== "cancelled").length >= 2).length;

  return (
    <AdminShell title={t("anav.customers")}>
      {/* Header */}
      <div className="mb-4">
        <h2 className="flex items-center gap-2 text-xl font-extrabold text-slate-800">
          <Users className="h-6 w-6 text-caramel-500" /> 顧客管理
        </h2>
        <p className="text-sm text-slate-500">顧客台帳・予約履歴・WhatsApp対応履歴を一元管理します。</p>
      </div>

      {/* Stats */}
      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard icon={Users}  label="総顧客数"   value={CUSTOMERS.length}        tone="bg-caramel-400/15 text-caramel-500" />
        <StatCard icon={Repeat} label="リピーター" value={repeaters}               tone="bg-emerald-50 text-emerald-500" />
        <StatCard icon={Globe2} label="国籍数"     value={nationalities.length}    tone="bg-sky-50 text-sky-500" />
        <StatCard icon={BadgeCheck} label="今月利用" value={CUSTOMERS.filter((c) => c.lastUsed.startsWith("2024/06")).length} tone="bg-violet-50 text-violet-500" />
      </div>

      {/* Value-prop banner */}
      <div className="mb-5 flex items-start gap-3 rounded-xl bg-caramel-400/10 p-4 ring-1 ring-caramel-400/20">
        <IdCard className="mt-0.5 h-5 w-5 shrink-0 text-caramel-500" />
        <p className="text-sm text-slate-700">
          <span className="font-bold text-caramel-600">一度登録した顧客情報を使い回し。</span>
          {"  "}パスポート・免許証・連絡先は予約時の入力から取り込まれ、書類自動生成・WhatsApp対応にそのまま連携されます。
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_400px]">
        {/* ── Left: search + list ── */}
        <div className="space-y-3">
          {/* Search & filter */}
          <Card className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
            <span className="flex flex-1 items-center gap-2 rounded-xl bg-beige-50 px-3 py-2 ring-1 ring-beige-200 focus-within:ring-caramel-400">
              <Search className="h-4 w-4 shrink-0 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="氏名・メール・電話・顧客IDで検索"
                className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
              />
            </span>
            <span className="flex items-center gap-2 rounded-xl bg-beige-50 px-3 py-2 ring-1 ring-beige-200 focus-within:ring-caramel-400">
              <Globe2 className="h-4 w-4 shrink-0 text-slate-400" />
              <select
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
                className="cursor-pointer bg-transparent text-sm text-slate-700 outline-none"
              >
                <option value="all">国籍：すべて</option>
                {nationalities.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </span>
          </Card>

          {/* List */}
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/60 text-left text-xs font-bold text-slate-400">
                    <th className="px-4 py-2.5">顧客</th>
                    <th className="px-4 py-2.5">国籍</th>
                    <th className="px-4 py-2.5 text-center">利用回数</th>
                    <th className="px-4 py-2.5">最終利用</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c) => {
                    const active = c.reservations.filter((r) => r.status !== "cancelled").length;
                    const isSel = c.id === selected.id;
                    return (
                      <tr
                        key={c.id}
                        onClick={() => setSelectedId(c.id)}
                        className={cn(
                          "cursor-pointer border-b border-slate-50 transition-colors hover:bg-beige-50",
                          isSel && "bg-caramel-400/10 hover:bg-caramel-400/10"
                        )}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <span className="text-lg">{c.flag}</span>
                            <div className="min-w-0">
                              <p className="font-bold text-slate-700">{c.nameJa}</p>
                              <p className="truncate text-[11px] text-slate-400">{c.nameRoman} · {c.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-500">{c.nationality}</td>
                        <td className="px-4 py-3 text-center">
                          <span className="inline-flex items-center gap-1">
                            <span className="font-bold text-slate-700">{active}</span>
                            {active >= 2 && <Repeat className="h-3 w-3 text-emerald-500" />}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-500">{c.lastUsed}</td>
                      </tr>
                    );
                  })}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-4 py-10 text-center text-sm text-slate-400">
                        条件に合う顧客が見つかりませんでした
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* ── Right: detail panel ── */}
        <div className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          {/* Profile */}
          <Card className="p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-caramel-400/15 text-xl">
                {selected.flag}
              </span>
              <div className="min-w-0">
                <h3 className="text-lg font-extrabold text-slate-800">{selected.nameJa}</h3>
                <p className="text-xs text-slate-400">{selected.nameRoman} · {selected.id}</p>
              </div>
            </div>

            <dl className="mt-4 space-y-2.5">
              {[
                { icon: Globe2, label: "国籍", value: selected.nationality },
                { icon: Mail,   label: "メール", value: selected.email },
                { icon: Phone,  label: "電話", value: selected.phone },
                { icon: IdCard, label: "パスポート番号", value: selected.passport },
                { icon: IdCard, label: "免許証番号", value: selected.license },
                { icon: CalendarClock, label: "登録日", value: selected.registeredAt },
              ].map((f) => {
                const Icon = f.icon;
                return (
                  <div key={f.label} className="flex items-center gap-3 rounded-lg bg-beige-50/70 px-3 py-2">
                    <Icon className="h-4 w-4 shrink-0 text-slate-400" />
                    <div className="min-w-0 flex-1">
                      <dt className="text-[11px] text-slate-400">{f.label}</dt>
                      <dd className="truncate text-sm font-medium text-slate-700">{f.value}</dd>
                    </div>
                  </div>
                );
              })}
            </dl>
          </Card>

          {/* Reservation history */}
          <Card className="p-5">
            <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-700">
              <FileText className="h-4 w-4 text-caramel-500" /> 予約履歴
              <span className="ml-auto rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-500">
                {selected.reservations.length}件
              </span>
            </h4>
            <div className="space-y-2">
              {selected.reservations.map((r) => {
                const meta = STATUS_META[r.status];
                return (
                  <div key={r.id} className="flex items-center justify-between gap-2 rounded-xl bg-beige-50/70 px-3 py-2.5">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-700">{r.vehicle}</p>
                      <p className="font-mono text-[10px] text-slate-400">{r.id} · {r.period}</p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <span className="text-sm font-bold text-slate-700">{jpy(r.amount)}</span>
                      <Badge tone={meta.tone}>{meta.label}</Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* WhatsApp history */}
          <Card className="p-5">
            <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-700">
              <MessageCircle className="h-4 w-4 text-emerald-500" /> WhatsApp 対応履歴
              <span className="ml-auto rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-600">
                予約紐付け済み
              </span>
            </h4>
            <div className="space-y-2">
              {selected.whatsapp.map((m, i) => (
                <div
                  key={i}
                  className={cn("flex", m.from === "staff" ? "justify-end" : "justify-start")}
                >
                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl px-3 py-2",
                      m.from === "staff"
                        ? "bg-emerald-500 text-white"
                        : "bg-beige-100 text-slate-700"
                    )}
                  >
                    <p className="text-xs leading-relaxed">{m.text}</p>
                    <p className={cn("mt-1 text-[10px]", m.from === "staff" ? "text-emerald-100" : "text-slate-400")}>
                      {m.from === "staff" ? "スタッフ" : "お客様"} · {m.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-3 text-center text-[11px] text-slate-400">
              ※ WhatsApp Business 連携は Phase 2 で実装予定
            </p>
          </Card>
        </div>
      </div>
    </AdminShell>
  );
}
