/**
 * ExpertModelService: Provides "Golden Path" blueprints for roadmap categories.
 * These blueprints are used for the Cerebral Mesh comparison visualization.
 */
export class ExpertModelService {
    static async getExpertBlueprint(category) {
        // In a production app, this would be fetched from a database of expert-curated paths.
        // For Dyano, we'll provide high-fidelity blueprints for core categories.

        const blueprints = {
            'Frontend': {
                meshNodes: [
                    { id: 'exp-1', title: 'High-Performance DOM', importance: 0.9, depth: 1 },
                    { id: 'exp-2', title: 'Memory Management', importance: 0.8, depth: 2 },
                    { id: 'exp-3', title: 'AST Refactoring', importance: 0.7, depth: 3 },
                    { id: 'exp-4', title: 'Shadow DOM Internals', importance: 0.8, depth: 4 }
                ],
                connections: [
                    ['exp-1', 'exp-2'],
                    ['exp-2', 'exp-3'],
                    ['exp-3', 'exp-4']
                ]
            },
            'Backend': {
                meshNodes: [
                    { id: 'exp-b1', title: 'Distributed Systems', importance: 0.95, depth: 1 },
                    { id: 'exp-b2', title: 'ACID Internals', importance: 0.9, depth: 2 },
                    { id: 'exp-b3', title: 'Consensus Algorithms', importance: 0.85, depth: 3 }
                ],
                connections: [
                    ['exp-b1', 'exp-b2'],
                    ['exp-b2', 'exp-b3']
                ]
            }
        };

        return blueprints[category] || blueprints['Frontend']; // Fallback to Frontend
    }
}
