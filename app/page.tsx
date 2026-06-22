"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Languages, Shield, FileText, Car, ArrowRight,
  ChevronLeft, ChevronRight, Phone, Mail, MapPin, Menu, X,
  CheckCircle2, Star, Clock, Users,
} from "lucide-react";
import { CompassCarLogo } from "@/components/CompassCarLogo";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import {
  FacebookIcon, InstagramIcon, ThreadsIcon, WhatsAppIcon,
} from "@/components/SocialIcons";
import { cn } from "@/lib/utils";

// ── Static data ───────────────────────────────────────────────────────────────
const NAV = [
  { label: "車両を選ぶ",    href: "#vehicles"  },
  { label: "ご利用方法",    href: "#process"   },
  { label: "保険・補償",    href: "#insurance" },
  { label: "会社案内",      href: "#company"   },
  { label: "お問い合わせ",  href: "#contact"   },
];

const FEATURES = [
  {
    icon: Languages,
    title: "多言語スタッフ対応",
    desc: "日本語・英語・中国語に対応したスタッフが丁寧にご案内します。",
    color: "text-caramel-500 bg-caramel-400/10",
  },
  {
    icon: Car,
    title: "空港送迎サービス",
    desc: "成田・羽田をはじめ、主要空港でのお出迎えサービスを提供しています。",
    color: "text-emerald-600 bg-emerald-50",
  },
  {
    icon: Shield,
    title: "充実した保険プラン",
    desc: "外国人のお客様に最適な保険・補償オプションを複数ご用意しています。",
    color: "text-violet-600 bg-violet-50",
  },
  {
    icon: FileText,
    title: "書類サポート",
    desc: "契約書・車両確認書など必要書類を多言語で丁寧にご説明します。",
    color: "text-amber-600 bg-amber-50",
  },
];

const VEHICLES = [
  {
    tag: "S",
    cls: "コンパクト",
    en: "Compact",
    pax: "1〜4名",
    examples: "トヨタ カローラ / ホンダ フィット 等",
    from: "¥8,800〜/日",
    ring: "ring-sky-200 hover:ring-sky-400",
    badge: "bg-sky-100 text-sky-700",
    accent: "bg-sky-600",
    image: "/car_sample/COLT-B-01.jpg",
  },
  {
    tag: "M",
    cls: "ミニバン",
    en: "Minivan",
    pax: "5〜10名",
    examples: "トヨタ アルファード / 日産 セレナ 等",
    from: "¥16,500〜/日",
    ring: "ring-caramel-400/40 hover:ring-caramel-500",
    badge: "bg-caramel-400/15 text-caramel-600",
    accent: "bg-caramel-500",
    popular: true,
    image: "/car_sample/COLT-R-02.jpg",
  },
  {
    tag: "L",
    cls: "高級車",
    en: "Luxury",
    pax: "4〜7名",
    examples: "M.ベンツ Vクラス / テスラ モデルY 等",
    from: "¥28,600〜/日",
    ring: "ring-slate-200 hover:ring-slate-400",
    badge: "bg-slate-100 text-slate-700",
    accent: "bg-slate-700",
    image: "/car_sample/COLT-R-03.jpg",
  },
];

const STEPS = [
  { n: "01", title: "車両を選択",        desc: "日程・人数・目的に合わせ最適な車両をお選びください。" },
  { n: "02", title: "お客様情報を入力",  desc: "基本情報・パスポート情報をオンラインで入力するだけで予約完了。" },
  { n: "03", title: "空港でお受け取り",  desc: "担当スタッフが空港までお出迎え。車両・保険の説明も丁寧に行います。" },
  { n: "04", title: "日本を満喫",        desc: "カーナビ・ETC付きの車で、日本中を自由にドライブお楽しみください。" },
];

const INSURANCE_PLANS = [
  {
    name: "スタンダードプラン",
    price: "¥1,100/日",
    features: ["対人・対物補償", "車両免責補償（CDW）", "盗難補償"],
    highlight: false,
  },
  {
    name: "プレミアムプラン",
    price: "¥2,200/日",
    features: ["スタンダード全内容", "NOC（営業補償）免除", "ロードサービス", "24時間緊急サポート"],
    highlight: true,
  },
];

const STATS = [
  { value: "1,000+", label: "外国人ご利用実績" },
  { value: "3言語",  label: "対応言語数"       },
  { value: "7店舗",  label: "全国拠点数"       },
  { value: "24h",    label: "緊急サポート"     },
];

