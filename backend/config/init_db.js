import mongoose from "mongoose";
import responses from "../utils/response_util.js";

const init_db = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connected");
  } catch (error) {
    console.log(error);
    return responses.SERVER_ERROR(error.message, null);
  }
};

export default init_db;
