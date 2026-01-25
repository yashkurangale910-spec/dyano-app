import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, ShieldCheck } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import ParticleButton from '../components/ui/ParticleButton';
import CosmicInput from '../components/ui/CosmicInput';

export default function Register() {
    const navigate = useNavigate();

    return (
        <div className="flex items-center justify-center min-h-[85vh] p-4">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="w-full max-w-xl grid grid-cols-1 lg:grid-cols-12 gap-12"
            >
                {/* Asymmetric Side Brand */}
                <div className="lg:col-span-4 hidden lg:flex flex-col justify-center border-r border-white/5 pr-12">
                    <ShieldCheck className="w-12 h-12 text-cosmic-cyan mb-6" strokeWidth={1} />
                    <h1 className="text-4xl font-display font-bold text-white mb-4 leading-tight">Create Identity</h1>
                    <p className="text-xs uppercase tracking-[0.3em] font-bold text-gray-600 leading-loose">
                        Authorization Protocol <br />
                        DYANO // NODE_V1
                    </p>
                </div>

                <div className="lg:col-span-8">
                    <GlassCard className="p-10" glow glowColor="purple">
                        <header className="mb-10 lg:hidden">
                            <h1 className="text-3xl font-display font-bold text-white mb-2">Create Identity</h1>
                            <div className="w-8 h-[1px] bg-cosmic-cyan"></div>
                        </header>

                        <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); navigate('/dashboard'); }}>
                            <CosmicInput
                                label="Legal Alias"
                                icon={User}
                                placeholder="Ex. Arthur Dent"
                                required
                            />

                            <CosmicInput
                                label="Neural Identifier"
                                type="email"
                                icon={Mail}
                                placeholder="name@universe.com"
                                required
                            />

                            <CosmicInput
                                label="Security Key"
                                type="password"
                                icon={Lock}
                                placeholder="••••••••"
                                required
                            />

                            <div className="pt-4">
                                <ParticleButton className="w-full py-5 rounded-none tracking-[0.3em] font-bold text-xs uppercase">
                                    Establish Connection
                                </ParticleButton>
                            </div>
                        </form>

                        <footer className="mt-10 text-center lg:text-left">
                            <p className="text-xs font-mono tracking-widest text-gray-600 uppercase">
                                Existing unit?{' '}
                                <Link to="/login" className="text-cosmic-cyan hover:text-white transition-colors">
                   // Re-authenticate
                                </Link>
                            </p>
                        </footer>
                    </GlassCard>
                </div>
            </motion.div>
        </div>
    );
}
