import { Router } from 'express';
import Quiz from './models/Quiz.js';
import { authenticateToken, optionalAuth } from './middleware/auth.js';
import { callGroq } from './utils/groq.js';

const quizRouter = Router();

/**
 * Helper to extract JSON from LLM response
 */
function parseLLMJson(text) {
  try {
    // 1. Try direct parse
    return JSON.parse(text);
  } catch (e) {
    // 2. Try markdown block
    const markdownMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (markdownMatch) {
      try {
        return JSON.parse(markdownMatch[1].trim());
      } catch (innerE) { }
    }

    // 3. Try to find first '{' and last '}'
    const startIdx = text.indexOf('{');
    const endIdx = text.lastIndexOf('}');
    if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
      try {
        return JSON.parse(text.substring(startIdx, endIdx + 1));
      } catch (braceE) { }
    }

    console.error("❌ JSON Parse Failure. Raw text:", text);
    throw new Error("Neural response was not in a valid format.");
  }
}

/**
 * Generate and save a new quiz
 * @route POST /quiz
 */
quizRouter.post("/", optionalAuth, async (req, response) => {
  const { prompt, difficulty = 'medium', framework = 'General' } = req.body;
  const userId = req.user?.userId || 'anonymous';

  console.log(`[Quiz Request] Topic: "${prompt}", Difficulty: ${difficulty}, Framework: "${framework}"`);

  const frameworkContext = (framework && framework !== 'General')
    ? `\nCONTEXT: The user is studying the "${framework}" ecosystem. Tailor your questions specifically to valid patterns, libraries, and best practices in ${framework}.`
    : '';
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
    const { isBossEncounter = false } = req.body;
    const bossProtocol = isBossEncounter
      ? `\nCRITICAL: This is a BOSS ENCOUNTER. Generate the MOST CHALLENGING, deep-knowledge questions possible. Focus on edge cases, complex logic, and synthesis of multiple concepts. The tone should be imposing and high-stakes.`
      : '';

    const finalSystemPrompt = systemPrompt + frameworkContext + bossProtocol;
    const finalUserPrompt = `Generate a quiz about: "${prompt}". Difficulty: ${isBossEncounter ? 'EXTREME' : difficulty}. Ensure you follow the UNIVERSAL TOPIC QUIZ ENGINE rules strictly.`;

    let responseText;
    try {
      // Prioritize Groq for ultra-fast quiz synthesis
      console.log(`📡 Dispatching Quiz Synthesis to Groq Core...`);
      responseText = await callGroq([
        { role: 'system', content: finalSystemPrompt },
        { role: 'user', content: finalUserPrompt }
      ], {
        response_format: { type: "json_object" }
      });
    } catch (groqError) {
      console.error("❌ Groq Quiz Generation failed:", groqError.message);
      throw new Error(`Neural sync disrupted: AI engine is offline.`);
    }

    const content = parseLLMJson(responseText);

    // Extract data from the new structure
    const title = content.quizTitle || content.title || `Quiz about ${prompt}`;
    const topicFraming = content.topicFraming || content.description || '';
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