const CAROUSEL = [
  "/carousels/1.png",
  "/carousels/2.png",
  "/carousels/3.png",
  "/carousels/4.png",
  "/carousels/5.png",
  "/carousels/6.png",
  "/carousels/7.png",
  "/carousels/8.png",
  "/carousels/9.png",
  "/carousels/10.png",
];

const SOCIALS = [
  { label: "Facebook",  href: "https://facebook.com/compasscar",  icon: FacebookIcon,  handle: "@compasscar" },
  { label: "Instagram", href: "https://instagram.com/compasscar", icon: InstagramIcon, handle: "@compass_car" },
  { label: "Threads",   href: "https://threads.net/@compasscar",  icon: ThreadsIcon,   handle: "@compass_car" },
  { label: "WhatsApp",  href: "https://wa.me/817249035400",       icon: WhatsAppIcon,  handle: "+81 72-490-3540" },
];

// ── Component ─────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const [scrolled,    setScrolled]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [slide,       setSlide]       = useState(0);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const nextSlide = useCallback(
    () => setSlide((s) => (s + 1) % CAROUSEL.length),
    []
  );
  const prevSlide = useCallback(
    () => setSlide((s) => (s - 1 + CAROUSEL.length) % CAROUSEL.length),
    []
  );

  // Auto-play — restarts from 0 whenever slide changes (manual or auto)
  useEffect(() => {
    const t = setInterval(nextSlide, 4500);
    return () => clearInterval(t);
  }, [slide, nextSlide]);

  // Drag / swipe tracking
  const dragX = useRef<number | null>(null);
  const SWIPE_THRESHOLD = 50;

  const onPointerDown = (x: number) => { dragX.current = x; };
  const onPointerUp   = (x: number) => {
    if (dragX.current === null) return;
    const delta = dragX.current - x;
    if (delta >  SWIPE_THRESHOLD) nextSlide();
    else if (delta < -SWIPE_THRESHOLD) prevSlide();
    dragX.current = null;
  };

  return (
    <div className="min-h-screen bg-beige-100 text-warm-900">

      {/* ══ Header ═══════════════════════════════════════════════════════════ */}
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-beige-50/97 backdrop-blur-md shadow-sm shadow-beige-300/50"
            : "bg-transparent"
        )}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-5">

          <Link href="/">
            {scrolled ? <CompassCarLogo variant="light" /> : <CompassCarLogo variant="dark" />}
          </Link>

          {/* Desktop nav */}
          <nav className="ml-6 hidden items-center gap-6 text-sm font-medium lg:flex">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className={cn(
                  "transition-colors",
                  scrolled ? "text-warm-700 hover:text-warm-900" : "text-white/75 hover:text-white"
                )}
              >
                {n.label}
              </a>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-3">
            <LanguageSwitcher dark={!scrolled} />

            <Link
              href="/login"
              className={cn(
                "rounded-lg px-4 py-2 text-sm font-bold transition-colors",
                scrolled
                  ? "bg-caramel-500 text-white hover:bg-caramel-600"
                  : "bg-white/10 text-white ring-1 ring-white/25 hover:bg-white/18"
              )}
            >
              ログイン
            </Link>

            <button
              className={cn("lg:hidden", scrolled ? "text-warm-900" : "text-white")}
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="メニュー"
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="border-t border-beige-300 bg-beige-50 px-5 pb-4 lg:hidden">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={() => setMobileOpen(false)}
                className="block py-3 text-sm font-medium text-warm-700 hover:text-warm-900"
              >
                {n.label}
              </a>
            ))}
            <Link
              href="/login"
              className="mt-2 block rounded-lg bg-caramel-500 px-4 py-2.5 text-center text-sm font-bold text-white"
            >
              ログイン
            </Link>
          </div>
        )}
      </header>

      {/* ══ Hero Carousel ════════════════════════════════════════════════════ */}
      <section
        className="relative min-h-screen cursor-grab overflow-hidden bg-warm-900 select-none active:cursor-grabbing"
        onMouseDown={(e) => onPointerDown(e.clientX)}
        onMouseUp={(e)   => onPointerUp(e.clientX)}
        onMouseLeave={()  => { dragX.current = null; }}
        onTouchStart={(e) => onPointerDown(e.touches[0].clientX)}
        onTouchEnd={(e)   => onPointerUp(e.changedTouches[0].clientX)}
      >
        {/* Slides */}
        {CAROUSEL.map((src, i) => (
          <div
            key={src}
            className={cn(
              "absolute inset-0 transition-opacity duration-1000",
              i === slide ? "opacity-100" : "pointer-events-none opacity-0"
            )}
          >
            <Image
              src={src}
              alt=""
              fill
              sizes="100vw"
              className="object-cover"
              priority={i === 0}
            />
          </div>
        ))}

        {/* Warm overlay */}
        <div className="pointer-events-none absolute inset-0 bg-warm-900/25" />

        {/* Prev arrow */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-warm-900/35 text-white backdrop-blur-sm transition hover:bg-warm-900/60"
          aria-label="前へ"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* Next arrow */}
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-warm-900/35 text-white backdrop-blur-sm transition hover:bg-warm-900/60"
          aria-label="次へ"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Dot indicators */}
        <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 flex items-center gap-2">
          {CAROUSEL.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                i === slide ? "w-7 bg-white" : "w-2 bg-white/50 hover:bg-white/75"
              )}
              aria-label={`スライド ${i + 1}`}
            />
          ))}
        </div>
      </section>

      {/* ══ Features ══════════════════════════════════════════════════════════ */}
      <section className="bg-beige-100 py-24">
        <div className="mx-auto max-w-6xl px-5">
          <div className="mb-14 text-center">
            <span className="mb-4 inline-flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.28em] text-caramel-500">
              <span className="h-px w-6 bg-caramel-500/60" />Features<span className="h-px w-6 bg-caramel-500/60" />
            </span>
            <h2 className="text-3xl font-extrabold text-warm-900">
              外国人のお客様のための<br className="sm:hidden" />充実したサポート
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="rounded-xl bg-white p-6 ring-1 ring-beige-200 shadow-sm transition hover:shadow-md hover:ring-beige-300">
                  <span className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-caramel-400/15">
                    <Icon className="h-5 w-5 text-caramel-500" />
                  </span>
                  <h3 className="mb-2 text-sm font-bold text-warm-900">{f.title}</h3>
                  <p className="text-xs leading-relaxed text-warm-700">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ Vehicles ══════════════════════════════════════════════════════════ */}
      <section id="vehicles" className="scroll-mt-16 bg-beige-200 py-24">
        <div className="mx-auto max-w-6xl px-5">
          <div className="mb-14 text-center">
            <span className="mb-4 inline-flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.28em] text-caramel-500">
              <span className="h-px w-6 bg-caramel-500/60" />Vehicles<span className="h-px w-6 bg-caramel-500/60" />
            </span>
            <h2 className="text-3xl font-extrabold text-warm-900">車両を選ぶ</h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-warm-600">
              人数・目的・ご予算に合わせた豊富なラインナップをご用意しています
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {VEHICLES.map((v) => (
              <div
                key={v.tag}
                className={cn(
                  "relative overflow-hidden rounded-xl bg-white ring-1 ring-beige-200 shadow-sm transition-all hover:ring-caramel-400/50 hover:shadow-lg",
                  v.popular && "ring-caramel-400/50"
                )}
              >
                {v.popular && (
                  <span className="absolute left-4 top-4 z-10 rounded-full bg-caramel-500 px-3 py-0.5 text-[11px] font-bold text-white">
                    人気 No.1
                  </span>
                )}

                {/* Vehicle photo — full width */}
                <div className="relative h-44 w-full">
                  <Image src={v.image} alt={v.cls} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-warm-900/40 via-transparent to-transparent" />
                </div>

                <div className="p-5">
                  {/* Class + pax */}
                  <div className="mb-3 flex items-center justify-between">
                    <span className="rounded-md bg-beige-100 px-2.5 py-1 text-[11px] font-bold text-warm-700">
                      {v.tag} クラス
                    </span>
                    <span className="flex items-center gap-1 text-xs text-warm-600">
                      <Users className="h-3.5 w-3.5" /> {v.pax}
                    </span>
                  </div>

                  <h3 className="mb-0.5 text-lg font-extrabold text-warm-900">
                    {v.cls} <span className="text-sm font-normal text-warm-500">{v.en}</span>
                  </h3>
                  <p className="mb-4 text-xs text-warm-600">{v.examples}</p>

                  <div className="mb-4 border-t border-beige-200 pt-4">
                    <span className="text-[11px] text-warm-600">基本料金</span>
                    <p className="text-xl font-extrabold text-warm-900">{v.from}</p>
                    <p className="text-[10px] text-warm-500">※ 保険・オプション別途</p>
                  </div>

                  <Link
                    href="/search"
                    className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-caramel-500 py-2.5 text-sm font-bold text-white transition hover:bg-caramel-600"
                  >
                    この車両を予約 <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-8 text-center text-xs text-warm-500">
            ※ 上記は代表的な車種です。在庫状況によって異なります。詳細はお問い合わせください。
          </p>
        </div>
      </section>

      {/* ══ Process ═══════════════════════════════════════════════════════════ */}
      <section id="process" className="scroll-mt-16 bg-beige-100 py-24">
        <div className="mx-auto max-w-6xl px-5">
          <div className="mb-14 text-center">
            <span className="mb-4 inline-flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.28em] text-caramel-500">
              <span className="h-px w-6 bg-caramel-500/60" />How it works<span className="h-px w-6 bg-caramel-500/60" />
            </span>
            <h2 className="text-3xl font-extrabold text-warm-900">ご利用方法</h2>
          </div>

          <div className="relative grid gap-10 md:grid-cols-4">
            {/* Connector */}
            <div className="absolute left-[12.5%] right-[12.5%] top-7 hidden h-px bg-beige-300 md:block" />

            {STEPS.map((s) => (
              <div key={s.n} className="relative flex flex-col items-center text-center">
                <span className="relative z-10 mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-caramel-400/12 text-lg font-extrabold text-caramel-500 ring-1 ring-caramel-400/50 shadow-lg shadow-caramel-400/10">
                  {s.n}
                </span>
                <h3 className="mb-2 text-sm font-bold text-warm-900">{s.title}</h3>
                <p className="max-w-[200px] text-xs leading-relaxed text-warm-700">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-14 text-center">
            <Link
              href="/search"
              className="inline-flex items-center gap-2 rounded-lg bg-caramel-500 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-caramel-500/25 transition hover:bg-caramel-600"
            >
              今すぐ予約する <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ══ Insurance ═════════════════════════════════════════════════════════ */}
      <section id="insurance" className="scroll-mt-16 bg-beige-200 py-24">
        <div className="mx-auto max-w-6xl px-5">
          <div className="mb-14 text-center">
            <span className="mb-4 inline-flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.28em] text-caramel-500">
              <span className="h-px w-6 bg-caramel-500/60" />Insurance<span className="h-px w-6 bg-caramel-500/60" />
            </span>
            <h2 className="text-3xl font-extrabold text-warm-900">保険・補償プラン</h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-warm-600">
              外国人のお客様が安心してご利用いただけるよう、充実した保険プランをご用意しています
            </p>
          </div>

          <div className="mx-auto grid max-w-3xl gap-5 md:grid-cols-2">
            {INSURANCE_PLANS.map((p) => (
              <div
                key={p.name}
                className={cn(
                  "rounded-xl p-7",
                  p.highlight
                    ? "bg-warm-900 ring-2 ring-caramel-400/65 shadow-xl shadow-warm-900/50"
                    : "bg-white ring-1 ring-beige-300/70 shadow-sm"
                )}
              >
                {p.highlight && (
                  <span className="mb-4 inline-block rounded-full bg-caramel-300/25 px-3 py-0.5 text-[11px] font-bold text-caramel-300">
                    おすすめ
                  </span>
                )}
                <h3 className={cn("mb-1 font-bold", p.highlight ? "text-white" : "text-warm-900")}>{p.name}</h3>
                <p className={cn("mb-6 text-2xl font-extrabold", p.highlight ? "text-caramel-300" : "text-warm-900")}>
                  {p.price}
                </p>
                <ul className="space-y-2.5">
                  {p.features.map((f) => (
                    <li key={f} className={cn("flex items-center gap-2.5 text-sm", p.highlight ? "text-white/80" : "text-warm-700")}>
                      <CheckCircle2 className={cn("h-4 w-4 shrink-0", p.highlight ? "text-caramel-300" : "text-caramel-500")} />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ Stats ════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-warm-800 py-20">
        <div className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(196,120,48,0.18), transparent)" }} />
        <div className="relative mx-auto max-w-6xl px-5">
          <div className="grid gap-0 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 divide-beige-300/25 lg:divide-x lg:divide-y-0">
            {STATS.map((s) => (
              <div key={s.label} className="py-10 text-center lg:px-6">
                <p className="text-5xl font-extrabold text-caramel-300">{s.value}</p>
                <p className="mt-2.5 text-xs font-medium uppercase tracking-widest text-beige-200/75">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ Company ══════════════════════════════════════════════════════════ */}
      <section id="company" className="scroll-mt-16 bg-beige-100 py-24">
        <div className="mx-auto max-w-6xl px-5">
          <div className="mb-14 text-center">
            <span className="mb-4 inline-flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.28em] text-caramel-500">
              <span className="h-px w-6 bg-caramel-500/60" />Company<span className="h-px w-6 bg-caramel-500/60" />
            </span>
            <h2 className="text-3xl font-extrabold text-warm-900">会社案内</h2>
          </div>

          <div className="mx-auto max-w-2xl overflow-hidden rounded-xl ring-1 ring-beige-300">
            {[
              { label: "会社名",     value: "COMPASS CAR レンタカー株式会社" },
              { label: "所在地",     value: "〒100-0001 東京都千代田区千代田1-1" },
              { label: "電話番号",   value: "+81-72-490-3540" },
              { label: "メール",     value: "info@compass-car.jp" },
              { label: "対応言語",   value: "日本語 / English / 中文" },
              { label: "営業時間",   value: "9:00〜18:00（年中無休）" },
            ].map((r, i) => (
              <div
                key={r.label}
                className={cn(
                  "grid grid-cols-[140px_1fr] gap-4 px-6 py-4 text-sm",
                  i % 2 === 0 ? "bg-beige-50" : "bg-white",
                  i !== 0 && "border-t border-beige-200"
                )}
              >
                <dt className="font-medium text-warm-600">{r.label}</dt>
                <dd className="font-medium text-warm-900">{r.value}</dd>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ Contact ══════════════════════════════════════════════════════════ */}
      <section id="contact" className="scroll-mt-16 bg-beige-200 py-24">
        <div className="mx-auto max-w-3xl px-5 text-center">
          <span className="mb-4 inline-flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.28em] text-caramel-500">
            <span className="h-px w-6 bg-caramel-500/60" />Contact<span className="h-px w-6 bg-caramel-500/60" />
          </span>
          <h2 className="mb-4 text-3xl font-extrabold text-warm-900">お問い合わせ</h2>
          <p className="mb-12 text-sm text-warm-700">
            ご不明な点やご要望はお気軽にご連絡ください。多言語スタッフが対応いたします。
          </p>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { icon: Phone, label: "お電話",  val: "+81-72-490-3540",     sub: "9:00〜18:00" },
              { icon: Mail,  label: "メール",  val: "info@compass-car.jp", sub: "24時間受付" },
              { icon: MapPin,label: "主要拠点", val: "成田・羽田・新宿 他",  sub: "全国7店舗" },
            ].map((c) => {
              const Icon = c.icon;
              return (
                <div key={c.label} className="rounded-xl bg-white p-6 ring-1 ring-beige-200 shadow-sm text-left">
                  <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-caramel-400/15">
                    <Icon className="h-4.5 w-4.5 text-caramel-500" />
                  </span>
                  <p className="text-[11px] font-medium uppercase tracking-wider text-warm-600">{c.label}</p>
                  <p className="mt-1 text-sm font-bold text-warm-900">{c.val}</p>
                  <p className="mt-0.5 text-[11px] text-warm-500">{c.sub}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ Follow / SNS ══════════════════════════════════════════════════════ */}
      <section className="bg-warm-800 py-14">
        <div className="mx-auto max-w-6xl px-5 text-center">
          <span className="mb-3 inline-flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.28em] text-caramel-300">
            <span className="h-px w-6 bg-caramel-300/60" />Follow Us<span className="h-px w-6 bg-caramel-300/60" />
          </span>
          <h2 className="mb-2 text-2xl font-extrabold text-white">公式SNSで最新情報をチェック</h2>
          <p className="mb-8 text-sm text-beige-200/75">
            キャンペーン・新着車両・旅のヒントを各SNSで配信中。お問い合わせはWhatsAppからも承ります。
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {SOCIALS.map((s) => {
              const Icon = s.icon;
              return (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 rounded-xl bg-white/[0.06] p-4 ring-1 ring-white/10 transition hover:bg-white/[0.12] hover:ring-caramel-300/40"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-caramel-400/15 text-caramel-300 transition group-hover:bg-caramel-400/25">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 text-left">
                    <span className="block text-sm font-bold text-white">{s.label}</span>
                    <span className="block truncate text-xs text-beige-200/60">{s.handle}</span>
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ Footer ════════════════════════════════════════════════════════════ */}
      <footer className="border-t border-caramel-400/20 bg-warm-900 py-10">
        <div className="mx-auto max-w-6xl px-5">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <CompassCarLogo variant="dark" />
            <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              {NAV.map((n) => (
                <a key={n.href} href={n.href} className="text-xs text-beige-200/60 transition-colors hover:text-beige-100">
                  {n.label}
                </a>
              ))}
            </nav>
            <div className="flex items-center gap-3">
              {SOCIALS.map((s) => {
                const Icon = s.icon;
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-beige-200/60 ring-1 ring-white/10 transition hover:text-caramel-300 hover:ring-caramel-300/40"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
            <LanguageSwitcher dark />
          </div>
          <div className="mt-8 border-t border-white/12 pt-6 text-center">
            <p className="text-xs text-beige-200/45">© 2024 COMPASS CAR レンタカー株式会社. All rights reserved.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
