import { Router } from "express";
import { getContributores } from "../controllers/rankingController";

const router = Router();

router.get("/contributors", getContributores);

export default router;
