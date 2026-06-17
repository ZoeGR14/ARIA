import Nodemailer from "nodemailer";
import { MailtrapTransport } from "mailtrap";

export const transporter = Nodemailer.createTransport(
    MailtrapTransport({
        token: process.env.MAILTRAP_TOKEN!
    })
);