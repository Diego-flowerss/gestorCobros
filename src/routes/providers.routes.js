import { Router } from "express";
import {
  getProviders,
  getProviderById,
  deleteProvider,
  updateProvider,
  createProvider,
} from "../controllers/providers.controllers.js";

const router = Router();

router.get("/provider", getProviders);

router.get("/provider/:providerr", getProviderById);

router.post("/provider", createProvider);

router.delete("/provider/:providerr", deleteProvider);

router.patch("/provider/:providerr", updateProvider);

export default router;
