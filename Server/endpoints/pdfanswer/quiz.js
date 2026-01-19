import { Router } from 'express';
import OpenAI from 'openai';

let quizRouter = Router()

quizRouter.post("/", async (req, response) => {
  const quiz = req.body.prompt
  console.log(quiz)
  const openaiPrompt = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  async function main() {
    const completion = await openaiPrompt.chat.completions.create({
      messages: [{ role: 'user', content: quiz }],
      model: 'gpt-3.5-turbo',
    });

    let main = completion.choices[0].message.content
    console.log(main)
    let questions = [];
    let ans = [];

    main = main.split("\n")
    console.log(main)
    for (let i = 3; i <= 7; i++)
      questions.push(main[i].substring(3));
    for (let i = 10; i <= 14; i++)
      ans.push(main[i].substring(3));
    response.json({ questions: questions, answers: ans })
  }

  main()

})

export default quizRouter