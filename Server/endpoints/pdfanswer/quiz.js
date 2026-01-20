import { Router } from 'express';
import OpenAI from 'openai';

let quizRouter = Router()

quizRouter.post("/", async (req, response) => {
  const prompt = req.body.prompt

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a quiz generator. Return only a JSON array of objects. Each object must have: "question" (string), "options" (array of 4 strings), and "correctAnswer" (integer index 0-3).'
        },
        { role: 'user', content: `Generate a quiz about: ${prompt}` }
      ],
      model: 'gpt-3.5-turbo-0125',
      response_format: { type: "json_object" }
    });

    let content = completion.choices[0].message.content;
    const quizData = JSON.parse(content);

    // Some models might wrap it in a "quiz" or "questions" key
    const questions = quizData.questions || quizData.quiz || quizData;

    response.json({ quiz: Array.isArray(questions) ? questions : [questions] });
  } catch (error) {
    console.error("Quiz generation error:", error);
    response.status(500).json({ error: "Failed to generate quiz" });
  }
});

export default quizRouter;