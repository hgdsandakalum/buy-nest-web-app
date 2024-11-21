import express from "express";
import { authenticateJWT, authorize } from "../middlewares/auth.js";
import {
  getInventory,
  getAllInventory,
  updateInventory,
  getTotalInventoryCount,
} from "../controllers/inventoryController.js";

const router = express.Router();

// Get all inventory
router.get(
  "/all",
  authenticateJWT,
  authorize(["ADMIN", "CSR"]),
  getAllInventory
);

// Get inventory for a product
router.get(
  "/:vendorId",
  authenticateJWT,
  authorize(["ADMIN", "VENDOR", "CSR"]),
  getInventory
);

// Update inventory for a product
router.put(
  "/:productId",
  authenticateJWT,
  authorize(["ADMIN", "VENDOR", "CSR"]),
  updateInventory
);

// Get total inventory count
router.get(
  "/total/count",
  authenticateJWT,
  authorize(["ADMIN", "VENDOR", "CSR"]),
  getTotalInventoryCount
);

export default router;
