import { Router } from "express";
import {
  getResidencias,
  getResidenciaById,
  createResidencia,
  updateResidencia,
  deleteResidencia,
} from "../controllers/recidency.controllers.js";

const router = Router();

router.get("/recidency", getResidencias);

router.get("/recidency/:reci", getResidenciaById);

router.post("/recidency", createResidencia);

router.delete("/recidency/:reci", deleteResidencia);

router.patch("/recidency/:reci", updateResidencia);

export default router;
