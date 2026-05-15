import { Router } from "express";
import { getSanctionedLoans, disburseLoan } from "../controllers/disbursement.controller";
import { verifyJWT } from "../middleware/auth.middleware";
import { authorizeRoles } from "../middleware/rbac.middleware";

const router = Router();

router.use(verifyJWT, authorizeRoles("Disbursement", "Admin"));

router.get("/loans", getSanctionedLoans);
router.patch("/loans/:id/disburse", disburseLoan);

export default router;
