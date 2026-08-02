import type { Metadata } from "next";
import { Montserrat, Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";

const montserrat = Montserrat({
  variable: "--font-admin-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const inter = Inter({
  variable: "--font-admin-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Admin · BW Sites",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className={`${montserrat.variable} ${inter.variable} flex flex-1 flex-col font-[family-name:var(--font-admin-sans)]`}
    >
      {children}
      <Toaster />
    </div>
  );
}
