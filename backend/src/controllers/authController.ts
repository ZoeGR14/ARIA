import { Request, Response } from "express";

import prisma from "../config/prisma";

import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";

export const register = async (

    req: Request,
    res: Response

): Promise<void> => {

    try {

        const {

            nombre,
            correo,
            password

        } = req.body;

        const existe = await prisma.usuario.findUnique({

            where: { correo }

        });

        if (existe) {

            res.status(409).json({

                mensaje: "Usuario ya existe"

            });

            return;
        }

        const hash = await bcrypt.hash(password, 10);

        const usuario = await prisma.usuario.create({

            data: {

                nombre,
                correo,
                password: hash,
                rol: "CIUDADANO"

            }

        });

        res.status(201).json({

            id: usuario.id,
            nombre: usuario.nombre,
            correo: usuario.correo

        });

    } catch (error) {

        res.status(500).json(error);

    }

};

export const login = async (

    req: Request,
    res: Response

): Promise<void> => {

    try {

        const {

            correo,
            password

        } = req.body;

        const usuario = await prisma.usuario.findUnique({

            where: { correo }

        });

        if (!usuario) {

            res.status(401).json({

                mensaje: "Credenciales inválidas"

            });

            return;
        }

        const valido = await bcrypt.compare(

            password,
            usuario.password

        );

        if (!valido) {

            res.status(401).json({

                mensaje: "Credenciales inválidas"

            });

            return;
        }

        const token = jwt.sign(
            {
                id: usuario.id,
                rol: usuario.rol
            },
            process.env.JWT_SECRET as string,
            {
                expiresIn: "24h"
            }
        );

        res.json({

            token,

            usuario: {

                id: usuario.id,
                nombre: usuario.nombre,
                rol: usuario.rol

            }

        });

    } catch (error) {

        res.status(500).json(error);

    }

};