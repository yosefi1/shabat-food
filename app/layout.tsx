import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";

const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  variable: "--font-heebo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "שבת פוד | אוכל ביתי לשבת",
  description:
    "הזמינו אוכל ביתי טעים לשבת — חלות טריות, מנות עיקריות, סלטים וקינוחים. משלוח לבית עד יום שישי.",
  keywords: ["שבת", "אוכל ביתי", "חלה", "עוף צלוי", "משלוח שישי"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl" className={heebo.variable}>
      <body className="min-h-screen antialiased">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
