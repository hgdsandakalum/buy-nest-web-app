import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
  name: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: {
    type: String,
    enum: ["ADMIN", "VENDOR", "CSR", "CUSTOMER"],
    required: true,
  },
  description: { type: String },
  address: { type: String },
  contact: { type: String },
  image: { type: String },
  averageRating: { type: Number, default: 0 },
  totalRatings: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);

export default User;
