import mongoose from "mongoose";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

const DEFAULT_FALLBACK_MONGO_URI =
  "mongodb://yogeshrd1708:yogesh1708@ac-2tdi0hf-shard-00-00.8rdbura.mongodb.net:27017,ac-2tdi0hf-shard-00-01.8rdbura.mongodb.net:27017,ac-2tdi0hf-shard-00-02.8rdbura.mongodb.net:27017/ZealPharma?ssl=true&replicaSet=atlas-sdtbqe-shard-0&authSource=admin&appName=Cluster0";

const connectDatabase = async (): Promise<typeof mongoose> => {
  // 1. If connection already established and healthy, return it immediately
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  // 2. If no connection promise is currently in flight, initiate one
  if (!cached.promise) {
    const rawUri = (process.env.MONGO_URI || DEFAULT_FALLBACK_MONGO_URI).trim();

    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 8000,
      maxPoolSize: 10,
    };

    cached.promise = mongoose.connect(rawUri, opts).then((m) => {
      console.log(`MongoDB connected: ${m.connection.host}`);
      return m;
    });
  }

  // 3. All concurrent requests wait on the SAME connection promise
  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    console.error("MongoDB connection failed:", error);
    throw error;
  }
};

export default connectDatabase;
