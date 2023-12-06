import express from "express";
const router = express.Router();
import * as cartController from "../controller/cartController.js";

router
    .get("/cart/:userId", cartController.getCartByMaKH)
    .post("/newcart", cartController.addCart)
    .post("/cart", cartController.addSpToCart)
    .post("/cart/refresh", cartController.refreshCart)
    .put("/cart", cartController.updateCart)
    .delete("/cart/:userId/:productid", cartController.deleteSp)
    .delete("/cart/:userId", cartController.deleteGH);

export default router;
