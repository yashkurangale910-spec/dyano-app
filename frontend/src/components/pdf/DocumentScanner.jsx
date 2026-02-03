import { motion } from 'framer-motion';
import { Upload, Shield, FileText } from 'lucide-react';
import LuxuryCard, { LuxuryContent } from '../ui/LuxuryCard';

export default function DocumentScanner({ onUpload, isScanning }) {
    return (
        <div className="space-y-8">
            <LuxuryCard
                variant="default"
                className={`
                    w-full transition-all duration-700
                    ${isScanning ? 'opacity-40 pointer-events-none' : 'hover:border-accent-cyan/30'}
                `}
            >
                <label className="block w-full cursor-pointer group">
                    <input
                        type="file"
                        className="hidden"
                        accept=".pdf"
                        onChange={(e) => e.target.files[0] && onUpload(e.target.files[0])}
                    />
                    <LuxuryContent className="py-24 text-center">
                        <div className="w-20 h-20 rounded-2xl bg-white/[0.03] border border-white/10 flex-center text-accent-cyan mx-auto mb-8 group-hover:scale-110 transition-transform duration-500">
                            <Upload className="w-8 h-8" />
                        </div>
                        <h3 className="text-3xl font-black text-white mb-2 tracking-tighter">Initialize Upload.</h3>
                        <p className="text-text-muted font-light mb-8 max-w-sm mx-auto">Select a technical document to begin synthesis. Only .pdf formats are currently accepted.</p>

                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/5 text-[9px] font-bold text-text-muted uppercase tracking-[0.2em]">
                            Maximum payload: 24MB
                        </div>
                    </LuxuryContent>
                </label>
            </LuxuryCard>

            <div className="flex flex-col md:flex-row gap-4">
                <LuxuryCard variant="outline" className="flex-1">
                    <LuxuryContent className="flex items-center gap-4 py-4">
                        <Shield size={18} className="text-text-muted" />
                        <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Local Neural Processing</span>
                    </LuxuryContent>
                </LuxuryCard>
                <LuxuryCard variant="outline" className="flex-1">
                    <LuxuryContent className="flex items-center gap-4 py-4">
                        <FileText size={18} className="text-text-muted" />
                        <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Engine v4.2.0 Stable</span>
                    </LuxuryContent>
                </LuxuryCard>
            </div>
        </div>
    );
}
