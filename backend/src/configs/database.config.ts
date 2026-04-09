import mongoose from "mongoose";
import { logger } from "../utils/logger";

export const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.DATABASE}`);
    logger.info("Kết nối DB thành công!");
  } catch (error) {
    logger.error("Kết nối DB thất bại!", error);
    process.exit(1);
  }
};
