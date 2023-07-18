import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

try {
  (async () =>
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/workout-db"
    ))();
} catch (err) {
  console.log(err);
  throw err;
}

mongoose.set("strictQuery", false);

export default mongoose.connection;
