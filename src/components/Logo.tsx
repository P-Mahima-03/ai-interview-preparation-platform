import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

export function Logo({ to = "/" }: { to?: string }) {
  return (
    <Link to={to} className="group flex items-center gap-2.5">
      <span className="bg-brand-gradient grid size-9 place-items-center rounded-xl shadow-elegant transition-transform group-hover:scale-105">
        <Sparkles className="size-4.5 text-white" strokeWidth={2.5} />
      </span>
      <span className="text-lg font-bold tracking-tight">
        <span className="gradient-text">Intervize</span>
        <span className="text-foreground"> AI</span>
      </span>
    </Link>
  );
}
