import mongoose from 'mongoose';

import { MongoMemoryServer } from 'mongodb-memory-server';
async function connect() {
  const uri =
    'mongodb+srv://minhthuong:XlQEpchOnXP0Vy9V@cluster0.txcndfq.mongodb.net/?retryWrites=true&w=majority';

  const mongodb = await MongoMemoryServer.create();
  const getUri = mongodb.getUri();
  mongoose.set('strictQuery', true);
  const db = await mongoose.connect(uri);
  console.log('Database connected');
  return db;
}
export default connect;
