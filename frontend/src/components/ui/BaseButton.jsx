import { forwardRef, useRef } from 'react';
import { motion, useSpring } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useMagnetic } from '../../hooks/useMagnetic';

const BaseButton = forwardRef(({
    children,
    variant = 'primary', // 'primary', 'secondary', 'ghost', 'outline', 'destructive'
    size = 'md', // 'sm', 'md', 'lg', 'xl'
    loading = false,
    leftIcon,
    rightIcon,
    className = '',
    disabled,
    magnetic = true,
    ...props
}, forwardedRef) => {
    const { ref: magneticRef, x, y, handleMouseMove, handleMouseLeave } = useMagnetic();
    const baseStyles = `
        relative inline-flex items-center justify-center gap-2 font-semibold 
        transition-all duration-300 rounded-xl overflow-hidden 
        disabled:opacity-50 disabled:cursor-not-allowed
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cosmic-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-cosmic-void
    `;

    const variants = {
        primary: `
            bg-white text-black 
            hover:bg-slate-200
            active:scale-[0.98]
        `,
        secondary: `
            bg-white/5 text-white border border-white/10 
            hover:bg-white/10 hover:border-white/20
            active:scale-[0.98]
        `,
        ghost: `
            bg-transparent text-slate-500 
            hover:text-white hover:bg-white/5
            active:bg-white/10
        `,
        outline: `
            bg-transparent border border-white/20 text-white 
            hover:bg-white/5 hover:border-white/40
            active:bg-white/10
        `,
        destructive: `
            bg-red-500/10 text-red-500 border border-red-500/20
            hover:bg-red-500/20 hover:border-red-500/30
            active:bg-red-500/30
        `
    };

    const sizes = {
        sm: "px-3 py-1.5 text-xs min-h-[32px]",
        md: "px-5 py-2.5 text-sm min-h-[40px]",
        lg: "px-8 py-3.5 text-base min-h-[48px]",
        xl: "px-10 py-4 text-lg min-h-[56px]"
    };

    const isDisabled = disabled || loading;

    return (
        <motion.button
            ref={(node) => {
                magneticRef.current = node;
                if (forwardedRef) {
                    if (typeof forwardedRef === 'function') forwardedRef(node);
                    else forwardedRef.current = node;
                }
            }}
            onMouseMove={magnetic && !isDisabled ? handleMouseMove : undefined}
            onMouseLeave={magnetic && !isDisabled ? handleMouseLeave : undefined}
            style={{ x: magnetic ? x : 0, y: magnetic ? y : 0 }}
            whileHover={!isDisabled ? {
                scale: 1.02,
                transition: { type: "spring", stiffness: 400, damping: 10 }
            } : {}}
            whileTap={!isDisabled ? {
                scale: 0.98,
                transition: { type: "spring", stiffness: 400, damping: 10 }
            } : {}}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`
                ${baseStyles}
                ${variants[variant]}
                ${sizes[size]}
                ${className}
            `}
            disabled={isDisabled}
            aria-busy={loading}
            {...props}
        >
            {/* Phase III: Glossy Reflection Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-tr from-transparent via-white to-transparent" style={{ transform: 'rotate(25deg) translateY(-50%)' }} />

            {loading ? (
                <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Processing...</span>
                </>
            ) : (
                <>
                    {leftIcon && <span className="flex-shrink-0 relative z-10">{leftIcon}</span>}
                    <span className="relative z-10">{children}</span>
                    {rightIcon && <span className="flex-shrink-0 relative z-10">{rightIcon}</span>}
                </>
            )}
        </motion.button>
    );
});

BaseButton.displayName = 'BaseButton';

export default BaseButton;
