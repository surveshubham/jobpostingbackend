import mongoose from "mongoose";

export async function connectToMongo() {
  try {
    console.log("MONGO URI: ", "mongodb://localhost:27017");
    await mongoose.connect("mongodb://localhost:27017/ideamagix");
    console.log("Connected To Database!");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}