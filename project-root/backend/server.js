require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection - Single connection
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/project-root";
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("🔥 MongoDB Connected!");
  } catch (err) {
    console.error("MongoDB Connection Error:", err);
    process.exit(1); // Exit process with failure
  }
};

// Connect to database
connectDB();

// Welcome route
app.get("/", (req, res) => {
  res.send("Notes Management System API is running... 🚀");
});

// Set up routes
const noteRoutes = require("./routes/noteRoutes");
const authRoutes = require("./utils/auth"); // Import auth routes

// Use route modules
app.use("/api/notes", noteRoutes);
app.use("/api/auth", authRoutes);

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Promise Rejection:", err);
  // Close server & exit process
  // server.close(() => process.exit(1));
});