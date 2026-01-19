import express from 'express';
import cors from 'cors';
import axios from 'axios';
import imageGenerator from './final.js';
import pdfRouter from "./server.js"
import path from "node:path"
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import quizRouter from "./quiz.js"
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended:true }));
app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use('/img', express.static(path.join(__dirname, 'img')));
app.get("/", (req, res) => {
    res.send("<h1>Welcome to Dnyanodaya</h1>")
})
app.post('/img',imageGenerator);
app.use("/pdf", pdfRouter)
app.use("/quiz", quizRouter)

const PORT = 3005;
app.listen(PORT,()=>{
    console.log(`server is listening on port ${PORT}`)
});
