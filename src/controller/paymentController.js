import Payment from "../models/payment.js";
import Order from "../models/order.js";

export default class PaymentController {
  static async getAllPayments(req, res) {
    try {
      const payments = await Payment.find().populate("order");
      res.json(payments);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async addPayment(req, res) {
    const { order } = req.body;

    try {
      // Create a new payment
      const payment = new Payment({
        order,
      });

      // Save the payment to the database
      const savedPayment = await payment.save();

      res.json(savedPayment);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async getPaymentById(req, res) {
    const paymentId = req.params.id;

    try {
      // Find the payment by ID and populate the associated order information
      const payment = await Payment.findById(paymentId).populate("order");

      if (!payment) {
        return res.status(404).json({ error: "Payment not found" });
      }

      res.json(payment);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
