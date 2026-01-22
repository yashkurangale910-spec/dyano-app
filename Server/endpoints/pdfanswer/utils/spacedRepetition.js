/**
 * Spaced Repetition Algorithm (SM-2)
 * Based on SuperMemo 2 algorithm
 */

/**
 * Calculate next review date and difficulty based on user response
 * @param {number} currentDifficulty - Current difficulty (0-5)
 * @param {number} quality - User response quality (0-5)
 *   5: Perfect response
 *   4: Correct response after hesitation
 *   3: Correct response with difficulty
 *   2: Incorrect but remembered
 *   1: Incorrect but familiar
 *   0: Complete blackout
 * @returns {Object} { nextReviewDate, newDifficulty, interval }
 */
export const calculateNextReview = (currentDifficulty, quality) => {
    let newDifficulty = currentDifficulty;
    let interval = 1; // days

    if (quality < 3) {
        // Failed - reset to beginning
        newDifficulty = 0;
        interval = 1;
    } else {
        // Passed - increase difficulty
        newDifficulty = Math.min(5, currentDifficulty + 1);

        // Calculate interval based on difficulty
        switch (newDifficulty) {
            case 0:
            case 1:
                interval = 1;
                break;
            case 2:
                interval = 3;
                break;
            case 3:
                interval = 7;
                break;
            case 4:
                interval = 14;
                break;
            case 5:
                interval = 30;
                break;
            default:
                interval = 1;
        }

        // Adjust based on quality
        if (quality === 5) {
            interval *= 1.3; // Perfect response - increase interval
        } else if (quality === 3) {
            interval *= 0.8; // Difficult response - decrease interval
        }
    }

    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + Math.round(interval));

    return {
        nextReviewDate,
        newDifficulty,
        interval: Math.round(interval)
    };
};

/**
 * Get cards due for review
 * @param {Array} cards - Array of flashcards
 * @returns {Array} Cards that are due for review
 */
export const getDueCards = (cards) => {
    const now = new Date();
    return cards.filter(card => {
        const nextReview = new Date(card.nextReview);
        return nextReview <= now;
    });
};

/**
 * Get study statistics
 * @param {Array} cards - Array of flashcards
 * @returns {Object} Statistics about the cards
 */
export const getStudyStats = (cards) => {
    const now = new Date();
    const dueCards = getDueCards(cards);

    const masteredCards = cards.filter(card => card.difficulty >= 4).length;
    const learningCards = cards.filter(card => card.difficulty > 0 && card.difficulty < 4).length;
    const newCards = cards.filter(card => card.difficulty === 0).length;

    return {
        total: cards.length,
        due: dueCards.length,
        mastered: masteredCards,
        learning: learningCards,
        new: newCards
    };
};

/**
 * Recommend study session size
 * @param {Array} cards - Array of flashcards
 * @returns {number} Recommended number of cards to study
 */
export const recommendSessionSize = (cards) => {
    const dueCards = getDueCards(cards);
    const dueCount = dueCards.length;

    if (dueCount === 0) return 0;
    if (dueCount <= 10) return dueCount;
    if (dueCount <= 30) return 15;
    return 20; // Max session size
};

export default {
    calculateNextReview,
    getDueCards,
    getStudyStats,
    recommendSessionSize
};
