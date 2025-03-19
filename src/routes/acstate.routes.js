import { Router } from "express";

import { getStateById } from "../controllers/acstate.controllers.js";

const router = Router();

router.get("/state/:id", getStateById);

export default router;
