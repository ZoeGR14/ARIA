import express from "express";

import cors from "cors";

import authRoutes from "./routes/authRoutes";

import dashboardRoutes from "./routes/dashboardRoutes";

import FCMRoutes from "./routes/FCMRoutes";

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/fcm",FCMRoutes);

export default app;