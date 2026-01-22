import { Router } from 'express';
import OpenAI from 'openai';
import Quiz from './models/Quiz.js';
import { authenticateToken } from './middleware/auth.js';

const quizRouter = Router();

/**
 * Generate and save a new quiz
 * @route POST /quiz
 */
quizRouter.post("/", authenticateToken, async (req, response) => {
  const { prompt, difficulty = 'medium' } = req.body;
  const userId = req.user.userId;

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a quiz generator. Return only a JSON object with a "questions" key containing an array of objects. Each object must have: "questionText" (string), "options" (array of 4 strings), "correctAnswer" (string - the exact text of the correct option), and "explanation" (string).'
        },
        { role: 'user', content: `Generate a quiz about: ${prompt}. Difficulty: ${difficulty}` }
      ],
      model: 'gpt-3.5-turbo-0125',
      response_format: { type: "json_object" }
    });

    const content = JSON.parse(completion.choices[0].message.content);
    const questionsList = content.questions || content.quiz || content;
    const finalQuestions = Array.isArray(questionsList) ? questionsList : [questionsList];

    // Create and save to DB
    const newQuiz = await Quiz.create({
      user: userId,
      title: `Quiz about ${prompt}`,
      topic: prompt,
      questions: finalQuestions,
      difficulty,
      totalQuestions: finalQuestions.length
    });

    response.status(201).json({
      success: true,
      message: "Quiz generated and saved successfully",
      quiz: newQuiz
    });
  } catch (error) {
    console.error("Quiz generation error:", error);
    response.status(500).json({
      success: false,
      message: "Failed to generate quiz",
      error: error.message
    });
  }
});

/**
 * Get all quizzes for the logged-in user
 * @route GET /quiz
 */
quizRouter.get("/", authenticateToken, async (req, res) => {
  try {
    const quizzes = await Quiz.find({ user: req.user.userId }).sort({ createdAt: -1 });
    res.json({ success: true, quizzes });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch quizzes", error: error.message });
  }
});

export default quizRouter;