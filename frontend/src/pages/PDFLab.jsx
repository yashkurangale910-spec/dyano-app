import { motion, AnimatePresence } from 'framer-motion';
import { FileText, ChevronLeft, Info, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import usePDFLab from '../hooks/usePDFLab';
import DocumentScanner from '../components/pdf/DocumentScanner';
import IntelligenceStream from '../components/pdf/IntelligenceStream';
import GlassCard from '../components/ui/GlassCard';
import { MOCK_PDF_STATS } from '../constants/landingContent';

export default function PDFLab() {
    const navigate = useNavigate();
    const { status, messages, isProcessing, uploadFile, sendMessage, reset } = usePDFLab();

    return (
        <div className="container-cosmic py-12 min-h-[85vh]">
            <AnimatePresence mode="wait">
                {status === 'idle' || status === 'scanning' ? (
                    <motion.div
                        key="scanner"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        className="relative pt-12"
                    >
                        {status === 'scanning' && (
                            <div className="absolute inset-0 z-50 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="w-64 h-1 bg-white/5 rounded-full overflow-hidden mb-4">
                                        <motion.div
                                            className="h-full bg-cosmic-cyan shadow-[0_0_15px_rgba(0,245,255,0.8)]"
                                            initial={{ width: "0%" }}
                                            animate={{ width: "100%" }}
                                            transition={{ duration: 3 }}
                                        />
                                    </div>
                                    <div className="text-[10px] font-mono tracking-[0.5em] text-cosmic-cyan uppercase">Mapping Neural Nodes...</div>
                                </div>
                            </div>
                        )}
                        <DocumentScanner onUpload={uploadFile} isScanning={status === 'scanning'} />
                    </motion.div>
                ) : (
                    <motion.div
                        key="session"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="grid grid-cols-1 lg:grid-cols-12 gap-12"
                    >
                        {/* Sidebar: Document Metadata (Asymmetric) */}
                        <aside className="lg:col-span-4 space-y-8">
                            <button
                                onClick={reset}
                                className="flex items-center gap-3 text-gray-500 hover:text-white transition-colors mb-12 group"
                            >
                                <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                                <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Close Session</span>
                            </button>

                            <div className="text-[10px] uppercase tracking-[0.4em] font-bold text-cosmic-cyan mb-8">
                                Active_Document // {MOCK_PDF_STATS.fileName}
                            </div>

                            <GlassCard className="p-8 border-l-4 border-l-cosmic-cyan">
                                <FileText className="text-cosmic-cyan mb-6" size={32} strokeWidth={1} />
                                <h3 className="text-2xl font-display font-bold text-white mb-6 leading-tight">
                                    {MOCK_PDF_STATS.fileName}
                                </h3>

                                <div className="space-y-4 mb-10 text-[11px] font-mono text-gray-500">
                                    <div className="flex justify-between">
                                        <span>SIZE:</span>
                                        <span className="text-white">{MOCK_PDF_STATS.fileSize}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>NODES:</span>
                                        <span className="text-white">{MOCK_PDF_STATS.pages} Pages</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>SYNC_DATE:</span>
                                        <span className="text-white">{MOCK_PDF_STATS.indexedDate}</span>
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-white/5">
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 mb-3 uppercase">
                                        <Info size={12} /> Executive Summary
                                    </div>
                                    <p className="text-sm text-gray-500 leading-relaxed font-light italic">
                                        "{MOCK_PDF_STATS.summary}"
                                    </p>
                                </div>
                            </GlassCard>

                            <button className="w-full py-4 border border-white/5 rounded-2xl flex items-center justify-center gap-3 text-[10px] uppercase tracking-widest font-bold text-gray-500 hover:bg-white/5 hover:text-white transition-all">
                                <Download size={14} /> Export Insight
                            </button>
                        </aside>

                        {/* Main: Interaction Stream */}
                        <div className="lg:col-span-8">
                            <IntelligenceStream
                                messages={messages}
                                onSend={sendMessage}
                                isProcessing={isProcessing}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
