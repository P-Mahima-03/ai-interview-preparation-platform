import { useState } from "react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard,
  BookOpen,
  Sparkles,
  Trophy,
  Settings,
  LogOut,
  Menu,
  X,
  Moon,
  Sun,
  Search,
  Bell,
} from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/Logo";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/hooks/use-theme";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

const navItems = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/dashboard/questions", label: "Questions", icon: BookOpen },
  { to: "/dashboard/mock", label: "Mock Interview", icon: Sparkles },
  { to: "/dashboard/leaderboard", label: "Leaderboard", icon: Trophy },
  { to: "/dashboard/settings", label: "Settings", icon: Settings },
] as const;

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar mobileOpen={open} onClose={() => setOpen(false)} />
      <div className="lg:pl-64">
        <TopBar onMenu={() => setOpen(true)} />
        <main className="px-4 py-8 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-7xl animate-fade-in-up">{children}</div>
        </main>
      </div>
    </div>
  );
}

function Sidebar({ mobileOpen, onClose }: { mobileOpen: boolean; onClose: () => void }) {
  const location = useLocation();
  const navigate = useNavigate();

  async function signOut() {
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({ to: "/" });
  }

  return (
    <>
      {/* mobile overlay */}
      {mobileOpen && (
        <button
          aria-label="Close menu"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-foreground/30 backdrop-blur-sm lg:hidden"
        />
      )}
      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 w-64 transform border-r border-sidebar-border bg-sidebar transition-transform lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        <div className="flex h-16 items-center justify-between px-5">
          <Logo to="/dashboard" />
          <button
            onClick={onClose}
            className="grid size-9 place-items-center rounded-md text-sidebar-foreground/70 hover:bg-sidebar-accent lg:hidden"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        </div>
        <nav className="mt-4 flex flex-col gap-1 px-3">
          {navItems.map((item) => {
            const active =
              item.to === "/dashboard"
                ? location.pathname === "/dashboard"
                : location.pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={[
                  "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-elegant"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                ].join(" ")}
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="absolute inset-x-3 bottom-4">
          <button
            onClick={signOut}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
          >
            <LogOut className="size-4" />
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}

function TopBar({ onMenu }: { onMenu: () => void }) {
  const { theme, toggle } = useTheme();
  const { user } = useAuth();
  const initial =
    (user?.user_metadata?.full_name as string | undefined)?.charAt(0)?.toUpperCase() ??
    user?.email?.charAt(0)?.toUpperCase() ??
    "U";

  return (
    <header className="sticky top-0 z-30 glass border-b border-border/60">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-10">
        <button
          onClick={onMenu}
          className="grid size-9 place-items-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="size-5" />
        </button>
        <div className="relative ml-1 flex-1 max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search questions, topics…" className="h-9 pl-9" />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="grid size-9 place-items-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </button>
          <button
            aria-label="Notifications"
            className="relative grid size-9 place-items-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <Bell className="size-4" />
            <span className="absolute right-2 top-2 size-1.5 rounded-full bg-destructive" />
          </button>
          <div className="bg-brand-gradient grid size-9 place-items-center rounded-full text-sm font-bold text-white">
            {initial}
          </div>
        </div>
      </div>
    </header>
  );
}
