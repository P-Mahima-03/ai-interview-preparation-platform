import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Moon, Sun, Save, Lock, Bell } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/dashboard/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const { user } = useAuth();
  const { theme, toggle } = useTheme();
  const qc = useQueryClient();

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("*").eq("id", user!.id).maybeSingle();
      return data;
    },
  });

  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [saving, setSaving] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);
  const [notif, setNotif] = useState({ daily: true, tips: true, achievements: true });

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name ?? "");
      setBio(profile.bio ?? "");
    }
  }, [profile]);

  async function saveProfile(e: FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ full_name: fullName, bio })
        .eq("id", user.id);
      if (error) throw error;
      qc.invalidateQueries({ queryKey: ["profile", user.id] });
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update");
    } finally {
      setSaving(false);
    }
  }

  async function changePassword(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const password = String(fd.get("password") ?? "");
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    setPwSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success("Password updated");
      e.currentTarget.reset();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update password");
    } finally {
      setPwSaving(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Manage your profile, security, and notifications."
        crumbs={[{ label: "Settings" }]}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <form
          onSubmit={saveProfile}
          className="rounded-2xl border border-border bg-card p-6 lg:col-span-2"
        >
          <h2 className="text-lg font-bold">Profile</h2>
          <p className="text-xs text-muted-foreground">Update your public profile.</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={user?.email ?? ""} disabled />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="fullName">Full name</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                maxLength={80}
              />
            </div>
          </div>
          <div className="mt-4 space-y-1.5">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={300}
              placeholder="Tell us a bit about yourself…"
            />
          </div>
          <div className="mt-6 flex justify-end">
            <Button type="submit" disabled={saving} className="bg-brand-gradient text-white">
              {saving ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <>
                  <Save className="mr-2 size-4" /> Save changes
                </>
              )}
            </Button>
          </div>
        </form>

        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-2 text-sm font-bold">
              {theme === "dark" ? <Moon className="size-4" /> : <Sun className="size-4" />}
              Appearance
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Switch between light and dark themes.
            </p>
            <div className="mt-5 flex items-center justify-between rounded-xl border border-border bg-secondary/50 p-3">
              <span className="text-sm font-medium capitalize">{theme} mode</span>
              <Switch checked={theme === "dark"} onCheckedChange={toggle} />
            </div>
          </div>

          <form onSubmit={changePassword} className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-2 text-sm font-bold">
              <Lock className="size-4" /> Change password
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Minimum 6 characters.</p>
            <Input
              type="password"
              name="password"
              className="mt-4"
              placeholder="New password"
              required
              minLength={6}
            />
            <Button
              type="submit"
              disabled={pwSaving}
              className="mt-3 w-full bg-brand-gradient text-white"
            >
              {pwSaving ? <Loader2 className="size-4 animate-spin" /> : "Update password"}
            </Button>
          </form>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 lg:col-span-3">
          <div className="flex items-center gap-2 text-sm font-bold">
            <Bell className="size-4" /> Notifications
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Choose which alerts you want to receive.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {(
              [
                ["daily", "Daily reminders", "A gentle nudge to keep your streak alive."],
                ["tips", "Interview tips", "Weekly insights from senior engineers."],
                ["achievements", "Achievement alerts", "Get pinged when you unlock a badge."],
              ] as const
            ).map(([k, label, desc]) => (
              <div
                key={k}
                className="flex items-start justify-between rounded-xl border border-border bg-secondary/40 p-4"
              >
                <div className="pr-3">
                  <p className="text-sm font-semibold">{label}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
                <Switch
                  checked={notif[k]}
                  onCheckedChange={(v) => setNotif((n) => ({ ...n, [k]: v }))}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
