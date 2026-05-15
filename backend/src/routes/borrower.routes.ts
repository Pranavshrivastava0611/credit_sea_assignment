import { Router } from "express";
import { breCheck, uploadSalarySlipHandler, applyForLoan, getMyLoans } from "../controllers/borrower.controller";
import { verifyJWT } from "../middleware/auth.middleware";
import { authorizeRoles } from "../middleware/rbac.middleware";
import { uploadSalarySlip } from "../middleware/upload.middleware";

const router = Router();

// All borrower routes require auth + Borrower role
router.use(verifyJWT, authorizeRoles("Borrower"));

router.post("/bre-check", breCheck);
router.post("/upload-salary-slip", uploadSalarySlip, uploadSalarySlipHandler);
router.post("/apply", applyForLoan);
router.get("/my-loans", getMyLoans);

export default router;
