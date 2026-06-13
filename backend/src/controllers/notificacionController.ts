import { Request, Response } from "express";
import prisma from "../config/prisma";

export const guardarFcmToken = async (
    req: Request,
    res: Response
): Promise<void> => {

    try {

        const usuarioId = req.user?.id;

        const {
            fcmToken,
            dispositivoInfo
        } = req.body;

        if (!usuarioId) {

            res.status(401).json({
                mensaje: "Usuario no autenticado"
            });

            return;

        }

        if (!fcmToken) {

            res.status(400).json({
                mensaje: "FCM Token requerido"
            });

            return;

        }

        const existente =
            await prisma.dispositivo_usuario.findUnique({

                where: {
                    fcm_token: fcmToken
                }

            });

        if (existente) {

            await prisma.dispositivo_usuario.update({

                where: {
                    id: existente.id
                },

                data: {
                    usuario_id: usuarioId,
                    dispositivo_info: dispositivoInfo
                }

            });

        } else {

            await prisma.dispositivo_usuario.create({

                data: {

                    usuario_id: usuarioId,

                    fcm_token: fcmToken,

                    dispositivo_info: dispositivoInfo

                }

            });

        }

        res.status(200).json({

            mensaje: "Token FCM registrado correctamente"

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            mensaje: "Error al guardar token FCM"

        });

    }

};

export const eliminarFcmToken = async (
    req: Request,
    res: Response
): Promise<void> => {

    const { fcmToken } = req.body;

    await prisma.dispositivo_usuario.deleteMany({

        where: {
            fcm_token: fcmToken
        }

    });

    res.json({
        mensaje: "Token eliminado"
    });

};


export const obtenerMisDispositivos = async (
    req: Request,
    res: Response
): Promise<void> => {

    try {

        const usuarioId = req.user?.id;

        const dispositivos =
            await prisma.dispositivo_usuario.findMany({

                where: {
                    usuario_id: usuarioId
                },

                select: {

                    id: true,

                    fcm_token: true,

                    dispositivo_info: true,

                    fecha_registro: true

                }

            });

        res.json(dispositivos);

    } catch (error) {

        console.error(error);

        res.status(500).json({

            mensaje: "Error al obtener dispositivos"

        });

    }

};