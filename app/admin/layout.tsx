import type { Metadata } from "next";
import { Montserrat, Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { getAdminSession } from "@/lib/admin/auth";
import { getCategories } from "@/lib/admin/categories";

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

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getAdminSession();
  const categories = session ? await getCategories() : [];

  return (
    <div
      className={`${montserrat.variable} ${inter.variable} flex flex-1 flex-col font-[family-name:var(--font-admin-sans)]`}
    >
      {session ? (
        <div className="flex min-h-svh flex-1 bg-background">
          <AdminSidebar user={session.user} />
          <div className="flex min-w-0 flex-1 flex-col">
            <AdminHeader user={session.user} categories={categories} />
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
              {children}
            </main>
          </div>
        </div>
      ) : (
        children
      )}
      <Toaster />
    </div>
  );
}
