"use client";
import { formatCurrency, calculateSimpleInterest } from "@/lib/utils";
import Card from "@/components/ui/Card";

interface LoanCalculatorProps {
  principal: number;
  tenureDays: number;
}

export default function LoanCalculator({ principal, tenureDays }: LoanCalculatorProps) {
  const { interestRate, simpleInterest, totalRepayment } = calculateSimpleInterest(principal, tenureDays);

  return (
    <Card highlight className="mt-8 overflow-hidden">
      <h3 className="text-lg font-bold mb-5 flex items-center gap-2" style={{ color: "rgb(var(--color-text))" }}>
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
        Loan Summary
      </h3>
      <div className="space-y-1">
        <SummaryRow label="Principal" value={formatCurrency(principal)} />
        <SummaryRow label="Interest Rate" value={`${interestRate}% p.a.`} />
        <SummaryRow label="Tenure" value={`${tenureDays} days`} />
        <SummaryRow label="Simple Interest" value={formatCurrency(simpleInterest)} highlight="amber" />
        
        <div className="my-4" style={{ borderTop: "1px solid rgb(var(--color-border) / 0.1)" }} />
        
        <div className="flex justify-between items-center py-1">
          <span className="font-bold text-sm" style={{ color: "rgb(var(--color-text))" }}>Total Repayment</span>
          <span className="text-2xl font-bold font-mono bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">
            {formatCurrency(totalRepayment)}
          </span>
        </div>
      </div>
    </Card>
  );
}

function SummaryRow({ label, value, highlight }: { label: string; value: string; highlight?: "amber" }) {
  const highlightClasses = {
    amber: "text-amber-600 dark:text-amber-400",
  };

  return (
    <div className="flex justify-between items-center py-2">
      <span className="text-sm font-medium" style={{ color: "rgb(var(--color-text-muted))" }}>{label}</span>
      <span className={cn(
        "font-mono font-bold",
        highlight ? highlightClasses[highlight] : ""
      )}
      style={!highlight ? { color: "rgb(var(--color-text-secondary))" } : undefined}
      >
        {value}
      </span>
    </div>
  );
}

import { cn } from "@/lib/utils";
