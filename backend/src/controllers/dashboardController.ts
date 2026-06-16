import { Request, Response } from "express";
import prisma from "../config/prisma";

export const getAdminStats = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const totalUsuarios = await prisma.usuario.count();
        const totalReportes = await prisma.reporte.count();
        
        // Reportes pendientes de validación
        const pendientesValidacion = await prisma.reporte.count({
            where: {
                estado: {
                    nombre: {
                        in: ['Reportado', 'En Progreso', 'En progreso', 'Validando']
                    }
                }
            }
        });

        const categoriasRaw = await prisma.categoria.findMany({
            include: {
                _count: {
                    select: { reporte: true }
                }
            }
        });

        const severidadesRaw = await prisma.reporte.groupBy({
            by: ['severidad'],
            _count: {
                severidad: true
            }
        });

        // Tendencia ultimos 30 dias
        const fechaLimite = new Date();
        fechaLimite.setDate(fechaLimite.getDate() - 30);
        
        const reportesRecientes = await prisma.reporte.findMany({
            where: {
                fecha_creacion: {
                    gte: fechaLimite
                }
            },
            select: {
                fecha_creacion: true
            }
        });

        const tendencias = reportesRecientes.reduce((acc: Record<string, number>, curr: any) => {
            if (curr.fecha_creacion) {
                const dateStr = curr.fecha_creacion.toISOString().split('T')[0];
                acc[dateStr] = (acc[dateStr] || 0) + 1;
            }
            return acc;
        }, {});

        res.status(200).json({
            totalUsuarios,
            totalReportes,
            pendientesValidacion,
            categorias: categoriasRaw.map((c: any) => ({ nombre: c.nombre, conteo: c._count.reporte })),
            severidad: severidadesRaw.reduce((acc: Record<string, number>, curr: any) => {
                if (curr.severidad) acc[curr.severidad.toLowerCase()] = curr._count.severidad;
                return acc;
            }, { baja: 0, media: 0, alta: 0, critica: 0 }),
            tendencias
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje: "Error al obtener estadísticas de administrador"
        });
    }
};

export const getUserStats = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ mensaje: "No autenticado" });
            return;
        }

        const usuarioId = req.user.id;

        const totalReportes = await prisma.reporte.count({
            where: { usuario_id: usuarioId }
        });

        const reportesValidados = await prisma.reporte.count({
            where: {
                usuario_id: usuarioId,
                estado: {
                    nombre: 'Resuelto'
                }
            }
        });

        const usuario = await prisma.usuario.findUnique({
            where: { id: usuarioId },
            select: { puntos_totales: true, nivel_ranking: true }
        });

        const reportesRecientes = await prisma.reporte.findMany({
            where: { usuario_id: usuarioId },
            orderBy: { fecha_creacion: 'desc' },
            take: 5,
            include: {
                estado: true,
                categoria: true
            }
        });

        res.status(200).json({
            totalReportes,
            reportesValidados,
            puntosTotales: usuario?.puntos_totales || 0,
            nivelRanking: usuario?.nivel_ranking || "Novato",
            reportesRecientes: reportesRecientes.map((r: any) => ({
                id: r.id,
                title: r.descripcion,
                category: r.categoria.nombre,
                status: r.estado.nombre,
                location: "Ubicación", // Simplifying location for now or parse it
                timeAgo: r.fecha_creacion ? r.fecha_creacion.toLocaleDateString() : "",
                views: 0
            }))
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje: "Error al obtener estadísticas de usuario"
        });
    }
};