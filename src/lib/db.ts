import mongoose from "mongoose";

const { MONGODB_URI } = process.env;

export const dbConnect = async () => {
  try {
    const { connection } = await mongoose.connect(MONGODB_URI as string);
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
