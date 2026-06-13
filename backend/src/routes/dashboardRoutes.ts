import { Router } from "express";

import {

    stats

} from "../controllers/dashboardController";

import {

    authMiddleware

} from "../middleware/authMiddleware";

import {

    adminMiddleware

} from "../middleware/adminMiddleware";

const router = Router();

router.get(

    "/stats",

    authMiddleware,

    adminMiddleware,

    stats

);

export default router;