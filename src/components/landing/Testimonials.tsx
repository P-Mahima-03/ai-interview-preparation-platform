import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Priya Sharma",
    role: "SDE @ Microsoft",
    quote:
      "Intervize completely changed how I prepared. The AI feedback after each mock was sharper than any peer review I had.",
  },
  {
    name: "Arjun Patel",
    role: "SWE @ Google",
    quote:
      "Daily challenges kept me consistent for 90 days straight. Walked into my Google loop already in interview mode.",
  },
  {
    name: "Sara Chen",
    role: "Engineer @ Stripe",
    quote:
      "The DSA + behavioral coverage is unreal. I felt confident across every round, not just coding.",
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="bg-secondary/40 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-primary">
            Loved by Engineers
          </p>
          <h2 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
            From <span className="gradient-text">first interview</span> to first offer.
          </h2>
        </div>
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="rounded-2xl border border-border bg-card p-7 shadow-soft"
            >
              <div className="flex gap-1 text-warning">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-4 fill-current" />
                ))}
              </div>
              <blockquote className="mt-4 text-base leading-relaxed text-foreground">
                "{t.quote}"
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <div className="bg-brand-gradient grid size-10 place-items-center rounded-full text-sm font-bold text-white">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
