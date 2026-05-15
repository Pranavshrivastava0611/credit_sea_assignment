import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { Loan } from "../models/Loan.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

// GET /api/v1/sanction/loans — All APPLIED loans
export const getAppliedLoans = asyncHandler(async (req: AuthRequest, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const loans = await Loan.find({ status: "APPLIED" })
    .populate("borrower", "name email")
    .sort({ appliedAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Loan.countDocuments({ status: "APPLIED" });

  res.json(
    new ApiResponse(200, {
      loans,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    }, "Applied loans fetched")
  );
});

// PATCH /api/v1/sanction/loans/:id/approve
export const approveLoan = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const loan = await Loan.findById(id);
  if (!loan) throw new ApiError(404, "Loan not found");

  if (loan.status !== "APPLIED") {
    throw new ApiError(400, `Cannot approve a loan with status '${loan.status}'. Only APPLIED loans can be approved.`);
  }

  loan.status = "SANCTIONED";
  loan.sanctionedAt = new Date();
  loan.sanctionedBy = req.user!._id;
  await loan.save();

  res.json(new ApiResponse(200, loan, "Loan approved and sanctioned successfully"));
});

// PATCH /api/v1/sanction/loans/:id/reject
export const rejectLoan = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { rejectionReason } = req.body;

  if (!rejectionReason || rejectionReason.trim().length === 0) {
    throw new ApiError(400, "Rejection reason is required");
  }

  const loan = await Loan.findById(id);
  if (!loan) throw new ApiError(404, "Loan not found");

  if (loan.status !== "APPLIED") {
    throw new ApiError(400, `Cannot reject a loan with status '${loan.status}'. Only APPLIED loans can be rejected.`);
  }

  loan.status = "REJECTED";
  loan.rejectionReason = rejectionReason.trim();
  loan.sanctionedBy = req.user!._id;
  await loan.save();

  res.json(new ApiResponse(200, loan, "Loan rejected"));
});
