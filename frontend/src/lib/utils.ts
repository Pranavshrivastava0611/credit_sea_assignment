import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { LoanStatus } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export const STATUS_COLORS: Record<LoanStatus, string> = {
  APPLIED: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20",
  SANCTIONED: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20",
  DISBURSED: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20",
  CLOSED: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
  REJECTED: "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20",
};

export function getStatusColor(status: LoanStatus): string {
  return STATUS_COLORS[status] || "bg-gray-500/20 text-gray-400";
}

export function calculateSimpleInterest(principal: number, tenureDays: number) {
  const rate = 12;
  const si = (principal * rate * tenureDays) / (365 * 100);
  return {
    interestRate: rate,
    simpleInterest: parseFloat(si.toFixed(2)),
    totalRepayment: parseFloat((principal + si).toFixed(2)),
  };
}
