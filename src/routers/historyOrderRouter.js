import express from 'express';
const router = express.Router();
import * as orderController from '../controller/histopryOrderController.js';

router.route('/orders/:_id').get(orderController.getAllOrders);

router.route('/orderall').get(orderController.getAllOrdersAllUser);

router.route('/orderdetail/:_orderid').get(orderController.getOrderbyId);

router.route('/cancelorder').put(orderController.cancelOrderById);

router.route('/deliveredorder').put(orderController.deliveredOrderById);

router.route('/confirmorder').put(orderController.confirmOrderbyId);
router.route('/schedule').post(orderController.scheduleMail);
// router.route('/orderall/search').get(orderController.searchOrder);
export default router;
