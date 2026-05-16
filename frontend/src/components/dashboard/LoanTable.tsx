"use client";
import Badge from "@/components/ui/Badge";
import { Loan, LoanStatus } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { motion } from "framer-motion";

interface LoanTableProps {
  loans: Loan[];
  columns: {
    key: string;
    label: string;
    render?: (loan: Loan) => React.ReactNode;
  }[];
  actions?: (loan: Loan) => React.ReactNode;
  loading?: boolean;
}

export default function LoanTable({ loans, columns, actions, loading }: LoanTableProps) {
  if (loading) {
    return (
      <div className="glass-card overflow-hidden">
        <div className="animate-pulse space-y-0">
          <div className="h-12 bg-white/5" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 bg-white/[0.02] border-t border-white/5" />
          ))}
        </div>
      </div>
    );
  }

  if (loans.length === 0) {
    return (
      <div className="glass-card p-12 text-center">
        <div className="w-16 h-16 rounded-full bg-dark-100 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="text-gray-400 font-medium">No records found</p>
        <p className="text-gray-600 text-sm mt-1">There are no items to display at this time.</p>
      </div>
    );
  }

  const defaultRender = (loan: Loan, key: string) => {
    switch (key) {
      case "borrowerName":
        return typeof loan.borrower === "object" ? loan.borrower.name : loan.fullName;
      case "borrowerEmail":
        return typeof loan.borrower === "object" ? loan.borrower.email : "-";
      case "status":
        return <Badge status={loan.status} />;
      case "principal":
      case "totalRepayment":
      case "simpleInterest":
      case "monthlySalary":
        return <span className="font-mono">{formatCurrency(loan[key] as number)}</span>;
      case "outstanding":
      case "totalPaid":
        return <span className="font-mono">{formatCurrency((loan as any)[key] || 0)}</span>;
      case "appliedAt":
      case "sanctionedAt":
      case "disbursedAt":
        return loan[key] ? formatDate(loan[key] as string) : "-";
      case "pan":
        return <span className="font-mono text-xs">{loan.pan}</span>;
      case "tenureDays":
        return `${loan.tenureDays} days`;
      default:
        return String((loan as any)[key] || "-");
    }
  };

  return (
    <div className="glass-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-white/5">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider"
                >
                  {col.label}
                </th>
              ))}
              {actions && (
                <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {loans.map((loan, index) => (
              <motion.tr
                key={loan._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className="table-row"
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-5 py-4 text-sm text-gray-300">
                    {col.render ? col.render(loan) : defaultRender(loan, col.key)}
                  </td>
                ))}
                {actions && (
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {actions(loan)}
                    </div>
                  </td>
                )}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
