import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Sparkles, Download, RefreshCw, Image as ImageIcon, Loader2, Zap } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import PageHeader from '../components/ui/PageHeader';
import Breadcrumbs from '../components/ui/Breadcrumbs';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3005';

export default function ImageGen() {
    const { t } = useTranslation();
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [result, setResult] = useState(null);

    const handleGenerate = async (e) => {
        if (e) e.preventDefault();
        if (!prompt.trim()) return;

        setIsGenerating(true);
        setResult(null);

        try {
            const userStr = localStorage.getItem('dyano_user');
            const token = userStr ? JSON.parse(userStr).token : null;

            const response = await axios.post(`${API_URL}/img`, {
                prompt: prompt
            }, {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });

            if (response.data) {
                setResult(response.data);
                toast.success('Visual artifact synthesized.');
            }
        } catch (error) {
            console.error(error);
            toast.error('Synthesis protocol failed.');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="w-full relative min-h-screen">
            <main className="py-20 relative z-10">
                <div className="container-monolith">
                    <Breadcrumbs />

                    <motion.div layoutId="card-imagine">
                        <PageHeader
                            title="Neural Visualizer"
                            subtitle="Convert conceptual abstracts into high-fidelity optic arrays using quantum generation."
                            helpText="Powered by FLUX-REALISM for 1024x1024 precision synthesis."
                        />
                    </motion.div>

                    {/* Input Section - Minimalist */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-24"
                    >
                        <form onSubmit={handleGenerate} className="max-w-3xl mx-auto relative group">
                            <div className="relative flex items-center bg-white/[0.01] border border-white/5 rounded-[2.5rem] p-3 pr-4 group-focus-within:border-white/20 transition-all duration-700 shadow-2xl">
                                <input
                                    type="text"
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder="Execute neural prompt..."
                                    className="flex-1 bg-transparent px-10 py-5 text-white text-xl placeholder:text-gray-700 focus:outline-none font-light tracking-tight"
                                />
                                <button
                                    type="submit"
                                    disabled={isGenerating || !prompt.trim()}
                                    className="px-10 py-5 rounded-[2rem] bg-white text-black text-[11px] font-black uppercase tracking-[0.3em] hover:bg-gray-200 transition-all disabled:opacity-20 flex items-center gap-3"
                                >
                                    {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                                    <span>Synthesize</span>
                                </button>
                            </div>

                            {/* Suggestions */}
                            <div className="flex flex-wrap justify-center gap-3 mt-10">
                                {['Monochrome Blueprint', 'Neural Topography', 'Glass Morphism', 'Cybernetic Matrix'].map((suggestion) => (
                                    <button
                                        key={suggestion}
                                        onClick={() => setPrompt(suggestion)}
                                        className="px-5 py-2 rounded-xl bg-white/[0.02] border border-white/5 text-[9px] uppercase tracking-[0.4em] font-black text-gray-700 hover:text-white hover:border-white/20 transition-all"
                                    >
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        </form>
                    </motion.div>

                    {/* Result Display */}
                    <AnimatePresence>
                        {result && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                className="max-w-6xl mx-auto"
                            >
                                <LuxuryCard variant="glass" className="border-white/5 overflow-hidden group">
                                    <LuxuryContent className="p-8 md:p-12">
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                                            {/* Image Container */}
                                            <div className="aspect-square rounded-[2rem] overflow-hidden relative border border-white/10 bg-black/50 group/img">
                                                <img
                                                    src={result.imgUrl}
                                                    alt={prompt}
                                                    className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-[3s] ease-out"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-700 flex items-end justify-end p-8">
                                                    <a
                                                        href={result.imgUrl}
                                                        download={`dyano-synapse-${Date.now()}.png`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="p-4 bg-white text-black rounded-2xl hover:bg-gray-200 transition-all shadow-2xl"
                                                    >
                                                        <Download size={20} />
                                                    </a>
                                                </div>
                                            </div>

                                            {/* Details */}
                                            <div className="flex flex-col justify-center">
                                                <div className="mb-10">
                                                    <div className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-700 mb-6">Synthesis_Log</div>
                                                    <p className="text-white text-2xl font-light leading-relaxed italic tracking-tight mb-8">
                                                        "{result.data?.response || result.data || 'Visual interpretation complete.'}"
                                                    </p>
                                                    <div className="w-12 h-0.5 bg-white/10" />
                                                </div>

                                                <div className="grid grid-cols-2 gap-8 mb-12">
                                                    {[
                                                        { label: "Precision", value: "1024x1024" },
                                                        { label: "Engine", value: "FLUX_REALISM" },
                                                        { label: "Seed", value: "42881" },
                                                        { label: "Latency", value: "Synoptic" }
                                                    ].map((p, i) => (
                                                        <div key={i}>
                                                            <div className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-800 mb-2">{p.label}</div>
                                                            <div className="text-[10px] font-mono text-gray-400">{p.value}</div>
                                                        </div>
                                                    ))}
                                                </div>

                                                <button
                                                    onClick={() => handleGenerate()}
                                                    className="self-start px-8 py-4 rounded-xl bg-white/[0.03] hover:bg-white/10 border border-white/5 text-[10px] font-black uppercase tracking-[0.3em] text-white transition-all flex items-center gap-4"
                                                >
                                                    <RefreshCw size={14} className={isGenerating ? "animate-spin" : ""} />
                                                    Regenerate Protocol
                                                </button>
                                            </div>
                                        </div>
                                    </LuxuryContent>
                                </LuxuryCard>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}
