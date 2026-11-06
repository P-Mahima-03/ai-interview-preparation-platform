import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/reset-password")({
  component: ResetPassword,
});

const passwordSchema = z.string().min(6).max(72);

function ResetPassword() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  // Supabase recovery flow appends type=recovery in the URL hash. The auth client
  // parses it on load and we listen for the PASSWORD_RECOVERY event.
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const password = String(fd.get("password") ?? "");
    try {
      passwordSchema.parse(password);
    } catch {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success("Password updated. You're signed in.");
      navigate({ to: "/dashboard" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-hero-radial">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Logo />
      </header>
      <main className="mx-auto max-w-md px-6 pb-16 pt-6">
        <div className="glass-strong rounded-3xl p-8 shadow-elegant">
          <h1 className="text-3xl font-bold tracking-tight">Set a new password</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {ready
              ? "Choose a strong password to secure your account."
              : "Waiting for your reset link... Use the link from your email to continue."}
          </p>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="password">New password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="At least 6 characters"
                required
                minLength={6}
                disabled={!ready}
              />
            </div>
            <Button
              type="submit"
              disabled={loading || !ready}
              className="bg-brand-gradient h-11 w-full text-white"
            >
              {loading ? <Loader2 className="size-4 animate-spin" /> : "Update password"}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            <Link to="/auth" className="font-semibold text-primary hover:underline">
              Back to sign in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
