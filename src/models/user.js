import mongoose from "mongoose";

export const UserSchema = new mongoose.Schema({
  userid: { type: String },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  email: { type: String, required: true },
  otp: { type: String, expires: "10m" },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
});

export default mongoose.model.Users || mongoose.model("User", UserSchema);
