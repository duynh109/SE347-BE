import express from "express";
const router = express.Router();
import ProductController from "../controller/productController.js";

router
  .get("/product", ProductController.getAllProduct)
  .get("/product/search", ProductController.searchProduct)
  .get("/product/:id", ProductController.getProductById)
  .get("/product/category/:category", ProductController.getProductsByCategory)
  .get("/product/checkQuality/:quality", ProductController.getProductsByQuality)
  .get("/sortedProduct", ProductController.sortAndgetAllProduct)
  .get("/product/category/ascendingPrice/:category", ProductController.getAscendingPriceByCategory)
  .get("/product/category/descendingPrice/:category", ProductController.getDescendingPriceByCategory)
  .get("/product/category/newest/:category", ProductController.getNewestByCategory)
  .get("/product/category/mostSold/:category", ProductController.getMostSoldProductByCategory)
  .get(
    "/soldNumbersOfProducts",
    ProductController.sortBySoldNumberAndGetAllProduct
  )
  .post("/product", ProductController.addProduct)
  .put("/product/:id", ProductController.updateProduct)
  .put("/product/increase_sold/:id", ProductController.increaseProductsSold)
  .delete("/product/:id", ProductController.deleteProduct);

export default router;
