import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

try {
  mongoose.connect(
    process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/workout-db"
  );
  mongoose.set("strictQuery", false);
} catch (err) {
  console.log(err);
  throw err;
}

export default mongoose.connection;
