"use client";
import { useState, useEffect } from "react";
import { useLoan } from "@/hooks/useLoan";
import { Loan, Payment } from "@/types";
import PageHeader from "@/components/layout/PageHeader";
import LoanTable from "@/components/dashboard/LoanTable";
import LoanDetailsModal from "@/components/dashboard/LoanDetailsModal";
import Button from "@/components/ui/Button";
import PaymentForm from "@/components/dashboard/PaymentForm";
import Modal from "@/components/ui/Modal";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function CollectionPage() {
  const { getDisbursedLoans, recordPayment, getPaymentHistory } = useLoan();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [paymentModal, setPaymentModal] = useState(false);
  const [historyModal, setHistoryModal] = useState(false);
  const [selected, setSelected] = useState<Loan | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [paymentSummary, setPaymentSummary] = useState<any>(null);
  const [detailLoan, setDetailLoan] = useState<Loan | null>(null);

  useEffect(() => { fetchLoans(); }, []);

  const fetchLoans = async () => {
    setLoading(true);
    try { const d = await getDisbursedLoans(1, 50); setLoans(d.loans); }
    catch {} finally { setLoading(false); }
  };

  const handleRecordPayment = async (data: { utrNumber: string; amount: number; paymentDate: string }) => {
    if (!selected) return;
    await recordPayment(selected._id, data);
    fetchLoans();
  };

  const showHistory = async (loan: Loan) => {
    setSelected(loan);
    try {
      const d = await getPaymentHistory(loan._id);
      setPayments(d.payments);
      setPaymentSummary(d.summary);
      setHistoryModal(true);
    } catch {}
  };

  return (
    <div>
      <PageHeader title="Collection Module" description="Manage disbursed loan collections and payments" />

      <LoanTable loans={loans} loading={loading}
        columns={[
          { key: "borrowerName", label: "Borrower" },
          { key: "borrowerEmail", label: "Email" },
          { key: "totalRepayment", label: "Total Repayable" },
          { key: "totalPaid", label: "Paid So Far", render: (l) => <span className="font-mono text-emerald-400">{formatCurrency(l.totalPaid || 0)}</span> },
          { key: "outstanding", label: "Outstanding", render: (l) => {
            const pct = l.totalRepayment > 0 ? ((l.totalPaid || 0) / l.totalRepayment) * 100 : 0;
            return (
              <div className="space-y-1">
                <span className="font-mono text-amber-400">{formatCurrency(l.outstanding || 0)}</span>
                <div className="w-full bg-dark-100 rounded-full h-1.5">
                  <div className="bg-gradient-to-r from-emerald-500 to-green-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${Math.min(pct, 100)}%` }} />
                </div>
              </div>
            );
          }},
        ]}
        actions={(loan) => (
          <>
            <Button size="sm" variant="ghost" onClick={() => setDetailLoan(loan)} className="!px-3">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </Button>
            <Button size="sm" onClick={() => { setSelected(loan); setPaymentModal(true); }}>
              Record Payment
            </Button>
            <Button size="sm" variant="ghost" onClick={() => showHistory(loan)}>
              History
            </Button>
          </>
        )}
      />

      {/* Loan Details Modal */}
      <LoanDetailsModal loan={detailLoan} isOpen={!!detailLoan} onClose={() => setDetailLoan(null)} />

      {/* Payment Form */}
      {selected && (
        <PaymentForm
          isOpen={paymentModal}
          onClose={() => { setPaymentModal(false); setSelected(null); }}
          onSubmit={handleRecordPayment}
          maxAmount={selected.outstanding || 0}
          loanId={selected._id}
        />
      )}

      {/* Payment History Modal */}
      <Modal isOpen={historyModal} onClose={() => setHistoryModal(false)} title="Payment History" size="lg">
        <div className="space-y-4">
          {/* Borrower summary */}
          {selected && (
            <div className="flex items-center gap-3 bg-dark-100/60 rounded-xl p-3 mb-2">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">{selected.fullName.charAt(0)}</span>
              </div>
              <div>
                <p className="text-white text-sm font-medium">{selected.fullName}</p>
                <p className="text-gray-500 text-xs">PAN: {selected.pan}</p>
              </div>
            </div>
          )}

          {paymentSummary && (
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-dark-100/50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500">Total Repayable</p>
                <p className="text-white font-mono font-semibold">{formatCurrency(paymentSummary.totalRepayment)}</p>
              </div>
              <div className="bg-dark-100/50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500">Paid</p>
                <p className="text-emerald-400 font-mono font-semibold">{formatCurrency(paymentSummary.totalPaid)}</p>
              </div>
              <div className="bg-dark-100/50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500">Outstanding</p>
                <p className="text-amber-400 font-mono font-semibold">{formatCurrency(paymentSummary.outstanding)}</p>
              </div>
            </div>
          )}
          {payments.length === 0 ? (
            <p className="text-gray-400 text-center py-6">No payments recorded yet</p>
          ) : (
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {payments.map((p, i) => (
                <div key={p._id} className="bg-dark-100/50 rounded-lg p-4 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 text-xs font-bold">
                      {i + 1}
                    </div>
                    <div>
                      <p className="text-white font-mono text-sm">{formatCurrency(p.amount)}</p>
                      <p className="text-xs text-gray-500">UTR: {p.utrNumber} • {formatDate(p.paymentDate)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-500">Remaining</span>
                    <p className="text-sm font-mono text-amber-400">{formatCurrency(p.outstandingAfter)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
