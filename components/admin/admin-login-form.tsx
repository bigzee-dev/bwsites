"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2, Mail } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { AdminTextField } from "@/components/admin/admin-text-field";
import { AdminPasswordField } from "@/components/admin/admin-password-field";
import { AdminFormError } from "@/components/admin/admin-form-error";

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const { error: signInError } = await authClient.signIn.email({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message ?? "Invalid email or password.");
      setLoading(false);
      return;
    }

    router.refresh();
  }

  return (
    <div className="w-full max-w-sm">
      <span className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.18em] text-brand-blue-700 uppercase dark:text-brand-blue-300">
        <span className="h-px w-6 bg-brand-yellow-dark dark:bg-brand-yellow-light" />
        Sign in
      </span>
      <h2 className="mt-3 font-[family-name:var(--font-admin-display)] text-3xl font-medium tracking-tight">
        Good to see you again.
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Enter your credentials to reach the dashboard.
      </p>

      <form onSubmit={handleSubmit} className="mt-9 flex flex-col gap-6">
        {error ? <AdminFormError message={error} /> : null}

        <AdminTextField
          id="email"
          label="Email"
          icon={Mail}
          type="email"
          autoComplete="email"
          placeholder="admin@bwsites.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          disabled={loading}
          required
        />

        <AdminPasswordField
          id="password"
          label="Password"
          autoComplete="current-password"
          placeholder="••••••••"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          disabled={loading}
          required
        />

        <Button type="submit" disabled={loading} size="lg" className="w-full">
          {loading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <>
              Sign in
              <ArrowRight className="size-4" />
            </>
          )}
        </Button>
      </form>

      <p className="mt-8 text-xs text-muted-foreground/80">
        This console is restricted to the site administrator.
      </p>
    </div>
  );
}
