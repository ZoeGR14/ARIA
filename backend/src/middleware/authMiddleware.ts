import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
    id: number;
    rol: string;
    iat?: number;
    exp?: number;
}

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

    if (!authHeader.startsWith("Bearer ")) {

        res.status(401).json({
            mensaje: "Formato de token inválido"
        });

        return;
    }

    const token = authHeader.split(" ")[1];

    try {

        const secret = process.env.JWT_SECRET;

        if (!secret) {

            throw new Error(
                "JWT_SECRET no configurado"
            );

        }

        const decoded = jwt.verify(
            token,
            secret
        ) as JwtPayload;

        req.user = {

            id: decoded.id,
            rol: decoded.rol

        };

        next();

    } catch (error) {

        console.error(
            "Error validando JWT:",
            error
        );

        res.status(401).json({

            mensaje: "Token inválido o expirado"

        });

    }

};