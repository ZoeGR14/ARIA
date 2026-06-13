import express from "express";

import cors from "cors";

import authRoutes from "./routes/authRoutes";

import dashboardRoutes from "./routes/dashboardRoutes";

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/dashboard", dashboardRoutes);

export default app;