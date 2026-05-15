import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { Loan } from "../models/Loan.model";
import { Payment } from "../models/Payment.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

// GET /api/v1/collection/loans — All DISBURSED loans
export const getDisbursedLoans = asyncHandler(async (req: AuthRequest, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const loans = await Loan.find({ status: "DISBURSED" })
    .populate("borrower", "name email")
    .sort({ disbursedAt: -1 })
    .skip(skip)
    .limit(limit);

  // Compute outstanding for each loan
  const loansWithOutstanding = await Promise.all(
    loans.map(async (loan) => {
      const payments = await Payment.find({ loan: loan._id });
      const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
      const outstanding = loan.totalRepayment - totalPaid;
      return {
        ...loan.toObject(),
        totalPaid: parseFloat(totalPaid.toFixed(2)),
        outstanding: parseFloat(outstanding.toFixed(2)),
      };
    })
  );

  const total = await Loan.countDocuments({ status: "DISBURSED" });

  res.json(
    new ApiResponse(200, {
      loans: loansWithOutstanding,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    }, "Disbursed loans fetched")
  );
});

// POST /api/v1/collection/loans/:id/payment — Record a payment
export const recordPayment = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { utrNumber, amount, paymentDate } = req.body;

  if (!utrNumber || !amount || !paymentDate) {
    throw new ApiError(400, "utrNumber, amount, and paymentDate are required");
  }

  const loan = await Loan.findById(id);
  if (!loan) throw new ApiError(404, "Loan not found");

  if (loan.status !== "DISBURSED") {
    throw new ApiError(400, "Payments can only be recorded for DISBURSED loans");
  }

  // Check UTR uniqueness
  const utrExists = await Payment.findOne({ utrNumber: utrNumber.trim() });
  if (utrExists) {
    throw new ApiError(409, "UTR number already exists. Each payment must have a unique UTR.");
  }

  // Calculate outstanding
  const prevPayments = await Payment.find({ loan: id });
  const totalPaid = prevPayments.reduce((sum, p) => sum + p.amount, 0);
  const outstanding = loan.totalRepayment - totalPaid;

  const paymentAmount = Number(amount);

  if (paymentAmount <= 0) {
    throw new ApiError(400, "Payment amount must be greater than zero");
  }

  if (paymentAmount > outstanding) {
    throw new ApiError(
      400,
      `Payment amount ₹${paymentAmount.toLocaleString("en-IN")} exceeds outstanding balance ₹${outstanding.toFixed(2)}`
    );
  }

  const outstandingAfter = parseFloat((outstanding - paymentAmount).toFixed(2));

  const payment = await Payment.create({
    loan: id,
    borrower: loan.borrower,
    utrNumber: utrNumber.trim(),
    amount: paymentAmount,
    paymentDate: new Date(paymentDate),
    recordedBy: req.user!._id,
    outstandingAfter,
  });

  // Auto-close if fully paid
  if (outstandingAfter <= 0) {
    loan.status = "CLOSED";
    loan.closedAt = new Date();
    await loan.save();
  }

  res.status(201).json(
    new ApiResponse(
      201,
      { payment, outstandingAfter, loanStatus: loan.status },
      outstandingAfter <= 0
        ? "Payment recorded. Loan auto-closed — fully repaid!"
        : "Payment recorded successfully"
    )
  );
});

// GET /api/v1/collection/loans/:id/payments — Payment history for a loan
export const getPaymentHistory = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const loan = await Loan.findById(id);
  if (!loan) throw new ApiError(404, "Loan not found");

  const payments = await Payment.find({ loan: id })
    .populate("recordedBy", "name email")
    .sort({ paymentDate: -1 });

  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
  const outstanding = loan.totalRepayment - totalPaid;

  res.json(
    new ApiResponse(200, {
      payments,
      summary: {
        totalRepayment: loan.totalRepayment,
        totalPaid: parseFloat(totalPaid.toFixed(2)),
        outstanding: parseFloat(outstanding.toFixed(2)),
        paymentCount: payments.length,
      },
    }, "Payment history fetched")
  );
});
