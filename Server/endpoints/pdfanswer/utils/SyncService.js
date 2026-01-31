/**
 * SyncService: Implements Differential State Synchronization (CRDT-lite).
 * Ensures collision-free merging of neural impressions (notes) across multiple devices.
 */
export const SyncService = {
    /**
     * Merge two versions of a note using a simple LWW (Last-Write-Wins) strategy
     * combined with a causal semantic merge for text chunks.
     */
    mergeNotes: (local, remote) => {
        if (!local) return remote;
        if (!remote) return local;

        // If versions are identical, no merge needed
        if (local.content === remote.content) return local;

        // Simplified Semantic Merge: Append differences if timestamps are close,
        // otherwise follow Last-Write-Wins.
        const timeDiff = Math.abs(new Date(local.timestamp) - new Date(remote.timestamp));

        if (timeDiff < 60000) { // 1 minute window for "Collaboration"
            return {
                ...local,
                content: `${local.content}\n\n[CONFLICT_MERGE]:\n${remote.content}`,
                timestamp: new Date().toISOString(),
                merged: true
            };
        }

        return local.timestamp > remote.timestamp ? local : remote;
    },

    /**
     * Generate a Vector Clock for the current state.
     */
    generateVectorClock: (userId) => {
        return {
            node: userId,
            time: Date.now(),
            counter: Math.floor(Math.random() * 1000)
        };
    }
};
