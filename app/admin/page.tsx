import { adminExists, getAdminSession } from "@/lib/admin/auth";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { AdminSignUpForm } from "@/components/admin/admin-signup-form";
import { AdminBrandPanel } from "@/components/admin/admin-brand-panel";
import { DashboardHome } from "@/components/admin/dashboard-home";
import { DashboardShell } from "@/components/admin/dashboard-shell";
import { getCategories } from "@/lib/admin/categories";
import { getDashboardStats } from "@/lib/admin/dashboard";

export default async function AdminPage() {
  const session = await getAdminSession();

  if (session) {
    const [stats, categories] = await Promise.all([getDashboardStats(), getCategories()]);

    return (
      <DashboardShell title="Home" user={session.user} categories={categories}>
        <DashboardHome stats={stats} />
      </DashboardShell>
    );
  }

  const hasAdmin = await adminExists();

  const brandCopy = hasAdmin
    ? {
        eyebrow: "Admin console",
        heading: "Good to see you again.",
        description: "Sign in to manage the directory of Botswana's finest websites.",
      }
    : {
        eyebrow: "First launch",
        heading: "Let's get your console live.",
        description:
          "Create the one and only admin account. It's the only account you'll ever need for this dashboard.",
      };

  return (
    <div className="grid flex-1 lg:grid-cols-[46%_54%]">
      <AdminBrandPanel {...brandCopy} />

      <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-background px-6 py-14 sm:px-10 lg:px-16">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 [background-image:radial-gradient(circle,var(--border)_1px,transparent_1px)] [background-size:22px_22px] opacity-40"
        />

        <div className="relative">
          {hasAdmin ? <AdminLoginForm /> : <AdminSignUpForm />}
        </div>
      </div>
    </div>
  );
}
