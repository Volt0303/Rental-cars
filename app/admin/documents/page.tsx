"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  Files, FileText, FileSignature, ClipboardCheck, ShieldCheck,
  Sparkles, Download, Eye, Check, ArrowRight, Lightbulb,
  X, ChevronDown, CheckCircle2, Loader2,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { AdminShell } from "@/components/admin/AdminShell";
import { Card, Button, Badge } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

// ── Types ────────────────────────────────────────────────────────────────────
type DocKind = "order" | "contract" | "inspection" | "consent";

type DemoReservation = {
  id: string;
  customer: string;
  customerRomaji: string;
  passport: string;
  license: string;
  nationality: string;
  birthday: string;
  vehicle: string;
  plate: string;
  vehicleType: string;
  seats: number;
  store: string;
  pickup: string;
  returnDate: string;
  days: number;
  basePrice: string;
  insurance: string;
  options: string;
  total: string;
  purpose: string;
  flight: string;
  email: string;
  phone: string;
};

// ── Demo reservations ────────────────────────────────────────────────────────
const RESERVATIONS: DemoReservation[] = [
  {
    id: "RES-2024-0058",
    customer: "山田 太郎",
    customerRomaji: "Taro Yamada",
    passport: "TZ1234567",
    license: "123456789012",
    nationality: "日本",
    birthday: "1990/05/15",
    vehicle: "Toyota Alphard",
    plate: "品川 300 わ 12-34",
    vehicleType: "高級車",
    seats: 7,
    store: "成田空港店",
    pickup: "2024/06/15 10:00",
    returnDate: "2024/06/17 18:00",
    days: 2,
    basePrice: "¥24,200",
    insurance: "免責補償制度（CDW）¥1,100/日",
    options: "カーナビ ¥550/日、ETC車載器 無料",
    total: "¥29,040（税込）",
    purpose: "観光・レジャー",
    flight: "JL123 / 2024/06/15 08:30",
    email: "taro.yamada@example.com",
    phone: "080-1234-5678",
  },
  {
    id: "RES-2024-0057",
    customer: "株式会社ABC 御中",
    customerRomaji: "ABC Corporation",
    passport: "—",
    license: "987654321098",
    nationality: "日本（法人）",
    birthday: "—",
    vehicle: "Toyota Hiace Grand Cabin",
    plate: "品川 400 わ 56-78",
    vehicleType: "ミニバン",
    seats: 10,
    store: "羽田空港店",
    pickup: "2024/06/05 09:00",
    returnDate: "2024/06/07 18:00",
    days: 2,
    basePrice: "¥18,700",
    insurance: "スーパー補償制度（SCDW）¥2,200/日",
    options: "カーナビ ¥550/日、ETC車載器 無料、チャイルドシート ¥550/日",
    total: "¥25,740（税込）",
    purpose: "ビジネス",
    flight: "—",
    email: "info@abc-corp.example.com",
    phone: "03-1234-5678",
  },
  {
    id: "INQ-2024-0056",
    customer: "John Smith",
    customerRomaji: "John Smith",
    passport: "US123456789",
    license: "DL-NY-98765432",
    nationality: "アメリカ合衆国",
    birthday: "1985/03/22",
    vehicle: "Mercedes-Benz V-Class",
    plate: "品川 330 わ 33-44",
    vehicleType: "高級車",
    seats: 7,
    store: "成田空港店",
    pickup: "2024/06/10 14:00",
    returnDate: "2024/06/15 10:00",
    days: 5,
    basePrice: "¥35,200",
    insurance: "スーパー補償制度（SCDW）¥2,200/日",
    options: "カーナビ ¥550/日、ETC車載器 無料",
    total: "¥212,300（税込）",
    purpose: "観光・レジャー",
    flight: "AA456 / 2024/06/10 13:00",
    email: "john.smith@example.com",
    phone: "+1-212-555-0100",
  },
];

// ── Document content templates ────────────────────────────────────────────────

