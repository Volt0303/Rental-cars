/**
 * Mock data for the Rentacar Pro demo. In production these would come from
 * Supabase (Postgres) via the API / server components. Kept in one file so the
 * front-end demo is fully self-contained.
 */

export type VehicleType =
  | "compact"
  | "minivan"
  | "suv"
  | "wagon"
  | "luxury";

export type Vehicle = {
  id: string;
  name: string;
  nameJa: string;
  plate: string;
  type: VehicleType;
  seats: number;
  transmission: "auto";
  fuel: "gas" | "diesel" | "ev";
  basePrice2Days: number;
  features: string[];
  recommended?: boolean;
  available: boolean;
  stockNote?: "last" | null;
  accent: string; // tailwind gradient classes for the thumbnail
  image?: string; // path to vehicle photo under /public
  store: string;  // which store location this vehicle is based at
};

export const VEHICLES: Vehicle[] = [
  {
    id: "alphard",
    name: "Toyota Alphard",
    nameJa: "トヨタ アルファード",
    plate: "品川 300 わ 12-34",
    type: "luxury",
    seats: 7,
    transmission: "auto",
    fuel: "gas",
    basePrice2Days: 24200,
    features: ["carNavi", "etc", "backCamera", "bluetooth"],
    recommended: true,
    available: true,
    stockNote: null,
    store: "成田空港店",
    accent: "from-slate-200 to-slate-400",
    image: "/car_sample/COLT-B-01.jpg",
  },
  {
    id: "hiace",
    name: "Toyota Hiace Grand Cabin",
    nameJa: "トヨタ ハイエース グランドキャビン",
    plate: "品川 400 わ 56-78",
    type: "minivan",
    seats: 10,
    transmission: "auto",
    fuel: "diesel",
    basePrice2Days: 18700,
    features: ["carNavi", "etc", "backCamera", "bluetooth"],
    available: true,
    stockNote: null,
    store: "羽田空港店",
    accent: "from-zinc-300 to-zinc-500",
    image: "/car_sample/COLT-B-02.jpg",
  },
  {
    id: "serena",
    name: "Nissan Serena",
    nameJa: "日産 セレナ",
    plate: "品川 500 わ 90-12",
    type: "minivan",
    seats: 8,
    transmission: "auto",
    fuel: "gas",
    basePrice2Days: 16500,
    features: ["carNavi", "etc", "backCamera", "bluetooth"],
    available: true,
    stockNote: "last",
    store: "新宿店",
    accent: "from-sky-200 to-sky-400",
    image: "/car_sample/COLT-R-02.jpg",
  },
  {
    id: "vclass",
    name: "Mercedes-Benz V-Class",
    nameJa: "メルセデス・ベンツ Vクラス",
    plate: "品川 330 わ 33-44",
    type: "luxury",
    seats: 7,
    transmission: "auto",
    fuel: "diesel",
    basePrice2Days: 35200,
    features: ["carNavi", "etc", "backCamera", "bluetooth"],
    available: true,
    stockNote: null,
    store: "渋谷店",
    accent: "from-neutral-300 to-neutral-500",
    image: "/car_sample/COLT-R-03.jpg",
  },
  {
    id: "modely",
    name: "Tesla Model Y",
    nameJa: "テスラ モデルY",
    plate: "品川 301 わ 77-88",
    type: "suv",
    seats: 5,
    transmission: "auto",
    fuel: "ev",
    basePrice2Days: 28600,
    features: ["carNavi", "etc", "backCamera", "bluetooth"],
    available: true,
    stockNote: null,
    store: "横浜店",
    accent: "from-rose-200 to-rose-400",
    image: "/car_sample/COLT-B-01.jpg",
  },
  {
    id: "prado",
    name: "Land Cruiser Prado",
    nameJa: "ランドクルーザー プラド",
    plate: "品川 302 わ 11-22",
    type: "suv",
    seats: 7,
    transmission: "auto",
    fuel: "diesel",
    basePrice2Days: 26400,
    features: ["carNavi", "etc", "backCamera", "bluetooth"],
    available: true,
    stockNote: null,
    store: "大阪店",
    accent: "from-emerald-200 to-emerald-400",
    image: "/car_sample/COLT-B-02.jpg",
  },
];

