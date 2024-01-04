import OrderModel from "../models/order.js";
import { confirmDeliveryMail, confirmScheduleMail } from "./mailer.js";

export async function getAllOrders(req, res) {
  try {
    OrderModel.find({ userId: req.params._id })
      .then(function (orders) {
        res.status(201).send(orders);
      })
      .catch(function (error) {
        console.log(errors);
        res.status(401).send(error);
      });
  } catch (error) {
    console.log(error);
    res.status(405).send(error);
  }
}
export async function getAllOrdersAllUser(req, res) {
  try {
    const orders = await OrderModel.find({});

    res.status(202).send(orders);
  } catch (error) {
    console.log(error);
    res.status(405).send(error);
  }
}

export async function getOrderbyId(req, res) {
  try {
    const { _orderid } = req.params;
    console.log(_orderid);
    OrderModel.find({ _id: _orderid }).then(function (detail) {
      res.status(201).send(detail);
    });
  } catch (error) {
    console.log(error);
  }
}
export async function cancelOrderById(req, res) {
  try {
    const { tinhtrang } = req.body;

    const _orderid = req.body._orderid;
    OrderModel.updateOne({ _id: _orderid }, { tinhtrang: tinhtrang })
      .then(function (data) {
        res.status(201).send(data);
      })
      .catch(function (error) {
        console.log(error);
      });
  } catch (error) {
    console.log(error);
  }
}

export async function deliveredOrderById(req, res) {
  try {
    const { tinhtrang } = req.body;

    const _orderid = req.body._orderid;
    OrderModel.updateOne({ _id: _orderid }, { tinhtrang: tinhtrang })
      .then(function (data) {
        res.status(201).send(data);
      })
      .catch(function (error) {
        console.log(error);
      });
  } catch (error) {
    console.log(error);
  }
}
export async function confirmOrderbyId(req, res) {
  try {
    const { tinhtrang, email, total } = req.body;

    const _orderid = req.body._orderid;
    console.log(email, tinhtrang, total, _orderid);
    OrderModel.updateOne({ _id: _orderid }, { tinhtrang: tinhtrang })
      .then(function (data) {
        try {
          confirmDeliveryMail(email, total, _orderid);

          return res.status(201).send("ok");
        } catch (error) {
          console.log(error);
          return res.status(500).send({ error });
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  } catch (error) {
    console.log(error);
  }
}
// UserModel.updateOne({ _id: _id }, body)

export async function scheduleMail(req, res) {
  const { date, email, total, _id } = req.body; //get parameter

  if (!date) return res.status(501).send({ error: "invalid date" });

  try {
    confirmScheduleMail(email, date, total, _id);

    return res.status(201).send("ok");
  } catch (error) {
    return res.status(500).send({ error });
  }
}

// export const searchOrder = async (req, res) => {
//   try {
//     const query = req.query.query; // Từ khóa tìm kiếm được truyền qua query parameter

//     // if (!query) {
//     //   return res.status(400).json({ error: "Query parameter is required" });
//     // }

//     // Chuyển đổi giá trị query thành một số
//     const parsedQuery = parseFloat(query);

//     // Kiểm tra xem query có phải là một số hợp lệ hay không
//     const isNumber = !isNaN(parsedQuery) && isFinite(query);

//     const searchCondition = {
//       $or: [
//         { mahd: { $regex: query, $options: "i" } }, // Tìm kiếm theo mã hoá đơn (không phân biệt hoa thường)
//         { ngaylap: { $regex: query, $options: "i" } }, // Tìm kiếm theo ngày lập (không phân biệt hoa thường)
//         { tinhtrang: { $regex: query, $options: "i" } }, // Tìm kiếm theo tình trạng hoá đơn (không phân biệt hoa thường)
//       ],
//     };

//     // Nếu query là một số hợp lệ, thêm điều kiện tìm kiếm theo price hoặc quality
//     if (isNumber) {
//       searchCondition.$or.push({ tongtien: parsedQuery });
//     }

//     // Tìm kiếm hoá đơn dựa trên các trường mahd, ngaylap, tongtien, và tinhtrang
//     const orders = await OrderModel.find(searchCondition);
//     // const ordersArray = Array.isArray(orders) ? orders : [orders];
//     res.status(200).send({orders});
//   } catch (error) {
//     console.error("Error searching orders:", error);
//     res.status(500).send({ error: error.message });
//   }
// };
// export const searchOrder = async (req, res) => {
//   try {
//     const query = req.query.query; // Từ khóa tìm kiếm được truyền qua query parameter

//     if (!query) {
//       return res.status(400).json({ error: 'Query parameter is required' });
//     }

//     // Tìm kiếm hoá đơn dựa trên các trường mahd, ngaylap, tongtien, và tinhtrang
//     const orders = await OrderModel.find({
//       $or: [
//         { mahd: { $regex: query, $options: 'i' } }, // Tìm kiếm theo mã hoá đơn (không phân biệt hoa thường)
//         { ngaylap: { $regex: query, $options: 'i' } }, // Tìm kiếm theo ngày lập (không phân biệt hoa thường)
//         { tongtien: parseInt(query) }, // Tìm kiếm theo tổng tiền (phải là số)
//         { tinhtrang: { $regex: query, $options: 'i' } }, // Tìm kiếm theo tình trạng hoá đơn (không phân biệt hoa thường)
//       ],
//     });

//     res.status(200).send(Array.from(orders));
//   } catch (error) {
//     console.error('Error searching orders:', error);
//     res.status(500).json({ error: 'Error searching orders' });
//   }
// }

