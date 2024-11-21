import Order from "../models/Order.js";
import Product from "../models/Product.js";

//Create a new order
export const createOrder = async (req, res) => {
  try {
    const { products, shippingAddress } = req.body;
    const customerId = req.user.id;

    let totalAmount = 0;
    const orderProducts = [];

    for (let item of products) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res
          .status(404)
          .json({ message: `Product ${item.productId} not found` });
      }
      totalAmount += product.price * item.quantity;
      orderProducts.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      });
    }

    const newOrder = new Order({
      customerId,
      products: orderProducts,
      totalAmount,
      shippingAddress,
    });

    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating order", error: error.message });
  }
};

//Get all orders
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("customerId", "name email");
    res.json(orders);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching orders", error: error.message });
  }
};

//Update a order
export const updateOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { shippingAddress, status } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (shippingAddress) {
      order.shippingAddress = shippingAddress;
    }

    if (status) {
      order.status = status;
    }

    order.updatedAt = Date.now();
    await order.save();

    res.json(order);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating order", error: error.message });
  }
};

//Cancel a order
export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status !== "Processing") {
      return res
        .status(400)
        .json({ message: "Can only cancel orders that are still processing" });
    }

    order.status = "Cancelled";
    order.updatedAt = Date.now();
    await order.save();

    res.json({ message: "Order cancelled successfully", order });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error cancelling order", error: error.message });
  }
};

//Get orders by vendor
export const getOrdersByVendorProducts = async (req, res) => {
  try {
    const { vendorId } = req.params;

    const vendorProducts = await Product.find({ vendorId: vendorId }, "_id");
    const vendorProductIds = vendorProducts.map((product) => product._id);

    const orders = await Order.find({
      "products.productId": { $in: vendorProductIds },
    })
      .populate("customerId", "name email")
      .populate("products.productId", "name price");

    if (orders.length === 0) {
      return res
        .status(404)
        .json({ message: "No orders found with products from this vendor" });
    }

    res.json(orders);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching orders", error: error.message });
  }
};
