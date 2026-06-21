import { PlaceholderPage } from "@/components/admin/PlaceholderPage";

export default function Page() {
  return (
    <PlaceholderPage
      titleKey="anav.settings"
      features={[
        "店舗・営業時間の設定",
        "料金・オプションの初期設定",
        "メール・通知テンプレート",
        "書類フォーマットの管理",
      ]}
    />
  );
}