// ---- Dashboard KPIs ----
export const DASH_STATS = {
  todayReservations: 48,
  activeReservations: 31,
  availableVehicles: 22,
  inMaintenance: 4,
  pendingQuotes: 15,
};

// ---- Reservation schedule (week of 2024/05/20 - 05/26) ----
export type ScheduleStatus =
  | "confirmed" // green
  | "inUse" // blue
  | "returning" // orange
  | "reserved" // purple (VIP)
  | "maintenance"; // gray

export type ScheduleBar = {
  id: string;
  vehicleId: string;
  label: string;
  startDay: number; // 0 = Mon (5/20) ... 6 = Sun (5/26)
  startFrac: number; // fraction into the day (0-1)
  endDay: number;
  endFrac: number;
  status: ScheduleStatus;
  timeLabel: string;
};

export const SCHEDULE_VEHICLES = [
  { id: "alphard", name: "Toyota Alphard",       plate: "品川 300 わ 12-34", status: "available",   store: "成田空港店", category: "luxury"  },
  { id: "hiace",   name: "Toyota Hiace",          plate: "品川 400 わ 56-78", status: "inUse",       store: "羽田空港店", category: "minivan" },
  { id: "serena",  name: "Nissan Serena",          plate: "品川 500 わ 90-12", status: "available",   store: "新宿店",     category: "minivan" },
  { id: "vclass",  name: "Mercedes-Benz V-Class", plate: "品川 330 わ 33-44", status: "maintenance", store: "渋谷店",     category: "luxury"  },
  { id: "modely",  name: "Tesla Model Y",          plate: "品川 301 わ 77-88", status: "available",   store: "横浜店",     category: "suv"     },
  { id: "prado",   name: "Land Cruiser Prado",     plate: "品川 302 わ 11-22", status: "maintenance", store: "大阪店",     category: "suv"     },
] as const;

export const SCHEDULE_STORES = [
  "成田空港店", "羽田空港店", "新宿店", "渋谷店", "横浜店", "大阪店",
] as const;

export const WEEK_DAYS = [
  { date: "5/20", dow: "月" },
  { date: "5/21", dow: "火" },
  { date: "5/22", dow: "水" },
  { date: "5/23", dow: "木" },
  { date: "5/24", dow: "金" },
  { date: "5/25", dow: "土" },
  { date: "5/26", dow: "日" },
];

export const SCHEDULE_BARS: ScheduleBar[] = [
  { id: "b1", vehicleId: "alphard", label: "鈴木 太郎", startDay: 0, startFrac: 0.42, endDay: 2, endFrac: 0.75, status: "confirmed", timeLabel: "5/20 10:00 - 5/22 18:00" },
  { id: "b2", vehicleId: "alphard", label: "田中 花子", startDay: 3, startFrac: 0.38, endDay: 5, endFrac: 0.71, status: "confirmed", timeLabel: "5/23 09:00 - 5/25 17:00" },
  { id: "b3", vehicleId: "hiace", label: "株式会社ABC", startDay: 1, startFrac: 0.38, endDay: 4, endFrac: 0.75, status: "inUse", timeLabel: "5/21 09:00 - 5/24 18:00" },
  { id: "b4", vehicleId: "hiace", label: "佐藤 次郎", startDay: 5, startFrac: 0.42, endDay: 5, endFrac: 0.75, status: "inUse", timeLabel: "5/25 10:00 - 18:00" },
  { id: "b5", vehicleId: "serena", label: "山田 一郎", startDay: 0, startFrac: 0.33, endDay: 0, endFrac: 0.71, status: "inUse", timeLabel: "5/20 08:00 - 17:00" },
  { id: "b6", vehicleId: "serena", label: "高橋 美咲", startDay: 2, startFrac: 0.42, endDay: 4, endFrac: 0.67, status: "confirmed", timeLabel: "5/22 10:00 - 5/24 16:00" },
  { id: "b7", vehicleId: "serena", label: "予約済み", startDay: 6, startFrac: 0.38, endDay: 6, endFrac: 0.75, status: "returning", timeLabel: "5/26 09:00 - 18:00" },
  { id: "b8", vehicleId: "vclass", label: "VIP予約", startDay: 1, startFrac: 0.38, endDay: 6, endFrac: 0.75, status: "reserved", timeLabel: "5/21 09:00 - 5/26 18:00" },
  { id: "b9", vehicleId: "modely", label: "Michael Brown", startDay: 3, startFrac: 0.42, endDay: 5, endFrac: 0.67, status: "inUse", timeLabel: "5/23 10:00 - 5/25 16:00" },
  { id: "b10", vehicleId: "prado", label: "定期点検・整備", startDay: 0, startFrac: 0, endDay: 1, endFrac: 1, status: "maintenance", timeLabel: "5/20 〜 5/21" },
];

