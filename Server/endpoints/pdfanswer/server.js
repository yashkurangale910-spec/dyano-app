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
import { RetrievalQAChain , loadQAStuffChain } from "langchain/chains";
import { Router } from "express";
const router = Router();

router.use(express.json())
// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Save uploaded files to the 'uploads' directory
  },
  filename: function (req, file, cb) {
    // Use the current timestamp as the filename to avoid conflicts
    cb(null, "samplePDF" + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Serve HTML form for file upload
router.get('/', (req, res) => {
  res.sendFile("/pdfanswer/pdf/index.html")
});

// Handle file upload
router.post('/upload', upload.single('pdfFile'), async (req, res) => {
  console.log("hi")
  const loader = new PDFLoader("./uploads/samplePDF.pdf",{
    parsedItemSeparator:" ",
});

const docs = await loader.load();

const splitter = new CharacterTextSplitter({
    chunkSize: 200,
    chunkOverlap: 50,
});

const documents = await splitter.splitDocuments(docs);
const embeddings = new OpenAIEmbeddings();

const vectorstores = await FaissStore.fromDocuments(documents,embeddings);
await vectorstores.save("./");
res.send('File uploaded successfully!');
});

router.post("/question", async(req, res) => {
  console.log(req.body)
  const {question} = req.body

  const embeddings = new OpenAIEmbeddings();
const vectorstores = await FaissStore.load("./",embeddings);

const model = new OpenAI({ temperature:0 });

const chain = new RetrievalQAChain({
    combineDocumentsChain: loadQAStuffChain(model),
    retriever: vectorstores.asRetriever(),
    returnSourceDocuments:true,
});


const response = await chain.call({
    query: question
});

res.json({data: response.text})

})

export default router;

