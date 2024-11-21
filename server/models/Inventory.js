import mongoose from "mongoose";
const { Schema } = mongoose;

const inventorySchema = new Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: { type: Number, required: true, min: 0 },
  lowStockThreshold: { type: Number, required: true, default: 10 },
  updatedAt: { type: Date, default: Date.now },
});

const Inventory = mongoose.model("Inventory", inventorySchema);

export default Inventory;
