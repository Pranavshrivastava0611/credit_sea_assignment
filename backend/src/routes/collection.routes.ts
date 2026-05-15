import { Router } from "express";
import { getDisbursedLoans, recordPayment, getPaymentHistory } from "../controllers/collection.controller";
import { verifyJWT } from "../middleware/auth.middleware";
import { authorizeRoles } from "../middleware/rbac.middleware";

const router = Router();

router.use(verifyJWT, authorizeRoles("Collection", "Admin"));

router.get("/loans", getDisbursedLoans);
router.post("/loans/:id/payment", recordPayment);
router.get("/loans/:id/payments", getPaymentHistory);

export default router;
