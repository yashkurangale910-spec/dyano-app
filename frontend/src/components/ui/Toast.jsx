import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useState, useEffect } from 'react';

/**
 * Enhanced toast notification system
 * Provides rich feedback with actions and auto-dismiss
 */
const toastVariants = {
    success: {
        icon: CheckCircle2,
        bgClass: 'bg-green-500/10 border-green-500/30',
        iconClass: 'text-green-500'
    },
    error: {
        icon: AlertCircle,
        bgClass: 'bg-red-500/10 border-red-500/30',
        iconClass: 'text-red-500'
    },
    info: {
        icon: Info,
        bgClass: 'bg-blue-500/10 border-blue-500/30',
        iconClass: 'text-blue-500'
    },
    warning: {
        icon: AlertCircle,
        bgClass: 'bg-yellow-500/10 border-yellow-500/30',
        iconClass: 'text-yellow-500'
    }
};

export function Toast({
    id,
    type = 'info',
    title,
    description,
    action,
    duration = 5000,
    persistent = false,
    onClose
}) {
    const [progress, setProgress] = useState(100);
    const variant = toastVariants[type];
    const Icon = variant.icon;

    useEffect(() => {
        if (persistent) return;

        const interval = setInterval(() => {
            setProgress((prev) => {
                const newProgress = prev - (100 / (duration / 100));
                if (newProgress <= 0) {
                    onClose(id);
                    return 0;
                }
                return newProgress;
            });
        }, 100);

        return () => clearInterval(interval);
    }, [duration, persistent, id, onClose]);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            className={`
        relative w-full max-w-md p-4 rounded-xl border backdrop-blur-xl
        ${variant.bgClass}
        shadow-lg
      `}
        >
            <div className="flex items-start gap-3">
                {/* Icon */}
                <div className={`flex-shrink-0 ${variant.iconClass}`}>
                    <Icon size={20} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    {title && (
                        <p className="font-bold text-white text-sm mb-1">
                            {title}
                        </p>
                    )}
                    {description && (
                        <p className="text-gray-400 text-sm leading-relaxed">
                            {description}
                        </p>
                    )}

                    {/* Action Button */}
                    {action && (
                        <button
                            onClick={() => {
                                action.onClick();
                                if (!persistent) onClose(id);
                            }}
                            className="mt-2 text-xs font-bold text-cosmic-cyan hover:text-cosmic-cyan/80 transition-colors uppercase tracking-wider"
                        >
                            {action.label}
                        </button>
                    )}
                </div>

                {/* Close Button */}
                <button
                    onClick={() => onClose(id)}
                    className="flex-shrink-0 text-gray-600 hover:text-white transition-colors"
                >
                    <X size={16} />
                </button>
            </div>

            {/* Progress Bar */}
            {!persistent && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5 rounded-b-xl overflow-hidden">
                    <motion.div
                        className={`h-full ${variant.iconClass.replace('text-', 'bg-')}`}
                        style={{ width: `${progress}%` }}
                        transition={{ duration: 0.1, ease: 'linear' }}
                    />
                </div>
            )}
        </motion.div>
    );
}

/**
 * Toast container component
 */
export function ToastContainer({ toasts, onClose }) {
    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 pointer-events-none">
            <AnimatePresence mode="popLayout">
                {toasts.map((toast) => (
                    <div key={toast.id} className="pointer-events-auto">
                        <Toast {...toast} onClose={onClose} />
                    </div>
                ))}
            </AnimatePresence>
        </div>
    );
}

/**
 * Toast hook for managing toast state
 */
let toastId = 0;

export function useToast() {
    const [toasts, setToasts] = useState([]);

    const addToast = (toast) => {
        const id = toastId++;
        setToasts((prev) => [...prev, { ...toast, id }]);
        return id;
    };

    const removeToast = (id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    const toast = {
        success: (title, options = {}) =>
            addToast({ type: 'success', title, ...options }),

        error: (title, options = {}) =>
            addToast({ type: 'error', title, ...options }),

        info: (title, options = {}) =>
            addToast({ type: 'info', title, ...options }),

        warning: (title, options = {}) =>
            addToast({ type: 'warning', title, ...options }),

        custom: (options) =>
            addToast(options)
    };

    return {
        toast,
        toasts,
        removeToast
    };
}

// Export a singleton instance for global use
let globalToastFn = null;

export function setGlobalToast(toastFn) {
    globalToastFn = toastFn;
}

export const toast = {
    success: (title, options) => globalToastFn?.success(title, options),
    error: (title, options) => globalToastFn?.error(title, options),
    info: (title, options) => globalToastFn?.info(title, options),
    warning: (title, options) => globalToastFn?.warning(title, options)
};
