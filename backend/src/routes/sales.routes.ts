import { Router } from "express";
import { getLeads, getPipeline } from "../controllers/sales.controller";
import { verifyJWT } from "../middleware/auth.middleware";
import { authorizeRoles } from "../middleware/rbac.middleware";

const router = Router();

router.use(verifyJWT, authorizeRoles("Sales", "Admin"));

router.get("/leads", getLeads);
router.get("/pipeline", getPipeline);

export default router;
