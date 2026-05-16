"use client";
import { useState, useEffect } from "react";
import { useLoan } from "@/hooks/useLoan";
import { Loan, User } from "@/types";
import PageHeader from "@/components/layout/PageHeader";
import StatCard from "@/components/dashboard/StatCard";
import LoanTable from "@/components/dashboard/LoanTable";
import LoanDetailsModal from "@/components/dashboard/LoanDetailsModal";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { formatCurrency } from "@/lib/utils";

export default function AdminPage() {
  const { getAllLoans, getAllUsers } = useLoan();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [detailLoan, setDetailLoan] = useState<Loan | null>(null);

  useEffect(() => {
    fetchData();
  }, [statusFilter]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getAllLoans(1, 50, statusFilter);
      setLoans(data.loans);
      if (data.statusCounts) setStatusCounts(data.statusCounts);
    } catch {
      //
    } finally {
      setLoading(false);
    }
  };

  const totalLoans = Object.values(statusCounts).reduce((a, b) => a + b, 0);

  return (
    <div>
      <PageHeader
        title="Admin Overview"
        description="Complete overview of all loans and system metrics"
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatCard
          title="Total Loans"
          value={totalLoans}
          color="indigo"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
        />
        <StatCard title="Applied" value={statusCounts.APPLIED || 0} color="indigo"
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
        <StatCard title="Sanctioned" value={statusCounts.SANCTIONED || 0} color="violet"
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
        <StatCard title="Disbursed" value={statusCounts.DISBURSED || 0} color="amber"
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>} />
        <StatCard title="Closed" value={statusCounts.CLOSED || 0} color="emerald"
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" /></svg>} />
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6">
        {["", "APPLIED", "SANCTIONED", "DISBURSED", "CLOSED", "REJECTED"].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
              statusFilter === s
                ? "bg-primary text-white shadow-lg shadow-primary/20"
                : "border hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
            }`}
            style={statusFilter !== s ? { 
              background: "rgb(var(--color-bg-secondary))",
              borderColor: "var(--glass-border)",
              color: "rgb(var(--color-text-secondary))"
            } : undefined}
          >
            {s || "All"}
          </button>
        ))}
      </div>

      <LoanTable
        loans={loans}
        loading={loading}
        columns={[
          { key: "borrowerName", label: "Borrower" },
          { key: "pan", label: "PAN" },
          { key: "principal", label: "Amount" },
          { key: "tenureDays", label: "Tenure" },
          { key: "totalRepayment", label: "Repayment" },
          { key: "status", label: "Status" },
          { key: "appliedAt", label: "Applied" },
        ]}
        actions={(loan) => (
          <Button size="sm" variant="ghost" onClick={() => setDetailLoan(loan)} className="!px-3">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </Button>
        )}
      />

      <LoanDetailsModal loan={detailLoan} isOpen={!!detailLoan} onClose={() => setDetailLoan(null)} />
    </div>
  );
}
