import { PlaceholderPage } from "@/components/admin/PlaceholderPage";

export default function Page() {
  return (
    <PlaceholderPage
      titleKey="anav.quotations"
      features={[
        "見積依頼の一覧・ステータス管理",
        "見積書PDFの自動作成・送付",
        "多言語見積テンプレート",
        "予約・顧客情報との連携",
      ]}
    />
  );
}
