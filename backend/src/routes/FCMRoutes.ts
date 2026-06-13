import {Router} from "express";

import {

    guardarFcmToken,
    eliminarFcmToken,
    obtenerMisDispositivos

} from "../controllers/notificacionController";

import {

    authMiddleware

} from "../middleware/authMiddleware";

const router = Router();

router.post(
    "/fcm-token",
    authMiddleware,
    guardarFcmToken
);

router.delete(
    "/fcm-token",
    authMiddleware,
    eliminarFcmToken
);

router.get(
    "/mis-dispositivos",
    authMiddleware,
    obtenerMisDispositivos
);
export default router;