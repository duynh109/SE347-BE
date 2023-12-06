import express from 'express';

const router = express.Router();
import * as loginController from '../controller/loginController.js';
import { localVariables } from '../helper/auth.js';

router.route('/register').post(loginController.register);
router.route('/login').post(loginController.login);
router.route('/loginAdmin').post(loginController.loginAdmin);
//first verify user=>  move next

//GET METHOD
router.route('/user/:email/forgot').post(loginController.getUser);
router.route('/user/:email/schedule').post(loginController.schedule);
router.route('/userid/:_id').get(loginController.getUserbyId);
router
  .route('/generateOTP')
  .get(loginController.verifyUser, localVariables, loginController.generateOTP);
router.route('/verifyOTP').get(loginController.verifyOTP);
router.route('/createResetSession').get(loginController.createResetSession);

//PUT METHOD
router.route('/updateuser').put(loginController.updateUser);
router.route('/recovery').put(loginController.resetPassword);
router.route('/changepassword').put(loginController.changepassword);

export default router;