// ---- Recent inquiries ----
export type QuoteStatus = "new" | "sent" | "waiting";

export type Inquiry = {
  no: string;
  customer: string;
  lang: "en" | "ja" | "zh";
  flag: string;
  langLabel: string;
  vehicle: string;
  period: string;
  status: QuoteStatus;
  receivedAt: string;
};

export const INQUIRIES: Inquiry[] = [
  { no: "INQ-2024-0056", customer: "John Smith", lang: "en", flag: "🇺🇸", langLabel: "English", vehicle: "Toyota Alphard", period: "2024/06/10 - 2024/06/15", status: "waiting", receivedAt: "2024/05/20 14:30" },
  { no: "INQ-2024-0055", customer: "株式会社ABC 御中", lang: "ja", flag: "🇯🇵", langLabel: "日本語", vehicle: "Toyota Hiace", period: "2024/06/05 - 2024/06/07", status: "sent", receivedAt: "2024/05/20 11:15" },
  { no: "INQ-2024-0053", customer: "陈小明", lang: "zh", flag: "🇨🇳", langLabel: "中文", vehicle: "Mercedes-Benz V-Class", period: "2024/06/20 - 2024/06/25", status: "waiting", receivedAt: "2024/05/19 16:20" },
  { no: "INQ-2024-0052", customer: "Emma Wilson", lang: "en", flag: "🇬🇧", langLabel: "English", vehicle: "Tesla Model Y", period: "2024/06/08 - 2024/06/10", status: "sent", receivedAt: "2024/05/19 13:10" },
];

// ---- Maintenance alerts ----
export type AlertKind = "inspectionSoon" | "periodicInspection" | "oilChange" | "insuranceExpiry";

export type MaintenanceAlert = {
  kind: AlertKind;
  vehicle: string;
  dateKind: "expiry" | "scheduled";
  date: string;
  daysLater: number;
  severity: "red" | "orange";
};

export const ALERTS: MaintenanceAlert[] = [
  { kind: "inspectionSoon", vehicle: "品川 300 わ 12-34 (Alphard)", dateKind: "expiry", date: "2024/05/25", daysLater: 1, severity: "red" },
  { kind: "periodicInspection", vehicle: "品川 400 わ 56-78 (Hiace)", dateKind: "scheduled", date: "2024/05/28", daysLater: 4, severity: "orange" },
  { kind: "oilChange", vehicle: "品川 500 わ 90-12 (Serena)", dateKind: "scheduled", date: "2024/06/01", daysLater: 8, severity: "orange" },
  { kind: "insuranceExpiry", vehicle: "品川 330 わ 33-44 (V-Class)", dateKind: "expiry", date: "2024/06/15", daysLater: 22, severity: "orange" },
];

