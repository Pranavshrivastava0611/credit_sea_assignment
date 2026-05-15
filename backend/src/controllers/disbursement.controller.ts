import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { Loan } from "../models/Loan.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

// GET /api/v1/disbursement/loans — All SANCTIONED loans
export const getSanctionedLoans = asyncHandler(async (req: AuthRequest, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const loans = await Loan.find({ status: "SANCTIONED" })
    .populate("borrower", "name email")
    .populate("sanctionedBy", "name")
    .sort({ sanctionedAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Loan.countDocuments({ status: "SANCTIONED" });

  res.json(
    new ApiResponse(200, {
      loans,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    }, "Sanctioned loans fetched")
  );
});

// PATCH /api/v1/disbursement/loans/:id/disburse
export const disburseLoan = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const loan = await Loan.findById(id);
  if (!loan) throw new ApiError(404, "Loan not found");

  if (loan.status !== "SANCTIONED") {
    throw new ApiError(
      400,
      `Cannot disburse a loan with status '${loan.status}'. Only SANCTIONED loans can be disbursed.`
    );
  }

  loan.status = "DISBURSED";
  loan.disbursedAt = new Date();
  loan.disbursedBy = req.user!._id;
  await loan.save();

  res.json(new ApiResponse(200, loan, "Loan disbursed successfully"));
});
