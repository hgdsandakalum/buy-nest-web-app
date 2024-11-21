import express from "express";
import { authenticateJWT, authorize } from "../middlewares/auth.js";
import {
  createOrder,
  getOrders,
  updateOrder,
  cancelOrder,
  getOrdersByVendorProducts,
} from "../controllers/orderController.js";

const router = express.Router();

// Create a new order
router.post("/", authenticateJWT, createOrder);

// Get all orders
router.get("/", authenticateJWT, authorize(["ADMIN", "CSR"]), getOrders);

// Update an order
router.put(
  "/:orderId",
  authenticateJWT,
  authorize(["ADMIN", "CSR"]),
  updateOrder
);

// Cancel an order
router.put("/:orderId/cancel", authenticateJWT, cancelOrder);

// Get orders by vendor
router.get(
  "/vendor/:vendorId",
  authenticateJWT,
  authorize(["ADMIN", "VENDOR"]),
  getOrdersByVendorProducts
);

export default router;
