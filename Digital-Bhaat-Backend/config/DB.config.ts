import mongoose from "mongoose";
import Env from "./Env.config";


let isConnected = false;

const connectDB = async () => {

  if (isConnected) {
    return;
  }

  try {
    await mongoose.connect(Env.MONGO_URL!);
    isConnected = true;
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1); // Exit the process on failure
  }
};

export default connectDB;
