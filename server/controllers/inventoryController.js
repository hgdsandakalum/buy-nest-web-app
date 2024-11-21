import Inventory from "../models/Inventory.js";
import Product from "../models/Product.js";
import { sendLowStockNotification } from "../utils/notifications.js";

//Get all inventories
export const getAllInventory = async (req, res) => {
  try {
    const inventoryItems = await Inventory.find()
      .populate({
        path: "productId",
      })
      .exec();
    res.json(inventoryItems);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching inventory", error: error.message });
  }
};

//Get inventory by vendor
export const getInventory = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const inventoryItems = await Inventory.find()
      .populate({
        path: "productId",
        match: { vendorId: vendorId },
      })
      .exec();

    const filteredInventory = inventoryItems.filter((item) => item.productId);

    if (filteredInventory.length === 0) {
      return res
        .status(404)
        .json({ message: "No inventory items found for this vendor" });
    }

    res.json(filteredInventory);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching inventory", error: error.message });
  }
};

//Update the inventory
export const updateInventory = async (req, res) => {
  try {
    console.log("req.params", req.params);
    const { productId } = req.params;
    const { quantity } = req.body;

    const inventory = await Inventory.findOne({ productId: productId });
    if (!inventory) {
      return res.status(404).json({ message: "Inventory not found" });
    }

    inventory.quantity = quantity;
    await inventory.save();

    if (quantity <= inventory.lowStockThreshold) {
      const product = await Product.findById(productId);
      await sendLowStockNotification(product.vendorId, product.name, quantity);
    }

    res.json(inventory);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating inventory", error: error.message });
  }
};

//Get total inventory count
export const getTotalInventoryCount = async (req, res) => {
  try {
    const totalCount = await Inventory.aggregate([
      {
        $group: {
          _id: null,
          totalQuantity: { $sum: "$quantity" },
        },
      },
    ]);

    res.json({ totalInventoryCount: totalCount[0]?.totalQuantity || 0 });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching total inventory count",
      error: error.message,
    });
  }
};
