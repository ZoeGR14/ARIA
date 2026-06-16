import { Request, Response } from "express";
import prisma from "../config/prisma";

export const getContributores = async (req: Request, res: Response): Promise<void> => {
    try {
        const contributors = await prisma.usuario.findMany({
            orderBy: { puntos_totales: "desc" },
            take: 10,
            select: {
                id: true,
                nombre_completo: true,
                puntos_totales: true,
                nivel_ranking: true,
                email_verificado: true,
                _count: { select: { reporte: true } }
            }
        });

        res.status(200).json(contributors);
    } catch (error) {
        console.error("Error al obtener contribuidores:", error);
        res.status(500).json({ mensaje: "Error al obtener contribuidores" });
    }
};
