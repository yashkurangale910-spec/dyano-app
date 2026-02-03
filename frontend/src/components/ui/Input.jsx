import { forwardRef, useState } from 'react';
import PropTypes from 'prop-types';

/**
 * Enhanced Input Component
 * Features: floating label, error states, icon support, focus glow
 */
const Input = forwardRef(({
    label,
    type = 'text',
    error,
    helperText,
    leftIcon,
    rightIcon,
    className = '',
    onFocus,
    onBlur,
    ...props
}, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(false);

    const handleFocus = (e) => {
        setIsFocused(true);
        onFocus?.(e);
    };

    const handleBlur = (e) => {
        setIsFocused(false);
        setHasValue(e.target.value.length > 0);
        onBlur?.(e);
    };

    const showFloatingLabel = isFocused || hasValue;

    return (
        <div className={`relative ${className}`}>
            {/* Glow effect on focus */}
            {isFocused && (
                <div className="absolute -inset-1 bg-gradient-to-r from-cosmic-cyan/20 to-cosmic-purple/20 rounded-2xl blur opacity-50 transition-opacity duration-500" />
            )}

            {/* Input container */}
            <div className={`
        relative flex items-center gap-3 px-5 py-4 rounded-2xl
        bg-white/[0.03] backdrop-blur-xl border transition-all duration-300
        ${error ? 'border-cosmic-crimson' : isFocused ? 'border-cosmic-cyan/50' : 'border-white/10'}
        ${error ? 'animate-shake' : ''}
      `}>
                {/* Left Icon */}
                {leftIcon && (
                    <span className="flex-shrink-0 text-gray-500">
                        {leftIcon}
                    </span>
                )}

                {/* Input field */}
                <div className="flex-1 relative">
                    {label && (
                        <label className={`
              absolute left-0 transition-all duration-300 pointer-events-none font-sans
              ${showFloatingLabel
                                ? '-top-6 text-xs text-cosmic-cyan'
                                : 'top-0 text-base text-gray-500'
                            }
            `}>
                            {label}
                        </label>
                    )}

                    <input
                        ref={ref}
                        type={type}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        className="w-full bg-transparent text-white focus:outline-none placeholder:text-gray-700"
                        {...props}
                    />
                </div>

                {/* Right Icon */}
                {rightIcon && (
                    <span className="flex-shrink-0 text-gray-500">
                        {rightIcon}
                    </span>
                )}
            </div>

            {/* Error or Helper Text */}
            {(error || helperText) && (
                <p className={`mt-2 text-xs font-sans ${error ? 'text-cosmic-crimson' : 'text-gray-600'}`}>
                    {error || helperText}
                </p>
            )}
        </div>
    );
});

Input.displayName = 'Input';

Input.propTypes = {
    label: PropTypes.string,
    type: PropTypes.string,
    error: PropTypes.string,
    helperText: PropTypes.string,
    leftIcon: PropTypes.node,
    rightIcon: PropTypes.node,
    className: PropTypes.string,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func
};

// Add shake animation to CSS if not exists
const style = document.createElement('style');
style.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-10px); }
    75% { transform: translateX(10px); }
  }
  .animate-shake {
    animation: shake 0.3s ease-in-out;
  }
`;
if (typeof document !== 'undefined' && !document.getElementById('input-animations')) {
    style.id = 'input-animations';
    document.head.appendChild(style);
}

export default Input;
