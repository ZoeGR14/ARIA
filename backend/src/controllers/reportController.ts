import { Request, Response } from "express";
import prisma from "../config/prisma";
import { enviarNotificacionFCM } from "../services/fcm.service";

export const getReportesActivos = async (req: Request, res: Response): Promise<void> => {
    try {
        const reports = await prisma.$queryRaw<any[]>`
            SELECT 
                r.id,
                r.descripcion,
                r.fecha_creacion,
                r.fecha_actualizacion,
                r.severidad,
                r.url_evidencia_foto,
                r.puntos_asignados,
                r.estado_puntos,
                r.usuario_id,
                r.estado_id,
                r.categoria_id,
                ST_X(r.ubicacion::geometry) as longitude,
                ST_Y(r.ubicacion::geometry) as latitude,
                c.nombre as categoria_nombre,
                c.color_hex as categoria_color,
                e.nombre as estado_nombre,
                u.nombre_completo as usuario_nombre
            FROM reporte r
            LEFT JOIN categoria c ON r.categoria_id = c.id
            LEFT JOIN estado e ON r.estado_id = e.id
            LEFT JOIN usuario u ON r.usuario_id = u.id
            ORDER BY r.fecha_creacion DESC
        `;

        const formattedReports = reports.map((r: any) => {
            return {
                id: r.id,
                descripcion: r.descripcion,
                fecha_creacion: r.fecha_creacion,
                fecha_actualizacion: r.fecha_actualizacion,
                severidad: r.severidad,
                url_evidencia_foto: r.url_evidencia_foto,
                puntos_asignados: r.puntos_asignados,
                estado_puntos: r.estado_puntos,
                usuario_id: r.usuario_id,
                estado_id: r.estado_id,
                categoria_id: r.categoria_id,
                latitude: r.latitude,
                longitude: r.longitude,
                categoria: {
                    id: r.categoria_id,
                    nombre: r.categoria_nombre,
                    color_hex: r.categoria_color
                },
                estado: {
                    id: r.estado_id,
                    nombre: r.estado_nombre
                },
                usuario: {
                    id: r.usuario_id,
                    nombre_completo: r.usuario_nombre
                }
            };
        });

        res.status(200).json(formattedReports);
    } catch (error) {
        console.error("Error al obtener reportes activos:", error);
        res.status(500).json({ mensaje: "Error al obtener reportes" });
    }
};

export const getReporteById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const reports = await prisma.$queryRaw<any[]>`
            SELECT 
                r.id,
                r.descripcion,
                r.fecha_creacion,
                r.fecha_actualizacion,
                r.severidad,
                r.url_evidencia_foto,
                r.puntos_asignados,
                r.estado_puntos,
                r.usuario_id,
                r.estado_id,
                r.categoria_id,
                ST_X(r.ubicacion::geometry) as longitude,
                ST_Y(r.ubicacion::geometry) as latitude,
                c.nombre as categoria_nombre,
                c.color_hex as categoria_color,
                e.nombre as estado_nombre,
                u.nombre_completo as usuario_nombre
            FROM reporte r
            LEFT JOIN categoria c ON r.categoria_id = c.id
            LEFT JOIN estado e ON r.estado_id = e.id
            LEFT JOIN usuario u ON r.usuario_id = u.id
            WHERE r.id = ${parseInt(id as string)}
        `;

        if (!reports || reports.length === 0) {
            res.status(404).json({ mensaje: "Reporte no encontrado" });
            return;
        }

        const r = reports[0];

        const formattedReport = {
            id: r.id,
            descripcion: r.descripcion,
            fecha_creacion: r.fecha_creacion,
            fecha_actualizacion: r.fecha_actualizacion,
            severidad: r.severidad,
            url_evidencia_foto: r.url_evidencia_foto,
            puntos_asignados: r.puntos_asignados,
            estado_puntos: r.estado_puntos,
            usuario_id: r.usuario_id,
            estado_id: r.estado_id,
            categoria_id: r.categoria_id,
            latitude: r.latitude,
            longitude: r.longitude,
            categoria: {
                id: r.categoria_id,
                nombre: r.categoria_nombre,
                color_hex: r.categoria_color
            },
            estado: {
                id: r.estado_id,
                nombre: r.estado_nombre
            },
            usuario: {
                id: r.usuario_id,
                nombre_completo: r.usuario_nombre
            }
        };

        res.status(200).json(formattedReport);
    } catch (error) {
        console.error("Error al obtener detalle del reporte:", error);
        res.status(500).json({ mensaje: "Error al obtener detalle del reporte" });
    }
};

