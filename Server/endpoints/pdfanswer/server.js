import express from "express"
import multer from "multer"
import path from "path"
import { CharacterTextSplitter } from 'langchain/text_splitter';
import { config } from 'dotenv';
config();
import { OpenAIEmbeddings } from '@langchain/openai';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { FaissStore } from '@langchain/community/vectorstores/faiss';
import { OpenAI } from "langchain/llms/openai";
import { RetrievalQAChain, loadQAStuffChain } from "langchain/chains";
import { Router } from "express";
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

// Serve HTML form for file upload
router.get('/', (req, res) => {
  res.sendFile("/pdfanswer/pdf/index.html")
});

// Handle file upload
router.post('/upload', upload.single('pdfFile'), async (req, res) => {
  console.log("hi")
  const loader = new PDFLoader("./uploads/samplePDF.pdf", {
    parsedItemSeparator: " ",
  });

  const docs = await loader.load();

  const splitter = new CharacterTextSplitter({
    chunkSize: 200,
    chunkOverlap: 50,
  });

  const documents = await splitter.splitDocuments(docs);
  const embeddings = new OpenAIEmbeddings();

  const vectorstores = await FaissStore.fromDocuments(documents, embeddings);
  await vectorstores.save("./");
  res.send('File uploaded successfully!');
});

router.post("/question", async (req, res) => {
  console.log(req.body)
  const { question } = req.body

  const embeddings = new OpenAIEmbeddings();
  const vectorstores = await FaissStore.load("./", embeddings);

  const model = new OpenAI({ temperature: 0 });

  const chain = new RetrievalQAChain({
    combineDocumentsChain: loadQAStuffChain(model),
    retriever: vectorstores.asRetriever(),
    returnSourceDocuments: true,
  });


  const response = await chain.call({
    query: question
  });

  res.json({ data: response.text })

})

export default router;

