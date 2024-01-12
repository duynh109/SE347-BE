import Order from "../models/order.js";
import User from "../models/user.js";
import Discount from "../models/discount.js";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

export const getAllOrder = async (req, res) => {
  try {
    const listOrder = await Order.find({});
    res.send(listOrder);
  } catch (e) {
    res.status(502).send(e);
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id });
    if (!order) res.status(404).send("Not found!");
    res.send(order);
  } catch (e) {
    res.status(500).send(e);
  }
};

export const getOrderByKH = async (req, res) => {
  try {
    const regex = new RegExp(req.params.ten, "i");
    const kh = await User.findOne({ name: regex });
    if (!kh) {
      res.status(404).send("Không tìm thấy khách hàng (user) phù hợp!");
      return;
    }
    const order = await Order.find({ userId: kh.userId });
    if (!order) res.status(404).send("Not found!");
    res.send(order);
  } catch (e) {
    res.status(500).send(e);
  }
};

export const getOrderByStatus = async (req, res) => {
  try {
    const status = req.params.tinhtrang;
    const orders = await Order.find({ tinhtrang: status });
    res.send(orders);
  } catch (e) {
    res.status(500).send(e);
  }
};

export const getOrderByMahd = async (req, res) => {
  try {
    const hd = req.params.mahd;
    const order = await Order.find({ mahd: hd });
    res.send(order);
  } catch (e) {
    res.status(500).send(e);
  }
};

export const addOrder = async (req, res) => {
  const hd = new Order(req.body);
  try {
    if ((await (await Order.find({})).length) !== 0) {
      const hdLast = await (await Order.find({})).splice(-1);
      const mahdLast = hdLast[0].mahd.substring(2) || "0";
      const newmahd = "HD" + Number(Number(mahdLast) + 1);
      hd.mahd = newmahd;
    }
    await hd.save();
    res.status(201).send(hd);
  } catch (e) {
    res.status(400).send(e);
  }
};

export const updateOrder = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowUpdates = [
    "userId",
    "hinhanh",
    "sanphams",
    "ngaylap",
    "tinhtrang",
    "diachigiaohang",
    "hinhthucthanhtoan",
    "tongtien",
  ];
  const isValidOperation = updates.every((update) => {
    return allowUpdates.includes(update);
  });
  if (!isValidOperation) return res.status(400).send("error: Invalid updates!");

  try {
    const hd = await Order.findOne({ _id: req.params.id });
    if (!hd) return res.status(404).send();
    // lưu file ảnh vào thư mục confirms trong firebase
    if (req.file) {
      const storage = getStorage();
      const fileExtension = req.file.originalname.split(".").pop(); //đuôi file ảnh
      const today = new Date();
      const timestamp = `${today.getMilliseconds()}:${today.getMinutes()}:${today.getHours()}-${today.getDate()}-${
        today.getMonth() + 1
      }-${today.getFullYear()}`; //thời gian đăng lên firebase
      const storageRef = ref(
        storage,
        `confirms/${req.file.originalname
          .split(".")
          .shift()}-${timestamp}.${fileExtension}`
      );
      const metadata = {
        contentType: req.file.minetype,
      };
      //upload
      const snapshot = await uploadBytesResumable(
        storageRef,
        req.file.buffer,
        metadata
      );
      //lấy link ảnh
      const downloadURL = await getDownloadURL(snapshot.ref);
      hd.hinhanh = downloadURL;
    }

    //Cập nhật các thông tin của order
    updates.forEach((update) => {
      if (update !== "hinhanh") hd[update] = req.body[update];
    });

    await hd.save();
    res.send(hd);
  } catch (e) {
    res.status(500).send(e);
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const hd = await Order.findByIdAndDelete({ _id: req.params.id });
    if (!hd) res.status(404).send("Not found!");
    if (hd.hinhanh !== "") {
      const storage = getStorage();
      const url = new URL(hd.hinhanh);
      const filename = decodeURIComponent(url.pathname.split("/").pop());
      const fileRef = ref(storage, filename);
      await deleteObject(fileRef);
    }
    res.send(hd);
  } catch (e) {
    res.status(500).send(e);
  }
};

export const discount = async (req, res) => {
  try {
    const { code, total } = req.body;
    const isValidCode = await Discount.findOne({ code });
    if (!isValidCode || isValidCode.isUsed)
      return res.status(404).send("Invalid code");

    isValidCode.isUsed = true;
    await isValidCode.save();
    return res.status(200).json({ result: total * isValidCode.value });
  } catch (error) {
    return res.status(500).send(error);
  }
};

export const searchOrder = async (req, res) => {
    const query = req.query.query; // Từ khóa tìm kiếm được truyền qua query parameter

    if (!query) {
      return res.status(400).json({ error: "Query parameter is required" });
    }

    // Chuyển đổi giá trị query thành một số
    const parsedQuery = parseFloat(query);

    // Kiểm tra xem query có phải là một số hợp lệ hay không
    const isNumber = !isNaN(parsedQuery) && isFinite(query);

    const searchCondition = {
      $or: [
        { mahd: { $regex: query, $options: "i" } }, // Tìm kiếm theo mã hoá đơn (không phân biệt hoa thường)
        { ngaylap: { $regex: query, $options: "i" } }, // Tìm kiếm theo ngày lập (không phân biệt hoa thường)
        { tinhtrang: { $regex: query, $options: "i" } }, // Tìm kiếm theo tình trạng hoá đơn (không phân biệt hoa thường)
      ],
    };

    // Nếu query là một số hợp lệ, thêm điều kiện tìm kiếm theo price hoặc quality
    if (isNumber) {
      searchCondition.$or.push({ tongtien: parsedQuery });
    }

    // Tìm kiếm hoá đơn dựa trên các trường mahd, ngaylap, tongtien, và tinhtrang
    Order.find(searchCondition, (err, orders) => {
      if (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
      } else if (orders.length === 0) {
        res.status(404).send("No products found");
      } else {
        res.json(orders);
      }
    });
    // const ordersArray = Array.isArray(orders) ? orders : [orders];
    // res.status(200).send({ orders });
};

export const showDiscounts = async (req,res) => {
  const discounts = await Discount.find({})
  return res.json(discounts);
}

export const createDiscounts =async (req,res) => {
  const {code, value} = req.body
  const isExists = await Discount.findOne({code});
  if(isExists){
    return res.status(403).send("Code is already exists")
  }
  const discont = new Discount({code, value})
  await discont.save();
  return res.status(201).send("Created")
}