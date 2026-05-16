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
    <Card highlight className="mt-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
        Loan Summary
      </h3>
      <div className="space-y-3">
        <div className="flex justify-between items-center py-2">
          <span className="text-gray-400 text-sm">Principal</span>
          <span className="text-white font-mono font-semibold">{formatCurrency(principal)}</span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-gray-400 text-sm">Interest Rate</span>
          <span className="text-white font-mono font-semibold">{interestRate}% p.a.</span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-gray-400 text-sm">Tenure</span>
          <span className="text-white font-mono font-semibold">{tenureDays} days</span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-gray-400 text-sm">Simple Interest</span>
          <span className="text-amber-400 font-mono font-semibold">{formatCurrency(simpleInterest)}</span>
        </div>
        <div className="border-t border-white/10 my-2" />
        <div className="flex justify-between items-center py-2">
          <span className="text-white font-medium">Total Repayment</span>
          <span className="text-xl font-bold font-mono bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
            {formatCurrency(totalRepayment)}
          </span>
        </div>
      </div>
    </Card>
  );
}
