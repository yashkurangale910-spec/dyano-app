import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Zap } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import ParticleButton from '../components/ui/ParticleButton';
import CosmicInput from '../components/ui/CosmicInput';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const result = await login({ email, password });
        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[85vh] p-4">
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="w-full max-w-xl grid grid-cols-1 lg:grid-cols-12 gap-12"
            >
                <div className="lg:col-span-8">
                    <GlassCard className="p-10" glow glowColor="cyan">
                        <header className="mb-10 lg:hidden">
                            <h1 className="text-3xl font-display font-bold text-white mb-2">Re-Authenticate</h1>
                            <div className="w-8 h-[1px] bg-cosmic-pink"></div>
                        </header>

                        <form className="space-y-8" onSubmit={handleSubmit}>
                            {error && (
                                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs uppercase tracking-widest font-bold">
                                    {error}
                                </div>
                            )}
                            <CosmicInput
                                label="Neural Identifier"
                                type="email"
                                icon={Mail}
                                placeholder="name@universe.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />

                            <div className="space-y-2">
                                <div className="flex justify-between items-center px-1">
                                    <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-700">Password</span>
                                    <button type="button" className="text-[9px] uppercase tracking-widest text-cosmic-pink/50 hover:text-cosmic-pink transition-colors">Lost Key?</button>
                                </div>
                                <CosmicInput
                                    label="" // Hidden but structure kept
                                    type="password"
                                    icon={Lock}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="pt-4">
                                <ParticleButton className="w-full py-5 rounded-none tracking-[0.3em] font-bold text-xs uppercase">
                                    Warp to Dashboard
                                </ParticleButton>
                            </div>
                        </form>

                        <footer className="mt-10 text-center lg:text-left">
                            <p className="text-xs font-mono tracking-widest text-gray-600 uppercase">
                                New Identity?{' '}
                                <Link to="/register" className="text-cosmic-pink hover:text-white transition-colors">
                   // Create Orbit
                                </Link>
                            </p>
                        </footer>
                    </GlassCard>
                </div>

                {/* Asymmetric Side Brand */}
                <div className="lg:col-span-4 hidden lg:flex flex-col justify-center border-l border-white/5 pl-12 order-first lg:order-last">
                    <Zap className="w-12 h-12 text-cosmic-pink mb-6" strokeWidth={1} />
                    <h1 className="text-4xl font-display font-bold text-white mb-4 leading-tight">Sync Stream</h1>
                    <p className="text-xs uppercase tracking-[0.3em] font-bold text-gray-600 leading-loose">
                        Transmission Link <br />
                        DYANO // NODE_V1
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
