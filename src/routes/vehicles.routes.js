import { Router } from "express";
import {
  getAllVehicles,
  getVehicleById,
  postVehicle,
  deleteVehicle,
  updateVehicle,
} from "../controllers/vehicles.controller.js";

const router = Router();

router.get("/vehicle", getAllVehicles);

router.get("/vehicle/:vehicle", getVehicleById);

router.post("/vehicle", postVehicle);

router.delete("/vehicle/:vehicle", deleteVehicle);

router.patch("/vehicle/:vehicle", updateVehicle);

export default router;
