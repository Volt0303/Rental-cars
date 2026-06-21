import { PlaceholderPage } from "@/components/admin/PlaceholderPage";

export default function Page() {
  return (
    <PlaceholderPage
      titleKey="anav.sales"
      features={[
        "売上・入金管理（現金・ETC精算）",
        "月次・車両別の売上集計",
        "オプション別の売上分析",
        "請求・領収データの出力",
      ]}
    />
  );
}
