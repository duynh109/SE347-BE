import express from "express";
const router = express.Router();
import PaymentController from "../controller/paymentController.js";

router
  .get("/payment", PaymentController.getAllPayments)
  .get("/payment/:id", PaymentController.getPaymentById)
  .post("/payment", PaymentController.addPayment);

export default router;