// ---- Today's returns ----
export const RETURNS = [
  { customer: "山田 一郎", vehicle: "Nissan Serena", time: "17:00" },
  { customer: "株式会社ABC", vehicle: "Toyota Hiace", time: "18:00" },
  { customer: "Michael Brown", vehicle: "Tesla Model Y", time: "16:00" },
  { customer: "高橋 美咲", vehicle: "Nissan Serena", time: "16:00" },
];

// ---- Documents (auto-generated from a reservation) ----
export const DOC_RESERVATION = {
  no: "RES-2024-0058",
  customer: "山田 太郎 / Taro Yamada",
  passport: "TZ1234567",
  license: "123456789012",
  vehicle: "Toyota Alphard（品川 300 わ 12-34）",
  period: "2024/06/15 10:00 〜 2024/06/17 18:00",
};

export type DocKind = "order" | "contract" | "inspection" | "consent";
export const DOC_KINDS: DocKind[] = ["order", "contract", "inspection", "consent"];

// ---- Options pricing ----
export const INSURANCE_OPTIONS = [
  { id: "cdw", nameKey: "options.cdw", descKey: "options.cdwDesc", price: 1100, recommended: true },
  { id: "scdw", nameKey: "options.scdw", descKey: "options.scdwDesc", price: 2200, recommended: false },
];

export const ADDITIONAL_OPTIONS = [
  { id: "carNavi", nameKey: "options.carNavi", descKey: "options.carNaviDesc", price: 550, icon: "navi" },
  { id: "etc", nameKey: "options.etc", descKey: "options.etcDesc", price: 0, icon: "etc" },
  { id: "childSeat", nameKey: "options.childSeat", descKey: "options.childSeatDesc", price: 550, icon: "child" },
  { id: "juniorSeat", nameKey: "options.juniorSeat", descKey: "options.juniorSeatDesc", price: 550, icon: "junior" },
  { id: "babySeat", nameKey: "options.babySeat", descKey: "options.babySeatDesc", price: 550, icon: "baby" },
  { id: "snowTire", nameKey: "options.snowTire", descKey: "options.snowTireDesc", price: 1100, icon: "tire" },
];

// ---- Search catalog (208 vehicles generated for the search/pagination demo) ----

const _CATALOG_STORES = ["成田空港店","羽田空港店","新宿店","渋谷店","横浜店","大阪店","名古屋店"];

const _CAR_IMAGES = [
  "/car_sample/COLT-B-01.jpg",
  "/car_sample/COLT-B-02.jpg",
  "/car_sample/COLT-R-02.jpg",
  "/car_sample/COLT-R-03.jpg",
];

