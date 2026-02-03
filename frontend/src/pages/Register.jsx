import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Terminal } from 'lucide-react';
import LuxuryCard, { LuxuryContent } from '../components/ui/LuxuryCard';
import BaseButton from '../components/ui/BaseButton';

export default function Register() {
    const navigate = useNavigate();

    return (
        <div className="flex items-center justify-center min-h-[85vh] p-6">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <header className="text-center mb-12">
                    <div className="w-12 h-12 rounded-xl bg-white flex-center text-black mx-auto mb-6">
                        <Terminal size={24} strokeWidth={3} />
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tighter mb-2">Create Identity.</h1>
                    <p className="text-text-muted font-light">Join the Dyano network to accelerate your learning trajectory.</p>
                </header>

                <LuxuryCard variant="default">
                    <LuxuryContent className="py-10">
                        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); navigate('/dashboard'); }}>

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-text-muted font-black">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                                    <input
                                        type="text"
                                        placeholder="John Wick"
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:border-accent-cyan outline-none transition-all placeholder:text-text-muted"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-text-muted font-black">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                                    <input
                                        type="email"
                                        placeholder="user@example.com"
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:border-accent-cyan outline-none transition-all placeholder:text-text-muted"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-text-muted font-black">Security Key</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:border-accent-cyan outline-none transition-all placeholder:text-text-muted"
                                        required
                                    />
                                </div>
                            </div>

                            <BaseButton type="submit" className="w-full py-6">
                                Establish Connectivity
                            </BaseButton>
                        </form>

                        <footer className="mt-8 text-center">
                            <p className="text-[10px] font-black tracking-widest text-text-muted uppercase">
                                Existing unit?{' '}
                                <Link to="/login" className="text-white hover:text-accent-cyan transition-colors">
                                    Re-authenticate Terminal
                                </Link>
                            </p>
                        </footer>
                    </LuxuryContent>
                </LuxuryCard>
            </motion.div>
        </div>
    );
}
