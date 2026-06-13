import { Request, Response } from "express";

import prisma from "../config/prisma";

export const stats = async (

    req: Request,
    res: Response

): Promise<void> => {

    try {

        const totalReportes =

            await prisma.reporte.count();

        const alta =

            await prisma.reporte.count({

                where: {

                    severidad: "ALTA"

                }

            });

        const media =

            await prisma.reporte.count({

                where: {

                    severidad: "MEDIA"

                }

            });

        const baja =

            await prisma.reporte.count({

                where: {

                    severidad: "BAJA"

                }

            });

        res.json({

            totalReportes,
            alta,
            media,
            baja

        });

    } catch (error) {

        res.status(500).json(error);

    }

};