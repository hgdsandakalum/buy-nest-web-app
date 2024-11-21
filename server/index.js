import express, { json, urlencoded } from "express";
import { connect } from "mongoose";
import { config } from "dotenv";
import cors from "cors";

// Import middlewares
import { authenticateJWT, authorize } from "./middlewares/auth.js";

// Import routes
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";
import vendorRoutes from "./routes/vendorRoutes.js";

config();

const app = express();

//middleware
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cors());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/products", authenticateJWT, productRoutes);
app.use("/api/orders", authenticateJWT, orderRoutes);
app.use("/api/inventory", authenticateJWT, inventoryRoutes);
app.use("/api/vendors", authenticateJWT, vendorRoutes);

connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

const port = process.env.PORT || 5000;

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

export default app;
