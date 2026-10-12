import mongoose from "mongoose";

let isConnecting = false;

const connectDatabase = async (): Promise<void> => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  if (isConnecting) {
    return;
  }

  try {
    isConnecting = true;
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error("MONGO_URI is missing in environment variables");
    }
    const connection = await mongoose.connect(mongoUri, {
      bufferCommands: false,
    });
    console.log(`MongoDB connected: ${connection.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    if (!process.env.VERCEL) {
      process.exit(1);
    }
    throw error;
  } finally {
    isConnecting = false;
  }
};

export default connectDatabase;