import { Brain, Zap, BarChart3, Trophy, Bookmark, Timer } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Feedback",
    description:
      "Get nuanced, line-by-line feedback on communication, technical depth, confidence, and problem solving after every mock interview.",
  },
  {
    icon: Timer,
    title: "Realistic Mock Interviews",
    description:
      "Run timed sessions with random or category-specific questions that mirror the on-site experience at top companies.",
  },
  {
    icon: BarChart3,
    title: "Progress Analytics",
    description:
      "Visualize streaks, accuracy, and study time with weekly charts so you always know what to work on next.",
  },
  {
    icon: Bookmark,
    title: "Smart Question Bank",
    description:
      "Hundreds of curated questions across 13 categories with bookmarks, notes, and completion tracking.",
  },
  {
    icon: Trophy,
    title: "Leaderboards & Badges",
    description:
      "Earn achievements and climb the global leaderboard as you build consistency and master new topics.",
  },
  {
    icon: Zap,
    title: "Daily Challenges",
    description: "A handpicked question every day keeps your skills sharp and your streak alive.",
  },
];

export function Features() {
  return (
    <section id="features" className="border-t border-border bg-background py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-primary">Why Intervize</p>
          <h2 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
            Everything you need to <span className="gradient-text">land the offer.</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            A complete preparation toolkit, designed by engineers who've sat on both sides of the
            table.
          </p>
        </div>
        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-7 transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-elegant"
            >
              <div className="bg-brand-gradient grid size-12 place-items-center rounded-xl text-white shadow-elegant">
                <f.icon className="size-6" strokeWidth={2.25} />
              </div>
              <h3 className="mt-5 text-lg font-bold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
