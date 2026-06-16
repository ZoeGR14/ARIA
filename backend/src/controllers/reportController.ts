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
                u.nombre_completo as usuario_nombre,
                u.avatar_url as avatar,
                u.nivel_ranking as usuario_nivel_ranking,
                CASE WHEN a.id IS NOT NULL THEN 'Administrador' ELSE 'Ciudadano' END as usuario_rol
            FROM reporte r
            LEFT JOIN categoria c ON r.categoria_id = c.id
            LEFT JOIN estado e ON r.estado_id = e.id
            LEFT JOIN usuario u ON r.usuario_id = u.id
            LEFT JOIN administrador a ON u.id = a.id
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
                    nombre_completo: r.usuario_nombre,
                    avatar_url: r.avatar,
                    nivel_ranking: r.usuario_nivel_ranking,
                    rol: r.usuario_rol,
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
                u.nombre_completo as usuario_nombre,
                u.avatar_url as avatar,
                u.nivel_ranking as usuario_nivel_ranking,
                CASE WHEN a.id IS NOT NULL THEN 'Administrador' ELSE 'Ciudadano' END as usuario_rol
            FROM reporte r
            LEFT JOIN categoria c ON r.categoria_id = c.id
            LEFT JOIN estado e ON r.estado_id = e.id
            LEFT JOIN usuario u ON r.usuario_id = u.id
            LEFT JOIN administrador a ON u.id = a.id
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
                nombre_completo: r.usuario_nombre,
                avatar_url: r.avatar,
                nivel_ranking: r.usuario_nivel_ranking,
                rol: r.usuario_rol,
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

        const { descripcion, latitude, longitude, severidad, categoria_id } = req.body;
        const file = req.file;

        // Validaciones básicas
        if (!descripcion || latitude === undefined || longitude === undefined) {
            res.status(400).json({ mensaje: "Faltan campos obligatorios" });
            return;
        }

        const severidadDb = ["Baja", "Media", "Alta", "Critica"].includes(severidad) ? severidad : "Baja";
        const photoUrl = file ? `${req.protocol}://${req.get("host")}/uploads/${file.filename}` : null;

        // Mapeo dinámico de categoría a ID
        let finalCategoriaId = 1;
        if (categoria_id) {
            const parsedId = parseInt(categoria_id);
            if (!isNaN(parsedId)) {
                finalCategoriaId = parsedId;
            } else {
                const catStr = String(categoria_id).toLowerCase();
                if (catStr.includes("residuo") || catStr.includes("basura")) {
                    finalCategoriaId = 1;
                } else if (catStr.includes("agua")) {
                    finalCategoriaId = 2;
                } else if (catStr.includes("tala") || catStr.includes("verde")) {
                    finalCategoriaId = 3;
                } else if (catStr.includes("aire") || catStr.includes("atm")) {
                    finalCategoriaId = 4;
                }
            }
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
                ${photoUrl},
                0,
                'Pendiente'::estado_puntos_enum,
                ${usuarioId},
                1,
                ${finalCategoriaId}
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
                    const adminIds = administradores.map((a: any) => a.id);
                    const mensajeAlerta = `¡Alerta! Nuevo reporte de severidad ${severidadDb}: ${descripcion.substring(0, 50)}...`;

                    await prisma.notificacion.createMany({
                        data: adminIds.map((id: number) => ({
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

                    const tokens = dispositivos.map((d: any) => d.fcm_token);

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
                u.nombre_completo as usuario_nombre,
                u.avatar_url as avatar,
                u.nivel_ranking as usuario_nivel_ranking,
                CASE WHEN a.id IS NOT NULL THEN 'Administrador' ELSE 'Ciudadano' END as usuario_rol
            FROM reporte r
            LEFT JOIN categoria c ON r.categoria_id = c.id
            LEFT JOIN estado e ON r.estado_id = e.id
            LEFT JOIN usuario u ON r.usuario_id = u.id
            LEFT JOIN administrador a ON u.id = a.id
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
                nombre_completo: r.usuario_nombre,
                avatar_url: r.avatar,
                nivel_ranking: r.usuario_nivel_ranking,
                rol: r.usuario_rol,
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
                u.nombre_completo as usuario_nombre,
                u.avatar_url as avatar,
                u.nivel_ranking as usuario_nivel_ranking,
                CASE WHEN a.id IS NOT NULL THEN 'Administrador' ELSE 'Ciudadano' END as usuario_rol
            FROM reporte r
            LEFT JOIN categoria c ON r.categoria_id = c.id
            LEFT JOIN estado e ON r.estado_id = e.id
            LEFT JOIN usuario u ON r.usuario_id = u.id
            LEFT JOIN administrador a ON u.id = a.id
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
                nombre_completo: r.usuario_nombre,
                avatar_url: r.avatar,
                nivel_ranking: r.usuario_nivel_ranking,
                rol: r.usuario_rol,
            }
        }));

        res.status(200).json(formattedReports);
    } catch (error) {
        console.error("Error al obtener reportes del usuario:", error);
        res.status(500).json({ mensaje: "Error al obtener reportes del usuario" });
    }
}
export const actualizarReporte = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const reporteId = parseInt(id as string);

        if (isNaN(reporteId)) {
            res.status(400).json({ mensaje: "ID de reporte inválido" });
            return;
        }

        const { estado_id, estado_puntos, puntos_asignados } = req.body;

        // Verify if report exists and get its creator
        const reporteActual = await prisma.reporte.findUnique({
            where: { id: reporteId },
            include: { estado: true }
        });

        if (!reporteActual) {
            res.status(404).json({ mensaje: "Reporte no encontrado" });
            return;
        }

        const updateData: any = {};

        let notificarEstado = false;
        let notificarPuntos = false;
        let nuevoEstadoNombre = "";

        if (estado_id !== undefined && estado_id !== reporteActual.estado_id) {
            updateData.estado_id = parseInt(estado_id);
            const nuevoEstado = await prisma.estado.findUnique({ where: { id: parseInt(estado_id) } });
            if (nuevoEstado) {
                notificarEstado = true;
                nuevoEstadoNombre = nuevoEstado.nombre;
            }
        }

        if (estado_puntos !== undefined && estado_puntos !== reporteActual.estado_puntos) {
            updateData.estado_puntos = estado_puntos;
            if (puntos_asignados !== undefined) {
                updateData.puntos_asignados = parseInt(puntos_asignados);
            }
            if (estado_puntos === 'Otorgado' && (updateData.puntos_asignados > 0 || (reporteActual.puntos_asignados !== null && reporteActual.puntos_asignados > 0))) {
                notificarPuntos = true;
                if (updateData.puntos_asignados === undefined) {
                    updateData.puntos_asignados = reporteActual.puntos_asignados;
                }
            }
        } else if (puntos_asignados !== undefined && puntos_asignados !== reporteActual.puntos_asignados) {
            updateData.puntos_asignados = parseInt(puntos_asignados);
            if (reporteActual.estado_puntos === 'Otorgado') {
                notificarPuntos = true; // Notificamos si ya estaba otorgado pero cambiaron los puntos
            }
        }

        // Si no hay nada que actualizar
        if (Object.keys(updateData).length === 0) {
            res.status(200).json({ mensaje: "No hay cambios para actualizar", reporte: reporteActual });
            return;
        }

        updateData.fecha_actualizacion = new Date();

        // Update the report
        const reporteActualizado = await prisma.reporte.update({
            where: { id: reporteId },
            data: updateData
        });

        const usuarioId = reporteActual.usuario_id;
        const notificacionesACrear: any[] = [];
        const mensajesFCM: { title: string, body: string }[] = [];

        // Lógica de gamificación y notificación de puntos
        if (notificarPuntos) {
            const puntosAgregados = updateData.puntos_asignados || 0;

            // Sumar puntos al usuario
            const usuarioUpdate = await prisma.usuario.update({
                where: { id: usuarioId },
                data: { puntos_totales: { increment: puntosAgregados } }
            });

            // Actualizar nivel_ranking basado en puntos totales
            let nuevoNivel = "Novato";
            if (usuarioUpdate.puntos_totales >= 1000) {
                nuevoNivel = "Experto";
            } else if (usuarioUpdate.puntos_totales >= 500) {
                nuevoNivel = "Protector";
            } else if (usuarioUpdate.puntos_totales >= 100) {
                nuevoNivel = "Colaborador";
            }

            if (usuarioUpdate.nivel_ranking !== nuevoNivel) {
                await prisma.usuario.update({
                    where: { id: usuarioId },
                    data: { nivel_ranking: nuevoNivel }
                });
                mensajesFCM.push({ title: '¡Has subido de nivel! 🚀', body: `¡Felicidades! Ahora eres de nivel ${nuevoNivel}.` });
                notificacionesACrear.push({
                    usuario_id: usuarioId,
                    mensaje: `¡Felicidades! Has subido al nivel ${nuevoNivel}.`,
                    tipo: 'SISTEMA_ALERTA',
                    reporte_id: reporteId
                });
            }

            const mensajePuntos = `¡Has ganado ${puntosAgregados} puntos por tu reporte! Tu puntaje total es ahora de ${usuarioUpdate.puntos_totales} puntos.`;
            notificacionesACrear.push({
                usuario_id: usuarioId,
                mensaje: mensajePuntos,
                tipo: 'PUNTOS_OTORGADOS',
                reporte_id: reporteId
            });
            mensajesFCM.push({ title: '¡Puntos ganados! 🌟', body: mensajePuntos });
        }

        // Lógica de notificación de cambio de estado
        if (notificarEstado) {
            const mensajeEstado = `Tu reporte ha cambiado de estado a "${nuevoEstadoNombre}".`;
            notificacionesACrear.push({
                usuario_id: usuarioId,
                mensaje: mensajeEstado,
                tipo: 'ESTADO_REPORTE',
                reporte_id: reporteId
            });
            mensajesFCM.push({ title: 'Actualización de tu reporte 📋', body: mensajeEstado });
        }

        // Enviar notificaciones
        if (notificacionesACrear.length > 0) {
            await prisma.notificacion.createMany({ data: notificacionesACrear });

            const dispositivos = await prisma.dispositivo_usuario.findMany({
                where: { usuario_id: usuarioId },
                select: { fcm_token: true }
            });

            const tokens = dispositivos.map((d: any) => d.fcm_token);

            if (tokens.length > 0) {
                // Enviar FCMs de forma asíncrona
                for (const msg of mensajesFCM) {
                    await enviarNotificacionFCM(tokens, msg.title, msg.body, reporteId.toString());
                }
            }
        }

        res.status(200).json({
            mensaje: "Reporte actualizado exitosamente",
            reporte: reporteActualizado
        });
    } catch (error) {
        console.error("Error al actualizar reporte:", error);
        res.status(500).json({ mensaje: "Error al actualizar el reporte" });
    }
};
