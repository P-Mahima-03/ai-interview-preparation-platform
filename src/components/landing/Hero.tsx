import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-hero-radial pt-24 pb-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              <Sparkles className="size-3.5" />
              AI-Powered Career Growth
            </div>
            <h1 className="mt-6 text-balance text-5xl font-extrabold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
              Master the <span className="gradient-text">Technical Interview</span> with AI.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
              Real-time coding challenges, behavioral simulations, and instant expert feedback
              tailored for top-tier software engineering roles.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link to="/auth" search={{ mode: "signup" }}>
                <Button
                  size="lg"
                  className="bg-brand-gradient h-12 px-8 text-base font-semibold text-white shadow-elegant hover:opacity-95"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 size-4" />
                </Button>
              </Link>
              <a href="#features">
                <Button size="lg" variant="outline" className="h-12 px-8 text-base font-semibold">
                  See How It Works
                </Button>
              </a>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              {["13 interview categories", "AI feedback on every mock", "Free to start"].map(
                (item) => (
                  <li key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-success" />
                    {item}
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Visual preview card */}
          <div className="relative animate-fade-in-up [animation-delay:120ms]">
            <div className="bg-brand-gradient absolute -inset-6 -z-10 rounded-[2rem] opacity-20 blur-3xl" />
            <div className="glass-strong rounded-3xl p-6 shadow-elegant">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="size-2.5 rounded-full bg-destructive/70" />
                  <span className="size-2.5 rounded-full bg-warning/70" />
                  <span className="size-2.5 rounded-full bg-success/70" />
                </div>
                <span className="text-xs font-mono text-muted-foreground">Mock Session #842</span>
              </div>
              <div className="rounded-2xl bg-secondary/60 p-5">
                <p className="text-sm font-semibold">
                  Q: Design a rate limiter for a distributed API.
                </p>
                <div className="mt-3 flex gap-2">
                  <span className="rounded-md bg-primary/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
                    System Design
                  </span>
                  <span className="rounded-md bg-warning/15 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-warning-foreground">
                    Hard
                  </span>
                </div>
              </div>

              <div className="mt-5 space-y-4">
                {[
                  { label: "Technical", value: 88, color: "var(--brand-blue)" },
                  { label: "Communication", value: 76, color: "var(--brand-purple)" },
                  { label: "Problem Solving", value: 95, color: "var(--primary)" },
                ].map((m) => (
                  <div key={m.label}>
                    <div className="mb-1.5 flex justify-between text-xs font-medium">
                      <span className="text-muted-foreground">{m.label}</span>
                      <span className="text-foreground">{m.value}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${m.value}%`, backgroundColor: m.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-xl border border-border bg-card/60 p-4 text-sm">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  AI Insight
                </p>
                <p className="mt-1.5 text-foreground">
                  Strong intuition for token-bucket. Consider eventual consistency across regions
                  next time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
