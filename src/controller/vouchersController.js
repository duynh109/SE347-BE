import Vouchers from "../models/vouchers.js";

export default class VouchersController {
  //Lấy danh sách người dùng:
  static async getAllVouchers(req, res) {
    try {
      const vouchers = await Vouchers.find();
      if (!vouchers) {
        throw "error";
      }
      return res.status(201).json(vouchers);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
  //Lấy người dùng theo id:
  static async getVouchersById(req, res) {
    try {
      const { id } = req.params;
      const vouchers = await Vouchers.findById(id);
      if (!vouchers) {
        throw "error";
      }
      return res.status(201).json(vouchers);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
  //Thêm người dùng:
  static async addVouchers(req, res) {
    try {
      console.debug("Adding vouchers...");
      const vouchers = new Vouchers({ ...req.body });
      await vouchers.save();
      return res.status(201).json(vouchers);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
  //Cập nhật thông tin người dùng:
  static async updateVouchers(req, res) {
    try {
      console.debug("Updating Vouchers...");
      const { id } = req.params;
      const updatedVouchers = await Vouchers.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      if (!updatedVouchers) {
        return res.status(404).json({ error: "Vouchers not found." });
      }
      return res.json(updatedVouchers);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
  //Xóa người dùng:
  static async deleteVouchers(req, res) {
    try {
      console.debug("Deleting Vouchers...");

      const deletedVouchers = await Vouchers.findOneAndDelete({
        _id: req.params.id,
      });
      if (!deletedVouchers) {
        return res.status(404).json({ error: "Vouchers not found." });
      }
      return res.json(deletedVouchers);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  // Thêm sản phẩm vào trang chi tiết vouchers
  static async addProduct(req, res) {
    const { vouchersId } = req.params;
    const { product } = req.body;

    try {
      const vouchers = await Vouchers.findById(vouchersId);

      if (!vouchers) {
        return res.status(404).json({ message: "Không tìm thấy vouchers" });
      }

      vouchers.products.push(product);
      await vouchers.save();

      res.status(200).json({ product: product });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Đã xảy ra lỗi khi thêm sản phẩm", error });
    }
  }

  // Xóa sản phẩm khỏi trang chi tiết vouchers
  static async deleteProduct(req, res) {
    const { vouchersId, productId } = req.params;

    try {
      const vouchers = await Vouchers.findByIdAndUpdate(vouchersId, {
        $pull: { products: { _id: productId } },
      });

      if (!vouchers) {
        return res.status(404).json({ message: "Không tìm thấy vouchers" });
      }

      res.status(200).json({ message: "Sản phẩm đã được xóa khỏi vouchers" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Đã xảy ra lỗi khi xóa sản phẩm", error });
    }
  }

  // Sửa thông tin sản phẩm trong trang chi tiết vouchers
  static async updateProduct(req, res) {
    const { vouchersId, productId } = req.params;
    const updatedProduct = req.body;

    try {
      const vouchers = await Vouchers.findOneAndUpdate(
        { _id: vouchersId, "products._id": productId },
        { $set: { "products.$": updatedProduct } }
      );

      if (!vouchers) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy vouchers hoặc sản phẩm" });
      }

      res.status(200).json({ message: "Sản phẩm đã được cập nhật" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Đã xảy ra lỗi khi cập nhật sản phẩm", error });
    }
  }
  static async getProductById(req, res) {
    try {
      const { id, productId } = req.params;

      // Kiểm tra xem Vouchers có tồn tại không
      const vouchers = await Vouchers.findById(id);
      if (!vouchers) {
        return res.status(404).json({ error: "Vouchers not found" });
      }

      // Tìm kiếm sản phẩm theo productId trong danh sách products
      const product = vouchers.products.find(
        (p) => p._id.toString() === productId
      );
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      res.json(product);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  }
}
