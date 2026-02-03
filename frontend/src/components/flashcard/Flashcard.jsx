import { motion } from 'framer-motion';
import { Sparkles, HelpCircle } from 'lucide-react';
import LuxuryCard, { LuxuryContent } from '../ui/LuxuryCard';

export default function Flashcard({ card, isFlipped, onFlip }) {
    return (
        <div
            className="relative w-full max-w-2xl h-[400px] [perspective:1000px] cursor-pointer group"
            onClick={onFlip}
        >
            <motion.div
                className="relative w-full h-full [transform-style:preserve-3d]"
                initial={false}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
                {/* FRONT FACE */}
                <div className="absolute inset-0 [backface-visibility:hidden]">
                    <LuxuryCard
                        variant="default"
                        className="w-full h-full border-t-2 border-t-accent-cyan"
                    >
                        <LuxuryContent className="w-full h-full flex flex-col items-center justify-center text-center p-12">
                            <HelpCircle className="text-white/5 absolute top-8 left-8" size={32} />
                            <span className="text-[10px] uppercase font-black tracking-[0.4em] text-text-muted mb-8">System // Query</span>
                            <h2 className="text-3xl md:text-5xl font-black text-white leading-tight tracking-tighter">
                                {card.front}
                            </h2>
                            <div className="absolute bottom-12 text-[10px] uppercase tracking-widest text-text-muted font-bold group-hover:text-accent-cyan transition-colors">
                                [ Click to Reveal ]
                            </div>
                        </LuxuryContent>
                    </LuxuryCard>
                </div>

                {/* BACK FACE */}
                <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                    <LuxuryCard
                        variant="glass"
                        className="w-full h-full border-t-2 border-t-white"
                    >
                        <LuxuryContent className="w-full h-full flex flex-col items-center justify-center text-center p-12">
                            <Sparkles className="text-white/5 absolute top-8 left-8" size={32} />
                            <span className="text-[10px] uppercase font-black tracking-[0.4em] text-text-muted mb-8">Neural // Result</span>
                            <p className="text-xl md:text-2xl font-light text-text-secondary leading-relaxed italic">
                                {card.back}
                            </p>
                        </LuxuryContent>
                    </LuxuryCard>
                </div>
            </motion.div>
        </div>
    );
}
