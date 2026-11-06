import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { CATEGORY_ICONS } from "@/lib/categories";

const categories = [
  { slug: "java", name: "Java" },
  { slug: "dsa", name: "Data Structures & Algorithms" },
  { slug: "sql", name: "SQL" },
  { slug: "dbms", name: "DBMS" },
  { slug: "os", name: "Operating Systems" },
  { slug: "cn", name: "Computer Networks" },
  { slug: "oop", name: "OOP" },
  { slug: "html", name: "HTML" },
  { slug: "css", name: "CSS" },
  { slug: "javascript", name: "JavaScript" },
  { slug: "aptitude", name: "Aptitude" },
  { slug: "hr", name: "HR Interview" },
  { slug: "behavioral", name: "Behavioral" },
];

export function Categories() {
  return (
    <section id="categories" className="bg-secondary/40 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary">
              Interview Categories
            </p>
            <h2 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
              Practice across <span className="gradient-text">13 categories.</span>
            </h2>
          </div>
          <Link to="/auth" className="text-sm font-semibold text-primary hover:underline">
            Browse all questions <ArrowRight className="inline size-4" />
          </Link>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((c) => {
            const Icon = CATEGORY_ICONS[c.slug] ?? CATEGORY_ICONS.javascript;
            return (
              <Link
                key={c.slug}
                to="/auth"
                className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-elegant"
              >
                <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="size-5" />
                </span>
                <span className="text-sm font-semibold">{c.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
