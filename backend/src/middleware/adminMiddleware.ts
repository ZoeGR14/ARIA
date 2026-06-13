import {

    Request,
    Response,
    NextFunction

} from "express";

export const adminMiddleware = (

    req: Request,
    res: Response,
    next: NextFunction

): void => {

    if (req.user?.rol !== "ADMIN") {

        res.status(403).json({

            mensaje: "Acceso denegado"

        });

        return;
    }

    next();
};