import { config } from "dotenv";
config();
import { OpenAIEmbeddings } from "@langchain/openai";
import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { OpenAI } from "langchain/llms/openai";
import { RetrievalQAChain , loadQAStuffChain } from "langchain/chains";

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