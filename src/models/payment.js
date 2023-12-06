// Payment.js
import mongoose from "mongoose";
import Order from "./order.js";

const paymentSchema = new mongoose.Schema({
  // paymentId: String,
  order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
});

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
