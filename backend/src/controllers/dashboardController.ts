import { Request, Response } from "express";
import prisma from "../config/prisma";

export const stats = async (
    req: Request,
    res: Response
): Promise<void> => {

    try {

        const [
            totalReportes,
            baja,
            media,
            alta,
            critica
        ] = await Promise.all([

            prisma.reporte.count(),

            prisma.reporte.count({
                where: {
                    severidad: "Baja"
                }
            }),

            prisma.reporte.count({
                where: {
                    severidad: "Media"
                }
            }),

            prisma.reporte.count({
                where: {
                    severidad: "Alta"
                }
            }),

            prisma.reporte.count({
                where: {
                    severidad: "Critica"
                }
            })

        ]);

        res.status(200).json({

            totalReportes,

            severidad: {
                baja,
                media,
                alta,
                critica
            }

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            mensaje: "Error al obtener estadísticas"

        });

    }

};