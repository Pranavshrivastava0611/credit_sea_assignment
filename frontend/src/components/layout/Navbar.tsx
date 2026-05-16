"use client";
import { useAuth } from "@/hooks/useAuth";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function Navbar() {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 h-16 backdrop-blur-xl border-b flex items-center justify-between px-6"
      style={{ background: "var(--navbar-bg)", borderColor: "var(--glass-border)" }}
    >
      <div>
        <h2 className="text-sm" style={{ color: "rgb(var(--color-text-muted))" }}>Welcome back,</h2>
        <p className="font-semibold" style={{ color: "rgb(var(--color-text))" }}>{user?.name || "User"}</p>
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-xs font-medium text-primary-hover">{user?.role}</span>
        </div>
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
          <span className="text-sm font-bold text-white">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </span>
        </div>
      </div>
    </header>
  );
}
