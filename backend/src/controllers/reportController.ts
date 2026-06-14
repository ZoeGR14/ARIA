import { Request, Response } from "express";
import prisma from "../config/prisma";

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

        const {
            descripcion,
            latitude,
            longitude,
            severidad,
            categoria_id
        } = req.body;

        const file = req.file;

        if (!descripcion || latitude === undefined || longitude === undefined || !categoria_id) {
            res.status(400).json({ mensaje: "Campos requeridos faltantes" });
            return;
        }

        const severidadesValidas = ["Baja", "Media", "Alta", "Critica"];
        const severidadDb = severidadesValidas.includes(severidad) ? severidad : "Baja";

        let photoUrl = null;
        if (file) {
            // Build the URL depending on host and protocol
            // Usually req.protocol is "http", and req.get("host") is "localhost:3001"
            photoUrl = `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;
        }

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
                ${photoUrl || null},
                0,
                'Pendiente'::estado_puntos_enum,
                ${usuarioId},
                1, 
                ${parseInt(categoria_id)}
            )
            RETURNING id
        `;

        const newId = result[0]?.id;

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
