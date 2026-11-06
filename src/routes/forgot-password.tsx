import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, MailCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/forgot-password")({
  component: ForgotPassword,
});

const emailSchema = z.string().trim().email().max(255);

function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") ?? "");
    try {
      emailSchema.parse(email);
    } catch {
      toast.error("Please enter a valid email.");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setSent(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not send email");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-hero-radial">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Logo />
        <Link to="/auth" className="text-sm text-muted-foreground hover:text-foreground">
          ← Back to sign in
        </Link>
      </header>
      <main className="mx-auto max-w-md px-6 pb-16 pt-6">
        <div className="glass-strong rounded-3xl p-8 shadow-elegant">
          {sent ? (
            <div className="text-center">
              <div className="bg-brand-gradient mx-auto grid size-14 place-items-center rounded-2xl text-white">
                <MailCheck className="size-7" />
              </div>
              <h1 className="mt-5 text-2xl font-bold">Check your email</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                We've sent you a reset link. Follow the instructions to set a new password.
              </p>
              <Link
                to="/auth"
                className="mt-6 inline-block text-sm font-semibold text-primary hover:underline"
              >
                Back to sign in
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-3xl font-bold tracking-tight">Forgot your password?</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Enter your email and we'll send you a link to reset it.
              </p>
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-brand-gradient h-11 w-full text-white"
                >
                  {loading ? <Loader2 className="size-4 animate-spin" /> : "Send reset link"}
                </Button>
              </form>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
