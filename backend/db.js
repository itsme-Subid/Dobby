import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const mongoURI =
  process.env.CONNECTION_STRING || "mongodb://0.0.0.0:27017/dobby";

const connectToMongo = () => {
  mongoose.connect(mongoURI).then(() => {
    console.log("Express.js: Connected to MongoDB");
  });
};

export default connectToMongo;
