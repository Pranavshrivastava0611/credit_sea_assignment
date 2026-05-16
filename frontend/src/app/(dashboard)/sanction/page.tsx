"use client";
import { useState, useEffect } from "react";
import { useLoan } from "@/hooks/useLoan";
import { Loan } from "@/types";
import PageHeader from "@/components/layout/PageHeader";
import LoanTable from "@/components/dashboard/LoanTable";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { formatCurrency } from "@/lib/utils";
import toast from "react-hot-toast";

export default function SanctionPage() {
  const { getAppliedLoans, approveLoan, rejectLoan } = useLoan();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedLoanId, setSelectedLoanId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    setLoading(true);
    try {
      const data = await getAppliedLoans(1, 50);
      setLoans(data.loans);
    } catch {
      //
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (loanId: string) => {
    setActionLoading(true);
    try {
      await approveLoan(loanId);
      fetchLoans();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to approve");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedLoanId || !rejectionReason.trim()) return;
    setActionLoading(true);
    try {
      await rejectLoan(selectedLoanId, rejectionReason);
      setRejectModalOpen(false);
      setRejectionReason("");
      setSelectedLoanId(null);
      fetchLoans();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to reject");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Sanction Module"
        description="Review and approve or reject loan applications"
      />

      <LoanTable
        loans={loans}
        loading={loading}
        columns={[
          { key: "borrowerName", label: "Borrower" },
          { key: "pan", label: "PAN" },
          { key: "monthlySalary", label: "Salary" },
          { key: "principal", label: "Loan Amount" },
          { key: "tenureDays", label: "Tenure" },
          { key: "appliedAt", label: "Applied On" },
        ]}
        actions={(loan) => (
          <>
            <Button
              size="sm"
              variant="success"
              onClick={() => handleApprove(loan._id)}
              loading={actionLoading}
            >
              Approve
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={() => {
                setSelectedLoanId(loan._id);
                setRejectModalOpen(true);
              }}
            >
              Reject
            </Button>
          </>
        )}
      />

      <Modal
        isOpen={rejectModalOpen}
        onClose={() => {
          setRejectModalOpen(false);
          setRejectionReason("");
        }}
        title="Reject Loan Application"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-400">
            Please provide a reason for rejecting this loan application. This will be visible to the borrower.
          </p>
          <textarea
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Enter rejection reason..."
            rows={4}
            className="input-dark resize-none"
          />
          <div className="flex gap-3">
            <Button
              variant="ghost"
              onClick={() => {
                setRejectModalOpen(false);
                setRejectionReason("");
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleReject}
              disabled={!rejectionReason.trim()}
              loading={actionLoading}
              className="flex-1"
            >
              Confirm Rejection
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
