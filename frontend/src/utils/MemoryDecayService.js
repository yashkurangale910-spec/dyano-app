/**
 * MemoryDecayService: Calculates cognitive retention scores based on the 
 * Ebbinghaus Forgetting Curve: R = e^(-t/S)
 * Where:
 * R = Retention
 * t = time since mastery (in days)
 * S = Strength of memory (default stability)
 */
export const MemoryDecayService = {
    /**
     * Calculate retention score (0 to 1)
     * @param {Date|string} masteredAt - The timestamp when the node was mastered
     * @returns {number} Retention score (1.0 = full recall, 0.0 = completely forgotten)
     */
    getRetentionScore: (masteredAt) => {
        if (!masteredAt) return 1.0;

        const lastRecall = new Date(masteredAt);
        const now = new Date();
        const diffInMs = now - lastRecall;
        const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

        // Stability factor S: Roughly 7 days for a 50% decay in high-density technical learning
        const stability = 7;

        // Calculate retention: R = exp(-t / S)
        const retention = Math.exp(-diffInDays / stability);

        return Math.max(0.1, retention); // Cap at 0.1 so it never completely disappears
    },

    /**
     * Map retention score to CSS opacity/filter
     * @param {number} score 
     */
    getPalimpsestStyle: (score) => {
        if (score > 0.9) return { opacity: 1, filter: 'none' };
        if (score > 0.7) return { opacity: 0.9, filter: 'grayscale(0.2)' };
        if (score > 0.5) return { opacity: 0.7, filter: 'grayscale(0.5)' };
        return { opacity: 0.5, filter: 'grayscale(0.8) blur(0.5px)', fontStyle: 'italic' };
    },

    /**
     * Returns true if retention is below the psychological extinction threshold
     */
    isExtinct: (retentionScore) => {
        return retentionScore < 0.25;
    },

    /**
     * Advanced "Glitch" styles for extinct nodes.
     */
    getExtinctStyle: (isExtinct) => {
        if (!isExtinct) return {};
        return {
            filter: 'blur(8px) grayscale(1) brightness(0.2)',
            pointerEvents: 'none',
            opacity: 0.2,
            transition: 'all 3s ease',
            userSelect: 'none'
        };
    },

    /**
     * HACKER-TIER: Batch process retention scores using Float32Array for WASM-like speed.
     * @param {Array} nodes - Array of node objects
     * @param {Object} progress - Progress map
     * @returns {Float32Array} - Array of retention scores aligned with nodes index
     */
    batchProcessRetention: (nodes, progress) => {
        const scores = new Float32Array(nodes.length);
        const now = Date.now();

        for (let i = 0; i < nodes.length; i++) {
            const nodeId = nodes[i].id;
            const nodeData = progress[nodeId] || {};

            if (nodeData.status !== 'MASTERED' || !nodeData.masteredAt) {
                scores[i] = 1.0; // Default full retention if not mastered or learning
                continue;
            }

            const timeSinceMastery = (now - new Date(nodeData.masteredAt).getTime()) / (1000 * 60 * 60 * 24); // Days
            const strength = nodeData.strength || 1;

            // Ebbinghaus Formula: R = e^(-t/S)
            scores[i] = Math.exp(-timeSinceMastery / strength);
        }

        return scores;
    }
};
