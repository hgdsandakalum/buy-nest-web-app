import mongoose from "mongoose";
const { Schema } = mongoose;

const productSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  image: { type: String },
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Remove the virtual for productId
// productSchema.virtual("productId").get(function () {
//   return this._id.toHexString();
// });

// Ensure virtual fields are serialized
productSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    ret.productId = ret._id.toHexString();
    delete ret._id;
    delete ret.__v;
  },
});

const Product = mongoose.model("Product", productSchema);
export default Product;
