// BiometricGuard.js - "Mental Callus" Phase 24
// Simulates Gaze Detection & User Attention Monitoring

export const BiometricGuard = {
    isActive: false,
    penaltyCallback: null,

    // Config
    attentionThreshold: 3000, // 3 seconds of "looking away"
    lastGazeTime: Date.now(),
    checkInterval: null,

    start(onPenalty) {
        this.isActive = true;
        this.penaltyCallback = onPenalty;
        this.lastGazeTime = Date.now();

        // Listeners for "Presumed Attention"
        window.addEventListener('mousemove', this.resetGaze);
        window.addEventListener('keydown', this.resetGaze);
        window.addEventListener('scroll', this.resetGaze);
        document.addEventListener('visibilitychange', this.handleVisibilityChange);

        // Simulated Gaze Loop
        this.checkInterval = setInterval(() => {
            const timeSinceGaze = Date.now() - this.lastGazeTime;

            if (timeSinceGaze > this.attentionThreshold) {
                // User is "looking away" (simulated by lack of input)
                this.triggerPenalty("GAZE_LOST");
            }
        }, 1000);
    },

    stop() {
        this.isActive = false;
        if (this.checkInterval) clearInterval(this.checkInterval);
        window.removeEventListener('mousemove', this.resetGaze);
        window.removeEventListener('keydown', this.resetGaze);
        window.removeEventListener('scroll', this.resetGaze);
        document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    },

    resetGaze: () => {
        BiometricGuard.lastGazeTime = Date.now();
    },

    handleVisibilityChange: () => {
        if (document.hidden) {
            BiometricGuard.triggerPenalty("TAB_SWITCH");
        }
    },

    triggerPenalty(reason) {
        if (this.penaltyCallback && this.isActive) {
            this.penaltyCallback(reason);
            // Reset to prevent spamming
            this.lastGazeTime = Date.now();
        }
    }
};
