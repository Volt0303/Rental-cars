"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Eye, EyeOff, ArrowRight, ArrowLeft,
  Building2, Users, Loader2, Shield,
} from "lucide-react";
import { CompassCarLogo } from "@/components/CompassCarLogo";

// ── Placeholder credentials (replace with real auth later) ───────────────────
const DEMO_USERS = [
  {
    email:    "admin@compass-car.jp",
    password: "admin2024",
    role:     "admin"    as const,
    label:    "管理者",
    dest:     "/admin",
  },
  {
    email:    "guest@compass-car.jp",
    password: "guest2024",
    role:     "customer" as const,
    label:    "お客様",
    dest:     "/search",
  },
];

export default function LoginPage() {
  const router = useRouter();

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPwd,  setShowPwd]  = useState(false);
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  const fill = (role: "admin" | "customer") => {
    const u = DEMO_USERS.find((u) => u.role === role)!;
    setEmail(u.email);
    setPassword(u.password);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    const user = DEMO_USERS.find((u) => u.email === email && u.password === password);
    if (!user) {
      setError("メールアドレスまたはパスワードが正しくありません");
      setLoading(false);
      return;
    }
    router.push(user.dest);
  };

  return (
    <div className="flex min-h-screen bg-slate-50">

      {/* ── Left branding panel (desktop only) ── */}
      <div className="hidden flex-col justify-between bg-navy-900 p-10 lg:flex lg:w-[420px] lg:shrink-0">
        <CompassCarLogo variant="dark" />

        <div>
          <h2 className="mb-4 text-3xl font-extrabold leading-tight text-white">
            外国人のお客様に<br />寄り添う<br />
            <span className="text-brand-400">レンタカーサービス</span>
          </h2>
          <p className="mb-8 text-sm leading-relaxed text-slate-400">
            多言語対応スタッフが空港でお出迎え。
            予約から書類・保険まで安心のワンストップサポート。
          </p>
          <ul className="space-y-3">
            {[
              "管理者ログインで予約・書類・スケジュール管理",
              "お客様ログインで車両検索・オンライン予約",
            ].map((t) => (
              <li key={t} className="flex items-start gap-2.5 text-sm text-slate-300">
                <Shield className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
                {t}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-[11px] text-slate-600">
          © 2024 COMPASS CAR レンタカー株式会社
        </p>
      </div>

      {/* ── Right login panel ── */}
      <div className="flex flex-1 flex-col items-center justify-center px-5 py-12">

        {/* Mobile logo */}
        <div className="mb-8 lg:hidden">
          <div className="inline-flex items-center justify-center rounded-2xl bg-navy-900 p-3">
            <CompassCarLogo variant="dark" />
          </div>
        </div>

        <div className="w-full max-w-sm">
          <h1 className="mb-1 text-2xl font-extrabold text-slate-800">ログイン</h1>
          <p className="mb-8 text-sm text-slate-500">アカウントにサインインしてください</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-600">
                メールアドレス <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                placeholder="example@compass-car.jp"
                required
                autoComplete="email"
                className="w-full rounded-lg border-0 bg-white px-3.5 py-2.5 text-sm text-slate-800 shadow-sm ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            {/* Password */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-600">
                パスワード <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  placeholder="パスワードを入力"
                  required
                  autoComplete="current-password"
                  className="w-full rounded-lg border-0 bg-white px-3.5 py-2.5 pr-10 text-sm text-slate-800 shadow-sm ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label={showPwd ? "パスワードを隠す" : "パスワードを表示"}
                >
                  {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-lg bg-rose-50 px-3.5 py-2.5 text-xs text-rose-600 ring-1 ring-rose-100">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-brand-700 disabled:opacity-60"
            >
              {loading ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> ログイン中...</>
              ) : (
                <><ArrowRight className="h-4 w-4" /> ログイン</>
              )}
            </button>
          </form>

          {/* Demo quick-fill */}
          <div className="mt-8">
            <div className="relative mb-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-slate-50 px-3 text-xs text-slate-400">アカウントを選択</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Admin */}
              <button
                type="button"
                onClick={() => fill("admin")}
                className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-3 py-3 text-left shadow-sm transition hover:border-brand-300 hover:bg-brand-50"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-100">
                  <Building2 className="h-4 w-4 text-brand-600" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-700">管理者</p>
                  <p className="truncate text-[10px] text-slate-400">admin@compass-car.jp</p>
                </div>
              </button>

              {/* Customer */}
              <button
                type="button"
                onClick={() => fill("customer")}
                className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-3 py-3 text-left shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100">
                  <Users className="h-4 w-4 text-emerald-600" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-700">お客様</p>
                  <p className="truncate text-[10px] text-slate-400">guest@compass-car.jp</p>
                </div>
              </button>
            </div>

            <p className="mt-3 text-center text-[10px] text-slate-400">
              クリックで認証情報を自動入力 → ログインボタンを押してください
            </p>
          </div>

          {/* Back link */}
          <div className="mt-8 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 transition hover:text-slate-600"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> トップページに戻る
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
