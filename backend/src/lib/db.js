import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null, memoryServer: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      dbName: 'pery_sport',
      serverSelectionTimeoutMS: 3000,
    };

    const targetUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/pery_sport';

    cached.promise = (async () => {
      try {
        const conn = await mongoose.connect(targetUri, opts);
        console.log('Connected to MongoDB at:', targetUri);
        return conn;
      } catch (err) {
        console.warn('Target MongoDB instance unavailable. Starting MongoMemoryServer fallback...');
        if (!cached.memoryServer) {
          cached.memoryServer = await MongoMemoryServer.create({ instance: { dbName: 'pery_sport' } });
        }
        const memoryUri = cached.memoryServer.getUri();
        console.log('Connected to MongoMemoryServer at:', memoryUri);
        return await mongoose.connect(memoryUri, { bufferCommands: false });
      }
    })();
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectToDatabase;