const _CATALOG_TEMPLATES: Omit<Vehicle, "id" | "plate" | "available" | "stockNote" | "recommended" | "store">[] = [
  { name: "Toyota Alphard",           nameJa: "トヨタ アルファード",               type: "luxury",  seats: 7,  transmission: "auto", fuel: "gas",    basePrice2Days: 24200, features: ["carNavi","etc","backCamera","bluetooth"], accent: "from-slate-200 to-slate-400", image: _CAR_IMAGES[0] },
  { name: "Toyota Hiace Grand Cabin", nameJa: "トヨタ ハイエース グランドキャビン", type: "minivan", seats: 10, transmission: "auto", fuel: "diesel", basePrice2Days: 18700, features: ["carNavi","etc","backCamera","bluetooth"], accent: "from-zinc-300 to-zinc-500",   image: _CAR_IMAGES[1] },
  { name: "Nissan Serena",            nameJa: "日産 セレナ",                        type: "minivan", seats: 8,  transmission: "auto", fuel: "gas",    basePrice2Days: 16500, features: ["carNavi","etc","backCamera","bluetooth"], accent: "from-sky-200 to-sky-400",     image: _CAR_IMAGES[2] },
  { name: "Mercedes-Benz V-Class",    nameJa: "メルセデス・ベンツ Vクラス",         type: "luxury",  seats: 7,  transmission: "auto", fuel: "diesel", basePrice2Days: 35200, features: ["carNavi","etc","backCamera","bluetooth"], accent: "from-neutral-300 to-neutral-500", image: _CAR_IMAGES[3] },
  { name: "Tesla Model Y",            nameJa: "テスラ モデルY",                     type: "suv",     seats: 5,  transmission: "auto", fuel: "ev",     basePrice2Days: 28600, features: ["carNavi","etc","backCamera","bluetooth"], accent: "from-rose-200 to-rose-400",   image: _CAR_IMAGES[0] },
  { name: "Land Cruiser Prado",       nameJa: "ランドクルーザー プラド",             type: "suv",     seats: 7,  transmission: "auto", fuel: "diesel", basePrice2Days: 26400, features: ["carNavi","etc","backCamera","bluetooth"], accent: "from-emerald-200 to-emerald-400", image: _CAR_IMAGES[1] },
  { name: "Honda Odyssey",            nameJa: "ホンダ オデッセイ",                  type: "minivan", seats: 8,  transmission: "auto", fuel: "gas",    basePrice2Days: 15400, features: ["carNavi","etc","backCamera"],             accent: "from-blue-200 to-blue-400",  image: _CAR_IMAGES[2] },
  { name: "Toyota Vellfire",          nameJa: "トヨタ ヴェルファイア",              type: "luxury",  seats: 7,  transmission: "auto", fuel: "gas",    basePrice2Days: 22000, features: ["carNavi","etc","backCamera","bluetooth"], accent: "from-gray-200 to-gray-500",   image: _CAR_IMAGES[3] },
  { name: "Nissan Elgrand",           nameJa: "日産 エルグランド",                  type: "minivan", seats: 8,  transmission: "auto", fuel: "gas",    basePrice2Days: 17600, features: ["carNavi","etc","backCamera"],             accent: "from-indigo-200 to-indigo-400", image: _CAR_IMAGES[0] },
  { name: "Toyota Noah",              nameJa: "トヨタ ノア",                        type: "wagon",   seats: 7,  transmission: "auto", fuel: "gas",    basePrice2Days: 13200, features: ["carNavi","etc","backCamera"],             accent: "from-amber-200 to-amber-400", image: _CAR_IMAGES[1] },
  { name: "Toyota Voxy",              nameJa: "トヨタ ヴォクシー",                  type: "wagon",   seats: 7,  transmission: "auto", fuel: "gas",    basePrice2Days: 12100, features: ["carNavi","etc","backCamera"],             accent: "from-violet-200 to-violet-400", image: _CAR_IMAGES[2] },
  { name: "Honda Stepwgn",            nameJa: "ホンダ ステップワゴン",              type: "wagon",   seats: 8,  transmission: "auto", fuel: "gas",    basePrice2Days: 14300, features: ["carNavi","etc","backCamera"],             accent: "from-teal-200 to-teal-400",  image: _CAR_IMAGES[3] },
  { name: "Toyota RAV4",              nameJa: "トヨタ RAV4",                        type: "suv",     seats: 5,  transmission: "auto", fuel: "gas",    basePrice2Days: 19800, features: ["carNavi","etc","backCamera"],             accent: "from-orange-200 to-orange-400", image: _CAR_IMAGES[0] },
  { name: "Subaru Forester",          nameJa: "スバル フォレスター",                type: "suv",     seats: 5,  transmission: "auto", fuel: "gas",    basePrice2Days: 17600, features: ["carNavi","etc","backCamera"],             accent: "from-cyan-200 to-cyan-400",  image: _CAR_IMAGES[1] },
  { name: "Toyota Corolla",           nameJa: "トヨタ カローラ",                    type: "compact", seats: 5,  transmission: "auto", fuel: "gas",    basePrice2Days:  9900, features: ["carNavi","etc","backCamera"],             accent: "from-red-200 to-red-400",    image: _CAR_IMAGES[2] },
  { name: "Honda Fit",                nameJa: "ホンダ フィット",                    type: "compact", seats: 5,  transmission: "auto", fuel: "gas",    basePrice2Days:  8800, features: ["carNavi","backCamera"],                  accent: "from-pink-200 to-pink-400",  image: _CAR_IMAGES[3] },
];

