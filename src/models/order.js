import mongoose from "mongoose";
const orderSchema = new mongoose.Schema(
  {
    mahd: {
      type: String,
      default: "HD0",
      trim: true,
    },
    userId: {
      type: String,
      require: true,
      trim: true,
    },
    hinhanh: {
      type: String,
      require: true,
      trim: true,
      default: "",
    },
    sanphams: [
      {
        sanpham: {
          type: String,
          require: true,
        },
        hinhanh: {
          type: String,
          require: true,
          default:
            "https://m.media-amazon.com/images/I/81bc8mA3nKL._AC_UY327_FMwebp_QL65_.jpg",
        },
        loaisp: {
          type: String,
          require: true,
        },
        sl: {
          type: Number,
          require: true,
          default: 1,
        },
        dvt: {
          type: String,
          require: true,
        },
        dongia: {
          type: Number,
          require: true,
        },
        thanhtien: {
          type: Number,
          require: true,
        },
      },
    ],
    ngaylap: {
      type: String,
      require: true,
      trim: true,
    },
    tinhtrang: {
      type: String,
      default: "Đang xử lý",
    },
    diachigiaohang: {
      type: String,
      require: true,
    },
    hinhthucthanhtoan: {
      type: String,
    },
    tongtien: {
      type: Number,
      default: 0,
      require: true,
    },
  },
  { require: true }
);
export default mongoose.model.Orders || mongoose.model("Order", orderSchema);
