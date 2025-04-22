import { Router } from "express";
import {
  deletePayment,
  getAllPayments,
  getPaymentById,
  postPayment,
  updatePayment,
} from "../controllers/payment.routes.js";

const router = Router();

router.get("/payments", getAllPayments);

router.get("/payments/:id", getPaymentById);

router.post("/payments", postPayment);

router.patch("/payments/:id", updatePayment);

router.delete("/payments/:id", deletePayment);

export default router;
