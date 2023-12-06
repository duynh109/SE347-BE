import Product from "../models/product.js";
import order from "../models/order.js"

export default class ProductController {
  //Lấy danh sách sản phẩm:
  static async getAllProduct(req, res) {
    try {
      const product = await Product.find();
      if (!product) {
        throw "error";
      }
      return res.status(201).json(product);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  // Phân loại sản phẩm:
  static async getProductsByCategory(req, res) {
    try {
      const { category } = req.params;
      const products = await Product.find({ category });
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
  //sort
  static async sortAndgetAllProduct(req, res) {
    try {
      const sort = { _id: -1 };
     
      const product = await Product.find().sort(sort);
      if (!product) {
        throw "error";
      }
      return res.status(201).json(product);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
//giá tăng dần theo Category
  static async getAscendingPriceByCategory(req, res) {
    try {
      const { category } = req.params;
      const sort = { price: 1 };

      const product = await Product.find({ category }).sort(sort);
      if (!product) {
        throw "error";
      }
      return res.status(201).json(product);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  //giá giảm dần theo Category
  static async getDescendingPriceByCategory(req, res) {
    try {
      const { category } = req.params;
      const sort = { price: -1 };
      
      const product = await Product.find({ category }).sort(sort);
      if (!product) {
        throw "error";
      }
      return res.status(201).json(product);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  //lấy các sản phẩm mới nhất theo Category
  static async getNewestByCategory(req, res) {
    try {
      const { category } = req.params;
      const sort = { _id: -1 };
      
      const product = await Product.find({ category }).sort(sort);
      if (!product) {
        throw "error";
      }
      return res.status(201).json(product);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  //lấy các sản phẩm bán chạy theo Category
  static async getMostSoldProductByCategory(req, res) {
    try {
      const sort = { quantity_sold: -1 };
      const { category } = req.params;
      const product = await Product.find({ category }).sort(sort);
      if (!product) {
        throw "error";
      }
      return res.status(201).json(product);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
  //sort theo số lượng sản phẩm bán được
  static async sortBySoldNumberAndGetAllProduct(req, res) {
    try {
      const sort = { quantity_sold: -1 };
     
      const product = await Product.find().sort(sort);
      if (!product) {
        throw "error";
      }
      return res.status(201).json(product);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
  //Lấy sản phẩm theo id:
  static async getProductById(req, res) {
    try {
      const { id } = req.params;
      const product = await Product.findById(id);
      if (!product) {
        throw "error";
      }
      return res.status(201).json(product);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
  //Lấy số lượng sản phẩm đã bán
  static async getSoldCount(req, res) {
    try {
      const products = await Product.find();
      const soldCount = products.reduce(
        (total, product) => total + product.quantity_sold,
        0
      );
      res.json({ soldCount });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  //Lấy sản phẩm theo quality
  static async getProductsByQuality(req, res) {
    try {
      const { quality } = req.params;
      const products = await Product.find({ quality });
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
  //Thêm sản phẩm:
  static async addProduct(req, res) {
    try {
      console.debug("Adding product...");
      const product = new Product({ ...req.body });
      await product.save();
      return res.status(201).json(product);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
  //Cập nhật thông tin sản phẩm:
  static async updateProduct(req, res) {
    try {
      console.debug("Updating Product...");
      const { id } = req.params;
      const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      if (!updatedProduct) {
        return res.status(404).json({ error: "Product not found." });
      }
      return res.json(updatedProduct);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
  //Tăng số lượng đã bán
  static async increaseProductsSold(req, res) {
    try {
      const id  = req.params.id;
      const or = await order.findById(id);
      for(const sp of or.sanphams){
        const product = await Product.findOne({ name: sp.sanpham });
        if(!product){
          return res.status(404).json({ error: "Product not found." }); 
        }
        product.quantity_sold+=sp.sl;
        product.quantity-=sp.sl;
        await product.save();
      }
      return res.status(200).json({ message: "Products sold increased successfully." });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
  //Xóa sản phẩm:

  static async deleteProduct(req, res) {
    try {
      console.debug("Deleting Product...");
      const deletedProduct = await Product.findOneAndDelete({
        _id: req.params.id,
      });
      if (!deletedProduct) {
        return res.status(404).json({ error: "Product not found." });
      }
      return res.json(deletedProduct);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  static async searchProduct(req, res) {
    const query = req.query.query;

    // Chuyển đổi giá trị query thành một số
    const parsedQuery = parseFloat(query);

    // Kiểm tra xem query có phải là một số hợp lệ hay không
    const isNumber = !isNaN(parsedQuery) && isFinite(query);

    // Tạo điều kiện tìm kiếm
    const searchCondition = {
      $or: [
        { productid: { $regex: query, $options: "i" } },
        { name: { $regex: query, $options: "i" } },
        { quality: { $regex: query, $options: "i" } },
      ],
    };

    // Nếu query là một số hợp lệ, thêm điều kiện tìm kiếm theo price hoặc quality
    if (isNumber) {
      searchCondition.$or.push({ price: parsedQuery });
    }

    // Tìm kiếm sản phẩm dựa trên điều kiện tìm kiếm
    Product.find(searchCondition, (err, products) => {
      if (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
      } else if (products.length === 0) {
        res.status(404).send("No products found");
      } else {
        res.json(products);
      }
    });
  }
}
