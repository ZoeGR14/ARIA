import { Request, Response } from "express";

import prisma from "../config/prisma";

import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";

import { generarToken } from "../utils/token";
import { transporter } from "../services/email.service";

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

        await transporter.sendMail({

            to: usuario.correo_electronico,

            subject: "Verificación de correo",

            html: `
        <h2>Bienvenido a ARIA</h2>

        <p>Haz clic para verificar tu cuenta:</p>

        <a href="http://localhost:3001/api/auth/verificar/${token}">
            Verificar cuenta
        </a>
    `

        });

        res.status(201).json({

            mensaje: "Usuario registrado correctamente",

            usuario: {

                id: usuario.id,

                nombre_completo: usuario.nombreCompleto,

                correo_electronico: usuario.correoElectronico

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

                nombre_completo: usuario.nombreCompleto,

                correo_electronico: usuario.correoElectronico,

                email_verificado: usuario.emailVerificado,

                puntos_totales: usuario.puntosTotales,

                nivel_ranking: usuario.nivelRanking,

                rol

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

                tipo: "VERIFICACION_CORREO",

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

    await transporter.sendMail({

        to: usuario.correo_electronico,

        subject: "Recuperación de contraseña",

        html: `
            <p>Recupera tu contraseña:</p>

            <a href="http://localhost:3000/reset-password?token=${token}">
                Restablecer contraseña
            </a>
        `

    });

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