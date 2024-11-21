import express from "express";
import { authenticateJWT, authorize } from "../middlewares/auth.js";
import {
  createProduct,
  getProducts,
  getProductsByVendor,
  updateProduct,
  deleteProduct,
  getTotalProductCount,
} from "../controllers/productController.js";

const router = express.Router();

// Create a new product (admin and vendor only)
router.post(
  "/",
  authenticateJWT,
  authorize(["ADMIN", "VENDOR"]),
  createProduct
);

// Get all products (admin)
router.get("/", getProducts);

// Get all products (vendor)
router.get(
  "/vendor/:vendorId",
  authenticateJWT,
  authorize(["ADMIN", "VENDOR"]),
  getProductsByVendor
);

// Update a product (admin and vendor only)
router.put(
  "/:productId",
  authenticateJWT,
  authorize(["ADMIN", "VENDOR"]),
  updateProduct
);

// Delete a product (admin and vendor only)
router.delete(
  "/:productId",
  authenticateJWT,
  authorize(["ADMIN", "VENDOR"]),
  deleteProduct
);

// Get total product count
router.get(
  "/total/count",
  authenticateJWT,
  authorize(["ADMIN", "VENDOR"]),
  getTotalProductCount
);

export default router;
