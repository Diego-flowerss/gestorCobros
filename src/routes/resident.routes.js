import { Router } from "express";
import {
  pingResident,
  pingResidentById,
  postResident,
  deleteResident,
  updateResident,
} from "../controllers/resident.controllers.js";

const router = Router();

router.get("/ping", pingResident);

router.get("/ping/:resident", pingResidentById);

router.post("/ping", postResident);

router.delete("/ping/:resident", deleteResident);

router.patch("/ping/:resident", updateResident);

export default router;