function DocHeader({ title, subtitle, resId }: { title: string; subtitle?: string; resId: string }) {
  return (
    <div className="mb-6 border-b-2 border-slate-800 pb-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-bold tracking-widest text-slate-400">COMPASS CAR · レンタカーサービス</p>
          <h1 className="mt-0.5 text-2xl font-extrabold text-slate-900">{title}</h1>
          {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-400">受付番号</p>
          <p className="text-base font-bold text-slate-800">{resId}</p>
          <p className="mt-0.5 text-[10px] text-slate-400">発行日: {new Date().toLocaleDateString("ja-JP")}</p>
        </div>
      </div>
    </div>
  );
}

function DocTable({ rows }: { rows: [string, string][] }) {
  return (
    <table className="mb-5 w-full border-collapse text-sm">
      <tbody>
        {rows.map(([label, value]) => (
          <tr key={label} className="border border-slate-200">
            <td className="w-36 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-500">{label}</td>
            <td className="px-3 py-2 font-medium text-slate-800">{value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function SignatureSection({ parties }: { parties: string[] }) {
  return (
    <div className={cn("mt-8 grid gap-6", parties.length > 1 ? "grid-cols-2" : "grid-cols-1 max-w-xs")}>
      {parties.map((p) => (
        <div key={p}>
          <p className="mb-1 text-xs font-medium text-slate-500">{p}</p>
          <div className="h-16 rounded border border-slate-300 bg-slate-50" />
          <div className="mt-1 border-t border-slate-400 pt-1">
            <p className="text-[10px] text-slate-400">署名 / Signature</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function OrderDoc({ r }: { r: DemoReservation }) {
  return (
    <div className="p-10 pb-20 text-sm text-slate-700">
      <DocHeader title="注文確認書" subtitle="Order Confirmation" resId={r.id} />
      <p className="mb-5 text-sm leading-relaxed">
        このたびは COMPASS CAR をご利用いただきまして誠にありがとうございます。<br />
        下記の内容にてご予約を承りましたのでご確認ください。
      </p>
      <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">■ ご予約者情報</h2>
      <DocTable rows={[
        ["お客様氏名", r.customer],
        ["ローマ字", r.customerRomaji],
        ["国籍", r.nationality],
        ["連絡先メール", r.email],
        ["電話番号", r.phone],
      ]} />
      <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">■ 車両・利用情報</h2>
      <DocTable rows={[
        ["車両", `${r.vehicle}（${r.plate}）`],
        ["車両タイプ", `${r.vehicleType} / ${r.seats}人乗り`],
        ["貸出店舗", r.store],
        ["貸出日時", r.pickup],
        ["返却日時", r.returnDate],
        ["利用日数", `${r.days}日間`],
        ["ご利用目的", r.purpose],
        ["フライト情報", r.flight],
      ]} />
      <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">■ 料金</h2>
      <DocTable rows={[
        ["基本料金", r.basePrice + " × " + r.days + "日"],
        ["保険・補償", r.insurance],
        ["オプション", r.options],
        ["お支払い合計", r.total],
      ]} />
      <div className="mt-6 rounded-lg bg-amber-50 p-3 text-xs text-amber-700 ring-1 ring-amber-200">
        ※ 貸出日時の48時間前まではキャンセル無料です。それ以降は所定のキャンセル料が発生します。
      </div>
      <SignatureSection parties={["お客様ご署名"]} />
    </div>
  );
}

function ContractDoc({ r }: { r: DemoReservation }) {
  return (
    <div className="p-10 pb-20 text-sm text-slate-700">
      <DocHeader title="車両賃貸契約書" subtitle="Vehicle Rental Agreement" resId={r.id} />
      <div className="mb-5 grid grid-cols-2 gap-4 text-xs">
        <div className="rounded-lg border border-slate-200 p-3">
          <p className="mb-2 font-bold text-slate-600">【賃貸人（甲）】</p>
          <p className="font-medium">COMPASS CAR レンタカー株式会社</p>
          <p className="text-slate-500">〒100-0001 東京都千代田区千代田1-1</p>
          <p className="text-slate-500">TEL: 03-0000-0000</p>
        </div>
        <div className="rounded-lg border border-slate-200 p-3">
          <p className="mb-2 font-bold text-slate-600">【賃借人（乙）】</p>
          <p className="font-medium">{r.customer}</p>
          <p className="text-slate-500">{r.customerRomaji}</p>
          <p className="text-slate-500">国籍: {r.nationality}</p>
        </div>
      </div>
      <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">■ 賃貸車両</h2>
      <DocTable rows={[
        ["車種", r.vehicle],
        ["ナンバープレート", r.plate],
        ["車両タイプ / 定員", `${r.vehicleType} / ${r.seats}名`],
        ["貸出店舗", r.store],
      ]} />
      <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">■ 賃貸条件</h2>
      <DocTable rows={[
        ["賃貸期間", `${r.pickup} 〜 ${r.returnDate}`],
        ["利用日数", `${r.days}日間`],
        ["賃貸料金", r.total],
        ["保険・補償", r.insurance],
        ["付属オプション", r.options],
        ["支払方法", "クレジットカード / 現金"],
      ]} />
      <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">■ 特約事項</h2>
      <div className="mb-4 space-y-1 rounded-lg bg-slate-50 p-3 text-[11px] leading-relaxed text-slate-600">
        <p>第1条 乙は、善良な管理者の注意をもって本車両を使用するものとします。</p>
        <p>第2条 乙は、甲の承諾なしに本車両を第三者に転貸してはなりません。</p>
        <p>第3条 乙は、返却時に本車両を貸出時と同等の状態で甲に返却するものとします。</p>
        <p>第4条 事故・盗難が発生した場合は直ちに甲及び警察に連絡するものとします。</p>
        <p>第5条 乙は、本車両を返却期限までに指定の返却場所へ返却するものとします。</p>
      </div>
      <p className="mb-6 text-xs text-slate-500">
        甲乙双方は、上記の賃貸条件に合意し、本契約書を締結します。
      </p>
      <SignatureSection parties={["賃貸人（甲）COMPASS CAR", "賃借人（乙）お客様"]} />
    </div>
  );
}

function InspectionDoc({ r }: { r: DemoReservation }) {
  const checks = [
    ["フロントバンパー", "異常なし"], ["リアバンパー", "異常なし"],
    ["フロントガラス", "異常なし"], ["リアガラス", "異常なし"],
    ["左フロントドア", "異常なし"], ["右フロントドア", "異常なし"],
    ["左リアドア", "異常なし"], ["右リアドア", "異常なし"],
    ["ボンネット", "異常なし"], ["トランク", "異常なし"],
    ["左フロントタイヤ", "空気圧 正常"], ["右フロントタイヤ", "空気圧 正常"],
    ["左リアタイヤ", "空気圧 正常"], ["右リアタイヤ", "空気圧 正常"],
    ["ナビ・電装品", "動作確認済み"], ["スペアタイヤ", "搭載確認済み"],
  ];
  return (
    <div className="p-10 pb-20 text-sm text-slate-700">
      <DocHeader title="車両確認書" subtitle="Vehicle Inspection Sheet" resId={r.id} />
      <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">■ 車両情報</h2>
      <DocTable rows={[
        ["車種", r.vehicle],
        ["ナンバープレート", r.plate],
        ["貸出店舗", r.store],
        ["貸出日時", r.pickup],
        ["返却日時", r.returnDate],
        ["借受人", r.customer],
      ]} />
      <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">■ 貸出前点検チェックリスト</h2>
      <div className="mb-5 grid grid-cols-2 gap-0.5">
        {checks.map(([part, status]) => (
          <div key={part} className="flex items-center justify-between border border-slate-200 px-3 py-1.5 text-xs">
            <span className="font-medium text-slate-600">{part}</span>
            <span className="flex items-center gap-1 text-emerald-600">
              <Check className="h-3 w-3" /> {status}
            </span>
          </div>
        ))}
      </div>
      <div className="mb-5 grid grid-cols-3 gap-3 text-xs">
        <div className="rounded-lg border border-slate-200 p-3">
          <p className="mb-1 font-bold text-slate-500">燃料残量</p>
          <div className="relative h-4 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full w-3/4 rounded-full bg-emerald-400" />
          </div>
          <p className="mt-0.5 text-slate-500">3/4 満タン返し</p>
        </div>
        <div className="rounded-lg border border-slate-200 p-3">
          <p className="mb-1 font-bold text-slate-500">走行距離（貸出時）</p>
          <p className="text-lg font-bold text-slate-800">12,450 km</p>
        </div>
        <div className="rounded-lg border border-slate-200 p-3">
          <p className="mb-1 font-bold text-slate-500">付属品</p>
          <p className="text-slate-700">スペアキー×1<br />ETC カード×1</p>
        </div>
      </div>
      <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">■ 損傷・特記事項</h2>
      <div className="mb-5 min-h-[60px] rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-500">
        なし（貸出前点検にて異常なし）
      </div>
      <SignatureSection parties={["担当スタッフ署名", "お客様確認署名"]} />
    </div>
  );
}

function ConsentDoc({ r }: { r: DemoReservation }) {
  return (
    <div className="p-10 pb-20 text-sm text-slate-700">
      <DocHeader title="個人情報取扱同意書" subtitle="Personal Information Consent Form" resId={r.id} />
      <div className="mb-5 rounded-lg bg-slate-50 p-4 text-xs leading-relaxed text-slate-600">
        COMPASS CAR レンタカー株式会社（以下「当社」）は、以下の目的のためにお客様の個人情報を取得・利用いたします。
        ご同意のうえ、以下にご署名ください。
      </div>
      <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">■ ご提供いただく個人情報</h2>
      <DocTable rows={[
        ["お名前", r.customer + "（" + r.customerRomaji + "）"],
        ["生年月日", r.birthday],
        ["国籍", r.nationality],
        ["パスポート番号", r.passport],
        ["運転免許証番号", r.license],
        ["連絡先", r.email + " / " + r.phone],
        ["ご利用予約番号", r.id],
      ]} />
      <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">■ 利用目的</h2>
      <div className="mb-5 space-y-1 text-xs leading-relaxed text-slate-600">
        {[
          "車両レンタルサービスの提供および予約管理",
          "賃貸契約書・各種書類の作成",
          "緊急連絡・事故対応等のご連絡",
          "サービス改善のための統計的分析（個人を特定しない形式）",
          "法令に基づく届出・行政機関からの照会への回答",
        ].map((item, i) => (
          <div key={i} className="flex items-start gap-2">
            <span className="mt-0.5 shrink-0 text-caramel-400">（{i + 1}）</span>
            <span>{item}</span>
          </div>
        ))}
      </div>
      <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">■ 保管期間・第三者提供</h2>
      <div className="mb-5 space-y-2 text-xs leading-relaxed text-slate-600">
        <p><span className="font-bold text-slate-700">保管期間：</span>サービス終了後7年間（法令の定めによる）</p>
        <p><span className="font-bold text-slate-700">第三者提供：</span>法令に基づく場合を除き、お客様の同意なく第三者に提供することはありません。</p>
        <p><span className="font-bold text-slate-700">開示・訂正：</span>個人情報の開示・訂正・削除を請求する権利を有します。</p>
      </div>
      <div className="mb-6 rounded-lg border border-caramel-400/30 bg-caramel-400/10 p-3 text-xs text-caramel-600">
        上記の個人情報取扱いについてご確認いただき、同意される場合は下記にご署名ください。
      </div>
      <SignatureSection parties={["お客様確認・同意署名"]} />
    </div>
  );
}

// ── Document preview modal ────────────────────────────────────────────────────
const DOC_TITLES: Record<DocKind, string> = {
  order:      "注文確認書",
  contract:   "賃貸契約書",
  inspection: "車両確認書",
  consent:    "個人情報同意書",
};

function DocBody({ kind, r }: { kind: DocKind; r: DemoReservation }) {
  switch (kind) {
    case "order":      return <OrderDoc      r={r} />;
    case "contract":   return <ContractDoc   r={r} />;
    case "inspection": return <InspectionDoc r={r} />;
    case "consent":    return <ConsentDoc    r={r} />;
  }
}

// Generate a clean PDF from a rendered document node (no browser headers/footers).
async function generatePdf(el: HTMLElement, fileName: string) {
  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
    import("html2canvas-pro"),
    import("jspdf"),
  ]);

  const canvas = await html2canvas(el, {
    scale: 2,
    backgroundColor: "#ffffff",
    useCORS: true,
    logging: false,
  });

  const pdf = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = pdf.internal.pageSize.getWidth();   // 210mm
  const pageH = pdf.internal.pageSize.getHeight();  // 297mm
  const margin = 10; // mm
  const imgW  = pageW - margin * 2;  // 190mm
  const imgH  = (canvas.height / canvas.width) * imgW;
  const imgData = canvas.toDataURL("image/png");

  // Page 1: image starts at y=margin; the page physically ends at pageH, so
  // the image content shown on page 1 spans 0 → (pageH - margin) = 287mm.
  pdf.addImage(imgData, "PNG", margin, margin, imgW, imgH);

  // Subsequent pages each expose (pageH - 2*margin) = 277mm of fresh content.
  // We want content at `yShown` to appear at y=margin on the new page, so:
  //   margin - imgTop = yShown  →  imgTop = margin - yShown
  const perPage = pageH - 2 * margin; // 277mm
  let yShown = pageH - margin;        // 287mm consumed by page 1

  while (yShown < imgH) {
    pdf.addPage();
    pdf.addImage(imgData, "PNG", margin, margin - yShown, imgW, imgH);
    yShown += perPage;
  }

  pdf.save(fileName);
}

function PreviewModal({
  reservation,
  kind,
  onClose,
}: {
  reservation: DemoReservation;
  kind: DocKind;
  onClose: () => void;
}) {
  // Mount guard for createPortal (SSR-safe)
  const [mounted, setMounted] = useState(false);
  const [busy, setBusy] = useState(false);
  const paperRef = useRef<HTMLDivElement>(null);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const handleDownload = async () => {
    if (busy || !paperRef.current) return;
    setBusy(true);
    try {
      await generatePdf(paperRef.current, `${DOC_TITLES[kind]}_${reservation.id}.pdf`);
    } finally {
      setBusy(false);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex flex-col bg-black/60"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Toolbar */}
      <div className="flex shrink-0 items-center gap-3 border-b border-slate-700 bg-slate-800 px-5 py-3">
        <span className="text-sm font-bold text-white">{DOC_TITLES[kind]}</span>
        <span className="text-xs text-slate-400">— {reservation.id}</span>
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={handleDownload}
            disabled={busy}
            className="flex items-center gap-1.5 rounded-lg bg-caramel-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-caramel-600 disabled:opacity-60"
          >
            {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
            {busy ? "生成中..." : "PDFダウンロード"}
          </button>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Document scroll area */}
      <div className="flex-1 overflow-y-auto p-6">
        <div ref={paperRef} className="mx-auto w-full max-w-[794px] bg-white shadow-2xl">
          <DocBody kind={kind} r={reservation} />
        </div>
      </div>
    </div>,
    document.body
  );
}

// ── Individual doc card ───────────────────────────────────────────────────────
const DOC_META: { kind: DocKind; icon: React.ElementType; tone: string; bg: string }[] = [
  { kind: "order",      icon: FileText,       tone: "text-blue-500",   bg: "bg-blue-50"   },
  { kind: "contract",   icon: FileSignature,  tone: "text-violet-500", bg: "bg-violet-50" },
  { kind: "inspection", icon: ClipboardCheck, tone: "text-emerald-500",bg: "bg-emerald-50"},
  { kind: "consent",    icon: ShieldCheck,    tone: "text-amber-500",  bg: "bg-amber-50"  },
];

function DocCard({
  meta,
  reservation,
  visible,
  downloading,
  downloaded,
  onPreview,
  onDownload,
}: {
  meta: (typeof DOC_META)[number];
  reservation: DemoReservation;
  visible: boolean;
  downloading: boolean;
  downloaded: boolean;
  onPreview: () => void;
  onDownload: () => void;
}) {
  const { t } = useI18n();
  const Icon = meta.icon;
  const title = DOC_TITLES[meta.kind];

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl bg-white ring-1 transition-all duration-500",
        visible
          ? "translate-y-0 opacity-100 shadow-md ring-slate-200"
          : "translate-y-4 opacity-0 ring-transparent"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <span className="flex items-center gap-2 text-sm font-bold text-slate-700">
          <span className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-lg", meta.bg)}>
            <Icon className={cn("h-4 w-4", meta.tone)} />
          </span>
          {title}
        </span>
        {visible && (
          <Badge tone="green">
            <Check className="h-3 w-3" /> {t("docs.generated")}
          </Badge>
        )}
      </div>

      {/* Mini preview */}
      <div className="relative p-4">
        <div className={cn(
          "space-y-2 rounded-lg bg-white p-3 ring-1 ring-slate-100 transition-all duration-500",
          !visible && "select-none blur-[2px] opacity-40"
        )}>
          <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
            <span className="text-[10px] font-bold text-slate-600">{title}</span>
            <span className="text-[9px] text-slate-400">{reservation.id}</span>
          </div>
          {[
            ["お客様", reservation.customer],
            ["車両",   `${reservation.vehicle}`],
            ["期間",   `${reservation.pickup} 〜`],
            ["合計",   reservation.total],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between gap-2 text-[10px]">
              <span className="shrink-0 text-slate-400">{label}</span>
              <span className="truncate font-medium text-slate-600">{value}</span>
            </div>
          ))}
        </div>
        {!visible && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="rounded-full bg-slate-700/80 px-3 py-1 text-[11px] font-bold text-white">
              生成待ち
            </span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 border-t border-slate-100 px-4 py-3">
        <button
          disabled={!visible}
          onClick={onPreview}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 py-2 text-xs font-medium text-slate-600 transition-colors hover:border-caramel-300 hover:bg-caramel-400/10 hover:text-caramel-600 disabled:pointer-events-none disabled:opacity-40"
        >
          <Eye className="h-3.5 w-3.5" /> {t("docs.preview")}
        </button>
        <button
          disabled={!visible || downloading}
          onClick={onDownload}
          className={cn(
            "flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold transition-colors disabled:pointer-events-none disabled:opacity-40",
            downloaded
              ? "bg-emerald-500 text-white"
              : "bg-caramel-500 text-white hover:bg-caramel-600"
          )}
        >
          {downloading ? (
            <><Loader2 className="h-3.5 w-3.5 animate-spin" /> 準備中...</>
          ) : downloaded ? (
            <><CheckCircle2 className="h-3.5 w-3.5" /> 完了</>
          ) : (
            <><Download className="h-3.5 w-3.5" /> {t("docs.download")}</>
          )}
        </button>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function DocumentsPage() {
  const { t } = useI18n();

  const [selectedId, setSelectedId] = useState(RESERVATIONS[0].id);
  const [showPicker, setShowPicker] = useState(false);
  const [revealCount, setRevealCount]     = useState(0);
  const [generating,  setGenerating]      = useState(false);
  const [previewKind, setPreviewKind]     = useState<DocKind | null>(null);
  const [downloading, setDownloading]     = useState<Set<DocKind>>(new Set());
  const [downloaded,  setDownloaded]      = useState<Set<DocKind>>(new Set());

  const reservation = RESERVATIONS.find((r) => r.id === selectedId)!;
  const generated = revealCount === DOC_META.length;

  const handleSelectReservation = (id: string) => {
    setSelectedId(id);
    setShowPicker(false);
    setRevealCount(0);
    setDownloading(new Set());
    setDownloaded(new Set());
  };

  const handleGenerate = () => {
    if (generating) return;
    setRevealCount(0);
    setGenerating(true);
    setDownloaded(new Set());
    DOC_META.forEach((_, i) => {
      setTimeout(() => {
        setRevealCount(i + 1);
        if (i === DOC_META.length - 1) setGenerating(false);
      }, 300 + i * 350);
    });
  };

  const handleDownload = async (kind: DocKind) => {
    const node = document.getElementById(`doc-capture-${kind}`);
    if (!node) return;
    setDownloading((prev) => new Set([...prev, kind]));
    try {
      await generatePdf(node, `${DOC_TITLES[kind]}_${reservation.id}.pdf`);
      setDownloaded((prev) => new Set([...prev, kind]));
    } finally {
      setDownloading((prev) => { const s = new Set(prev); s.delete(kind); return s; });
    }
  };

  const SHARED_FIELDS: [string, string][] = [
    [t("docs.field.customer"),      reservation.customer],
    ["ローマ字",                    reservation.customerRomaji],
    [t("docs.field.passport"),      reservation.passport],
    [t("docs.field.license"),       reservation.license],
    [t("docs.field.vehicle"),       `${reservation.vehicle}（${reservation.plate}）`],
    [t("docs.field.period"),        `${reservation.pickup} 〜 ${reservation.returnDate}`],
    [t("docs.field.reservationNo"), reservation.id],
  ];

  return (
    <AdminShell title={t("anav.documents")}>
      {/* Header */}
      <div className="mb-4">
        <h2 className="flex items-center gap-2 text-xl font-extrabold text-slate-800">
          <Files className="h-6 w-6 text-caramel-500" /> {t("docs.title")}
        </h2>
        <p className="text-sm text-slate-500">{t("docs.subtitle")}</p>
      </div>

      {/* Value-prop banner */}
      <div className="mb-5 flex items-start gap-3 rounded-xl bg-caramel-400/10 p-4 ring-1 ring-caramel-400/20">
        <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-caramel-500" />
        <p className="text-sm text-slate-700">
          <span className="font-bold text-caramel-600">一度の入力で4書類を自動生成。</span>
          {"  "}現在の運用では同じ顧客情報を注文確認書・賃貸契約書・車両確認書・個人情報同意書の4種類に
          繰り返し転記しています。本システムでは予約時の入力から全書類を自動生成します。
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[340px_1fr]">
        {/* ── Left: reservation selector + shared fields ── */}
        <div className="space-y-4">
          <Card className="p-5">
            {/* Reservation picker */}
            <p className="mb-1 text-xs font-medium text-slate-400">{t("docs.selectReservation")}</p>
            <div className="relative">
              <button
                onClick={() => setShowPicker((v) => !v)}
                className="flex w-full items-center justify-between rounded-xl bg-slate-50 px-3 py-2.5 text-sm font-bold text-slate-700 ring-1 ring-slate-200 transition hover:ring-caramel-300"
              >
                <span>{reservation.id} / {reservation.customer.split("　")[0]}</span>
                <ChevronDown className={cn("h-4 w-4 text-slate-400 transition-transform", showPicker && "rotate-180")} />
              </button>
              {showPicker && (
                <div className="absolute left-0 right-0 top-full z-10 mt-1 overflow-hidden rounded-xl bg-white shadow-xl ring-1 ring-slate-200">
                  {RESERVATIONS.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => handleSelectReservation(r.id)}
                      className={cn(
                        "flex w-full flex-col px-4 py-3 text-left text-sm transition-colors hover:bg-caramel-400/10",
                        r.id === selectedId && "bg-caramel-400/10"
                      )}
                    >
                      <span className="font-bold text-slate-700">{r.id}</span>
                      <span className="text-xs text-slate-500">{r.customer} / {r.vehicle}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Shared fields */}
            <p className="mb-2 mt-4 text-xs font-bold text-slate-600">{t("docs.sharedFields")}</p>
            <dl className="space-y-1.5">
              {SHARED_FIELDS.map(([label, value]) => (
                <div key={label} className="rounded-lg bg-slate-50/80 px-3 py-2">
                  <dt className="text-[11px] text-slate-400">{label}</dt>
                  <dd className="text-sm font-medium text-slate-700">{value}</dd>
                </div>
              ))}
            </dl>

            {/* Generate button */}
            <button
              className={cn(
                "mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all",
                generated
                  ? "bg-emerald-500 text-white"
                  : generating
                  ? "bg-caramel-400 text-white"
                  : "bg-caramel-500 text-white hover:bg-caramel-600"
              )}
              onClick={handleGenerate}
              disabled={generating}
            >
              {generated ? (
                <><CheckCircle2 className="h-4 w-4" /> 4書類 生成完了</>
              ) : generating ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> 生成中...</>
              ) : (
                <><Sparkles className="h-4 w-4" /> {t("docs.autoGenerate")}</>
              )}
            </button>
          </Card>

          {/* Flow hint */}
          <Card className="flex items-center justify-center gap-2 p-4 text-xs font-medium text-slate-500">
            <span className="rounded-md bg-slate-100 px-2 py-1">{t("step.info")}</span>
            <ArrowRight className="h-3.5 w-3.5 text-caramel-400" />
            <span className="rounded-md bg-caramel-400/15 px-2 py-1 text-caramel-600">4書類 自動生成</span>
          </Card>

          {/* Progress indicator */}
          {(generating || revealCount > 0) && (
            <Card className="p-4">
              <p className="mb-2 text-xs font-bold text-slate-600">生成状況</p>
              <div className="space-y-1.5">
                {DOC_META.map((m, i) => (
                  <div key={m.kind} className="flex items-center gap-2 text-xs">
                    {i < revealCount ? (
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                    ) : i === revealCount && generating ? (
                      <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-caramel-400" />
                    ) : (
                      <span className="h-3.5 w-3.5 shrink-0 rounded-full border border-slate-300" />
                    )}
                    <span className={i < revealCount ? "font-medium text-emerald-700" : "text-slate-400"}>
                      {DOC_TITLES[m.kind]}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* ── Right: doc cards ── */}
        <div className="grid gap-4 sm:grid-cols-2">
          {DOC_META.map((meta, i) => (
            <DocCard
              key={meta.kind}
              meta={meta}
              reservation={reservation}
              visible={i < revealCount}
              downloading={downloading.has(meta.kind)}
              downloaded={downloaded.has(meta.kind)}
              onPreview={() => setPreviewKind(meta.kind)}
              onDownload={() => handleDownload(meta.kind)}
            />
          ))}
        </div>
      </div>

      {/* Preview modal */}
      {previewKind && (
        <PreviewModal
          reservation={reservation}
          kind={previewKind}
          onClose={() => setPreviewKind(null)}
        />
      )}

      {/* Hidden, full-size renders used as the source for card "PDFダウンロード".
          Positioned off-screen (not display:none) so html2canvas can measure & paint them. */}
      <div aria-hidden className="pointer-events-none fixed -left-[10000px] top-0 w-[794px]">
        {DOC_META.map((meta) => (
          <div key={meta.kind} id={`doc-capture-${meta.kind}`} className="bg-white">
            <DocBody kind={meta.kind} r={reservation} />
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
