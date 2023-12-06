import express from 'express';
const router = express.Router();
import UserController from '../controller/userController.js';

router
  .get('/users', UserController.getAllUser)
  .get('/user/:id', UserController.getUserById)
  .post('/user', UserController.addUser)
  .put('/user/:id', UserController.updateUser)
  .delete('/user/delete/:_id', UserController.deleteUser);

export default router;
