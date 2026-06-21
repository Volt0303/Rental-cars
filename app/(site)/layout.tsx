import { BookingProvider } from "@/lib/booking-context";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <BookingProvider>{children}</BookingProvider>;
}
