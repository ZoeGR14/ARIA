import { Router } from "express";
import multer from "multer";
import path from "path";
import {
    getReportesActivos,
    getReporteById,
    crearReporte
} from "../controllers/reportController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// GET all active reports
router.get("/activos", getReportesActivos);

// GET a specific report by ID
router.get("/:id", getReporteById);

// POST a new report (requires authentication)
// "foto" is the field name we expect the client to use for the image file
router.post("/", authMiddleware, upload.single("foto"), crearReporte);

export default router;
