import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  productid: { type: String, require: true },
  name: { type: String, require: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, enum: ["Nhẫn", "Dây chuyền", "Bông tai"] },
  // details: {
  //   type: Map,
  //   of: String,
  //   default: "Chưa có thông tin",
  // },
  dvt: {
    type: String,
    require: true,
    default: "Chiếc",
  },
  quality: {
    type: String,
    require: true,
  },
   quantity: {
    type: Number,
    require: true,
  },
  quantity_sold: {
    type: Number,
    require: true,
    default: 0,
  },
  color: {
    type: String,
    require: true,
  },
  mass: {
    type: String,
    require: true,
  },
  size: {
    type: String,
    require: true,
  },
});

const Product = mongoose.model("Product", productSchema);
export default Product;
