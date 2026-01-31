export const FallacyService = {
    fallacies: [
        {
            id: 'strawman',
            name: 'Strawman Argument',
            pattern: /(so|so you mean|so you're saying|implying that|suggesting that)\s+(that)?\s*.*is\s+(bad|wrong|stupid|evil)/i,
            description: "Misrepresenting an argument to make it easier to attack."
        },
        {
            id: 'ad-hominem',
            name: 'Ad Hominem',
            pattern: /(stupid|idiot|dumb|fool|ignorant|shill|bot|troll|you\s+are\s+a)/i,
            description: "Attacking the person rather than the argument."
        },
        {
            id: 'circular',
            name: 'Circular Reasoning',
            pattern: /(because\s+it\s+is|due\s+to\s+the\s+fact\s+that\s+it\s+is|reason\s+is\s+that\s+it\s+is)/i,
            description: "The conclusion is included in the premise."
        },
        {
            id: 'appeal-to-authority',
            name: 'Appeal to Authority',
            pattern: /(experts\s+say|studies\s+show|scientists\s+claim|according\s+to\s+.*who\s+knows)/i,
            description: "Claiming something is true because an 'expert' said so, without evidence."
        },
        {
            id: 'slippery-slope',
            name: 'Slippery Slope',
            pattern: /(if\s+we\s+.*then\s+.*will\s+destroy|lead\s+to\s+disaster|end\s+of\s+.*world)/i,
            description: "Asserting that a relatively small first step will inevitably lead to a chain of related (negative) events."
        }
    ],

    analyze: (text) => {
        const found = [];
        if (!text) return found;

        FallacyService.fallacies.forEach(f => {
            if (f.pattern.test(text)) {
                found.push(f);
            }
        });
        return found;
    }
};
