// Client-side authentication utility (should be in a separate file)
// This client-side portion should be in its own file, e.g., 'authClient.js'
// export const getProfile = async () => {
//   const token = localStorage.getItem('token');
//   if (!token) return null;
//
//   try {
//     const res = await axios.get('http://localhost:5001/api/auth/profile', {
//       headers: { 'x-auth-token': token }
//     });
//     return res.data;
//   } catch (err) {
//     console.error(err);
//     return null;
//   }
// };

// Server-side authentication routes
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require('../middleware/auth'); // Import auth middleware for protected routes

// Signup Route
router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;
    
    // Basic validation
    if (!username || !email || !password) {
        return res.status(400).json({ error: "Please provide all required fields" });
    }
    
    try {
        // Check if user already exists
        const existingUser = await User.findOne({ 
            $or: [{ email }, { username }] 
        });
        
        if (existingUser) {
            return res.status(400).json({ 
                error: "User already exists with that email or username" 
            });
        }
        
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // Create new user
        const user = new User({ 
            username, 
            email, 
            password: hashedPassword 
        });
        
        await user.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ error: "Server error during signup" });
    }
});

// Login Route
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ error: "Please provide email and password" });
    }
    
    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Invalid credentials" });
        }
        
        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials" });
        }
        
        // Create and send token
        const token = jwt.sign(
            { id: user._id }, 
            process.env.JWT_SECRET, 
            { expiresIn: "1h" }
        );
        
        res.status(200).json({ token });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Server error during login" });
    }
});

// Profile Route (Protected)
router.get("/profile", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        
        res.json(user);
    } catch (error) {
        console.error("Profile error:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// Get all users (for admin purposes)
router.get("/users", auth, async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json(users);
    } catch (error) {
        console.error("Get users error:", error);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;