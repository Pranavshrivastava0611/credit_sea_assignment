"use client";
import { cn, getStatusColor } from "@/lib/utils";
import { LoanStatus } from "@/types";

interface BadgeProps {
  status: LoanStatus | string;
  className?: string;
}

export default function Badge({ status, className }: BadgeProps) {
  const isLoanStatus = ["APPLIED", "SANCTIONED", "DISBURSED", "CLOSED", "REJECTED"].includes(status);

  return (
    <span
      className={cn(
        "status-badge",
        isLoanStatus ? getStatusColor(status as LoanStatus) : "bg-gray-500/20 text-gray-400 border border-gray-500/30",
        className
      )}
    >
      {status}
    </span>
  );
}
