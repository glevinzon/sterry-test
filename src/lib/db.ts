import mongoose from "mongoose";

const MONGO_URI =
  "mongodb+srv://glevinzond:yjvY5q0eQmRZXUaT@sterrytest.pwpgl.mongodb.net/db_sterry?retryWrites=true&w=majority&appName=sterrytest";

export const dbConnect = async () => {
  try {
    const { connection } = await mongoose.connect(MONGO_URI as string);
    connection.on("error", (err) => {
      console.error(err);
    });

    connection.once("open", () => {
      console.log("Connected to MongoDB");
    });

    if (connection.readyState === 1) {
      return Promise.resolve(true);
    }
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};
