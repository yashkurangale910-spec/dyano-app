// ArweaveMock.js - "The Finale" Phase 26
// Simulates Immutable Permaweb Storage

export const ArweaveMock = {
    async mint(data) {
        // Simulating Proof-of-Access Calculation
        await new Promise(resolve => setTimeout(resolve, 800));

        // Simulating Block Mining
        await new Promise(resolve => setTimeout(resolve, 1200));

        // Generate mock Transaction ID
        const txId = Array.from({ length: 43 }, () =>
            "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_"[Math.floor(Math.random() * 64)]
        ).join('');

        return {
            id: txId,
            status: 200,
            statusText: 'OK',
            cost: '0.0000042 AR'
        };
    },

    async getStatus(txId) {
        return {
            status: 200,
            confirmed: {
                block_height: 124590,
                block_indep_hash: 'mock_hash_xyz',
                number_of_confirmations: Math.floor(Math.random() * 20)
            }
        };
    }
};
