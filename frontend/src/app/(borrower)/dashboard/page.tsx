"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useLoan } from "@/hooks/useLoan";
import { Loan } from "@/types";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { CardSkeleton } from "@/components/ui/Skeleton";
import LoanDetailsModal from "@/components/dashboard/LoanDetailsModal";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { formatCurrency, formatDate } from "@/lib/utils";

import LoanProgressTracker from "@/components/borrower/LoanProgressTracker";

export default function BorrowerDashboard() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { getMyLoans } = useLoan();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);

  useEffect(() => {
    if (user && user.role !== "Borrower") {
      router.push("/");
      return;
    }
    fetchLoans();

    // Set up polling for real-time updates every 10 seconds
    const interval = setInterval(fetchLoans, 10000);
    return () => clearInterval(interval);
  }, [user]);

  const fetchLoans = async () => {
    try {
      const data = await getMyLoans();
      setLoans(data.loans);
    } catch {
      // handled
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen" style={{ background: "rgb(var(--color-bg))" }}>
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 py-10 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: "rgb(var(--color-text))" }}>My Dashboard</h1>
            <p className="text-sm" style={{ color: "rgb(var(--color-text-muted))" }}>Welcome, {user.name}</p>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button onClick={() => router.push("/apply")} size="sm" className="shadow-lg shadow-primary/20">
              + New Application
            </Button>
            <Button variant="ghost" size="sm" onClick={logout} className="dark:text-white font-bold">
              Logout
            </Button>
          </div>
        </div>

        {/* Loans */}
        {loading && loans.length === 0 ? (
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => <CardSkeleton key={i} />)}
          </div>
        ) : loans.length === 0 ? (
          <Card className="text-center py-20 border-dashed border-2" style={{ borderColor: "var(--glass-border)" }}>
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: "rgb(var(--color-bg-secondary))" }}>
              <svg className="w-10 h-10" style={{ color: "rgb(var(--color-text-muted))" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2" style={{ color: "rgb(var(--color-text))" }}>No Loan Applications</h3>
            <p className="mb-8 max-w-xs mx-auto" style={{ color: "rgb(var(--color-text-secondary))" }}>Start your journey by applying for a loan and get approved instantly.</p>
            <Button onClick={() => router.push("/apply")} size="lg" className="px-10 shadow-xl shadow-primary/25">Apply for Loan</Button>
          </Card>
        ) : (
          <div className="space-y-6">
            {loans.map((loan, index) => (
              <motion.div
                key={loan._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card hover className="cursor-pointer overflow-hidden group" highlight onClick={() => setSelectedLoan(loan)}>
                  <div className="p-1">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors shadow-inner">
                          <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-bold text-lg" style={{ color: "rgb(var(--color-text))" }}>Loan Application</h3>
                          <p className="text-xs font-medium" style={{ color: "rgb(var(--color-text-muted))" }}>Ref: {loan._id.slice(-8).toUpperCase()} • Applied {formatDate(loan.appliedAt)}</p>
                        </div>
                      </div>
                      <Badge status={loan.status} className="px-4 py-2 text-xs font-bold rounded-full" />
                    </div>

                    {/* Real-time Progress Tracker */}
                    <div className="mb-8 bg-black/[0.02] dark:bg-white/[0.02] rounded-2xl p-4 border border-black/5 dark:border-white/5">
                      <p className="text-[10px] font-bold uppercase tracking-widest mb-4 opacity-50 px-2" style={{ color: "rgb(var(--color-text))" }}>Live Journey Tracker</p>
                      <LoanProgressTracker status={loan.status} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-5 rounded-2xl border" style={{ background: "rgb(var(--color-bg-secondary) / 0.3)", borderColor: "var(--glass-border)" }}>
                      <div className="space-y-1">
                        <p className="text-[10px] uppercase tracking-widest font-extrabold" style={{ color: "rgb(var(--color-text-muted))" }}>Principal</p>
                        <p className="text-xl font-bold font-mono" style={{ color: "rgb(var(--color-text))" }}>{formatCurrency(loan.principal)}</p>
                      </div>
                      <div className="space-y-1 border-l border-black/5 dark:border-white/5 md:pl-6">
                        <p className="text-[10px] uppercase tracking-widest font-extrabold" style={{ color: "rgb(var(--color-text-muted))" }}>Tenure</p>
                        <p className="text-xl font-bold font-mono" style={{ color: "rgb(var(--color-text))" }}>{loan.tenureDays} <span className="text-sm font-sans font-medium opacity-60">Days</span></p>
                      </div>
                      <div className="space-y-1 border-l border-black/5 dark:border-white/5 md:pl-6">
                        <p className="text-[10px] uppercase tracking-widest font-extrabold" style={{ color: "rgb(var(--color-text-muted))" }}>To Repay</p>
                        <p className="text-xl font-bold font-mono text-primary">{formatCurrency(loan.totalRepayment)}</p>
                      </div>
                    </div>

                    {loan.rejectionReason && (
                      <div className="mt-5 bg-red-500/5 border border-red-500/10 rounded-2xl p-4 flex items-start gap-3 shadow-inner">
                        <div className="w-6 h-6 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-red-600 dark:text-red-400 font-bold text-xs">!</span>
                        </div>
                        <p className="text-xs leading-relaxed font-medium" style={{ color: "rgb(var(--color-text-secondary))" }}>
                          <span className="font-bold text-red-600 dark:text-red-400 uppercase tracking-tight mr-1">Rejection Reason:</span> {loan.rejectionReason}
                        </p>
                      </div>
                    )}

                    {loan.disbursementNotes && (
                      <div className="mt-5 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-4 flex items-start gap-3 shadow-inner">
                        <div className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <p className="text-xs leading-relaxed font-medium" style={{ color: "rgb(var(--color-text-secondary))" }}>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-tight mr-1">Operations Note:</span> {loan.disbursementNotes}
                        </p>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <LoanDetailsModal
        loan={selectedLoan}
        isOpen={!!selectedLoan}
        onClose={() => setSelectedLoan(null)}
      />
    </div>
  );
}
