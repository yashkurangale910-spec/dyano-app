import { motion } from 'framer-motion';
import { Target, Clock, BarChart, ChevronRight } from 'lucide-react';
import LuxuryCard, { LuxuryContent } from '../ui/LuxuryCard';

export default function QuizTopicSelector({ topics, onSelect }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {topics.map((topic, index) => (
                <motion.div
                    key={topic.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={index === 0 ? "md:col-span-8" : "md:col-span-4"}
                >
                    <LuxuryCard
                        variant="glass"
                        className="h-full group"
                        onClick={() => onSelect(topic.id)}
                    >
                        <LuxuryContent className={index === 0 ? 'p-10 md:p-14' : 'p-8'}>
                            <div className={`flex flex-col h-full justify-between`}>
                                <div>
                                    <div className="flex justify-between items-start mb-10">
                                        <div className="p-4 rounded-3xl bg-white/5 group-hover:bg-white/10 transition-colors">
                                            <Target className={`w-8 h-8 text-cosmic-${topic.color}`} strokeWidth={1} />
                                        </div>
                                        <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-600">
                                            Topic // 0{index + 1}
                                        </span>
                                    </div>

                                    <h3 className={`font-display font-bold text-white mb-6 tracking-tighter leading-tight ${index === 0 ? 'text-4xl md:text-5xl' : 'text-2xl'}`}>
                                        {topic.title}
                                    </h3>

                                    <div className="flex gap-8 mb-10">
                                        <div className="flex items-center gap-3">
                                            <Clock className="w-4 h-4 text-gray-600" />
                                            <span className="text-xs uppercase tracking-widest text-gray-500">{topic.duration}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <BarChart className="w-4 h-4 text-gray-600" />
                                            <span className="text-xs uppercase tracking-widest text-gray-500">{topic.difficulty}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-8 border-t border-white/5 opacity-40 group-hover:opacity-100 transition-opacity">
                                    <span className="text-[10px] font-mono tracking-widest font-bold text-cosmic-cyan">START QUIZ SEQUENCE</span>
                                    <ChevronRight className="w-5 h-5 text-cosmic-cyan group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </LuxuryContent>
                    </LuxuryCard>
                </motion.div>
            ))}
        </div>
    );
}
