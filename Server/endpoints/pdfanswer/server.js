import express from "express"
import multer from "multer"
import path from "path"
import { CharacterTextSplitter } from 'langchain/text_splitter';
import { config } from 'dotenv';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { Router } from "express";
import PDFDocument from "./models/PDFDocument.js";
import { authenticateToken } from "./middleware/auth.js";
import { callGemini } from "./utils/gemini.js";

config();
const router = Router();

router.use(express.json())

// Set up storage for uploaded files with security
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // Use timestamp + random string for unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'pdf-' + uniqueSuffix + path.extname(file.originalname));
  },
});

// File filter for PDF only
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

// Multer configuration with security limits
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
    files: 1 // Only 1 file at a time
  },
  fileFilter: fileFilter
});

/**
 * Handle PDF upload and initial processing
 * @route POST /pdf/upload
 */
router.post('/upload', authenticateToken, upload.single('pdfFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const userId = req.user.userId;
    const filePath = req.file.path;

    // Load and split PDF
    const loader = new PDFLoader(filePath, {
      parsedItemSeparator: " ",
    });

    const docs = await loader.load();
    const extractedText = docs.map(d => d.pageContent).join('\n').substring(0, 5000); // Store sample or full text

    const splitter = new CharacterTextSplitter({
      chunkSize: 500,
      chunkOverlap: 100,
    });

    const documents = await splitter.splitDocuments(docs);

    // Vector stores disabled for now as they require embeddings
    // We will use extractedText from MongoDB for simple QA

    // Save metadata to MongoDB
    const pdfDoc = await PDFDocument.create({
      user: userId,
      fileName: req.file.originalname,
      fileUrl: filePath,
      fileSize: req.file.size,
      extractedText: extractedText,
      status: 'ready',
      metadata: {
        pageCount: docs.length
      }
    });

    res.status(201).json({
      success: true,
      message: 'File processed successfully!',
      documentId: pdfDoc._id,
      vectorStorePath
    });
  } catch (error) {
    console.error("PDF Processing Error:", error);
    res.status(500).json({ success: false, message: "Failed to process PDF", error: error.message });
  }
});

/**
 * Ask questions about a specific PDF
 * @route POST /pdf/question
 */
router.post("/question", authenticateToken, async (req, res) => {
  try {
    const { question, documentId } = req.body;
    const userId = req.user.userId;

    // Find the document to get the vector store path
    const pdfDoc = await PDFDocument.findOne({ _id: documentId, user: userId });
    if (!pdfDoc) {
      return res.status(404).json({ success: false, message: "Document not found" });
    }

    // Use extractedText as context
    const context = pdfDoc.extractedText;

    const messages = [
      { role: 'system', content: `You are a helpful assistant analyzing a PDF document. Use the following context to answer the user's question accurately.\n\nCONTEXT:\n${context}` },
      { role: 'user', content: question }
    ];

    const aiResponse = await callGemini(messages);

    res.json({ success: true, data: aiResponse });
  } catch (error) {
    console.error("PDF QA Error:", error);
    res.status(500).json({ success: false, message: "QA failed", error: error.message });
  }
});

/**
 * Get all PDFs for user
 * @route GET /pdfList
 */
router.get("/list", authenticateToken, async (req, res) => {
  try {
    const documents = await PDFDocument.find({ user: req.user.userId }).sort({ createdAt: -1 });
    res.json({ success: true, documents });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch document list", error: error.message });
  }
});

export default router;
