import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://osmanxasan32:ok960606@database.hwhdt13.mongodb.net/movieL",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    console.log("✅ MongoDB connected successfully...");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1); // si app u istaago haddii uu khalad jiro
  }
};

export default connectDB;
