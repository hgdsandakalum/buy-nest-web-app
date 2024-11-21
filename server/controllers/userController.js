import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//Register a user
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, address, contact } = req.body;

    if (role === "ADMIN") {
      return res.status(403).json({ message: "Cannot register as admin" });
    }

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      password: hashedPassword,
      name,
      address,
      contact,
      role,
    });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  }
};

//Login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

//Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching user profile", error: error.message });
  }
};

//Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const { name, address, contact } = req.body;

    console.log("update req", req.body);

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) user.name = name;
    if (address) user.address = address;
    if (contact) user.contact = contact;

    await user.save();
    res.json({ message: "Profile updated successfully", user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating user profile", error: error.message });
  }
};

//Verify the token
export const verifyToken = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Token is valid",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Token verification error:", error);
    res
      .status(500)
      .json({ message: "Error verifying token", error: error.message });
  }
};
