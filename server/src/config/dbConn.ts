import mongoose from "mongoose";
import { DATABASE_URI } from "./dotenv";

const connectDB = async () => {
  try {
    mongoose.set("strictQuery", true);
    const db = await mongoose.connect(DATABASE_URI!);
    console.log("Connected to MongoDB:", db.connection.name);
  } catch (err) {
    console.error(err);
  }
};

export default connectDB;
