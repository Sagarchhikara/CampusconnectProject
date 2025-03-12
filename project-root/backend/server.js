require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("🔥 MongoDB Connected!"))
    .catch((err) => console.error("MongoDB Connection Error:", err));

// Sample route to test API
app.get("/", (req, res) => {
    res.send("Notes Management System API is running... 🚀");
});

// Set up routes
const noteRoutes = require("./routes/noteRoutes");
app.use("/api/notes", noteRoutes);

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🔥 Server running on port ${PORT}`));