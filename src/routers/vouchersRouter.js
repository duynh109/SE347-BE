import express from "express";
const router = express.Router();
import VouchersController from "../controller/vouchersController.js";

router
  .get("/vouchers", VouchersController.getAllVouchers)
  .get("/vouchers/:id", VouchersController.getVouchersById)
  .get("/vouchers/:id/product/:productId", VouchersController.getProductById)

  .post("/vouchers", VouchersController.addVouchers)
  .post("/vouchers/:vouchersId/product", VouchersController.addProduct)
  .put("/vouchers/:id", VouchersController.updateVouchers)
  .put(
    "/vouchers/:vouchersId/product/:productId",
    VouchersController.updateProduct
  )
  .delete("/vouchers/:id", VouchersController.deleteVouchers)
  .delete(
    "/vouchers/:vouchersId/product/:productId",
    VouchersController.deleteProduct
  );

export default router;
