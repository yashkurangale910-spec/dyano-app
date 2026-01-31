/**
 * QuantumLogic: A predictive engine that anticipates user interaction.
 * Used to provide proactive learning suggestions and predictive UI states.
 */
export const QuantumLogic = {
    /**
     * Predict likely next topics based on current context and node progress.
     * @param {Object} activeNode - The node currently being explored.
     * @param {Array} roadmapNodes - All nodes in the current roadmap.
     * @param {Object} nodeProgress - The current mastery state.
     */
    predictNextSteps: (activeNode, roadmapNodes, nodeProgress) => {
        if (!activeNode || !roadmapNodes) return [];

        // 1. Find directed descendants (direct next steps)
        const descendants = roadmapNodes.filter(n => n.id.startsWith(activeNode.id + '.') || (activeNode.children && activeNode.children.includes(n.id)));

        // 2. Filter out already mastered ones
        const availableSteps = descendants.filter(n => (nodeProgress[n.id]?.status || nodeProgress[n.id]) !== 'MASTERED');

        // 3. Add lateral suggestions (adjacent nodes at same depth)
        const lateralNodes = roadmapNodes.filter(n =>
            n.depth === activeNode.depth &&
            n.id !== activeNode.id &&
            (nodeProgress[n.id]?.status || nodeProgress[n.id]) !== 'MASTERED'
        ).slice(0, 2);

        const predictions = [...availableSteps.slice(0, 2), ...lateralNodes];

        return predictions.map(p => ({
            id: p.id,
            title: p.title,
            probability: 0.85, // Mock probability for UI
            reason: availableSteps.includes(p) ? "Logical Progression" : "Contextual Adjacency"
        }));
    },

    /**
     * Estimates "Learning Velocity" (XP/Time)
     */
    calculateVelocity: (sessions) => {
        if (!sessions || sessions.length < 2) return 1.0;
        // Simplified: messages per session as a proxy for engagement
        const totalMessages = sessions.reduce((sum, s) => sum + (s.messages?.length || 0), 0);
        return (totalMessages / sessions.length).toFixed(1);
    }
};
