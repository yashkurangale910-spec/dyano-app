import { motion } from 'framer-motion';

export default function CosmicInput({ label, icon: Icon, type = "text", placeholder, required = false, ...props }) {
    return (
        <div className="space-y-3 group text-left">
            <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-600 ml-1 group-focus-within:text-cosmic-cyan transition-colors">
                {label}
            </label>
            <div className="relative">
                {Icon && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none pr-4 border-r border-white/5 group-focus-within:border-cosmic-cyan/30 transition-colors">
                        <Icon className="w-4 h-4 text-gray-600 group-focus-within:text-cosmic-cyan transition-colors" strokeWidth={1.5} />
                    </div>
                )}
                <input
                    type={type}
                    placeholder={placeholder}
                    required={required}
                    className={`
                        w-full bg-white/[0.03] border-b border-white/10 rounded-t-lg py-5 
                        ${Icon ? 'pl-16' : 'px-6'} pr-6 text-white 
                        placeholder:text-gray-700 font-light tracking-wide
                        focus:outline-none focus:bg-white/[0.06] focus:border-cosmic-cyan
                        transition-all duration-500
                    `}
                    {...props}
                />

                {/* Subtle Grain Overlay on focus */}
                <div className="absolute inset-0 grain-overlay opacity-0 group-focus-within:opacity-[0.05] pointer-events-none transition-opacity duration-700" />
            </div>
        </div>
    );
}
