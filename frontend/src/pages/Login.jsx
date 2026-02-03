import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Terminal } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LuxuryCard, { LuxuryContent } from '../components/ui/LuxuryCard';
import BaseButton from '../components/ui/BaseButton';

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        const result = await login({ email, password });
        setIsLoading(false);
        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.message);
        }
    };

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
                    <h1 className="text-3xl font-black text-white tracking-tighter mb-2">Access Terminal.</h1>
                    <p className="text-text-muted font-light">Enter your credentials to synchronize with Dyano.</p>
                </header>

                <LuxuryCard variant="default">
                    <LuxuryContent className="py-10">
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            {error && (
                                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] uppercase tracking-widest font-black">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-text-muted font-black">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                                    <input
                                        type="email"
                                        placeholder="user@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:border-accent-cyan outline-none transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-[10px] uppercase tracking-widest text-text-muted font-black">Security Key</label>
                                    <button type="button" className="text-[9px] uppercase tracking-widest text-text-muted hover:text-white transition-colors">Recover</button>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:border-accent-cyan outline-none transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            <BaseButton type="submit" loading={isLoading} className="w-full py-6">
                                Connect to Network
                            </BaseButton>
                        </form>

                        <footer className="mt-8 text-center">
                            <p className="text-[10px] font-black tracking-widest text-text-muted uppercase">
                                No Identity?{' '}
                                <Link to="/register" className="text-white hover:text-accent-cyan transition-colors">
                                    Initialize Registration
                                </Link>
                            </p>
                        </footer>
                    </LuxuryContent>
                </LuxuryCard>
            </motion.div>
        </div>
    );
}
