import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import {
    obtenerNotificaciones,
    marcarNotificacionLeida,
    marcarTodasLeidas
} from "../controllers/notificacionController";

const router = Router();

router.get("/", authMiddleware, obtenerNotificaciones);
router.patch("/leer-todas", authMiddleware, marcarTodasLeidas);
router.patch("/:id/leer", authMiddleware, marcarNotificacionLeida);

export default router;
