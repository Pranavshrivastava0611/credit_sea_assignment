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
import { formatCurrency, formatDate } from "@/lib/utils";

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
    <div className="min-h-screen bg-dark">
      {/* Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-3xl" />

      <div className="max-w-4xl mx-auto px-4 py-10 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">My Dashboard</h1>
            <p className="text-gray-400 text-sm">Welcome, {user.name}</p>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={() => router.push("/apply")} size="sm">
              + New Application
            </Button>
            <Button variant="ghost" size="sm" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>

        {/* Loans */}
        {loading ? (
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => <CardSkeleton key={i} />)}
          </div>
        ) : loans.length === 0 ? (
          <Card className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-dark-100 flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No Loan Applications</h3>
            <p className="text-gray-400 mb-6">Start your journey by applying for a loan</p>
            <Button onClick={() => router.push("/apply")}>Apply for Loan</Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {loans.map((loan, index) => (
              <motion.div
                key={loan._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card hover className="cursor-pointer" highlight>
                  <div onClick={() => setSelectedLoan(loan)}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                          <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-white font-semibold">Loan Application</h3>
                          <p className="text-xs text-gray-500">Applied {formatDate(loan.appliedAt)}</p>
                        </div>
                      </div>
                      <Badge status={loan.status} />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Principal</p>
                        <p className="text-white font-mono font-semibold">{formatCurrency(loan.principal)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Tenure</p>
                        <p className="text-white font-mono font-semibold">{loan.tenureDays} days</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Total Repayment</p>
                        <p className="text-white font-mono font-semibold">{formatCurrency(loan.totalRepayment)}</p>
                      </div>
                    </div>
                    {loan.rejectionReason && (
                      <div className="mt-4 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                        <p className="text-xs text-red-400">
                          <span className="font-medium">Rejection Reason:</span> {loan.rejectionReason}
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
