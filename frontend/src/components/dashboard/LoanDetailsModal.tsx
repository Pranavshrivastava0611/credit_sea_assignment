"use client";
import { motion } from "framer-motion";
import Modal from "@/components/ui/Modal";
import Badge from "@/components/ui/Badge";
import { Loan } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";

interface LoanDetailsModalProps {
  loan: Loan | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function LoanDetailsModal({ loan, isOpen, onClose }: LoanDetailsModalProps) {
  if (!loan) return null;

  const borrowerName = typeof loan.borrower === "object" ? loan.borrower.name : loan.fullName;
  const borrowerEmail = typeof loan.borrower === "object" ? loan.borrower.email : "";

  const getAge = (dob: string) => {
    const today = new Date();
    const birth = new Date(dob);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Loan Application Details" size="lg">
      <div className="space-y-6 max-h-[75vh] overflow-y-auto pr-2 -mr-2">
        {/* Status Header */}
        <div className="flex items-center justify-between bg-dark-100/60 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">{borrowerName.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <h3 className="text-white font-semibold text-base">{borrowerName}</h3>
              {borrowerEmail && <p className="text-gray-400 text-xs">{borrowerEmail}</p>}
            </div>
          </div>
          <Badge status={loan.status} />
        </div>

        {loan.rejectionReason && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div>
                <p className="text-red-400 text-sm font-medium">Rejection Reason</p>
                <p className="text-red-400/80 text-sm mt-0.5">{loan.rejectionReason}</p>
              </div>
            </div>
          </div>
        )}

        {/* Section: Personal Information */}
        <div>
          <h4 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-3 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Personal Information
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <DetailItem label="Full Name" value={loan.fullName} />
            <DetailItem label="PAN Number" value={loan.pan} mono />
            <DetailItem label="Date of Birth" value={`${formatDate(loan.dateOfBirth)} (Age: ${getAge(loan.dateOfBirth)})`} />
            <DetailItem label="Employment Type" value={loan.employmentMode} highlight={loan.employmentMode === "Salaried" ? "emerald" : loan.employmentMode === "Self-Employed" ? "amber" : "red"} />
            <DetailItem label="Monthly Salary" value={formatCurrency(loan.monthlySalary)} mono />
            {borrowerEmail && <DetailItem label="Email" value={borrowerEmail} />}
          </div>
        </div>

        {/* Section: Salary Slip */}
        <div>
          <h4 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-3 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Document
          </h4>
          <div className="bg-dark-100/50 rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{loan.salarySlipFileName || "Salary Slip"}</p>
              <p className="text-gray-500 text-xs">Uploaded with application</p>
            </div>
            {loan.salarySlipUrl && (
              <a
                href={loan.salarySlipUrl.startsWith("http") ? loan.salarySlipUrl : `${process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "")}${loan.salarySlipUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors"
              >
                View File
              </a>
            )}
          </div>
        </div>

        {/* Section: Loan Configuration */}
        <div>
          <h4 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-3 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Loan Details
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <DetailItem label="Principal Amount" value={formatCurrency(loan.principal)} mono large />
            <DetailItem label="Tenure" value={`${loan.tenureDays} days`} mono large />
            <DetailItem label="Interest Rate" value={`${loan.interestRate}% p.a. (Simple)`} />
            <DetailItem label="Simple Interest" value={formatCurrency(loan.simpleInterest)} mono />
          </div>
          {/* Total Repayment highlight */}
          <div className="mt-3 bg-gradient-to-r from-indigo-500/10 to-violet-500/10 border border-indigo-500/20 rounded-xl p-4 flex items-center justify-between">
            <span className="text-gray-300 text-sm font-medium">Total Repayment</span>
            <span className="text-xl font-bold font-mono bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              {formatCurrency(loan.totalRepayment)}
            </span>
          </div>
        </div>

        {/* Section: Timeline */}
        <div>
          <h4 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-3 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Timeline
          </h4>
          <div className="space-y-0">
            <TimelineItem label="Applied" date={loan.appliedAt} active />
            <TimelineItem label="Sanctioned" date={loan.sanctionedAt} by={typeof loan.sanctionedBy === "object" ? loan.sanctionedBy?.name : undefined} />
            <TimelineItem label="Disbursed" date={loan.disbursedAt} by={typeof loan.disbursedBy === "object" ? loan.disbursedBy?.name : undefined} />
            <TimelineItem label="Closed" date={loan.closedAt} last />
          </div>
        </div>
      </div>
    </Modal>
  );
}

function DetailItem({ label, value, mono, large, highlight }: {
  label: string;
  value: string;
  mono?: boolean;
  large?: boolean;
  highlight?: "emerald" | "amber" | "red";
}) {
  const highlightClasses = {
    emerald: "text-emerald-400",
    amber: "text-amber-400",
    red: "text-red-400",
  };

  return (
    <div className="bg-dark-100/50 rounded-lg p-3">
      <p className="text-[11px] text-gray-500 mb-0.5 uppercase tracking-wider">{label}</p>
      <p className={`${large ? "text-base" : "text-sm"} ${mono ? "font-mono" : ""} ${highlight ? highlightClasses[highlight] : "text-white"} font-medium`}>
        {value}
      </p>
    </div>
  );
}

function TimelineItem({ label, date, by, active, last }: {
  label: string;
  date?: string;
  by?: string;
  active?: boolean;
  last?: boolean;
}) {
  const completed = !!date;

  return (
    <div className="flex items-start gap-3">
      <div className="flex flex-col items-center">
        <div className={`w-3 h-3 rounded-full flex-shrink-0 mt-1 ${
          completed
            ? "bg-gradient-to-br from-emerald-400 to-green-500 shadow-sm shadow-emerald-500/30"
            : "bg-dark-100 border border-white/10"
        }`} />
        {!last && <div className={`w-px h-8 ${completed ? "bg-emerald-500/30" : "bg-white/5"}`} />}
      </div>
      <div className={`pb-4 ${!completed ? "opacity-40" : ""}`}>
        <p className="text-sm text-white font-medium leading-tight">{label}</p>
        {completed ? (
          <p className="text-xs text-gray-500 mt-0.5">
            {formatDate(date!)}
            {by && <span> • by {by}</span>}
          </p>
        ) : (
          <p className="text-xs text-gray-600 mt-0.5">Pending</p>
        )}
      </div>
    </div>
  );
}
