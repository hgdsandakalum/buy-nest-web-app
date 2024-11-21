import User from "../models/User.js";
import VendorRating from "../models/VendorRating.js";
import bcrypt from "bcrypt";

//Create new vendor
export const createVendor = async (req, res) => {
  try {
    const { name, email, password, description, address, contact, image } =
      req.body;

    const existingUser = await User.findOne({ $or: [{ name }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: "Name or email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const vendor = new User({
      name,
      email,
      password: hashedPassword,
      role: "VENDOR",
      description,
      address,
      contact,
      image,
      averageRating: 0,
      totalRatings: 0,
    });
    await vendor.save();

    res.status(201).json({
      message: "Vendor created successfully",
      vendor: {
        id: vendor._id,
        name: vendor.name,
        email: vendor.email,
        description: vendor.description,
        address: vendor.address,
        contact: vendor.contact,
        image: vendor.image,
        averageRating: vendor.averageRating,
        totalRatings: vendor.totalRatings,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating vendor", error: error.message });
  }
};

//Get all vendors
export const getVendors = async (req, res) => {
  try {
    const vendors = await User.find({ role: "VENDOR" })
      .select("-password")
      .sort({ _id: -1 });
    res.json(vendors);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching vendors", error: error.message });
  }
};

//Update vendor details
export const updateVendor = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const { name, email, description, address, contact, image } = req.body;

    const vendor = await User.findById(vendorId);
    if (!vendor || vendor.role !== "VENDOR") {
      return res.status(404).json({ message: "Vendor not found" });
    }

    if (name) vendor.name = name;
    if (email) vendor.email = email;
    if (description) vendor.description = description;
    if (address) vendor.address = address;
    if (contact) vendor.contact = contact;
    if (image) vendor.image = image;

    await vendor.save();
    res.json({ message: "Vendor updated successfully", vendor });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating vendor", error: error.message });
  }
};

//Get vendor rating by id
export const getVendorRatings = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const ratings = await VendorRating.find({ vendorId }).populate(
      "customerId",
      "name"
    );
    res.json(ratings);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching vendor ratings", error: error.message });
  }
};

//Add vendor ratings
export const addVendorRating = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const { rating, comment } = req.body;
    const customerId = req.user.id;

    const vendor = await User.findById(vendorId);
    if (!vendor || vendor.role !== "VENDOR") {
      return res.status(404).json({ message: "Vendor not found" });
    }

    const newRating = new VendorRating({
      vendorId,
      customerId,
      rating,
      comment,
    });
    await newRating.save();

    // Update vendor's average rating and total ratings
    vendor.totalRatings += 1;
    vendor.averageRating =
      (vendor.averageRating * (vendor.totalRatings - 1) + rating) /
      vendor.totalRatings;
    await vendor.save();

    res.status(201).json(newRating);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding vendor rating", error: error.message });
  }
};

//Delete a vendor by id
export const deleteVendor = async (req, res) => {
  try {
    const { vendorId } = req.params;

    // Check if the user making the request is an admin
    if (req.user.role !== "ADMIN") {
      return res
        .status(403)
        .json({ message: "Only admins can delete vendors" });
    }

    // Find the vendor
    const vendor = await User.findById(vendorId);

    if (!vendor || vendor.role !== "VENDOR") {
      return res.status(404).json({ message: "Vendor not found" });
    }

    // Delete the vendor
    await User.findByIdAndDelete(vendorId);

    // Optionally, delete associated ratings
    await VendorRating.deleteMany({ vendorId });

    res.json({ message: "Vendor deleted successfully" });
  } catch (error) {
    console.error("Error deleting vendor:", error);
    res
      .status(500)
      .json({ message: "Error deleting vendor", error: error.message });
  }
};

//Get total vendor count
export const getTotalVendorCount = async (req, res) => {
  try {
    const totalCount = await User.countDocuments({ role: "VENDOR" });
    res.json({ totalVendorCount: totalCount });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching total vendor count",
      error: error.message,
    });
  }
};
