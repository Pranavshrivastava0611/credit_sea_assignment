import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { Loan } from "../models/Loan.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { runBRE } from "../services/bre.service";
import { calculateLoan } from "../services/loan.service";

// POST /api/v1/borrower/bre-check
export const breCheck = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { dateOfBirth, monthlySalary, pan, employmentMode } = req.body;

  if (!dateOfBirth || monthlySalary === undefined || !pan || !employmentMode) {
    throw new ApiError(400, "All fields are required: dateOfBirth, monthlySalary, pan, employmentMode");
  }

  const result = runBRE({
    dateOfBirth,
    monthlySalary: Number(monthlySalary),
    pan: pan.toUpperCase(),
    employmentMode,
  });

  if (!result.passed) {
    res.status(200).json(
      new ApiResponse(200, result, "BRE check failed — eligibility criteria not met")
    );
    return;
  }

  res.json(new ApiResponse(200, result, "BRE check passed — eligible for loan"));
});

// POST /api/v1/borrower/upload-salary-slip
export const uploadSalarySlipHandler = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.file) {
      throw new ApiError(400, "Salary slip file is required");
    }

    // Since we are using diskStorage, req.file already contains the destination path
    const fileUrl = `/uploads/${req.file.filename}`;

    res.json(
      new ApiResponse(200, {
        url: fileUrl,
        publicId: req.file.filename, // Using filename as ID for consistency
        fileName: req.file.originalname,
        size: req.file.size,
        format: req.file.mimetype.split("/")[1],
      }, "Salary slip uploaded to local storage successfully")
    );
  }
);


// POST /api/v1/borrower/apply
export const applyForLoan = asyncHandler(async (req: AuthRequest, res: Response) => {
  const {
    fullName, pan, dateOfBirth, monthlySalary, employmentMode,
    salarySlipUrl, salarySlipFileName,
    principal, tenureDays,
  } = req.body;

  // Validate required fields
  if (!fullName || !pan || !dateOfBirth || !monthlySalary || !employmentMode ||
      !salarySlipUrl || !principal || !tenureDays) {
    throw new ApiError(400, "All application fields are required");
  }

  // Check if borrower already has an active loan
  const existingLoan = await Loan.findOne({
    borrower: req.user!._id,
    status: { $nin: ["REJECTED", "CLOSED"] },
  });

  if (existingLoan) {
    throw new ApiError(400, "You already have an active loan application");
  }

  // Run BRE again on server for security
  const breResult = runBRE({
    dateOfBirth,
    monthlySalary: Number(monthlySalary),
    pan: pan.toUpperCase(),
    employmentMode,
  });

  if (!breResult.passed) {
    throw new ApiError(400, "BRE validation failed", breResult.failedRules);
  }

  // Validate loan params
  const principalNum = Number(principal);
  const tenureNum = Number(tenureDays);

  if (principalNum < 50000 || principalNum > 500000) {
    throw new ApiError(400, "Loan amount must be between ₹50,000 and ₹5,00,000");
  }
  if (tenureNum < 30 || tenureNum > 365) {
    throw new ApiError(400, "Tenure must be between 30 and 365 days");
  }

  // Calculate interest
  const loanCalc = calculateLoan(principalNum, tenureNum);

  const loan = await Loan.create({
    borrower: req.user!._id,
    fullName,
    pan: pan.toUpperCase(),
    dateOfBirth: new Date(dateOfBirth),
    monthlySalary: Number(monthlySalary),
    employmentMode,
    salarySlipUrl,
    salarySlipFileName: salarySlipFileName || "salary-slip",
    principal: principalNum,
    tenureDays: tenureNum,
    interestRate: loanCalc.interestRate,
    simpleInterest: loanCalc.simpleInterest,
    totalRepayment: loanCalc.totalRepayment,
    status: "APPLIED",
    appliedAt: new Date(),
  });

  res.status(201).json(
    new ApiResponse(201, loan, "Loan application submitted successfully")
  );
});

// GET /api/v1/borrower/my-loans
export const getMyLoans = asyncHandler(async (req: AuthRequest, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const loans = await Loan.find({ borrower: req.user!._id })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Loan.countDocuments({ borrower: req.user!._id });

  res.json(
    new ApiResponse(200, {
      loans,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    }, "Your loans fetched successfully")
  );
});
