import { Request, Response } from "express";

import prisma from "../config/prisma";

import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";

import path from 'path';

import { generarToken } from "../utils/token";
import { transporter } from "../services/email.service";

import {verificationEmailTemplate} from "../assets/templates/verificarCorreo"
import {recoverEmailTemplate} from "../assets/templates/recuperarContra"

export const register = async (
    req: Request,
    res: Response
): Promise<void> => {

    try {

        const {
            nombreCompleto,
            correoElectronico,
            password
        } = req.body;

        const existe = await prisma.usuario.findUnique({
            where: {
                correo_electronico: correoElectronico
            }
        });

        if (existe) {

            res.status(409).json({
                mensaje: "El correo ya está registrado"
            });

            return;
        }

        const hash = await bcrypt.hash(password, 10);

        const usuario = await prisma.usuario.create({

            data: {

                nombre_completo: nombreCompleto,

                correo_electronico: correoElectronico,

                contrasena_hash: hash,

                email_verificado: false,

                puntos_totales: 0,

                nivel_ranking: "Novato"

            }

        });

        const token = generarToken();

        const expira = new Date();

        expira.setHours(expira.getHours() + 24);

        await prisma.token_autenticacion.create({

            data: {

                usuario_id: usuario.id,

                token,

                tipo: "VERIFICACION_CORREO",

                expira_en: expira

            }

        });

        try {
            const url = "http://localhost:3000/verificar-correo/"+token;
            const html = verificationEmailTemplate(
                usuario.nombre_completo,
                url
            );
            await transporter.sendMail({

                to: usuario.correo_electronico,

                subject: "Verifica tu cuenta en ARIA",

                html,
                attachments: [
                    {
                        filename: 'logo-aria.png',
                        path: path.join(process.cwd(),'src','assets', 'images', 'tiny.png'),
                        cid: 'aria-logo'
                    }
                ]
            });
        } catch (mailError) {
            console.error("Error al enviar el correo de verificación:", mailError);
            // No interrumpimos el flujo porque el usuario ya fue creado en BD
        }

        res.status(201).json({

            mensaje: "Usuario registrado correctamente",

            usuario: {

                id: usuario.id,

                nombre_completo: usuario.nombre_completo,

                correo_electronico: usuario.correo_electronico

            }

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            mensaje: "Error al registrar usuario"

        });

    }

};

export const login = async (
    req: Request,
    res: Response
): Promise<void> => {

    try {

        const {
            correoElectronico,
            password
        } = req.body;

        const usuario = await prisma.usuario.findUnique({

            where: {
                correo_electronico: correoElectronico
            },

            include: {
                administrador: true
            }

        });

        if (!usuario) {

            res.status(401).json({
                mensaje: "Credenciales inválidas"
            });

            return;
        }

        const passwordValida = await bcrypt.compare(
            password,
            usuario.contrasena_hash
        );

        if (!passwordValida) {

            res.status(401).json({
                mensaje: "Credenciales inválidas"
            });

            return;
        }

        if (!usuario.email_verificado) {

            res.status(401).json({
                mensaje: "Verifique su correo"
            });

            return;
        }

        const rol = usuario.administrador
            ? "ADMINISTRADOR"
            : "CIUDADANO";

        const token = jwt.sign(
            {
                id: usuario.id,
                rol
            },
            process.env.JWT_SECRET as string,
            {
                expiresIn: "24h"
            }
        );

        res.status(200).json({

            token,

            usuario: {

                id: usuario.id,

                nombre_completo: usuario.nombre_completo,

                correo_electronico: usuario.correo_electronico,

                email_verificado: usuario.email_verificado,

                puntos_totales: usuario.puntos_totales,

                nivel_ranking: usuario.nivel_ranking,

                rol,

                avatar_url: usuario.avatar_url

            }

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            mensaje: "Error al iniciar sesión"

        });

    }

};

export const verificarCorreo = async (
    req: Request,
    res: Response
): Promise<void> => {

    const { token } = req.params;

    const registro =
        await prisma.token_autenticacion.findFirst({

            where: {

                token,

                tipo: "VERIFICACION_CORREO"

            }

        });

    if (registro == null) {
        res.status(401).json({
            mensaje: "Token inválido"
        })
        return;
    }

    if (registro.usado) {

        res.json({

            mensaje: "Correo verificado"

        });

        return;

    }

    if (registro.expira_en < new Date()) {

        res.status(400).json({

            mensaje: "Token expirado"

        });

        return;

    }

    await prisma.usuario.update({

        where: {

            id: registro.usuario_id

        },

        data: {

            email_verificado: true

        }

    });

    await prisma.token_autenticacion.update({

        where: {

            id: registro.id

        },

        data: {

            usado: true

        }

    });

    res.json({

        mensaje: "Correo verificado"

    });

};

