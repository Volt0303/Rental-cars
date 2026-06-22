"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  X, Fuel, Gauge, ShieldCheck, CheckCircle2, CreditCard,
  Clock, Plus, AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/primitives";
import { jpy, cn } from "@/lib/utils";

export type ReturnInfo = {
  resId: string;
  customer: string;
  vehicle: string;
  store: string;
  scheduledReturn: string;
};

const num = (s: string) => {
  const n = parseInt(s.replace(/[^0-9]/g, ""), 10);
  return isNaN(n) ? 0 : n;
};

function ChargeRow({
  icon: Icon,
  label,
  hint,
  value,
  onChange,
}: {
  icon: React.ElementType;
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-3 py-2">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-beige-100 text-caramel-500">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-slate-700">{label}</p>
        {hint && <p className="text-[11px] text-slate-400">{hint}</p>}
      </div>
      <div className="flex items-center gap-1">
        <span className="text-sm text-slate-400">¥</span>
        <input
          type="text"
          inputMode="numeric"
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/[^0-9]/g, ""))}
          placeholder="0"
          className="w-24 rounded-lg bg-beige-50 px-3 py-1.5 text-right text-sm font-medium text-slate-700 ring-1 ring-beige-200 outline-none focus:ring-caramel-400"
        />
      </div>
    </div>
  );
}

