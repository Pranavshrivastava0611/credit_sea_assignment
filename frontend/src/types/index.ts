export type UserRole =
  | "Borrower"
  | "Sales"
  | "Sanction"
  | "Disbursement"
  | "Collection"
  | "Admin";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt?: string;
}

export type LoanStatus =
  | "APPLIED"
  | "SANCTIONED"
  | "DISBURSED"
  | "CLOSED"
  | "REJECTED";

export type EmploymentMode = "Salaried" | "Self-Employed" | "Unemployed";

export interface Loan {
  _id: string;
  borrower: User | string;
  fullName: string;
  pan: string;
  dateOfBirth: string;
  monthlySalary: number;
  employmentMode: EmploymentMode;
  salarySlipUrl: string;
  salarySlipFileName: string;
  principal: number;
  tenureDays: number;
  interestRate: number;
  simpleInterest: number;
  totalRepayment: number;
  status: LoanStatus;
  rejectionReason?: string;
  appliedAt: string;
  sanctionedAt?: string;
  disbursedAt?: string;
  closedAt?: string;
  sanctionedBy?: User | string;
  disbursedBy?: User | string;
  totalPaid?: number;
  outstanding?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  _id: string;
  loan: string;
  borrower: string;
  utrNumber: string;
  amount: number;
  paymentDate: string;
  recordedBy: User | string;
  outstandingAfter: number;
  createdAt: string;
}

export interface BREResult {
  passed: boolean;
  failedRules: string[];
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}

export interface LoanCalculation {
  interestRate: number;
  simpleInterest: number;
  totalRepayment: number;
}

export interface LoanApplicationData {
  fullName: string;
  pan: string;
  dateOfBirth: string;
  monthlySalary: number;
  employmentMode: EmploymentMode;
  salarySlipUrl: string;
  salarySlipFileName: string;
  principal: number;
  tenureDays: number;
}
