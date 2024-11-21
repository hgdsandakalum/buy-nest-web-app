import mongoose from "mongoose";
const { Schema } = mongoose;

const vendorRatingSchema = new Schema({
  vendorId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  customerId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const VendorRating = mongoose.model("VendorRating", vendorRatingSchema);

export default VendorRating;
