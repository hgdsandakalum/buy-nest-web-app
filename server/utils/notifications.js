import nodemailer from "nodemailer";
import User from "../models/User.js";

export const sendLowStockNotification = async (
  vendorId,
  productName,
  currentStock
) => {
  try {
    const vendor = await User.findById(vendorId);
    if (!vendor) {
      console.error("Vendor not found for low stock notification");
      return;
    }

    const transporter = nodemailer.createTransport({
      // Configure your email service here
      // For example, using Gmail:
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: "your-app@example.com",
      to: vendor.email,
      subject: "Low Stock Alert",
      text: `Dear ${vendor.username},\n\nThe stock for ${productName} is running low. Current stock: ${currentStock}. Please restock soon to avoid stockouts.\n\nBest regards,\nYour App Team`,
    };

    await transporter.sendMail(mailOptions);
    console.log(
      `Low stock notification sent to ${vendor.email} for ${productName}`
    );
  } catch (error) {
    console.error("Error sending low stock notification:", error);
  }
};
