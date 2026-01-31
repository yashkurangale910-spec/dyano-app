/**
 * HapticService: Provides tactile feedback using the browser's vibration API.
 */
export const HapticService = {
    /**
     * Trigger a single short vibration
     */
    light: () => {
        if ('vibrate' in navigator) {
            navigator.vibrate(50);
        } else {
            console.log('[Haptic] Light Vibration (fallback)');
        }
    },

    /**
     * Trigger a heavy vibration (e.g., error or boss strike)
     */
    heavy: () => {
        if ('vibrate' in navigator) {
            navigator.vibrate([100, 50, 100]);
        } else {
            console.log('[Haptic] Heavy Vibration (fallback)');
        }
    },

    /**
     * Trigger a success pattern
     */
    success: () => {
        if ('vibrate' in navigator) {
            navigator.vibrate([30, 30, 100]);
        } else {
            console.log('[Haptic] Success Vibration (fallback)');
        }
    },

    /**
     * Trigger an error pattern
     */
    error: () => {
        if ('vibrate' in navigator) {
            navigator.vibrate([200, 100, 200]);
        } else {
            console.log('[Haptic] Error Vibration (fallback)');
        }
    }
};
