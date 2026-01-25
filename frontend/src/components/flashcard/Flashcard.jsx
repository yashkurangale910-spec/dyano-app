import { motion } from 'framer-motion';
import { Sparkles, HelpCircle } from 'lucide-react';
import GlassCard from '../ui/GlassCard';

export default function Flashcard({ card, isFlipped, onFlip }) {
    return (
        <div
            className="relative w-full max-w-2xl h-[400px] perspective-1000 cursor-pointer group"
            onClick={onFlip}
        >
            <motion.div
                className="relative w-full h-full transition-all duration-700 preserve-3d"
                initial={false}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
                {/* FRONT FACE */}
                <div className="absolute inset-0 backface-hidden">
                    <GlassCard
                        className="w-full h-full flex flex-col items-center justify-center text-center p-12 border-t-4 border-t-cosmic-cyan"
                        glow
                        glowColor="cyan"
                    >
                        <HelpCircle className="text-cosmic-cyan/20 absolute top-8 left-8" size={32} />
                        <span className="text-[10px] uppercase font-bold tracking-[0.5em] text-gray-600 mb-8">Prompt // Query</span>
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-white leading-tight">
                            {card.front}
                        </h2>
                        <div className="absolute bottom-12 text-[10px] uppercase tracking-widest text-cosmic-cyan/40 font-bold group-hover:text-cosmic-cyan transition-colors">
                            [ Tap to Decipher ]
                        </div>
                    </GlassCard>
                </div>

                {/* BACK FACE */}
                <div className="absolute inset-0 backface-hidden [transform:rotateY(180deg)]">
                    <GlassCard className="w-full h-full flex flex-col items-center justify-center text-center p-12 border-t-4 border-t-cosmic-pink bg-cosmic-deep/80">
                        <Sparkles className="text-cosmic-pink/20 absolute top-8 left-8" size={32} />
                        <span className="text-[10px] uppercase font-bold tracking-[0.5em] text-gray-600 mb-8">System // Result</span>
                        <p className="text-xl md:text-2xl font-light text-gray-200 leading-relaxed italic">
                            "{card.back}"
                        </p>
                    </GlassCard>
                </div>
            </motion.div>
        </div>
    );
}
