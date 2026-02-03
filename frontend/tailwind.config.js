/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Ultra-Premium SaaS Palette
                'bg-main': 'var(--bg-main)',
                'bg-surface': 'var(--bg-surface)',
                'bg-surface-light': 'var(--bg-surface-light)',
                'accent-cyan': 'var(--accent-cyan)',
                'accent-indigo': 'var(--accent-indigo)',
                'text-primary': 'var(--text-primary)',
                'text-secondary': 'var(--text-secondary)',
                'text-muted': 'var(--text-muted)',
                'border-subtle': 'var(--border-subtle)',
                'border-medium': 'var(--border-medium)',

                // Legacy cosmic colors (for backward compatibility)
                'cosmic-void': 'var(--cosmic-void)',
                'cosmic-deep': 'var(--cosmic-deep)',
                'cosmic-nebula': 'var(--cosmic-nebula)',
                'cosmic-purple': 'var(--cosmic-purple)',
                'cosmic-pink': 'var(--cosmic-pink)',
                'cosmic-cyan': 'var(--cosmic-cyan)',
                'cosmic-gold': 'var(--cosmic-gold)',
            },
            fontFamily: {
                header: ['var(--font-header)', 'sans-serif'],
                body: ['var(--font-body)', 'sans-serif'],
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'spin-slow': 'spin 8s linear infinite',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                }
            },
            boxShadow: {
                'glow-cyan': '0 0 20px rgba(0, 245, 255, 0.15)',
                'glow-indigo': '0 0 20px rgba(99, 102, 241, 0.15)',
                // Legacy glow variants
                'glow-purple': '0 0 30px rgba(123, 44, 191, 0.3)',
                'glow-pink': '0 0 30px rgba(224, 170, 255, 0.3)',
            }
        },
    },
    plugins: [],
}
