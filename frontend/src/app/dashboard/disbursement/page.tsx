"use client";
import { useState, useEffect } from "react";
import { useLoan } from "@/hooks/useLoan";
import { Loan } from "@/types";
import PageHeader from "@/components/layout/PageHeader";
import LoanTable from "@/components/dashboard/LoanTable";
import LoanDetailsModal from "@/components/dashboard/LoanDetailsModal";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { formatCurrency, formatDate } from "@/lib/utils";
import toast from "react-hot-toast";

export default function DisbursementPage() {
  const { getSanctionedLoans, disburseLoan } = useLoan();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selected, setSelected] = useState<Loan | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [detailLoan, setDetailLoan] = useState<Loan | null>(null);

  useEffect(() => { fetchLoans(); }, []);

  const fetchLoans = async () => {
    setLoading(true);
    try { const d = await getSanctionedLoans(1, 50); setLoans(d.loans); }
    catch {} finally { setLoading(false); }
  };

  const handleDisburse = async () => {
    if (!selected) return;
    setActionLoading(true);
    try {
      await disburseLoan(selected._id);
      setConfirmOpen(false); setSelected(null); fetchLoans();
    } catch (e: any) { toast.error(e.response?.data?.message || "Failed"); }
    finally { setActionLoading(false); }
  };

  return (
    <div>
      <PageHeader title="Disbursement Module" description="Manage sanctioned loans for disbursement" />
      <LoanTable loans={loans} loading={loading}
        columns={[
          { key: "borrowerName", label: "Borrower" },
          { key: "borrowerEmail", label: "Email" },
          { key: "principal", label: "Amount" },
          { key: "tenureDays", label: "Tenure" },
          { key: "simpleInterest", label: "Interest" },
          { key: "totalRepayment", label: "Repayment" },
          { key: "sanctionedAt", label: "Sanctioned On" },
        ]}
        actions={(loan) => (
          <>
            <Button size="sm" variant="ghost" onClick={() => setDetailLoan(loan)} className="!px-3">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </Button>
            <Button size="sm" className="bg-gradient-to-r from-amber-500 to-orange-600"
              onClick={() => { setSelected(loan); setConfirmOpen(true); }}>
              Mark Disbursed
            </Button>
          </>
        )}
      />

      {/* Loan Details Modal */}
      <LoanDetailsModal loan={detailLoan} isOpen={!!detailLoan} onClose={() => setDetailLoan(null)} />

      {/* Confirm Disbursement Modal */}
      <Modal isOpen={confirmOpen} onClose={() => setConfirmOpen(false)} title="Confirm Disbursement">
        <div className="space-y-4">
          <p className="text-sm text-gray-400">Are you sure you want to disburse this loan? Funds will be released to the borrower.</p>
          {selected && (
            <div className="bg-dark-100/50 rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">Borrower</span>
                <span className="text-white font-medium">{selected.fullName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">PAN</span>
                <span className="text-white font-mono text-sm">{selected.pan}</span>
              </div>
              <div className="border-t border-white/5 my-1" />
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">Loan Amount</span>
                <span className="text-white font-mono font-semibold">{formatCurrency(selected.principal)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">Tenure</span>
                <span className="text-white font-mono">{selected.tenureDays} days </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">Total Repayment</span>
                <span className="text-indigo-400 font-mono font-bold text-lg">{formatCurrency(selected.totalRepayment)}</span>
              </div>
            </div>
          )}
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => setConfirmOpen(false)} className="flex-1">Cancel</Button>
            <Button onClick={handleDisburse} loading={actionLoading} className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600">Confirm Disbursement</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
