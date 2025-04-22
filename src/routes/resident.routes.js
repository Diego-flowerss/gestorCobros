import { Router } from "express";
import {
  pingResident,
  pingResidentById,
  postResident,
  deleteResident,
  updateResident,
} from "../controllers/resident.controllers.js";

const router = Router();

router.get("/residente", pingResident);

router.get("/residente/:resident", pingResidentById);

router.post("/residente", postResident);

router.delete("/residente/:resident", deleteResident);

router.patch("/residente/:resident", updateResident);

export default router;
