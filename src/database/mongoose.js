import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
async function connect() {
  try {
    mongoose.connect(process.env.MONGODB_URL);
    console.log('database connected');
  } catch (e) {
    console.log(e);
  }
  mongoose.set('strictQuery', true);
}

export default connect;
