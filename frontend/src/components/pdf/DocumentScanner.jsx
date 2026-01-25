import { motion } from 'framer-motion';
import { FileText, Upload, Shield } from 'lucide-react';
import GlassCard from '../ui/GlassCard';

export default function DocumentScanner({ onUpload, isScanning }) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-8">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <div className="flex items-center gap-4 mb-10 opacity-40">
                        <div className="w-10 h-[1px] bg-cosmic-cyan"></div>
                        <span className="text-[10px] font-display tracking-[0.4em] font-bold text-cosmic-cyan uppercase">
                            Ingestion Protocol // v.1.0
                        </span>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-display font-bold text-white mb-10 leading-[0.95] tracking-tighter">
                        PDF <br />
                        <span className="text-cosmic-cyan italic">Intelligence.</span>
                    </h1>

                    <GlassCard
                        className={`
                            p-1 w-full max-w-2xl group transition-all duration-700
                            ${isScanning ? 'opacity-40 pointer-events-none' : 'hover:scale-[1.01]'}
                        `}
                    >
                        <label className="block w-full cursor-pointer">
                            <input
                                type="file"
                                className="hidden"
                                accept=".pdf"
                                onChange={(e) => e.target.files[0] && onUpload(e.target.files[0])}
                            />
                            <div className="border-2 border-dashed border-white/5 group-hover:border-cosmic-cyan/20 rounded-[2.3rem] p-16 text-center transition-colors">
                                <div className="p-6 rounded-3xl bg-cosmic-cyan/5 w-fit mx-auto mb-8 group-hover:bg-cosmic-cyan/10 transition-colors">
                                    <Upload className="w-10 h-10 text-cosmic-cyan" strokeWidth={1} />
                                </div>
                                <div className="text-2xl font-display font-bold text-white mb-2">Drop Neural Map</div>
                                <p className="text-gray-500 font-light">Upload PDF for intelligence synthesis</p>
                            </div>
                        </label>
                    </GlassCard>
                </motion.div>
            </div>

            <div className="lg:col-span-4 space-y-8">
                <GlassCard className="p-8 border-b-4 border-b-cosmic-pink">
                    <Shield className="text-cosmic-pink mb-4" size={24} />
                    <h3 className="text-lg font-bold text-white mb-2">Encrypted Stream</h3>
                    <p className="text-sm text-gray-500 leading-relaxed font-light">
                        All documents are processed in local neural buffers. No data leaves the mission perimeter.
                    </p>
                </GlassCard>

                <div className="flex items-center gap-6 px-4">
                    <div className="text-5xl font-display font-light text-white tracking-tighter">4.0.2</div>
                    <div className="text-[10px] uppercase tracking-widest text-gray-600 font-bold leading-tight">
                        Extraction <br /> Engine
                    </div>
                </div>
            </div>
        </div>
    );
}
