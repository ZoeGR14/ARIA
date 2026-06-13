import { Request, Response, NextFunction } from "express";

import jwt from "jsonwebtoken";

export const authMiddleware = (

    req: Request,
    res: Response,
    next: NextFunction

): void => {

    const authHeader = req.headers.authorization;

    if (!authHeader) {

        res.status(401).json({

            mensaje: "Token requerido"

        });

        return;
    }

    const token = authHeader.split(" ")[1];

    try {

        const decoded = jwt.verify(

            token,
            process.env.JWT_SECRET as string

        ) as {

            id: number;
            rol: string;

        };

        req.user = decoded;
        console.log("middleware cargado");
        next();

    } catch {

        res.status(401).json({

            mensaje: "Token inválido"

        });

    }

};