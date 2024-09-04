import mongoose from "mongoose";
export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("CONNECTED SUCCESSFULLY");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
