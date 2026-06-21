import { PlaceholderPage } from "@/components/admin/PlaceholderPage";

export default function Page() {
  return (
    <PlaceholderPage
      titleKey="anav.vehicles"
      features={[
        "車両台帳（車種・ナンバー・装備）",
        "稼働率・空車状況の可視化",
        "料金プラン設定",
        "車両写真・ステータス管理",
      ]}
    />
  );
}
