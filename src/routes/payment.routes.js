import { Router } from "express";
import { getPaymentById, postPayment } from "../controllers/payment.routes.js";

const router = Router();

router.get("/payments/:id", getPaymentById);

router.post("/payments", postPayment);

export default router;
