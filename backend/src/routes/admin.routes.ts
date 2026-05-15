import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware";
import { authorizeRoles } from "../middleware/rbac.middleware";
import { Loan } from "../models/Loan.model";
import { User } from "../models/User.model";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.use(verifyJWT, authorizeRoles("Admin"));

// GET /api/v1/admin/all-loans
router.get(
  "/all-loans",
  asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status as string;

    const query: any = {};
    if (status) query.status = status;

    const loans = await Loan.find(query)
      .populate("borrower", "name email")
      .populate("sanctionedBy", "name")
      .populate("disbursedBy", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Loan.countDocuments(query);

    // Status counts
    const statusCounts = await Loan.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    res.json(
      new ApiResponse(200, {
        loans,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        statusCounts: statusCounts.reduce(
          (acc, { _id, count }) => ({ ...acc, [_id]: count }),
          {}
        ),
      }, "All loans fetched")
    );
  })
);

// GET /api/v1/admin/all-users
router.get(
  "/all-users",
  asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const role = req.query.role as string;

    const query: any = {};
    if (role) query.role = role;

    const users = await User.find(query)
      .select("-password -refreshToken")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(query);

    res.json(
      new ApiResponse(200, {
        users,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      }, "All users fetched")
    );
  })
);

export default router;