function _generateCatalog(): Vehicle[] {
  const cities  = ["品川","練馬","足立","多摩","横浜","川崎","世田谷","相模","八王子","千葉"];
  const classes = ["300","301","302","330","400","500"];
  const hiras   = ["わ","を","あ","い","う"];
  const priceVars = [0.85, 0.90, 0.95, 1.00, 1.05, 1.10, 1.15];

  const result: Vehicle[] = [];
  let idx = 0;

  for (let copy = 0; copy < 13; copy++) {
    for (let t = 0; t < _CATALOG_TEMPLATES.length; t++) {
      const tpl = _CATALOG_TEMPLATES[t];
      const city = cities[Math.floor(idx / 6) % cities.length];
      const cls  = classes[idx % 6];
      const h    = hiras[Math.floor(idx / 30) % hiras.length];
      const n1   = String(10 + (idx % 90)).padStart(2, "0");
      const n2   = String(10 + ((idx * 7 + 13) % 90)).padStart(2, "0");

      const pv    = priceVars[(t + copy * 3) % priceVars.length];
      const price = Math.max(5000, Math.round((tpl.basePrice2Days * pv) / 100) * 100);

      const roll      = (idx * 3 + 7) % 10;
      const stockNote = roll === 3 ? ("last" as const) : null;
      const available = roll !== 8;
      const recommended = copy === 0 && t < 6;

      result.push({
        ...tpl,
        id: `cat-${idx}`,
        plate: `${city} ${cls} ${h} ${n1}-${n2}`,
        basePrice2Days: price,
        available,
        stockNote,
        recommended,
        store: _CATALOG_STORES[idx % _CATALOG_STORES.length],
      });
      idx++;
    }
  }
  return result;
}

export const SEARCH_VEHICLES: Vehicle[] = _generateCatalog();

// ---- Quotations (見積) ----
export type QuotationStatus = "draft" | "sent" | "accepted" | "expired";

export type QuotationItem = { label: string; amount: number };

export type Quotation = {
  id: string;
  customer: string;
  customerRoman: string;
  flag: string;
  lang: "en" | "ja" | "zh";
  langLabel: string;
  vehicle: string;
  period: string;
  days: number;
  status: QuotationStatus;
  createdAt: string;
  validUntil: string;
  items: QuotationItem[];
};

export const QUOTATIONS: Quotation[] = [
  {
    id: "QUO-2024-0061",
    customer: "John Smith", customerRoman: "John Smith", flag: "🇺🇸", lang: "en", langLabel: "English",
    vehicle: "Toyota Alphard", period: "2024/07/10 - 07/15", days: 5,
    status: "sent", createdAt: "2024/06/20", validUntil: "2024/06/27",
    items: [
      { label: "車両基本料金（5日）", amount: 60500 },
      { label: "車両保険 CDW（5日）", amount: 5500 },
      { label: "空港送迎サービス", amount: 3300 },
      { label: "カーナビ・ETC", amount: 2200 },
    ],
  },
  {
    id: "QUO-2024-0060",
    customer: "株式会社ABC 御中", customerRoman: "ABC Corp.", flag: "🇯🇵", lang: "ja", langLabel: "日本語",
    vehicle: "Toyota Hiace Grand Cabin", period: "2024/07/05 - 07/07", days: 2,
    status: "accepted", createdAt: "2024/06/19", validUntil: "2024/06/26",
    items: [
      { label: "車両基本料金（2日）", amount: 37400 },
      { label: "車両保険 プレミアム（2日）", amount: 4400 },
      { label: "チャイルドシート×2", amount: 2200 },
    ],
  },
  {
    id: "QUO-2024-0058",
    customer: "陈小明", customerRoman: "Chen Xiaoming", flag: "🇨🇳", lang: "zh", langLabel: "中文",
    vehicle: "Mercedes-Benz V-Class", period: "2024/07/20 - 07/25", days: 5,
    status: "sent", createdAt: "2024/06/18", validUntil: "2024/06/25",
    items: [
      { label: "車両基本料金（5日）", amount: 88000 },
      { label: "車両保険 プレミアム（5日）", amount: 11000 },
      { label: "空港送迎サービス", amount: 3300 },
    ],
  },
  {
    id: "QUO-2024-0057",
    customer: "Emma Wilson", customerRoman: "Emma Wilson", flag: "🇬🇧", lang: "en", langLabel: "English",
    vehicle: "Tesla Model Y", period: "2024/06/28 - 06/30", days: 2,
    status: "expired", createdAt: "2024/06/10", validUntil: "2024/06/17",
    items: [
      { label: "車両基本料金（2日）", amount: 28600 },
      { label: "車両保険 CDW（2日）", amount: 2200 },
    ],
  },
];

