import { CharacterTextSplitter } from 'langchain/text_splitter';
import { config } from 'dotenv';
config();
import { OpenAIEmbeddings } from '@langchain/openai';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { FaissStore } from '@langchain/community/vectorstores/faiss';

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