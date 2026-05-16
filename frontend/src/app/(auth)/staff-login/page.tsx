"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

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
    <div className="min-h-screen flex bg-dark relative overflow-hidden">
      {/* Left panel — staff role selector */}
      <div className="hidden lg:flex lg:w-[420px] relative flex-col bg-dark-400/80 border-r border-white/[0.06]">
        {/* Header */}
        <div className="p-6 border-b border-white/[0.06]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <span className="text-white font-bold text-sm">CS</span>
            </div>
            <div>
              <h2 className="text-white font-semibold text-sm">CreditSea LMS</h2>
              <p className="text-gray-500 text-xs">Internal Operations Portal</p>
            </div>
          </div>
        </div>

        {/* Role cards */}
        <div className="flex-1 p-4 space-y-2 overflow-y-auto">
          <p className="text-[11px] uppercase tracking-wider text-gray-600 font-semibold px-2 mb-3">Quick Access — Demo Accounts</p>
          {STAFF_ROLES.map((staff) => (
            <motion.button
              key={staff.role}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => selectRole(staff)}
              className={`w-full text-left p-4 rounded-xl transition-all duration-200 group ${
                activeRole === staff.role
                  ? "bg-primary/10 border border-primary/30 shadow-lg shadow-primary/5"
                  : "bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.1]"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0 ${
                  activeRole === staff.role ? "bg-primary/20" : "bg-dark-100"
                }`}>
                  {staff.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-semibold ${activeRole === staff.role ? "text-white" : "text-gray-300"}`}>
                      {staff.role}
                    </span>
                    {activeRole === staff.role && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-2 h-2 rounded-full bg-primary"
                      />
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{staff.desc}</p>
                  <p className="text-[11px] text-gray-600 font-mono mt-1">{staff.email}</p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Bottom badge */}
        <div className="p-4 border-t border-white/[0.06]">
          <div className="flex items-center gap-2 text-gray-600 text-xs">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Secured access • Role-based permissions</span>
          </div>
        </div>
      </div>

      {/* Right panel — login form */}
      <div className="flex-1 flex items-center justify-center px-6 relative">
        {/* Background decorations */}
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-violet-500/5 rounded-full blur-3xl" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md relative z-10"
        >
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20">
                <span className="text-amber-400 text-[11px] font-semibold uppercase tracking-wider">Internal</span>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white">Staff Login</h2>
            <p className="text-gray-400 text-sm mt-1">Operations dashboard access for authorized personnel only.</p>
          </div>

          <div className="glass-card p-8 border-t-2 border-t-amber-500/30">
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Staff Email"
                id="staff-login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="yourname@lms.com"
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
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="bg-primary/5 border border-primary/20 rounded-lg p-3 flex items-center gap-2"
                >
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-xs text-gray-400">
                    Logging in as <span className="text-white font-medium">{activeRole}</span>
                  </span>
                </motion.div>
              )}

              <Button
                type="submit"
                loading={loading}
                className="w-full !bg-gradient-to-r !from-amber-500 !to-orange-600 !shadow-amber-500/25 hover:!from-amber-400 hover:!to-orange-500"
                size="lg"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Access Dashboard
              </Button>
            </form>
          </div>

          {/* Mobile role selector */}
          <div className="lg:hidden mt-6">
            <p className="text-xs text-gray-500 mb-3 font-medium uppercase tracking-wider">Demo Staff Accounts</p>
            <div className="grid grid-cols-2 gap-2">
              {STAFF_ROLES.map((staff) => (
                <button
                  key={staff.role}
                  type="button"
                  onClick={() => selectRole(staff)}
                  className={`text-left p-3 rounded-lg transition-all text-xs ${
                    activeRole === staff.role
                      ? "bg-primary/10 border border-primary/30"
                      : "bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04]"
                  }`}
                >
                  <span className="text-lg">{staff.icon}</span>
                  <p className="text-gray-300 font-medium mt-1">{staff.role}</p>
                  <p className="text-gray-600 font-mono text-[10px]">{staff.email}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Borrower link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-6 text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-gray-500 text-sm">Looking for a loan?</span>
              <Link href="/login" className="text-primary-hover hover:text-primary text-sm font-medium transition-colors">
                User Login →
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
