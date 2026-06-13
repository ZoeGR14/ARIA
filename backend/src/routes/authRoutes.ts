import { Router } from "express";

import {

    register,
    login,
    verificarCorreo,
    solicitarRecuperacion,
    restablecerPassword

} from "../controllers/authController";

const router = Router();

router.post("/register", register);

router.post("/login", login);

router.get(
    "/verificar/:token",
    verificarCorreo
);

router.post(
    "/solicitar-recuperacion",
    solicitarRecuperacion
);

router.post(
    "/restablecer-password",
    restablecerPassword
);
export default router;