import { Request, Response, NextFunction } from "express";

export const adminMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {

    if (!req.user) {

        res.status(401).json({
            mensaje: "No autenticado"
        });

        return;

    }

    if (req.user.rol !== "ADMINISTRADOR") {

        res.status(403).json({
            mensaje: "Acceso denegado"
        });

        return;

    }

    next();

};