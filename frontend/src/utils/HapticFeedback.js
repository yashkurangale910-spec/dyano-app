// HapticFeedback.js - "Cinematic Reality" Phase 25
// Interface for Gamepad Vibration & Haptics

export const HapticFeedback = {
    trigger(type = 'impact') {
        const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
        const gamepad = gamepads[0]; // Assume P1

        if (gamepad && gamepad.vibrationActuator) {
            // Real Haptics
            switch (type) {
                case 'heavy':
                    gamepad.vibrationActuator.playEffect("dual-rumble", {
                        startDelay: 0,
                        duration: 300,
                        weakMagnitude: 1.0,
                        strongMagnitude: 1.0
                    });
                    break;
                case 'error':
                    gamepad.vibrationActuator.playEffect("dual-rumble", {
                        startDelay: 0,
                        duration: 100,
                        weakMagnitude: 0.5,
                        strongMagnitude: 0.8
                    });
                    break;
                case 'hover':
                    gamepad.vibrationActuator.playEffect("dual-rumble", {
                        startDelay: 0,
                        duration: 20,
                        weakMagnitude: 0.1,
                        strongMagnitude: 0
                    });
                    break;
                default: // impact
                    gamepad.vibrationActuator.playEffect("dual-rumble", {
                        startDelay: 0,
                        duration: 100,
                        weakMagnitude: 0.5,
                        strongMagnitude: 0.2
                    });
            }
        } else {
            // Simulated Visual Haptics (Screen Shake)
            if (window.navigator.vibrate) {
                // Mobile vibration fallback
                window.navigator.vibrate(type === 'heavy' ? 200 : 50);
            }

            // Dispatch event for UI shake
            window.dispatchEvent(new CustomEvent('haptic-visual', { detail: { type } }));
        }
    }
};
