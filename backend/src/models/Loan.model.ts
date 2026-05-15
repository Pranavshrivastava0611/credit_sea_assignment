import mongoose, { Schema, Document } from "mongoose";

export type LoanStatus =
  | "APPLIED"
  | "SANCTIONED"
  | "DISBURSED"
  | "CLOSED"
  | "REJECTED";

export type EmploymentMode = "Salaried" | "Self-Employed" | "Unemployed";

export interface ILoan extends Document {
  _id: mongoose.Types.ObjectId;
  borrower: mongoose.Types.ObjectId;
  // Personal Details
  fullName: string;
  pan: string;
  dateOfBirth: Date;
  monthlySalary: number;
  employmentMode: EmploymentMode;
  // Salary Slip
  salarySlipUrl: string;
  salarySlipFileName: string;
  // Loan Config
  principal: number;
  tenureDays: number;
  interestRate: number;
  simpleInterest: number;
  totalRepayment: number;
  // Status
  status: LoanStatus;
  rejectionReason?: string;
  // Timestamps for transitions
  appliedAt: Date;
  sanctionedAt?: Date;
  disbursedAt?: Date;
  closedAt?: Date;
  // Executive who acted
  sanctionedBy?: mongoose.Types.ObjectId;
  disbursedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const LoanSchema = new Schema<ILoan>(
  {
    borrower: { type: Schema.Types.ObjectId, ref: "User", required: true },
    fullName: { type: String, required: true, trim: true },
    pan: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      match: [/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN format"],
    },
    dateOfBirth: { type: Date, required: true },
    monthlySalary: { type: Number, required: true, min: 0 },
    employmentMode: {
      type: String,
      enum: ["Salaried", "Self-Employed", "Unemployed"],
      required: true,
    },
    salarySlipUrl: { type: String, required: true },
    salarySlipFileName: { type: String },
    principal: { type: Number, required: true, min: 50000, max: 500000 },
    tenureDays: { type: Number, required: true, min: 30, max: 365 },
    interestRate: { type: Number, default: 12 },
    simpleInterest: { type: Number, required: true },
    totalRepayment: { type: Number, required: true },
    status: {
      type: String,
      enum: ["APPLIED", "SANCTIONED", "DISBURSED", "CLOSED", "REJECTED"],
      default: "APPLIED",
    },
    rejectionReason: { type: String },
    appliedAt: { type: Date, default: Date.now },
    sanctionedAt: { type: Date },
    disbursedAt: { type: Date },
    closedAt: { type: Date },
    sanctionedBy: { type: Schema.Types.ObjectId, ref: "User" },
    disbursedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const Loan = mongoose.model<ILoan>("Loan", LoanSchema);
