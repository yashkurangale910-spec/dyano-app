// MemoryDecayWasm.js - Simulated WASM Module
// "Iron Core" Phase 18

// We use a SharedArrayBuffer if available, or fall back to structured cloning.
// In a real WASM implementation, this would be the glue code loading the .wasm file.

const ctx = self;

// "Heap" simulation
let memory = new Float32Array(0);
let retentionBuffer = new Float32Array(0);

ctx.onmessage = (e) => {
    const { type, payload, id } = e.data;

    switch (type) {
        case 'ALLOC':
            // Allocate "WASM" Linear Memory
            // payload = number of nodes
            const size = payload;
            memory = new Float32Array(size); // Stores masteredAt timestamps (as float representations if needed, or just diffs)
            retentionBuffer = new Float32Array(size); // Output buffer
            ctx.postMessage({ type: 'ALLOC_COMPLETE', id });
            break;

        case 'COMPUTE_RETENTION_BATCH':
            // payload: { timestamps: number[], stability: number }
            // In a real WASM app, we'd copy bytes to the heap. Here we just process the array.

            const start = performance.now();
            const now = Date.now();
            const { timestamps, defaultStability } = payload;

            // "AssemblyScript" style optimization loop
            // Unrolled loop for "SIMD-like" simulation
            const len = timestamps.length;
            const output = new Float32Array(len);

            // Constants for Ebbinghaus: R = e^(-t/S)
            // Pre-calculate constants
            const DAY_MS_INV = 1 / 86400000;
            const STABILITY_INV = 1 / defaultStability;

            let i = 0;
            // Unrolled x4
            const len4 = len - 3;
            for (; i < len4; i += 4) {
                // Node 1
                let t1 = (now - timestamps[i]) * DAY_MS_INV;
                output[i] = Math.exp(-t1 * STABILITY_INV);

                // Node 2
                let t2 = (now - timestamps[i + 1]) * DAY_MS_INV;
                output[i + 1] = Math.exp(-t2 * STABILITY_INV);

                // Node 3
                let t3 = (now - timestamps[i + 2]) * DAY_MS_INV;
                output[i + 2] = Math.exp(-t3 * STABILITY_INV);

                // Node 4
                let t4 = (now - timestamps[i + 3]) * DAY_MS_INV;
                output[i + 3] = Math.exp(-t4 * STABILITY_INV);
            }

            // Cleanup remaining
            for (; i < len; i++) {
                let t = (now - timestamps[i]) * DAY_MS_INV;
                output[i] = Math.exp(-t * STABILITY_INV);
            }

            const end = performance.now();

            ctx.postMessage({
                type: 'COMPUTE_COMPLETE',
                payload: output,
                metrics: {
                    executionTime: end - start,
                    opsPerSec: (len / ((end - start) / 1000)) || 0
                },
                id
            });
            break;

        default:
            console.warn('Unknown WASM OpCode:', type);
    }
};
