import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { User } from "../models/User.model";
import { Loan } from "../models/Loan.model";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

// GET /api/v1/sales/leads — Borrowers with no loan application yet
export const getLeads = asyncHandler(async (req: AuthRequest, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;
  const search = req.query.search as string;

  // Find all borrower IDs who have at least one loan
  const borrowersWithLoans = await Loan.distinct("borrower");

  // Build query for borrowers without any loan
  const query: any = {
    role: "Borrower",
    _id: { $nin: borrowersWithLoans },
  };

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  const leads = await User.find(query)
    .select("-password -refreshToken")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await User.countDocuments(query);

  res.json(
    new ApiResponse(200, {
      leads,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    }, "Sales leads fetched")
  );
});

// GET /api/v1/sales/pipeline — Loan pipeline stats + recent applications
export const getPipeline = asyncHandler(async (req: AuthRequest, res: Response) => {
  // Get count by status
  const statusCounts = await Loan.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  const pipeline: Record<string, number> = {};
  statusCounts.forEach((s) => {
    pipeline[s._id] = s.count;
  });

  // Total borrowers registered
  const totalBorrowers = await User.countDocuments({ role: "Borrower" });

  // Leads (borrowers without any loans)
  const borrowersWithLoans = await Loan.distinct("borrower");
  const totalLeads = await User.countDocuments({
    role: "Borrower",
    _id: { $nin: borrowersWithLoans },
  });

  // Recent applications (last 10)
  const recentApplications = await Loan.find()
    .populate("borrower", "name email")
    .sort({ appliedAt: -1 })
    .limit(10)
    .select("fullName pan principal status appliedAt monthlySalary employmentMode");

  res.json(
    new ApiResponse(200, {
      pipeline,
      totalBorrowers,
      totalLeads,
      conversionRate: totalBorrowers > 0
        ? Math.round(((totalBorrowers - totalLeads) / totalBorrowers) * 100)
        : 0,
      recentApplications,
    }, "Sales pipeline fetched")
  );
});
