import { Router } from "express";
import { getAdminStats, getUserStats } from "../controllers/dashboardController";
import { authMiddleware } from "../middleware/authMiddleware";
import { adminMiddleware } from "../middleware/adminMiddleware";

const router = Router();

router.get("/admin-stats", authMiddleware, adminMiddleware, getAdminStats);
router.get("/user-stats", authMiddleware, getUserStats);

export default router;