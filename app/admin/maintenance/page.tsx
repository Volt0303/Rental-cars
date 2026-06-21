import { PlaceholderPage } from "@/components/admin/PlaceholderPage";

export default function Page() {
  return (
    <PlaceholderPage
      titleKey="anav.maintenance"
      features={[
        "車検・点検・整備スケジュール",
        "オイル交換・消耗品の管理",
        "自賠責・任意保険の期限アラート",
        "整備履歴の記録",
      ]}
    />
  );
}
