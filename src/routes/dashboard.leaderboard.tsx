import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Trophy, Crown, Medal } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export const Route = createFileRoute("/dashboard/leaderboard")({
  component: LeaderboardPage,
});

// Dummy global leaderboard. In production this comes from an aggregation view.
const DUMMY = [
  { name: "Ada Lovelace", xp: 9820, streak: 64 },
  { name: "Linus Torvalds", xp: 8775, streak: 58 },
  { name: "Margaret Hamilton", xp: 8120, streak: 51 },
  { name: "Grace Hopper", xp: 7710, streak: 47 },
  { name: "Dennis Ritchie", xp: 6900, streak: 39 },
  { name: "Ken Thompson", xp: 6440, streak: 35 },
  { name: "Barbara Liskov", xp: 6020, streak: 32 },
  { name: "Donald Knuth", xp: 5610, streak: 29 },
  { name: "Tim Berners-Lee", xp: 5180, streak: 27 },
  { name: "Brian Kernighan", xp: 4920, streak: 22 },
];

function LeaderboardPage() {
  const { user } = useAuth();

  const { data: me, isLoading } = useQuery({
    queryKey: ["profile", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("full_name, xp, daily_streak")
        .eq("id", user!.id)
        .maybeSingle();
      return data;
    },
  });

  const meName = me?.full_name || user?.email?.split("@")[0] || "You";
  const meRow = { name: meName, xp: me?.xp ?? 0, streak: me?.daily_streak ?? 0, isMe: true };

  // Insert "you" into the dummy leaderboard and re-rank
  const merged = [...DUMMY.map((r) => ({ ...r, isMe: false })), meRow]
    .sort((a, b) => b.xp - a.xp)
    .map((r, i) => ({ ...r, rank: i + 1 }));
  const top = merged.slice(0, 3);
  const rest = merged.slice(3);

  return (
    <div>
      <PageHeader
        title="Leaderboard"
        description="Compete with engineers around the world."
        crumbs={[{ label: "Leaderboard" }]}
      />

      <Tabs defaultValue="global">
        <TabsList>
          <TabsTrigger value="global">Global</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="top">Top Learners</TabsTrigger>
        </TabsList>

        <TabsContent value="global" className="mt-6 space-y-6">
          {isLoading ? <Skeleton className="h-40 w-full rounded-2xl" /> : <PodiumRow top={top} />}
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            <table className="w-full text-sm">
              <thead className="bg-secondary/60 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-5 py-3 text-left">Rank</th>
                  <th className="px-5 py-3 text-left">Engineer</th>
                  <th className="px-5 py-3 text-right">Streak</th>
                  <th className="px-5 py-3 text-right">XP</th>
                </tr>
              </thead>
              <tbody>
                {rest.map((r) => (
                  <tr
                    key={`${r.name}-${r.rank}`}
                    className={`border-t border-border ${r.isMe ? "bg-primary/5" : ""}`}
                  >
                    <td className="px-5 py-3 font-mono font-bold">#{r.rank}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <span className="bg-brand-gradient grid size-8 place-items-center rounded-full text-xs font-bold text-white">
                          {r.name.charAt(0)}
                        </span>
                        <span className="font-medium">
                          {r.name}
                          {r.isMe && (
                            <span className="ml-2 rounded bg-primary/15 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                              You
                            </span>
                          )}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-right">{r.streak}d</td>
                    <td className="px-5 py-3 text-right font-bold">{r.xp.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="weekly" className="mt-6">
          <div className="rounded-2xl border border-border bg-card p-8 text-center">
            <Trophy className="mx-auto size-8 text-primary" />
            <p className="mt-3 text-sm text-muted-foreground">
              Weekly rankings reset every Monday. Earn XP this week to climb.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="top" className="mt-6">
          <PodiumRow top={top} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function PodiumRow({ top }: { top: { name: string; xp: number; rank: number; isMe?: boolean }[] }) {
  const icons = [Crown, Medal, Trophy];
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {top.map((r, i) => {
        const Icon = icons[i];
        const tones = [
          "from-warning/30 to-warning/0 border-warning/40",
          "from-muted to-transparent border-border",
          "from-accent/30 to-transparent border-accent/40",
        ];
        return (
          <div
            key={r.name + r.rank}
            className={`rounded-2xl border bg-gradient-to-b ${tones[i]} p-6 text-center`}
          >
            <Icon className="mx-auto size-7 text-warning" />
            <div className="bg-brand-gradient mx-auto mt-3 grid size-14 place-items-center rounded-full text-lg font-bold text-white">
              {r.name.charAt(0)}
            </div>
            <p className="mt-3 font-bold">
              {r.name}
              {r.isMe && (
                <span className="ml-2 rounded bg-primary/15 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                  You
                </span>
              )}
            </p>
            <p className="text-xs text-muted-foreground">
              #{r.rank} · {r.xp.toLocaleString()} XP
            </p>
          </div>
        );
      })}
    </div>
  );
}
