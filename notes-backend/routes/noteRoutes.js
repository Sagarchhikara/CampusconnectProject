const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Note = require("../models/Note");
const fs = require("fs");

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir); // Files go into "uploads/" folder with absolute path
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const upload = multer({ storage });

// Route to handle file upload
router.post("/add", upload.single("pdfFile"), async (req, res) => {
  try {
    const { title, content, videoUrl } = req.body;
    const pdfFile = req.file ? `uploads/${req.file.filename}` : null; // Store file path without leading slash

    const newNote = new Note({ title, content, videoUrl, pdfFile });
    await newNote.save();

    res.status(201).json({
      message: "✅ Note added successfully with PDF!",
      note: newNote,
    });
  } catch (error) {
    console.error("Error saving note:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get all notes
router.get("/", async (req, res) => {
  try {
    const notes = await Note.find();
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get a specific note by ID
router.get("/:id", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }
    res.json(note);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Download PDF file
router.get("/pdf/:filename", (req, res) => {
  const filePath = path.join(__dirname, "../uploads", req.params.filename);
  res.download(filePath, (err) => {
    if (err) {
      console.error("Download error:", err);
      return res.status(404).json({ error: "File not found" });
    }
  });
});

// Update a note
router.put("/:id", upload.single("pdfFile"), async (req, res) => {
  try {
    const { title, content, videoUrl } = req.body;
    const updateData = { title, content, videoUrl };
    
    // If a new file is uploaded, update the pdfFile field
    if (req.file) {
      updateData.pdfFile = `uploads/${req.file.filename}`;
    }
    
    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    
    if (!updatedNote) {
      return res.status(404).json({ error: "Note not found" });
    }
    
    res.json({
      message: "✅ Note updated successfully!",
      note: updatedNote
    });
  } catch (error) {
    console.error("Error updating note:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Delete a note
router.delete("/:id", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }
    
    // If the note has a PDF file, delete it
    if (note.pdfFile) {
      const filePath = path.join(__dirname, "..", note.pdfFile);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    await Note.findByIdAndDelete(req.params.id);
    
    res.json({ message: "✅ Note deleted successfully!" });
  } catch (error) {
    console.error("Error deleting note:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;