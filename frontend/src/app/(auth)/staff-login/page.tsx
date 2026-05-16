"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { cn } from "@/lib/utils";

const STAFF_ROLES = [
  { role: "Admin", email: "admin@lms.com", password: "Admin@123", icon: "🛡️", desc: "Full system access" },
  { role: "Sales", email: "sales@lms.com", password: "Sales@123", icon: "📊", desc: "Lead management" },
  { role: "Sanction", email: "sanction@lms.com", password: "Sanction@123", icon: "✅", desc: "Approve/Reject" },
  { role: "Disbursement", email: "disburse@lms.com", password: "Disburse@123", icon: "💸", desc: "Fund release" },
  { role: "Collection", email: "collection@lms.com", password: "Collect@123", icon: "📥", desc: "Payment tracking" },
];

export default function StaffLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeRole, setActiveRole] = useState<string | null>(null);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password, "staff");
    } catch {
      // error handled in hook
    } finally {
      setLoading(false);
    }
  };

  const selectRole = (staff: typeof STAFF_ROLES[0]) => {
    setEmail(staff.email);
    setPassword(staff.password);
    setActiveRole(staff.role);
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden" style={{ background: "rgb(var(--color-bg))" }}>
      {/* Theme toggle */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Left panel — staff role selector */}
      <div 
        className="hidden lg:flex lg:w-[420px] relative flex-col" 
        style={{ 
          background: "rgb(var(--color-bg-secondary))", 
          borderRight: "1px solid var(--glass-border)" 
        }}
      >
        {/* Header */}
        <div className="p-8 border-b" style={{ borderColor: "var(--glass-border)" }}>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <span className="text-white font-bold text-sm">CS</span>
            </div>
            <div>
              <h2 className="font-bold text-base" style={{ color: "rgb(var(--color-text))" }}>Staff Portal</h2>
              <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "rgb(var(--color-text-muted))" }}>LMS Operations</p>
            </div>
          </div>
        </div>

        {/* Role cards */}
        <div className="flex-1 p-6 space-y-3 overflow-y-auto">
          <p className="text-[11px] uppercase tracking-widest font-extrabold px-1 mb-4" style={{ color: "rgb(var(--color-text-muted))" }}>Quick Demo Access</p>
          {STAFF_ROLES.map((staff) => (
            <motion.button
              key={staff.role}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => selectRole(staff)}
              className={cn(
                "w-full text-left p-4 rounded-xl transition-all duration-200 border",
                activeRole === staff.role
                  ? "bg-amber-500/10 border-amber-500/30 shadow-md"
                  : "bg-white/50 dark:bg-black/20 border-transparent hover:border-amber-500/20"
              )}
            >
              <div className="flex items-start gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0 shadow-inner",
                  activeRole === staff.role ? "bg-amber-500/20" : "bg-black/5 dark:bg-white/5"
                )}>
                  {staff.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold" style={{ color: activeRole === staff.role ? "rgb(var(--color-text))" : "rgb(var(--color-text-secondary))" }}>
                      {staff.role}
                    </span>
                    {activeRole === staff.role && (
                      <span className="w-2 h-2 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50" />
                    )}
                  </div>
                  <p className="text-xs mt-1" style={{ color: "rgb(var(--color-text-muted))" }}>{staff.desc}</p>
                  <p className="text-[10px] font-mono mt-1.5 opacity-60" style={{ color: "rgb(var(--color-text-muted))" }}>{staff.email}</p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Bottom indicator */}
        <div className="p-6 border-t" style={{ borderColor: "var(--glass-border)" }}>
          <div className="flex items-center gap-2 text-xs font-medium" style={{ color: "rgb(var(--color-text-muted))" }}>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Role-based access enforced</span>
          </div>
        </div>
      </div>

      {/* Right panel — login form */}
      <div className="flex-1 flex items-center justify-center px-6 relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-amber-500/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-indigo-500/5 rounded-full blur-[100px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md relative z-10"
        >
          <div className="mb-10 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6">
              <span className="text-amber-600 dark:text-amber-400 text-[10px] font-bold uppercase tracking-widest">Internal Portal</span>
            </div>
            <h2 className="text-3xl font-extrabold" style={{ color: "rgb(var(--color-text))" }}>Staff Authentication</h2>
            <p className="mt-2" style={{ color: "rgb(var(--color-text-secondary))" }}>Enter your credentials to access the operations dashboard.</p>
          </div>

          <div className="glass-card p-8 border-t-2 border-t-amber-500 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Staff Email"
                id="staff-login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ops@creditsea.com"
                required
              />
              <Input
                label="Password"
                id="staff-login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />

              {activeRole && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 flex items-center gap-3"
                >
                  <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  <span className="text-xs font-medium" style={{ color: "rgb(var(--color-text-secondary))" }}>
                    Logging in as <span className="font-bold" style={{ color: "rgb(var(--color-text))" }}>{activeRole}</span>
                  </span>
                </motion.div>
              )}

              <Button
                type="submit"
                loading={loading}
                className="w-full h-12 !bg-gradient-to-r !from-amber-500 !to-orange-600 !shadow-amber-500/25 shadow-xl font-bold"
                size="lg"
              >
                Access Dashboard
              </Button>
            </form>
          </div>

          {/* Mobile role selector hint */}
          <div className="lg:hidden mt-10">
            <p className="text-[10px] uppercase tracking-widest font-bold mb-4 text-center" style={{ color: "rgb(var(--color-text-muted))" }}>Quick Demo Accounts</p>
            <div className="grid grid-cols-2 gap-3">
              {STAFF_ROLES.slice(0, 4).map((staff) => (
                <button
                  key={staff.role}
                  type="button"
                  onClick={() => selectRole(staff)}
                  className={cn(
                    "text-left p-3 rounded-xl transition-all border",
                    activeRole === staff.role
                      ? "bg-amber-500/10 border-amber-500/30"
                      : "bg-white/50 dark:bg-black/20 border-transparent"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{staff.icon}</span>
                    <span className="text-xs font-bold" style={{ color: "rgb(var(--color-text))" }}>{staff.role}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* User login link */}
          <div className="mt-10 text-center">
            <Link 
              href="/login" 
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all border group"
              style={{ 
                background: "rgb(var(--color-bg-secondary))",
                borderColor: "var(--glass-border)",
                color: "rgb(var(--color-text-secondary))"
              }}
            >
              <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Borrower?</span>
              <span className="text-indigo-600 dark:text-indigo-400">User Login →</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
