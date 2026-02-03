import { forwardRef } from 'react';
import PropTypes from 'prop-types';

/**
 * Advanced Button Component
 * Variants: primary, secondary, ghost, outline, danger
 * Sizes: sm, md, lg, xl
 * States: loading, disabled
 */
const Button = forwardRef(({
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    fullWidth = false,
    leftIcon,
    rightIcon,
    className = '',
    onClick,
    type = 'button',
    ...props
}, ref) => {
    const baseClasses = 'inline-flex items-center justify-center gap-2 font-display font-semibold rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cosmic-cyan/50 disabled:opacity-50 disabled:cursor-not-allowed';

    const variantClasses = {
        primary: 'bg-gradient-to-r from-cosmic-cyan to-cosmic-cyan/80 text-black hover:shadow-glow-cyan hover:scale-[1.02] active:scale-[0.98]',
        secondary: 'bg-cosmic-purple text-white hover:bg-cosmic-purple/80 hover:shadow-glow-purple',
        ghost: 'bg-transparent text-white hover:bg-white/10',
        outline: 'bg-transparent border-2 border-white/20 text-white hover:bg-white/5 hover:border-white/40',
        danger: 'bg-cosmic-crimson text-white hover:bg-cosmic-crimson/80 hover:shadow-lg'
    };

    const sizeClasses = {
        sm: 'px-4 py-2 text-xs',
        md: 'px-6 py-3 text-sm',
        lg: 'px-8 py-4 text-base',
        xl: 'px-10 py-5 text-lg'
    };

    const widthClass = fullWidth ? 'w-full' : '';

    return (
        <button
            ref={ref}
            type={type}
            disabled={disabled || loading}
            onClick={onClick}
            className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${widthClass}
        ${className}
      `}
            {...props}
        >
            {loading ? (
                <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Loading...</span>
                </>
            ) : (
                <>
                    {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
                    {children}
                    {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
                </>
            )}
        </button>
    );
});

Button.displayName = 'Button';

Button.propTypes = {
    children: PropTypes.node.isRequired,
    variant: PropTypes.oneOf(['primary', 'secondary', 'ghost', 'outline', 'danger']),
    size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
    loading: PropTypes.bool,
    disabled: PropTypes.bool,
    fullWidth: PropTypes.bool,
    leftIcon: PropTypes.node,
    rightIcon: PropTypes.node,
    className: PropTypes.string,
    onClick: PropTypes.func,
    type: PropTypes.oneOf(['button', 'submit', 'reset'])
};

export default Button;
