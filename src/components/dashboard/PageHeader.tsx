import { Link } from "@tanstack/react-router";
import { ChevronRight, Home } from "lucide-react";
import type { ReactNode } from "react";

export type Crumb = { label: string; to?: string };

export function PageHeader({
  title,
  description,
  crumbs = [],
  actions,
}: {
  title: string;
  description?: string;
  crumbs?: Crumb[];
  actions?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link to="/dashboard" className="flex items-center gap-1 hover:text-foreground">
            <Home className="size-3.5" /> Dashboard
          </Link>
          {crumbs.map((c, i) => (
            <span key={i} className="flex items-center gap-1.5">
              <ChevronRight className="size-3.5" />
              {c.to ? (
                <Link to={c.to} className="hover:text-foreground">
                  {c.label}
                </Link>
              ) : (
                <span className="text-foreground">{c.label}</span>
              )}
            </span>
          ))}
        </nav>
        <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">{title}</h1>
        {description && (
          <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}
