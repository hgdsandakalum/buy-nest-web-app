import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      quantity: {
        type: Number,
        min: 1,
      },
      price: {
        type: Number,
      },
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["Processing", "Confirmed", "Shipped", "Delivered", "Cancelled"],
    default: "Processing",
  },
  shippingAddress: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
