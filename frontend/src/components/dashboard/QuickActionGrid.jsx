import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import Card from '../ui/Card';
import {
    BookOpen,
    Brain,
    FileText,
    Sparkles,
    Image as ImageIcon,
    Map
} from 'lucide-react';

/**
 * Quick Action Grid - Fast access to main features
 */
export default function QuickActionGrid() {
    const navigate = useNavigate();

    const actions = [
        {
            icon: <Brain size={28} />,
            label: 'AI Quiz Lab',
            description: 'Test your knowledge',
            path: '/quiz',
            color: 'cyan',
            gradient: 'from-cosmic-cyan/20 to-cosmic-cyan/5'
        },
        {
            icon: <FileText size={28} />,
            label: 'PDF Lab',
            description: 'Upload & analyze',
            path: '/pdf',
            color: 'purple',
            gradient: 'from-cosmic-purple/20 to-cosmic-purple/5'
        },
        {
            icon: <BookOpen size={28} />,
            label: 'Flashcards',
            description: 'Memorize faster',
            path: '/flashcards',
            color: 'pink',
            gradient: 'from-cosmic-pink/20 to-cosmic-pink/5'
        },
        {
            icon: <Map size={28} />,
            label: 'Roadmap',
            description: 'Learning paths',
            path: '/roadmap',
            color: 'cyan',
            gradient: 'from-cosmic-cyan/20 to-cosmic-purple/5'
        },
        {
            icon: <Sparkles size={28} />,
            label: 'AI Tutor',
            description: 'Get instant help',
            path: '/chatbot',
            color: 'purple',
            gradient: 'from-cosmic-purple/20 to-cosmic-pink/5'
        },
        {
            icon: <ImageIcon size={28} />,
            label: 'Image Gen',
            description: 'Create visuals',
            path: '/imagine',
            color: 'pink',
            gradient: 'from-cosmic-pink/20 to-cosmic-cyan/5'
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20, scale: 0.95 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1]
            }
        }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
            {actions.map((action, index) => (
                <motion.div key={index} variants={itemVariants}>
                    <ActionCard action={action} onClick={() => navigate(action.path)} />
                </motion.div>
            ))}
        </motion.div>
    );
}

// Individual Action Card
function ActionCard({ action, onClick }) {
    const glowColors = {
        cyan: 'group-hover:shadow-glow-cyan',
        purple: 'group-hover:shadow-glow-purple',
        pink: 'group-hover:shadow-glow-pink'
    };

    return (
        <Card
            variant="glass"
            hover="none"
            onClick={onClick}
            className={`
        group cursor-pointer relative overflow-hidden
        hover:-translate-y-1 transition-all duration-300
        ${glowColors[action.color]}
      `}
        >
            {/* Gradient background on hover */}
            <div className={`
        absolute inset-0 bg-gradient-to-br ${action.gradient}
        opacity-0 group-hover:opacity-100 transition-opacity duration-500
      `} />

            <div className="relative z-10 p-6">
                {/* Icon */}
                <div className="mb-4 relative inline-block">
                    <div className={`
            absolute inset-0 blur-xl rounded-full opacity-0 group-hover:opacity-50 transition-opacity duration-500
            ${action.color === 'cyan' ? 'bg-cosmic-cyan' : action.color === 'purple' ? 'bg-cosmic-purple' : 'bg-cosmic-pink'}
          `} />

                    <div className="relative text-white group-hover:scale-110 transition-transform duration-300">
                        {action.icon}
                    </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-display font-bold text-white mb-1 group-hover:text-cosmic-cyan transition-colors">
                    {action.label}
                </h3>

                <p className="text-sm text-gray-500 font-light">
                    {action.description}
                </p>

                {/* Arrow indicator */}
                <div className="mt-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-cosmic-cyan/50 to-transparent" />
                    <svg className="w-4 h-4 text-cosmic-cyan group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </div>
            </div>
        </Card>
    );
}

ActionCard.propTypes = {
    action: PropTypes.shape({
        icon: PropTypes.node.isRequired,
        label: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        path: PropTypes.string.isRequired,
        color: PropTypes.string.isRequired,
        gradient: PropTypes.string.isRequired
    }).isRequired,
    onClick: PropTypes.func.isRequired
};
