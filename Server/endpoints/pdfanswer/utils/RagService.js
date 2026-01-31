import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

/**
 * RagService: Handles document synchronization and retrieval
 */
export class RagService {
    constructor(userId) {
        this.userId = userId;
        this.embeddings = new GoogleGenerativeAIEmbeddings({
            apiKey: process.env.GEMINI_API_KEY,
            modelName: "embedding-001", // Default Gemini embedding model
        });
        this.baseStorePath = path.resolve(process.cwd(), 'vector_stores');
    }

    /**
     * Get paths for a specific document's vector store
     */
    getStorePath(pdfDoc) {
        const docDir = path.join(this.baseStorePath, this.userId, pdfDoc._id.toString());
        return docDir;
    }

    /**
     * Ensure a vector store exists for a document, create if missing
     */
    async syncDocument(pdfDoc) {
        const storePath = this.getStorePath(pdfDoc);

        // If index exists, load it
        if (fs.existsSync(path.join(storePath, 'faiss.index'))) {
            return await FaissStore.load(storePath, this.embeddings);
        }

        console.log(`🚀 Creating new vector store for: ${pdfDoc.fileName}`);

        // Ensure directory exists
        fs.mkdirSync(storePath, { recursive: true });

        // Load PDF (pdfDoc.fileUrl is relative to Server root usually)
        // Normalize path
        const absolutePdfPath = path.resolve(process.cwd(), pdfDoc.fileUrl.replace(/^\//, ''));

        if (!fs.existsSync(absolutePdfPath)) {
            throw new Error(`PDF file not found at: ${absolutePdfPath}`);
        }

        const loader = new PDFLoader(absolutePdfPath);
        const docs = await loader.load();

        // Split text
        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
        });
        const splitDocs = await splitter.splitDocuments(docs);

        // Add metadata for citations
        splitDocs.forEach(doc => {
            doc.metadata.source = pdfDoc.fileName;
            doc.metadata.docId = pdfDoc._id;
        });

        // Create and save store
        const vectorStore = await FaissStore.fromDocuments(splitDocs, this.embeddings);
        await vectorStore.save(storePath);

        return vectorStore;
    }

    /**
     * Retrieve relevant chunks for a query
     */
    async retrieve(pdfDoc, query, k = 4) {
        try {
            const vectorStore = await this.syncDocument(pdfDoc);
            const results = await vectorStore.similaritySearch(query, k);

            return results.map(doc => ({
                text: doc.pageContent,
                metadata: {
                    source: doc.metadata.source,
                    page: doc.metadata.loc?.pageNumber || 'unknown',
                    snippet: doc.pageContent.substring(0, 150) + '...'
                }
            }));
        } catch (error) {
            console.error(`❌ RAG Retrieval Error for ${pdfDoc.fileName}:`, error);
            return [];
        }
    }
}
