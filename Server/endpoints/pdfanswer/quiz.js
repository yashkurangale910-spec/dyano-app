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

  const systemPrompt = `
# UNIVERSAL TOPIC QUIZ ENGINE

You are a highly intelligent, domain-aware quiz generator. Your goal is to generate a high-quality, objective, and adaptive quiz on ANY given topic.

## 1. TOPIC ANALYSIS
Before generating questions:
- Identify the domain of the topic (Technology, Science, Math, History, Ethics, Business, Soft skills, etc.).
- Identify knowledge type: Conceptual, Procedural, Analytical, Ethical/opinion-based.
- Identify what can be objectively assessed.

## 2. DOMAIN-AWARE STRATEGY
- Technical/Scientific: Test logic, principles, application.
- Mathematical: Test reasoning, steps, interpretation.
- Historical: Test cause–effect, significance, context.
- Ethical/Philosophical: Test reasoning, consistency, trade-offs.
- Soft skills: Use scenario-based judgment questions.

## 3. OBJECTIVITY SAFEGUARD
- Only ask questions with defensible answers.
- Avoid controversial or subjective grading.
- If multiple views exist, test reasoning quality, not opinion.
- Clearly state evaluation criteria.

## 4. QUESTION GENERATION RULES
- One clear concept per question.
- Increasing difficulty curve.
- No trivia unless explicitly requested.
- No ambiguous wording.
- No culturally biased assumptions.

## 5. ADAPTIVE OUTPUT CONTROL
Adjust question style, explanation depth, and language complexity based on topic nature and difficulty level.

## 6. FAILURE HANDLING
- Too broad: Narrow scope intelligently.
- Too vague: Infer most common interpretation.
- Too advanced: Test fundamentals first.

## 7. UNIVERSAL OUTPUT CONTRACT
Return ONLY a JSON object with:
{
  "quizTitle": "Clear, descriptive title",
  "topicFraming": "1–2 lines framing the topic context",
  "questions": [
    {
      "questionText": "Clear question",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "The exact text of the correct option",
      "explanation": "Concise justification and reasoning"
    }
  ]
}
`;

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        { role: 'user', content: `Generate a quiz about: "${prompt}". Difficulty: ${difficulty}. Ensure you follow the UNIVERSAL TOPIC QUIZ ENGINE rules strictly.` }
      ],
      model: 'gpt-4o',
      response_format: { type: "json_object" }
    });

    const content = JSON.parse(completion.choices[0].message.content);

    // Extract data from the new structure
    const title = content.quizTitle || `Quiz about ${prompt}`;
    const topicFraming = content.topicFraming || '';
    const questionsList = content.questions || [];

    // Create and save to DB
    const newQuiz = await Quiz.create({
      user: userId,
      title: title,
      topic: prompt,
      topicFraming: topicFraming,
      questions: questionsList,
      difficulty,
      totalQuestions: questionsList.length
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
 * Get a single quiz by ID
 * @route GET /quiz/:id
 */
quizRouter.get("/:id", authenticateToken, async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ _id: req.params.id, user: req.user.userId });
    if (!quiz) {
      return res.status(404).json({ success: false, message: "Quiz not found" });
    }
    res.json({ success: true, quiz });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch quiz", error: error.message });
  }
});

/**
 * Update quiz score and completion status
 * @route PATCH /quiz/:id/score
 */
quizRouter.patch("/:id/score", authenticateToken, async (req, res) => {
  const { score, isCompleted } = req.body;
  try {
    const quiz = await Quiz.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      { score, isCompleted },
      { new: true }
    );
    if (!quiz) {
      return res.status(404).json({ success: false, message: "Quiz not found" });
    }
    res.json({ success: true, quiz });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update quiz", error: error.message });
  }
});

export default quizRouter;