export const solicitarRecuperacion = async (
    req: Request,
    res: Response
): Promise<void> => {

    const { correoElectronico } = req.body;

    const usuario =
        await prisma.usuario.findUnique({

            where: {

                correo_electronico: correoElectronico

            }

        });

    if (!usuario) {

        res.json({

            mensaje:
                "Si el correo existe, se enviará un enlace"

        });

        return;

    }

    const token = generarToken();

    const expira = new Date();

    expira.setMinutes(
        expira.getMinutes() + 30
    );

    await prisma.token_autenticacion.create({

        data: {

            usuario_id: usuario.id,

            token,

            tipo: "RECUPERACION_PASSWORD",

            expira_en: expira

        }

    });

    try {
        const url = "http://localhost:3000/reset-password?token="+token;
        const html = recoverEmailTemplate(
            usuario.nombre_completo,
            url
        );
        await transporter.sendMail({

            to: usuario.correo_electronico,

            subject: "Recupera tu contraseña",

            html,
            attachments: [
                {
                    filename: 'logo-aria.png',
                    path: path.join(process.cwd(),'src','assets', 'images', 'tiny.png'),
                    cid: 'aria-logo'
                }
            ]
        });
    } catch (mailError) {
        console.error("Error al enviar el correo de verificación:", mailError);
        // No interrumpimos el flujo porque el usuario ya fue creado en BD
    }

    res.json({

        mensaje: "Correo enviado"

    });

};

export const restablecerPassword = async (
    req: Request,
    res: Response
): Promise<void> => {

    const {
        token,
        password
    } = req.body;

    const registro =
        await prisma.token_autenticacion.findFirst({

            where: {

                token,

                tipo: "RECUPERACION_PASSWORD",

                usado: false

            }

        });

    if (!registro) {

        res.status(400).json({

            mensaje: "Token inválido"

        });

        return;

    }

    if (registro.expira_en < new Date()) {

        res.status(400).json({

            mensaje: "Token expirado"

        });

        return;

    }

    const hash =
        await bcrypt.hash(password, 10);

    await prisma.usuario.update({

        where: {

            id: registro.usuario_id

        },

        data: {

            contrasena_hash: hash

        }

    });

    await prisma.token_autenticacion.update({

        where: {

            id: registro.id

        },

        data: {

            usado: true

        }

    });

    res.json({

        mensaje:
            "Contraseña actualizada correctamente"

    });

};

export const actualizarPerfil = async (

    req: Request,

    res: Response

): Promise<void> => {

    try {

        const usuarioId =

            req.user?.id;

        const {

            nombreCompleto

        } = req.body;

        if (!usuarioId) {

            res.status(401).json({

                mensaje:
                    "No autorizado"

            });

            return;

        }

        let avatarUrl:
            string | undefined;

        if (req.file) {

            avatarUrl =
                `${req.protocol}://${req.get(
                    "host"
                )}/uploads/avatars/${
                    req.file.filename
                }`;

        }

        const usuario =
            await prisma.usuario.update({

                where: {

                    id: usuarioId

                },

                data: {

                    nombre_completo:
                    nombreCompleto,

                    ...(avatarUrl && {

                        avatar_url:
                        avatarUrl

                    })

                }

            });

        res.json({

            mensaje:
                "Perfil actualizado",

            usuario

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            mensaje:
                "Error interno"

        });

    }

};

export const cambiarPassword = async (
    req: Request,
    res: Response
): Promise<void> => {

    try {

        const usuarioId = req.user?.id;

        const {
            passwordActual,
            passwordNueva
        } = req.body;

        const usuario =
            await prisma.usuario.findUnique({

                where: {
                    id: usuarioId
                }

            });

        if (!usuario) {

            res.status(404).json({
                mensaje: "Usuario no encontrado"
            });

            return;

        }

        const valida = await bcrypt.compare(

            passwordActual,

            usuario.contrasena_hash

        );

        if (!valida) {

            res.status(400).json({

                mensaje:
                    "La contraseña actual es incorrecta"

            });

            return;

        }

        const hash = await bcrypt.hash(
            passwordNueva,
            10
        );

        await prisma.usuario.update({

            where: {
                id: usuarioId
            },

            data: {
                contrasena_hash: hash
            }

        });

        res.json({

            mensaje:
                "Contraseña actualizada correctamente"

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            mensaje:
                "Error al cambiar contraseña"

        });

    }

};

export const eliminarUsuario = async (
    req: Request,
    res: Response
): Promise<void> => {

    try {

        const usuarioId = Number(
            req.params.id
        );

        const usuario =
            await prisma.usuario.findUnique({

                where: {
                    id: usuarioId
                }

            });

        if (!usuario) {

            res.status(404).json({

                mensaje:
                    "Usuario no encontrado"

            });

            return;

        }

        await prisma.usuario.delete({

            where: {
                id: usuarioId
            }

        });

        res.json({

            mensaje:
                "Usuario eliminado correctamente"

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            mensaje:
                "Error al eliminar usuario"

        });

    }

};