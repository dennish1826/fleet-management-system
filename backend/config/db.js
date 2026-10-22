import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

let mongodInstance = null;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/fleet_optimization';
  const inMemoryMode = process.env.USE_IN_MEMORY_DB;

  if (inMemoryMode === 'true') {
    return await startInMemoryServer();
  }

  try {
    console.log(`🔌 Attempting connection to MongoDB at: ${uri}`);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`✅ MongoDB connected successfully to: ${uri}`);
  } catch (err) {
    console.warn(`⚠️ Failed to connect to local/configured MongoDB (${uri}): ${err.message}`);
    console.log('⚡ Fallback: Initializing embedded In-Memory MongoDB server for instant zero-config launch...');
    await startInMemoryServer();
  }
};

async function startInMemoryServer() {
  try {
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    mongodInstance = await MongoMemoryServer.create();
    const inMemoryUri = mongodInstance.getUri();
    await mongoose.connect(inMemoryUri);
    console.log(`✅ Embedded In-Memory MongoDB connected: ${inMemoryUri}`);
  } catch (error) {
    console.error('❌ Fatal: Failed to initialize in-memory database:', error.message);
    process.exit(1);
  }
}

export const disconnectDB = async () => {
  await mongoose.disconnect();
  if (mongodInstance) {
    await mongodInstance.stop();
  }
};