export const crearReporte = async (req: Request, res: Response): Promise<void> => {
    try {
        const usuarioId = req.user?.id;
        if (!usuarioId) {
            res.status(401).json({ mensaje: "Usuario no autenticado" });
            return;
        }

        const { descripcion, latitude, longitude, severidad } = req.body;
        const file = req.file;

        // Validaciones básicas
        if (!descripcion || latitude === undefined || longitude === undefined) {
            res.status(400).json({ mensaje: "Faltan campos obligatorios" });
            return;
        }

        const severidadDb = ["Baja", "Media", "Alta", "Critica"].includes(severidad) ? severidad : "Baja";
        const photoUrl = file ? `${req.protocol}://${req.get("host")}/uploads/${file.filename}` : null;

        // FORZAMOS LA CATEGORÍA A 1 PARA ELIMINAR CUALQUIER ERROR DE FONTEND
        const categoriaForzada = 1;

        const result = await prisma.$queryRaw<any[]>`
            INSERT INTO reporte (
                descripcion,
                ubicacion,
                severidad,
                url_evidencia_foto,
                puntos_asignados,
                estado_puntos,
                usuario_id,
                estado_id,
                categoria_id
            ) VALUES (
                ${descripcion},
                ST_SetSRID(ST_MakePoint(${parseFloat(longitude)}, ${parseFloat(latitude)}), 4326)::geography,
                ${severidadDb}::severidad_enum,
                ${photoUrl},
                0,
                'Pendiente'::estado_puntos_enum,
                ${usuarioId},
                1,
                ${categoriaForzada}
            )
            RETURNING id
        `;

        const newId = result[0]?.id;

        if (severidadDb === "Alta" || severidadDb === "Critica") {
            try {
                const administradores = await prisma.$queryRaw<any[]>`
                    SELECT u.id 
                    FROM usuario u
                    INNER JOIN administrador a ON u.id = a.id
                `;

                if (administradores.length > 0) {
                    const adminIds = administradores.map(a => a.id);
                    const mensajeAlerta = `¡Alerta! Nuevo reporte de severidad ${severidadDb}: ${descripcion.substring(0, 50)}...`;

                    await prisma.notificacion.createMany({
                        data: adminIds.map(id => ({
                            usuario_id: id,
                            mensaje: mensajeAlerta,
                            tipo: 'SISTEMA_ALERTA',
                            reporte_id: newId
                        }))
                    });

                    const dispositivos = await prisma.dispositivo_usuario.findMany({
                        where: { usuario_id: { in: adminIds } },
                        select: { fcm_token: true }
                    });

                    const tokens = dispositivos.map(d => d.fcm_token);

                    if (tokens.length > 0) {
                        await enviarNotificacionFCM(
                            tokens,
                            `Reporte ${severidadDb} detectado`,
                            mensajeAlerta,
                            newId.toString()
                        );
                    }
                }
            } catch (notifyError) {
                console.error("Error enviando notificaciones a administradores:", notifyError);
            }
        }

        res.status(201).json({
            mensaje: "Reporte creado exitosamente",
            id: newId,
            url_evidencia_foto: photoUrl
        });
    } catch (error) {
        console.error("Error al crear reporte:", error);
        res.status(500).json({ mensaje: "Error al crear el reporte" });
    }
};

