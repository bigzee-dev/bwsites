"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2, Mail, User } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { AdminTextField } from "@/components/admin/admin-text-field";
import { AdminPasswordField } from "@/components/admin/admin-password-field";
import { AdminFormError } from "@/components/admin/admin-form-error";

export function AdminSignUpForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { error: signUpError } = await authClient.signUp.email({
      name,
      email,
      password,
    });

    if (signUpError) {
      setError(signUpError.message ?? "Could not create the admin account.");
      setLoading(false);
      return;
    }

    router.refresh();
  }

  return (
    <div className="w-full max-w-sm">
      <span className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.18em] text-brand-blue-700 uppercase dark:text-brand-blue-300">
        <span className="h-px w-6 bg-brand-yellow-dark dark:bg-brand-yellow-light" />
        First-time setup
      </span>
      <h2 className="mt-3 font-[family-name:var(--font-admin-display)] text-3xl font-medium tracking-tight">
        Let&apos;s get your console live.
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        No admin exists yet. Register the one and only admin account.
      </p>

      <form onSubmit={handleSubmit} className="mt-9 flex flex-col gap-6">
        {error ? <AdminFormError message={error} /> : null}

        <AdminTextField
          id="name"
          label="Name"
          icon={User}
          type="text"
          autoComplete="name"
          placeholder="Jane Admin"
          value={name}
          onChange={(event) => setName(event.target.value)}
          disabled={loading}
          required
        />

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
          autoComplete="new-password"
          placeholder="At least 8 characters"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          disabled={loading}
          minLength={8}
          required
        />

        <AdminPasswordField
          id="confirm-password"
          label="Confirm password"
          autoComplete="new-password"
          placeholder="Re-enter password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          disabled={loading}
          minLength={8}
          required
        />

        <Button type="submit" disabled={loading} size="lg" className="w-full">
          {loading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <>
              Create admin account
              <ArrowRight className="size-4" />
            </>
          )}
        </Button>
      </form>

      <p className="mt-8 text-xs text-muted-foreground/80">
        You can only do this once — this becomes the permanent admin account.
      </p>
    </div>
  );
}
