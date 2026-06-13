import crypto from "crypto";

export const generarToken = (): string => {

    return crypto
        .randomBytes(32)
        .toString("hex");

};