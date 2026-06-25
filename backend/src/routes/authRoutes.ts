import { Router } from "express";

import {

    register,
    login,
    verificarCorreo,
    solicitarRecuperacion,
    restablecerPassword,
    actualizarPerfil,
    cambiarPassword,
    eliminarUsuario

} from "../controllers/authController";

import {

    authMiddleware

} from "../middleware/authMiddleware";

import {

    adminMiddleware

} from "../middleware/adminMiddleware";

import {

    uploadAvatar

} from "../config/multer";

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

router.put(
    "/perfil",
    authMiddleware,
    uploadAvatar.single(
        "avatar"
    ),
    actualizarPerfil
);

router.put(
    "/password",
    authMiddleware,
    cambiarPassword
);

router.delete(
    "/:id",
    authMiddleware,
    adminMiddleware,
    eliminarUsuario
);
export default router;