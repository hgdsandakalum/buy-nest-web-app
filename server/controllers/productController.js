import Product from "../models/Product.js";
import Inventory from "../models/Inventory.js";

//Create a new product
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, image } = req.body;
    const vendorId = req.user.id;

    const product = new Product({
      name,
      description,
      price,
      category,
      image,
      vendorId,
    });
    await product.save();

    // Initialize inventory
    await new Inventory({ productId: product._id, quantity: 0 }).save();

    res.status(201).json(product);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating product", error: error.message });
  }
};

//Get all products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true });
    res.json(products);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching products", error: error.message });
  }
};

//Get products by vendor
export const getProductsByVendor = async (req, res) => {
  try {
    const { vendorId } = req.params;

    // Validate vendorId
    if (!vendorId) {
      return res.status(400).json({ message: "Vendor ID is required" });
    }

    const products = await Product.find({ vendorId, isActive: true });

    if (products.length === 0) {
      return res
        .status(404)
        .json({ message: "No products found for this vendor" });
    }

    res.json(products);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching products", error: error.message });
  }
};

//Update a product
export const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { name, description, price, category } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (
      product.vendorId.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this product" });
    }

    product.name = name;
    product.description = description;
    product.price = price;
    product.category = category;

    await product.save();
    res.json(product);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating product", error: error.message });
  }
};

//Delete a product by id
export const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (
      product.vendorId.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this product" });
    }

    await Product.findByIdAndDelete(productId);
    await Inventory.findOneAndDelete({ productId });

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting product", error: error.message });
  }
};

//Get total product count
export const getTotalProductCount = async (req, res) => {
  try {
    const totalCount = await Product.countDocuments({ isActive: true });
    res.json({ totalProductCount: totalCount });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching total product count",
      error: error.message,
    });
  }
};
