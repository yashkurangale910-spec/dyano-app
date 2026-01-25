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
                onLaunch={() => navigate('/dashboard')}
                onSignIn={() => navigate('/login')}
            />

            <FeatureGrid features={LANDING_FEATURES} />

            <StatsGrid stats={LANDING_STATS} />

            {/* Final Outro */}
            <section className="py-60 text-center container-cosmic">
                <div className="max-w-2xl mx-auto">
                    <h2 className="text-5xl md:text-7xl font-display font-bold mb-10 text-white tracking-tighter leading-tight">
                        The universe is <br />
                        <span className="text-gradient-cosmic italic">waiting.</span>
                    </h2>
                    <ParticleButton size="lg" onClick={() => navigate('/register')} className="rounded-none px-16">
                        Enter Orbit
                    </ParticleButton>
                </div>
            </section>
        </div>
    );
}
