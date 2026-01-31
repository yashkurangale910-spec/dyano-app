import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * FallacyDetector: Scans text for logical fallacies and cognitive biases.
 */
class FallacyDetector {
    constructor(apiKey) {
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    }

    async detect(text) {
        if (!text || text.length < 10) return { fallacies: [], score: 100 };

        const prompt = `
            Analyze the following study notes for logical fallacies, cognitive biases, or factual inconsistencies.
            Return a JSON object with:
            - fallacies: An array of objects { name, description, suggestion }.
            - logicalScore: A number from 0 to 100 indicating the logical integrity.

            NOTES:
            "${text}"

            JSON OUTPUT ONLY:
        `;

        try {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const output = response.text();

            // Extract JSON from response
            const jsonStr = output.match(/\{[\s\S]*\}/)[0];
            return JSON.parse(jsonStr);
        } catch (err) {
            console.error("Fallacy detection failed:", err);
            return { fallacies: [], score: 100, error: true };
        }
    }
}

export default FallacyDetector;
