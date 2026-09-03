import type { Metadata } from "next";
import { Montserrat, DM_Sans, JetBrains_Mono } from "next/font/google";
import { Footer } from "@/components/client/footer";
import { PublicOnly } from "@/components/client/public-only";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "OnlineSpot",
  description:
    "Discover reliable websites, essential services, and the best online resources Botswana has to offer.",
  icons: {
    icon: "/logo/onlinespot-yellow.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${dmSans.variable} ${jetbrainsMono.variable} antialiased`}
    >
      <body className="flex min-h-svh flex-col bg-cream-50 font-sans">
        {children}

        <PublicOnly>
          <Footer />
        </PublicOnly>
      </body>
    </html>
  );
}