export function ReturnSettlementModal({
  info,
  onClose,
  onComplete,
}: {
  info: ReturnInfo;
  onClose: () => void;
  onComplete: (total: number) => void;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  // Vehicle condition
  const [fuel, setFuel] = useState<"full" | "refuel">("full");
  const [damage, setDamage] = useState<"none" | "found">("none");
  const [damageNote, setDamageNote] = useState("");
  const [mileage, setMileage] = useState("");

  // Settlement charges
  const [etc, setEtc] = useState("");
  const [refuelFee, setRefuelFee] = useState("");
  const [extension, setExtension] = useState("");
  const [other, setOther] = useState("");
  const [otherNote, setOtherNote] = useState("");

  const [done, setDone] = useState(false);

  const totalExtra = num(etc) + num(refuelFee) + num(extension) + num(other);

  if (!mounted) return null;

  const handleComplete = () => {
    setDone(true);
    onComplete(totalExtra);
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-end justify-center bg-warm-900/50 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-beige-200 px-5 py-4">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-caramel-400/15 text-caramel-500">
              <ShieldCheck className="h-4.5 w-4.5" />
            </span>
            <div>
              <h2 className="font-extrabold text-slate-800">返却処理・精算</h2>
              <p className="font-mono text-[11px] text-slate-400">{info.resId}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-beige-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {done ? (
          /* ── Success state ── */
          <div className="flex flex-col items-center gap-3 px-5 py-12 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="h-9 w-9" />
            </span>
            <h3 className="text-lg font-extrabold text-slate-800">返却処理が完了しました</h3>
            <p className="text-sm text-slate-500">
              {info.customer} 様の予約（{info.resId}）を「完了」に更新しました。
            </p>
            <div className="mt-2 w-full max-w-xs rounded-xl bg-beige-50 px-4 py-3 ring-1 ring-beige-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">追加精算額</span>
                <span className="font-extrabold text-slate-800">{jpy(totalExtra)}</span>
              </div>
            </div>
            <Button className="mt-4 w-full max-w-xs" onClick={onClose}>
              閉じる
            </Button>
          </div>
        ) : (
          <>
            {/* Body (scrollable) */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {/* Reservation info */}
              <div className="mb-4 rounded-xl bg-beige-50 p-4 ring-1 ring-beige-200">
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <div>
                    <p className="text-[11px] text-slate-400">顧客名</p>
                    <p className="font-medium text-slate-700">{info.customer}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-400">車両</p>
                    <p className="font-medium text-slate-700">{info.vehicle}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-400">店舗</p>
                    <p className="font-medium text-slate-700">{info.store}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-400">返却予定日時</p>
                    <p className="font-medium text-slate-700">{info.scheduledReturn}</p>
                  </div>
                </div>
              </div>

              {/* Vehicle condition check */}
              <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                車両状態チェック
              </h3>

              {/* Fuel */}
              <div className="mb-3">
                <p className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-600">
                  <Fuel className="h-4 w-4 text-slate-400" /> 燃料
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {([
                    { id: "full", label: "満タン返却" },
                    { id: "refuel", label: "給油が必要" },
                  ] as const).map((o) => (
                    <button
                      key={o.id}
                      onClick={() => setFuel(o.id)}
                      className={cn(
                        "rounded-xl px-3 py-2 text-sm font-medium ring-1 transition-colors",
                        fuel === o.id
                          ? "bg-caramel-500 text-white ring-caramel-500"
                          : "bg-white text-slate-600 ring-beige-200 hover:bg-beige-50"
                      )}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Damage */}
              <div className="mb-3">
                <p className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-600">
                  <AlertTriangle className="h-4 w-4 text-slate-400" /> 傷・損傷
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {([
                    { id: "none", label: "問題なし" },
                    { id: "found", label: "傷・損傷あり" },
                  ] as const).map((o) => (
                    <button
                      key={o.id}
                      onClick={() => setDamage(o.id)}
                      className={cn(
                        "rounded-xl px-3 py-2 text-sm font-medium ring-1 transition-colors",
                        damage === o.id
                          ? o.id === "found"
                            ? "bg-rose-500 text-white ring-rose-500"
                            : "bg-emerald-500 text-white ring-emerald-500"
                          : "bg-white text-slate-600 ring-beige-200 hover:bg-beige-50"
                      )}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
                {damage === "found" && (
                  <textarea
                    value={damageNote}
                    onChange={(e) => setDamageNote(e.target.value)}
                    rows={2}
                    placeholder="損傷箇所・状況を記入（例：左後方バンパーに擦り傷）"
                    className="mt-2 w-full resize-none rounded-xl bg-beige-50 p-3 text-sm text-slate-700 ring-1 ring-beige-200 outline-none focus:ring-caramel-400"
                  />
                )}
              </div>

              {/* Mileage */}
              <div className="mb-4">
                <p className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-600">
                  <Gauge className="h-4 w-4 text-slate-400" /> 走行距離（任意）
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={mileage}
                    onChange={(e) => setMileage(e.target.value.replace(/[^0-9]/g, ""))}
                    placeholder="例：320"
                    className="w-32 rounded-xl bg-beige-50 px-3 py-2 text-sm text-slate-700 ring-1 ring-beige-200 outline-none focus:ring-caramel-400"
                  />
                  <span className="text-sm text-slate-400">km</span>
                </div>
              </div>

              {/* Settlement charges */}
              <h3 className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
                <CreditCard className="h-3.5 w-3.5" /> 追加精算
              </h3>
              <div className="divide-y divide-beige-100">
                <ChargeRow icon={CreditCard} label="ETC利用料金" hint="ETC履歴に基づく実費" value={etc} onChange={setEtc} />
                <ChargeRow icon={Fuel} label="燃料補給代" hint={fuel === "refuel" ? "給油が必要に設定されています" : "満タン返却の場合は0円"} value={refuelFee} onChange={setRefuelFee} />
                <ChargeRow icon={Clock} label="延長料金" hint="返却遅延・期間延長分" value={extension} onChange={setExtension} />
                <ChargeRow icon={Plus} label="その他追加料金" hint="清掃費・損傷修理費など" value={other} onChange={setOther} />
              </div>
              {num(other) > 0 && (
                <input
                  type="text"
                  value={otherNote}
                  onChange={(e) => setOtherNote(e.target.value)}
                  placeholder="その他料金の内訳を記入"
                  className="mt-2 w-full rounded-xl bg-beige-50 px-3 py-2 text-sm text-slate-700 ring-1 ring-beige-200 outline-none focus:ring-caramel-400"
                />
              )}
            </div>

            {/* Footer — total + actions */}
            <div className="border-t border-beige-200 bg-beige-50/70 px-5 py-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-bold text-slate-600">追加精算額 合計</span>
                <span className="text-2xl font-extrabold text-caramel-500">{jpy(totalExtra)}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={onClose}
                  className="flex-1 rounded-xl border border-beige-300 py-3 text-sm font-bold text-slate-600 transition hover:bg-white"
                >
                  キャンセル
                </button>
                <Button className="flex-1 py-3" onClick={handleComplete}>
                  <CheckCircle2 className="h-4 w-4" /> 返却を完了する
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>,
    document.body
  );
}
