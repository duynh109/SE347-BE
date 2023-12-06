import User from '../models/user.js';

export default class UserController {
  //Lấy danh sách người dùng:
  static async getAllUser(req, res) {
    try {
      const user = await User.find();
      if (!user) {
        throw 'error';
      }
      return res.status(201).send(user);
    } catch (error) {
      return res.status(400).send({ error: error.message });
    }
  }
  //Lấy người dùng theo id:
  static async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findById(id);
      if (!user) {
        throw 'error';
      }
      return res.status(201).json(user);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
  //Thêm người dùng:
  static async addUser(req, res) {
    try {
      console.debug('Adding user...');
      const user = new User({ ...req.body });
      await user.save();
      return res.status(201).json(user);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
  //Cập nhật thông tin người dùng:
  static async updateUser(req, res) {
    try {
      console.debug('Updating User...');
      const { id } = req.params;
      const updatedUser = await User.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found.' });
      }
      return res.json(updatedUser);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
  //Xóa người dùng:
  static async deleteUser(req, res) {
    try {
      console.debug('Deleting User...');
      const { _id } = req.params;
      console.log(_id);
      const deletedUser = await User.deleteOne({ _id: _id });
      if (!deletedUser) {
        return res.status(404).json({ error: 'User not found.' });
      }
      return res.json(deletedUser);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}
