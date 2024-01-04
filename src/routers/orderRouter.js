import express from 'express';
const router = express.Router();
import * as orderController from '../controller/orderController.js';
import multer from 'multer';

// Khởi tạo đối tượng multer để xử lý việc upload file từ client
const upload = multer({ storage: multer.memoryStorage() });
router
  .get('/order', orderController.getAllOrder)
  .get('/orderAllUserAll/search', orderController.searchOrder)
  .get('/order/:id', orderController.getOrderById)
  .get('/order/kh/:ten', orderController.getOrderByKH)
  .get('/order/tinhtrang/:tinhtrang', orderController.getOrderByStatus)
  .get('/order/hd/:mahd', orderController.getOrderByMahd)
  .post('/order', orderController.addOrder)
  .put('/order/:id', upload.single('hinhanh'), orderController.updateOrder)
  .delete('/order/:id', orderController.deleteOrder)
  .post('/order/discount', orderController.discount)
export default router;
