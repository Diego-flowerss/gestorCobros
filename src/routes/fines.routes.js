import Router from "express";
import { getFineById, postFine } from "../controllers/fines.controllers.js";

const router = Router();

router.get("/fines/:id", getFineById);
router.post("/fines", postFine);

export default router;
