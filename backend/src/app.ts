import express from "express";
import fs from "fs";
import path from "path";

import cors from "cors";

import authRoutes from "./routes/authRoutes";

import dashboardRoutes from "./routes/dashboardRoutes";

import FCMRoutes from "./routes/FCMRoutes";
import reportRoutes from "./routes/reportRoutes";

import notificacionRoutes from "./routes/notificacionRoutes";
import rankingRoutes from "./routes/rankingRoutes";

const app = express();

const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

if (!fs.existsSync(path.join(uploadsDir,"avatars"))) {
    fs.mkdirSync(path.join(uploadsDir,"avatars"), { recursive: true });
}


app.use("/uploads", express.static(uploadsDir));

app.use(cors());

app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/fcm",FCMRoutes);

app.use("/api/reportes", reportRoutes);

app.use("/api/notificaciones", notificacionRoutes);

app.use("/api/ranking", rankingRoutes);

export default app;