import { Brain, TrendingUp, Target, MessageCircle } from "lucide-react";

const scores = [
  { label: "Technical Knowledge", value: 88, icon: Brain, color: "var(--brand-blue)" },
  { label: "Communication", value: 76, icon: MessageCircle, color: "var(--brand-purple)" },
  { label: "Confidence", value: 82, icon: TrendingUp, color: "var(--primary)" },
  { label: "Problem Solving", value: 95, icon: Target, color: "var(--brand-violet)" },
];

export function AIFeedback() {
  return (
    <section className="relative overflow-hidden bg-background py-24">
      <div className="bg-brand-gradient absolute -top-40 left-1/2 -z-10 size-[600px] -translate-x-1/2 rounded-full opacity-10 blur-3xl" />
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary">
              AI Feedback Engine
            </p>
            <h2 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
              <span className="gradient-text">Expert insights,</span> instantly.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              After every mock interview, our AI generates a detailed evaluation of your performance
              — highlighting strengths, weaknesses, and concrete improvement suggestions calibrated
              for engineering interviews.
            </p>
            <ul className="mt-8 space-y-4">
              {[
                "Overall rating with weighted criteria",
                "Specific strengths to keep doing",
                "Targeted weaknesses to fix",
                "Actionable suggestions for next session",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1 grid size-5 place-items-center rounded-full bg-primary/15 text-primary">
                    ✓
                  </span>
                  <span className="text-sm text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass-strong rounded-3xl p-8 shadow-elegant">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold">Latest Analysis</h3>
                <p className="text-xs text-muted-foreground">Session #842 • 2h ago</p>
              </div>
              <div className="text-right">
                <div className="gradient-text text-5xl font-extrabold">92</div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Overall
                </p>
              </div>
            </div>
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
              {scores.map((s) => (
                <div key={s.label} className="rounded-xl border border-border bg-card/60 p-4">
                  <div className="flex items-center gap-2">
                    <s.icon className="size-4" style={{ color: s.color }} />
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {s.label}
                    </span>
                  </div>
                  <div className="mt-2 flex items-baseline justify-between">
                    <span className="text-2xl font-bold">{s.value}</span>
                    <span className="text-xs text-muted-foreground">/100</span>
                  </div>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${s.value}%`, backgroundColor: s.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
