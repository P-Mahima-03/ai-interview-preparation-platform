import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Flame,
  Target,
  Trophy,
  Timer,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  PlayCircle,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { WeeklyChart } from "@/components/dashboard/WeeklyChart";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardHome,
});

// Generate a stable weekly activity dataset (placeholder data, deterministic).
const weeklyData = [
  { day: "Mon", questions: 5, minutes: 32 },
  { day: "Tue", questions: 8, minutes: 48 },
  { day: "Wed", questions: 3, minutes: 22 },
  { day: "Thu", questions: 10, minutes: 65 },
  { day: "Fri", questions: 6, minutes: 40 },
  { day: "Sat", questions: 12, minutes: 80 },
  { day: "Sun", questions: 9, minutes: 55 },
];

function DashboardHome() {
  const { user } = useAuth();
  const firstName =
    (user?.user_metadata?.full_name as string | undefined)?.split(" ")[0] ??
    user?.email?.split("@")[0] ??
    "there";

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const { data: completedCount } = useQuery({
    queryKey: ["progress-count", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { count } = await supabase
        .from("progress")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user!.id)
        .eq("completed", true);
      return count ?? 0;
    },
  });

  const { data: dailyChallenge, isLoading: loadingChallenge } = useQuery({
    queryKey: ["daily-challenge"],
    queryFn: async () => {
      // Deterministic "of the day" pick — same question for all users today.
      const { data } = await supabase
        .from("questions")
        .select("id, title, question, difficulty, category_id, interview_categories(name, slug)")
        .limit(50);
      if (!data || data.length === 0) return null;
      const seed = new Date().toISOString().slice(0, 10);
      const idx = Array.from(seed).reduce((a, c) => a + c.charCodeAt(0), 0) % data.length;
      return data[idx];
    },
  });

  const { data: lastMock } = useQuery({
    queryKey: ["last-mock", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from("mock_interviews")
        .select("id, started_at, status, score, interview_categories(name)")
        .eq("user_id", user!.id)
        .order("started_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      return data;
    },
  });

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${firstName} 👋`}
        description="Here's a snapshot of your interview prep journey."
        actions={
          <Link to="/dashboard/mock">
            <Button className="bg-brand-gradient text-white hover:opacity-95">
              <PlayCircle className="mr-2 size-4" /> Start Mock Interview
            </Button>
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Daily Streak"
          value={`${profile?.daily_streak ?? 0}d`}
          icon={Flame}
          tone="warning"
          delta="Keep it up!"
        />
        <StatCard
          label="Completed"
          value={completedCount ?? 0}
          icon={CheckCircle2}
          tone="success"
        />
        <StatCard label="XP Earned" value={profile?.xp ?? 0} icon={Trophy} tone="primary" />
        <StatCard label="Study Time" value={`${profile?.total_study_minutes ?? 0}m`} icon={Timer} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-6 lg:col-span-2">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <h3 className="text-lg font-bold">Weekly Activity</h3>
              <p className="text-xs text-muted-foreground">Questions answered and time studied</p>
            </div>
            <span className="text-xs font-semibold text-success">+18% vs last week</span>
          </div>
          <WeeklyChart data={weeklyData} />
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
            <Sparkles className="size-3.5" /> Daily Challenge
          </div>
          {loadingChallenge ? (
            <div className="mt-4 space-y-3">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-9 w-32" />
            </div>
          ) : dailyChallenge ? (
            <>
              <h3 className="mt-3 text-base font-bold leading-snug">{dailyChallenge.title}</h3>
              <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                {dailyChallenge.question}
              </p>
              <div className="mt-3 flex gap-2">
                <span className="rounded-md bg-primary/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
                  {(dailyChallenge.interview_categories as { name?: string } | null)?.name ??
                    "General"}
                </span>
                <span className="rounded-md bg-warning/15 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-warning-foreground">
                  {dailyChallenge.difficulty}
                </span>
              </div>
              <Link to="/dashboard/questions" className="mt-5 inline-block">
                <Button size="sm" variant="outline">
                  Solve now <ArrowRight className="ml-2 size-3.5" />
                </Button>
              </Link>
            </>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">No challenge today.</p>
          )}
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="text-lg font-bold">Continue Learning</h3>
          <p className="mt-1 text-xs text-muted-foreground">Pick up where you left off.</p>
          {lastMock ? (
            <div className="mt-5 rounded-xl border border-border bg-secondary/50 p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-bold">
                    {(lastMock.interview_categories as { name?: string } | null)?.name ??
                      "Mock Interview"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(lastMock.started_at).toLocaleString()}
                  </p>
                </div>
                <span className="rounded-md bg-primary/10 px-2 py-1 text-xs font-bold uppercase tracking-wider text-primary">
                  {lastMock.status}
                </span>
              </div>
              <Link to="/dashboard/mock" className="mt-4 inline-block">
                <Button size="sm" className="bg-brand-gradient text-white">
                  Resume <ArrowRight className="ml-2 size-3.5" />
                </Button>
              </Link>
            </div>
          ) : (
            <div className="mt-5 rounded-xl border border-dashed border-border p-6 text-center">
              <Target className="mx-auto size-6 text-muted-foreground" />
              <p className="mt-2 text-sm font-medium">No mock interviews yet</p>
              <p className="text-xs text-muted-foreground">Start your first one in seconds.</p>
              <Link to="/dashboard/mock" className="mt-4 inline-block">
                <Button size="sm" className="bg-brand-gradient text-white">
                  Start now
                </Button>
              </Link>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="text-lg font-bold">Recent Activity</h3>
          <p className="mt-1 text-xs text-muted-foreground">Your last few actions.</p>
          <ul className="mt-5 space-y-3">
            {[
              { t: "Solved Two Sum (DSA)", time: "2h ago", color: "bg-success" },
              { t: "Bookmarked “What is OOP?”", time: "5h ago", color: "bg-primary" },
              { t: "Completed mock interview", time: "1d ago", color: "bg-warning" },
              { t: "Earned “7-day streak” badge", time: "2d ago", color: "bg-brand-purple" },
            ].map((a) => (
              <li key={a.t} className="flex items-center gap-3 text-sm">
                <span className={`size-2 rounded-full ${a.color}`} />
                <span className="flex-1 text-foreground">{a.t}</span>
                <span className="text-xs text-muted-foreground">{a.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
