import { Router } from "express";
import { signup, login, logout, refreshAccessToken, getCurrentUser } from "../controllers/auth.controller";
import { verifyJWT } from "../middleware/auth.middleware";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", verifyJWT, logout);
router.post("/refresh-token", refreshAccessToken);
router.get("/me", verifyJWT, getCurrentUser);

export default router;