export const getMisReportes = async (req: Request, res: Response): Promise<void> => {
    try {
        const usuarioId = req.user?.id;
        if (!usuarioId) {
            res.status(401).json({ mensaje: "Usuario no autenticado" });
            return;
        }

        const reports = await prisma.$queryRaw<any[]>`
            SELECT 
                r.id,
                r.descripcion,
                r.fecha_creacion,
                r.fecha_actualizacion,
                r.severidad,
                r.url_evidencia_foto,
                r.puntos_asignados,
                r.estado_puntos,
                r.usuario_id,
                r.estado_id,
                r.categoria_id,
                ST_X(r.ubicacion::geometry) as longitude,
                ST_Y(r.ubicacion::geometry) as latitude,
                c.nombre as categoria_nombre,
                c.color_hex as categoria_color,
                e.nombre as estado_nombre,
                u.nombre_completo as usuario_nombre
            FROM reporte r
            LEFT JOIN categoria c ON r.categoria_id = c.id
            LEFT JOIN estado e ON r.estado_id = e.id
            LEFT JOIN usuario u ON r.usuario_id = u.id
            WHERE r.usuario_id = ${usuarioId}
            ORDER BY r.fecha_creacion DESC
        `;

        const formattedReports = reports.map((r: any) => ({
            id: r.id,
            descripcion: r.descripcion,
            fecha_creacion: r.fecha_creacion,
            fecha_actualizacion: r.fecha_actualizacion,
            severidad: r.severidad,
            url_evidencia_foto: r.url_evidencia_foto,
            puntos_asignados: r.puntos_asignados,
            estado_puntos: r.estado_puntos,
            usuario_id: r.usuario_id,
            estado_id: r.estado_id,
            categoria_id: r.categoria_id,
            latitude: r.latitude,
            longitude: r.longitude,
            categoria: {
                id: r.categoria_id,
                nombre: r.categoria_nombre,
                color_hex: r.categoria_color
            },
            estado: {
                id: r.estado_id,
                nombre: r.estado_nombre
            },
            usuario: {
                id: r.usuario_id,
                nombre_completo: r.usuario_nombre
            }
        }));

        res.status(200).json(formattedReports);
    } catch (error) {
        console.error("Error al obtener mis reportes:", error);
        res.status(500).json({ mensaje: "Error al obtener mis reportes" });
    }
};

export const getReportesByUsuario = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = req.params;

        const reports = await prisma.$queryRaw<any[]>`
            SELECT 
                r.id,
                r.descripcion,
                r.fecha_creacion,
                r.fecha_actualizacion,
                r.severidad,
                r.url_evidencia_foto,
                r.puntos_asignados,
                r.estado_puntos,
                r.usuario_id,
                r.estado_id,
                r.categoria_id,
                ST_X(r.ubicacion::geometry) as longitude,
                ST_Y(r.ubicacion::geometry) as latitude,
                c.nombre as categoria_nombre,
                c.color_hex as categoria_color,
                e.nombre as estado_nombre,
                u.nombre_completo as usuario_nombre
            FROM reporte r
            LEFT JOIN categoria c ON r.categoria_id = c.id
            LEFT JOIN estado e ON r.estado_id = e.id
            LEFT JOIN usuario u ON r.usuario_id = u.id
            WHERE r.usuario_id = ${parseInt(userId as string)}
            ORDER BY r.fecha_creacion DESC
        `;

        const formattedReports = reports.map((r: any) => ({
            id: r.id,
            descripcion: r.descripcion,
            fecha_creacion: r.fecha_creacion,
            fecha_actualizacion: r.fecha_actualizacion,
            severidad: r.severidad,
            url_evidencia_foto: r.url_evidencia_foto,
            puntos_asignados: r.puntos_asignados,
            estado_puntos: r.estado_puntos,
            usuario_id: r.usuario_id,
            estado_id: r.estado_id,
            categoria_id: r.categoria_id,
            latitude: r.latitude,
            longitude: r.longitude,
            categoria: {
                id: r.categoria_id,
                nombre: r.categoria_nombre,
                color_hex: r.categoria_color
            },
            estado: {
                id: r.estado_id,
                nombre: r.estado_nombre
            },
            usuario: {
                id: r.usuario_id,
                nombre_completo: r.usuario_nombre
            }
        }));

        res.status(200).json(formattedReports);
    } catch (error) {
        console.error("Error al obtener reportes del usuario:", error);
        res.status(500).json({ mensaje: "Error al obtener reportes del usuario" });
    }
};
