import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import restaurantRoutes from "./routes/restaurants.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// Middleware
app.use(
  cors({
    credentials: true,
  }),
);
app.use(express.json({ limit: '5mb' }));

// MongoDB Connection
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes
app.use("/api/restaurants", restaurantRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "VTap Backend is running" });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    name: "VTap Restaurant API",
    version: "1.0.0",
    endpoints: {
      health: "/api/health",
      restaurants: "/api/restaurants",
      restaurantBySubdomain: "/api/restaurants/:subdomain",
    },
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    error: "Internal server error",
    message: err.message,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 VTap Backend running on http://localhost:${PORT}`);
});
