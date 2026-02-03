import { forwardRef, useState } from 'react';
import { X, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';
import PropTypes from 'prop-types';

/**
 * Enhanced Input Component with advanced features
 * - Inline validation
 * - Character counter
 * - Clear button
 * - Password visibility toggle
 * - Success/error indicators
 */
const EnhancedInput = forwardRef(({
    label,
    type = 'text',
    error,
    success,
    helperText,
    leftIcon,
    rightIcon,
    className = '',
    value,
    onChange,
    onFocus,
    onBlur,
    onClear,
    maxLength,
    showCharCount = false,
    showClearButton = false,
    validation,
    ...props
}, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [internalValue, setInternalValue] = useState(value || '');

    const currentValue = value !== undefined ? value : internalValue;
    const hasValue = currentValue && currentValue.length > 0;
    const showFloatingLabel = isFocused || hasValue;

    const handleFocus = (e) => {
        setIsFocused(true);
        onFocus?.(e);
    };

    const handleBlur = (e) => {
        setIsFocused(false);
        onBlur?.(e);
    };

    const handleChange = (e) => {
        const newValue = e.target.value;
        if (value === undefined) {
            setInternalValue(newValue);
        }
        onChange?.(newValue);
    };

    const handleClear = () => {
        if (value === undefined) {
            setInternalValue('');
        }
        onChange?.('');
        onClear?.();
    };

    const inputType = type === 'password' && showPassword ? 'text' : type;
    const charCount = currentValue?.length || 0;
    const isOverLimit = maxLength && charCount > maxLength;

    return (
        <div className={`relative ${className}`}>
            {/* Glow effect on focus */}
            {isFocused && !error && (
                <div className="absolute -inset-1 bg-gradient-to-r from-cosmic-cyan/20 to-cosmic-purple/20 rounded-2xl blur opacity-50 transition-opacity duration-500" />
            )}

            {/* Input container */}
            <div className={`
                relative flex items-center gap-3 px-5 py-4 rounded-2xl
                bg-white/[0.03] backdrop-blur-xl border transition-all duration-300
                ${error
                    ? 'border-red-500/50 bg-red-500/5'
                    : success
                        ? 'border-green-500/50 bg-green-500/5'
                        : isFocused
                            ? 'border-cosmic-cyan/50'
                            : 'border-white/10'
                }
                ${error ? 'animate-shake' : ''}
            `}>
                {/* Left Icon */}
                {leftIcon && (
                    <span className={`flex-shrink-0 transition-colors ${error ? 'text-red-500' : success ? 'text-green-500' : 'text-gray-500'
                        }`}>
                        {leftIcon}
                    </span>
                )}

                {/* Input field */}
                <div className="flex-1 relative">
                    {label && (
                        <label className={`
                            absolute left-0 transition-all duration-300 pointer-events-none font-sans
                            ${showFloatingLabel
                                ? '-top-6 text-xs text-cosmic-cyan font-medium'
                                : 'top-0 text-base text-gray-500'
                            }
                        `}>
                            {label}
                            {validation?.required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                    )}

                    <input
                        ref={ref}
                        type={inputType}
                        value={currentValue}
                        onChange={handleChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        maxLength={maxLength}
                        className="w-full bg-transparent text-white focus:outline-none placeholder:text-gray-700"
                        aria-invalid={error ? 'true' : 'false'}
                        aria-describedby={error ? `${label}-error` : helperText ? `${label}-helper` : undefined}
                        {...props}
                    />
                </div>

                {/* Right side icons */}
                <div className="flex items-center gap-2 flex-shrink-0">
                    {/* Success indicator */}
                    {success && !error && (
                        <CheckCircle2 size={18} className="text-green-500" />
                    )}

                    {/* Error indicator */}
                    {error && (
                        <AlertCircle size={18} className="text-red-500" />
                    )}

                    {/* Clear button */}
                    {showClearButton && hasValue && !props.disabled && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="text-gray-600 hover:text-white transition-colors"
                            aria-label="Clear input"
                        >
                            <X size={16} />
                        </button>
                    )}

                    {/* Password toggle */}
                    {type === 'password' && (
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-gray-600 hover:text-white transition-colors"
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    )}

                    {/* Custom right icon */}
                    {rightIcon && (
                        <span className="text-gray-500">
                            {rightIcon}
                        </span>
                    )}
                </div>
            </div>

            {/* Bottom section */}
            <div className="mt-2 flex items-start justify-between gap-2">
                {/* Error or Helper Text */}
                <div className="flex-1">
                    {error && (
                        <p id={`${label}-error`} className="text-xs text-red-500 font-medium" role="alert">
                            {error}
                        </p>
                    )}
                    {!error && helperText && (
                        <p id={`${label}-helper`} className="text-xs text-gray-600">
                            {helperText}
                        </p>
                    )}
                </div>

                {/* Character counter */}
                {showCharCount && maxLength && (
                    <span className={`text-xs font-mono ${isOverLimit ? 'text-red-500' : 'text-gray-600'
                        }`}>
                        {charCount}/{maxLength}
                    </span>
                )}
            </div>
        </div>
    );
});

EnhancedInput.displayName = 'EnhancedInput';

EnhancedInput.propTypes = {
    label: PropTypes.string,
    type: PropTypes.string,
    error: PropTypes.string,
    success: PropTypes.bool,
    helperText: PropTypes.string,
    leftIcon: PropTypes.node,
    rightIcon: PropTypes.node,
    className: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onClear: PropTypes.func,
    maxLength: PropTypes.number,
    showCharCount: PropTypes.bool,
    showClearButton: PropTypes.bool,
    validation: PropTypes.shape({
        required: PropTypes.bool,
        minLength: PropTypes.number,
        maxLength: PropTypes.number,
        pattern: PropTypes.instanceOf(RegExp)
    })
};

// Add shake animation to CSS if not exists
if (typeof document !== 'undefined' && !document.getElementById('enhanced-input-animations')) {
    const style = document.createElement('style');
    style.id = 'enhanced-input-animations';
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
    document.head.appendChild(style);
}

export default EnhancedInput;
