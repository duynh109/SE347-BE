import mongoose from "mongoose";

const vouchersSchema = new mongoose.Schema({
  vouchersId: { type: String, require: true },
  createdAt: { type: Date, require: true },
  production: { type: String, require: true },
  address: { type: String, require: true },
  PhoneNumber: { type: String, require: true },
  products: [
    {
      productid: { type: String, require: true },
      name: { type: String, require: true },
      image: { type: String, require: true },
      price: { type: Number, required: true },
      category: { type: String, enum: ["Nhẫn", "Dây chuyền", "Bông tai"] },
      amount: { type: Number, default: "1" },
      Unit: { type: String, default: "Chiếc" },
      quality: {
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
      color: {
        type: String,
        require: true,
      },
    },
  ],
});

const Vouchers = mongoose.model("Vouchers", vouchersSchema);
export default Vouchers;
