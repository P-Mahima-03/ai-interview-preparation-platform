import type { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  delta,
  icon: Icon,
  tone = "default",
}: {
  label: string;
  value: string | number;
  delta?: string;
  icon: LucideIcon;
  tone?: "default" | "primary" | "success" | "warning";
}) {
  const toneClass =
    tone === "primary"
      ? "from-primary/15 text-primary"
      : tone === "success"
        ? "from-success/15 text-success"
        : tone === "warning"
          ? "from-warning/20 text-warning-foreground"
          : "from-muted text-foreground";

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-elegant">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
          {delta && <p className="mt-1 text-xs font-medium text-success">{delta}</p>}
        </div>
        <span
          className={`grid size-10 place-items-center rounded-xl bg-gradient-to-br ${toneClass} to-transparent`}
        >
          <Icon className="size-5" />
        </span>
      </div>
    </div>
  );
}
