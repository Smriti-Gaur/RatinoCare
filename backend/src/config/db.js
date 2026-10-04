import mongoose from "mongoose";
import config from "./env.js";
import logger from "../utils/logger.js";
import { backfillPublicIds } from "../utils/backfillPublicIds.js";
const connectDB = async () => {
  try {

    await mongoose.connect(config.MONGO_URI);

    await backfillPublicIds();

    logger.info("MongoDB Connected");
    return true;
  } catch (error) {

    console.error(
      "❌ MongoDB Connection Failed:",
      error.message
    );

    process.exit(1);
    return false;
  }
};

export default connectDB;