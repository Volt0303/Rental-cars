import { PlaceholderPage } from "@/components/admin/PlaceholderPage";

export default function Page() {
  return (
    <PlaceholderPage
      titleKey="anav.reports"
      features={[
        "稼働率・予約数の推移レポート",
        "流入元（SNS）別の集客分析",
        "言語・国籍別の利用状況",
        "CSV / PDF エクスポート",
      ]}
    />
  );
}
