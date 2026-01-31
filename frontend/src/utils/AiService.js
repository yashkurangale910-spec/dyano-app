import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3005';

export const AiService = {
    /**
     * Summon a specific personality from the Hive Mind.
     * @param {string} persona - 'architect', 'hacker', 'qa_tester', 'refactor_bot'
     * @param {string} message - The user's input code or question
     * @param {string} token - Auth token
     */
    async summonHive(persona, message, token) {
        try {
            const res = await axios.post(`${API_URL}/tutor/chat`, {
                message,
                personality: persona,
                depth: 'standard',
                language: 'en',
                framework: 'React/Node' // Default context
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                return res.data.response.response;
            }
            throw new Error(res.data.message);
        } catch (error) {
            console.error('Hive Mind Link Failed:', error);
            return "Connection to Hive Mind severed.";
        }
    },

    /**
     * Generate unit tests for a snippet.
     */
    async generateTests(codeSnippet, token) {
        try {
            const prompt = `Generate Jest unit tests for this:\n${codeSnippet}`;
            return await this.summonHive('qa_tester', prompt, token);
        } catch (e) {
            return "// Test generation failed.";
        }
    },

    /**
     * Auto-refactor a snippet.
     */
    async refactorCode(codeSnippet, token) {
        try {
            const prompt = `Refactor this code:\n${codeSnippet}`;
            return await this.summonHive('refactor_bot', prompt, token);
        } catch (e) {
            return "// Refactoring unavailable.";
        }
    }
};