// ---- Customers (顧客台帳) ----
// Demonstrates the "enter once → reuse" concept: passport / license / contact
// captured at booking time, reused across reservations, documents and WhatsApp.
export type CustomerReservationStatus = "completed" | "active" | "upcoming" | "cancelled";

export type CustomerReservation = {
  id: string;
  vehicle: string;
  period: string;
  amount: number;
  status: CustomerReservationStatus;
};

export type WhatsAppMessage = {
  from: "customer" | "staff";
  text: string;
  time: string;
};

export type Customer = {
  id: string;
  nameJa: string;
  nameRoman: string;
  flag: string;
  nationality: string;
  lang: "en" | "ja" | "zh";
  email: string;
  phone: string;
  passport: string;
  license: string;
  registeredAt: string;
  lastUsed: string;
  reservations: CustomerReservation[];
  whatsapp: WhatsAppMessage[];
};

export const CUSTOMERS: Customer[] = [
  {
    id: "CUST-0001",
    nameJa: "山田 太郎",
    nameRoman: "Taro Yamada",
    flag: "🇯🇵",
    nationality: "日本",
    lang: "ja",
    email: "taro.yamada@example.com",
    phone: "080-1234-5678",
    passport: "TZ1234567",
    license: "123456789012",
    registeredAt: "2023/04/12",
    lastUsed: "2024/06/15",
    reservations: [
      { id: "RES-2024-0058", vehicle: "Toyota Alphard", period: "2024/06/15 - 06/17", amount: 31460, status: "active" },
      { id: "RES-2024-0021", vehicle: "Nissan Serena",  period: "2024/03/02 - 03/05", amount: 24200, status: "completed" },
      { id: "RES-2023-0142", vehicle: "Toyota Alphard", period: "2023/12/28 - 01/03", amount: 52800, status: "completed" },
    ],
    whatsapp: [
      { from: "customer", text: "予約の受け取り場所を確認したいです。", time: "06/14 10:21" },
      { from: "staff",    text: "成田空港第1ターミナル到着ロビーでお待ちしております。", time: "06/14 10:25" },
      { from: "customer", text: "ありがとうございます！", time: "06/14 10:26" },
    ],
  },
  {
    id: "CUST-0002",
    nameJa: "ジョン スミス",
    nameRoman: "John Smith",
    flag: "🇺🇸",
    nationality: "アメリカ",
    lang: "en",
    email: "john.smith@example.com",
    phone: "+1 415-555-0188",
    passport: "US8842019",
    license: "D-USA-77120",
    registeredAt: "2024/02/08",
    lastUsed: "2024/06/10",
    reservations: [
      { id: "RES-2024-0056", vehicle: "Tesla Model Y", period: "2024/06/10 - 06/15", amount: 71500, status: "completed" },
      { id: "RES-2024-0009", vehicle: "Tesla Model Y", period: "2024/01/20 - 01/24", amount: 57200, status: "completed" },
    ],
    whatsapp: [
      { from: "customer", text: "Can I extend the rental by one day?", time: "06/13 18:02" },
      { from: "staff",    text: "Yes, we can extend until 06/16. The extra fee is ¥14,300.", time: "06/13 18:10" },
      { from: "customer", text: "Perfect, please proceed.", time: "06/13 18:12" },
    ],
  },
  {
    id: "CUST-0004",
    nameJa: "陳 小明",
    nameRoman: "Chen Xiaoming",
    flag: "🇨🇳",
    nationality: "中国",
    lang: "zh",
    email: "chen.xm@example.com",
    phone: "+86 138-0013-8000",
    passport: "CN7733210",
    license: "CHN-9981-220",
    registeredAt: "2024/05/18",
    lastUsed: "2024/06/20",
    reservations: [
      { id: "RES-2024-0053", vehicle: "Mercedes-Benz V-Class", period: "2024/06/20 - 06/25", amount: 88000, status: "upcoming" },
    ],
    whatsapp: [
      { from: "customer", text: "可以提供中文的合同吗？", time: "06/18 14:30" },
      { from: "staff",    text: "可以，我们会准备中文版的租赁合同。", time: "06/18 14:36" },
    ],
  },
  {
    id: "CUST-0005",
    nameJa: "エマ ウィルソン",
    nameRoman: "Emma Wilson",
    flag: "🇬🇧",
    nationality: "イギリス",
    lang: "en",
    email: "emma.wilson@example.com",
    phone: "+44 7700-900123",
    passport: "GB4410927",
    license: "UK-EMMA-4410",
    registeredAt: "2023/09/22",
    lastUsed: "2024/06/08",
    reservations: [
      { id: "RES-2024-0052", vehicle: "Tesla Model Y",  period: "2024/06/08 - 06/10", amount: 28600, status: "completed" },
      { id: "RES-2024-0014", vehicle: "Toyota Hiace",   period: "2024/02/14 - 02/18", amount: 37400, status: "completed" },
      { id: "RES-2023-0098", vehicle: "Nissan Serena",  period: "2023/10/01 - 10/04", amount: 24750, status: "cancelled" },
    ],
    whatsapp: [
      { from: "staff",    text: "Thank you for choosing COMPASS CAR! Your pick-up is confirmed.", time: "06/07 16:00" },
      { from: "customer", text: "Thanks, see you tomorrow!", time: "06/07 16:05" },
    ],
  },
  {
    id: "CUST-0006",
    nameJa: "株式会社ABC（佐藤）",
    nameRoman: "ABC Corp. (Sato)",
    flag: "🇯🇵",
    nationality: "日本",
    lang: "ja",
    email: "sato@abc-corp.co.jp",
    phone: "03-5555-0042",
    passport: "—",
    license: "987654321098",
    registeredAt: "2023/06/30",
    lastUsed: "2024/06/05",
    reservations: [
      { id: "RES-2024-0055", vehicle: "Toyota Hiace", period: "2024/06/05 - 06/07", amount: 37400, status: "completed" },
      { id: "RES-2024-0031", vehicle: "Toyota Hiace", period: "2024/04/10 - 04/12", amount: 37400, status: "completed" },
      { id: "RES-2024-0007", vehicle: "Toyota Hiace", period: "2024/01/15 - 01/18", amount: 56100, status: "completed" },
      { id: "RES-2023-0120", vehicle: "Toyota Hiace", period: "2023/11/20 - 11/22", amount: 37400, status: "completed" },
    ],
    whatsapp: [
      { from: "customer", text: "来月の社員旅行で再度お願いします。", time: "06/04 11:00" },
      { from: "staff",    text: "いつもありがとうございます。詳細をお送りください。", time: "06/04 11:15" },
    ],
  },
];
