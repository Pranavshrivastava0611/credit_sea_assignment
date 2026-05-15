import { Router } from "express";
import { getAppliedLoans, approveLoan, rejectLoan } from "../controllers/sanction.controller";
import { verifyJWT } from "../middleware/auth.middleware";
import { authorizeRoles } from "../middleware/rbac.middleware";

const router = Router();

router.use(verifyJWT, authorizeRoles("Sanction", "Admin"));

router.get("/loans", getAppliedLoans);
router.patch("/loans/:id/approve", approveLoan);
router.patch("/loans/:id/reject", rejectLoan);

export default router;
