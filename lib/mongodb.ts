import mongoose from "mongoose";
const URL: string = process.env.URL;
export const ConnectDb = async () => {
  try {
    await mongoose.connect(URL);
    console.log("✅ MongoDB connected successfully!");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
  }
};
const mySchema = new mongoose.Schema({
  task: {
    type: String,
    required: true,
  },
});
export const myModel =
  mongoose.models.todoModel || mongoose.model("todoModel", mySchema);
