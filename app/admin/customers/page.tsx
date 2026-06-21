import { PlaceholderPage } from "@/components/admin/PlaceholderPage";

export default function Page() {
  return (
    <PlaceholderPage
      titleKey="anav.customers"
      features={[
        "顧客台帳（パスポート・免許証情報）",
        "予約・対応履歴の一元管理",
        "WhatsApp 対応履歴の紐付け",
        "リピーター・国籍別の分析",
      ]}
    />
  );
}
