import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import env from "../config/env.js";
import { success, error as apiError } from "../utils/ApiResponse.js";

// ---------------- Register ----------------
export async function register(req, res, next) {
  try {
    const { name, email, password, passwordConfirmation } = req.body;

    if (!name || !email || !password || !passwordConfirmation) {
      return res.status(400).json(apiError("All fields are required"));
    }

    if (password !== passwordConfirmation) {
      return res.status(400).json(apiError("Passwords do not match"));
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json(apiError("Email already registered"));
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, passwordHash });

    const token = jwt.sign({ id: user._id }, env.jwtSecret, { expiresIn: "7d" });

    res.status(201).json(
      success(
        { user: { id: user._id, name, email }, token },
        "User registered successfully"
      )
    );
  } catch (err) {
    next(err);
  }
}

// ---------------- Login ----------------
export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json(apiError("Email and password are required"));
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json(apiError("Invalid credentials"));

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(401).json(apiError("Invalid credentials"));

    const token = jwt.sign({ id: user._id }, env.jwtSecret, { expiresIn: "7d" });

    res.json(success({ user: { id: user._id, name: user.name, email: user.email }, token }, "User Login successful"));
  } catch (err) {
    next(err);
  }
}

// ---------------- Get all users ----------------
export async function getUsers(req, res, next) {
  try {
    const users = await User.find().select("-passwordHash").lean();
    res.json(success(users));
  } catch (err) {
    next(err);
  }
}
