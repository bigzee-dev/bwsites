"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export function AdminLogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    await authClient.signOut();
    router.refresh();
  }

  return (
    <Button type="button" variant="outline" disabled={loading} onClick={handleLogout}>
      <LogOut className="size-4" strokeWidth={1.75} />
      {loading ? "Signing out…" : "Sign out"}
    </Button>
  );
}
