import { PlaceholderPage } from "@/components/admin/PlaceholderPage";

export default function Page() {
  return (
    <PlaceholderPage
      titleKey="anav.systemSettings"
      features={[
        "スタッフアカウント・権限管理",
        "対応言語の追加・編集",
        "WhatsApp / SNS 連携設定",
        "データのバックアップ",
      ]}
    />
  );
}
