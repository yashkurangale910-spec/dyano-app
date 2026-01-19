const {Router} = require("express")
const router = Router()
import { config } from 'dotenv';
config();
import { CharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from '@langchain/openai';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { OpenAI } from "langchain/llms/openai";
import { RetrievalQAChain , loadQAStuffChain } from "langchain/chains";



router.post("/upload", async (req, res) => {
    const loader = new PDFLoader("./blockchain.pdf",{
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
})

router.post("/question", async (req, res) => {
    const embeddings = new OpenAIEmbeddings();
    const vectorstores = await FaissStore.load("./",embeddings);

    const model = new OpenAI({ temperature:0 });

    const chain = new RetrievalQAChain({
        combineDocumentsChain: loadQAStuffChain(model),
        retriever: vectorstores.asRetriever(),
        returnSourceDocuments:true,
    });

    // const question = process.argv[2]

    const res = await chain.call({
        query: "what is blockchain",
    });

    console.log(res.text);
})

module.exports = router