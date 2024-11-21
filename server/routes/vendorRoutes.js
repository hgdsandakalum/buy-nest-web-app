import express from "express";
import { authenticateJWT, authorize } from "../middlewares/auth.js";
import {
  createVendor,
  getVendors,
  updateVendor,
  getVendorRatings,
  addVendorRating,
  deleteVendor,
  getTotalVendorCount,
} from "../controllers/vendorController.js";

const router = express.Router();

// Create a new vendor (admin only)
router.post("/", authenticateJWT, authorize(["ADMIN"]), createVendor);

// Get all vendors
router.get("/", authenticateJWT, getVendors);

// Update vendor information (admin and vendor)
router.put(
  "/:vendorId",
  authenticateJWT,
  authorize(["ADMIN", "VENDOR"]),
  updateVendor
);

// Get vendor ratings
router.get("/:vendorId/ratings", getVendorRatings);

// Add a rating for a vendor
router.post("/:vendorId/ratings", authenticateJWT, addVendorRating);

router.delete(
  "/:vendorId",
  authenticateJWT,
  authorize(["ADMIN"]),
  deleteVendor
);

// Get total vendor count
router.get(
  "/total/count",
  authenticateJWT,
  authorize(["ADMIN", "CSR"]),
  getTotalVendorCount
);

export default router;
