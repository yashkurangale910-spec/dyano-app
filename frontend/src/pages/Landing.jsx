import { useNavigate } from 'react-router-dom';

// Components
import HeroSection from '../components/landing/HeroSection';
import FeatureGrid from '../components/landing/FeatureGrid';
import StatsGrid from '../components/landing/StatsGrid';
import ParticleButton from '../components/ui/ParticleButton';

// Data & Hooks
import { HERO_CONTENT, LANDING_FEATURES, LANDING_STATS } from '../constants/landingContent';
import useScrollParallax from '../hooks/useScrollParallax';

export default function Landing() {
    const navigate = useNavigate();
    useScrollParallax();

    return (
        <div className="w-full">
            <HeroSection
                content={HERO_CONTENT}
                onLaunch={(topic) => topic ? navigate(`/quiz?topic=${encodeURIComponent(topic)}`) : navigate('/dashboard')}
                onSignIn={() => navigate('/login')}
            />

            <FeatureGrid features={LANDING_FEATURES} />

            <StatsGrid stats={LANDING_STATS} />

            {/* Final Outro Synthesis */}
            <section className="py-80 relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cosmic-cyan/5 blur-[120px] rounded-full pointer-events-none" />

                <div className="container-cosmic relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                        className="max-w-4xl mx-auto"
                    >
                        <div className="inline-flex items-center gap-3 mb-12 px-4 py-2 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-3xl">
                            <Rocket size={14} className="text-cosmic-pink" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">[EXP_NOD_01] Final Synthesis</span>
                        </div>

                        <h2 className="text-7xl md:text-9xl font-display font-black text-white mb-16 tracking-[-0.06em] leading-[0.85]">
                            The universe is <br />
                            <span className="text-gradient-kinetic italic">Waiting.</span>
                        </h2>

                        <div className="flex flex-col items-center gap-8">
                            <ParticleButton size="lg" onClick={() => navigate('/register')} className="px-20 py-6 text-xs uppercase tracking-[0.4em] font-black shadow-glow-cyan border-none">
                                Initialize Vector
                            </ParticleButton>

                            <div className="text-[8px] font-mono text-gray-700 tracking-[0.5em] uppercase">
                                Transmission Stable // Node-7 Ready
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
