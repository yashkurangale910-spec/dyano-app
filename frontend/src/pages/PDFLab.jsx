import { motion, AnimatePresence } from 'framer-motion';
import { FileText, ChevronLeft, Info, Download, Terminal, Search as SearchIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import usePDFLab from '../hooks/usePDFLab';
import DocumentScanner from '../components/pdf/DocumentScanner';
import IntelligenceStream from '../components/pdf/IntelligenceStream';
import LuxuryCard, { LuxuryContent } from '../components/ui/LuxuryCard';
import BaseButton from '../components/ui/BaseButton';
import PageHeader from '../components/ui/PageHeader';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import { MOCK_PDF_STATS } from '../constants/landingContent';

export default function PDFLab() {
    const navigate = useNavigate();
    const { status, messages, isProcessing, uploadFile, sendMessage, reset } = usePDFLab();

    return (
        <div className="w-full relative min-h-screen">
            <main className="py-20 relative z-10">
                <div className="container-monolith">
                    <Breadcrumbs />

                    <AnimatePresence mode="wait">
                        {status === 'idle' || status === 'scanning' ? (
                            <motion.div
                                key="scanner"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-20"
                            >
                                <motion.div layoutId="card-pdf">
                                    <PageHeader
                                        title="Document Intelligence"
                                        subtitle="Execute deep neural synthesis on technical manuscripts for vector-based retrieval."
                                        helpText="Engine parses and indexes PDF structures into a desaturated synaptic matrix."
                                    />
                                </motion.div>

                                <div className="max-w-3xl mx-auto relative">
                                    {status === 'scanning' && (
                                        <div className="absolute inset-0 z-50 flex items-center justify-center bg-bg-main/80 backdrop-blur-md rounded-[3rem]">
                                            <div className="text-center">
                                                <div className="w-80 h-1 bg-white/5 rounded-full overflow-hidden mb-8 mx-auto">
                                                    <motion.div
                                                        className="h-full bg-white"
                                                        initial={{ width: "0%" }}
                                                        animate={{ width: "100%" }}
                                                        transition={{ duration: 4, ease: [0.16, 1, 0.3, 1] }}
                                                    />
                                                </div>
                                                <div className="text-[10px] font-black tracking-[0.6em] text-white uppercase italic">Synthesizing Nodes...</div>
                                            </div>
                                        </div>
                                    )}
                                    <DocumentScanner onUpload={uploadFile} isScanning={status === 'scanning'} />
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="session"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="grid grid-cols-1 lg:grid-cols-12 gap-12"
                            >
                                {/* Sidebar */}
                                <aside className="lg:col-span-4 space-y-8">
                                    <BaseButton
                                        variant="ghost"
                                        size="sm"
                                        onClick={reset}
                                        className="!px-0 text-gray-600 hover:text-white transition-colors"
                                    >
                                        <ChevronLeft size={16} className="mr-2" />
                                        <span className="text-[10px] uppercase tracking-[0.4em] font-black">Terminate Archive Session</span>
                                    </BaseButton>

                                    <LuxuryCard variant="glass" className="border-white/5 shadow-2xl">
                                        <LuxuryContent className="p-10">
                                            <div className="flex items-center gap-6 mb-10 pb-10 border-b border-white/5">
                                                <div className="w-14 h-14 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center justify-center text-white/40">
                                                    <FileText size={24} strokeWidth={1} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-[9px] font-black text-gray-700 uppercase tracking-[0.4em] mb-2">Subject_Alpha</div>
                                                    <div className="text-white font-bold truncate text-lg tracking-tight">{MOCK_PDF_STATS.fileName}</div>
                                                </div>
                                            </div>

                                            <div className="space-y-6 mb-10">
                                                {[
                                                    { label: "Data Scale", value: MOCK_PDF_STATS.fileSize },
                                                    { label: "Segment Count", value: `${MOCK_PDF_STATS.pages} Segments` },
                                                    { label: "Injection Date", value: MOCK_PDF_STATS.indexedDate }
                                                ].map((item, i) => (
                                                    <div key={i} className="flex justify-between items-center text-[10px] font-mono">
                                                        <span className="text-gray-700 uppercase tracking-widest">{item.label}</span>
                                                        <span className="text-white/60">{item.value}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="pt-10 border-t border-white/5">
                                                <div className="flex items-center gap-2 text-[9px] font-black text-gray-800 mb-6 uppercase tracking-[0.4em]">
                                                    <Terminal size={12} className="opacity-40" /> Archive Summary
                                                </div>
                                                <p className="text-[11px] text-gray-600 leading-relaxed font-light italic">
                                                    "{MOCK_PDF_STATS.summary}"
                                                </p>
                                            </div>
                                        </LuxuryContent>
                                    </LuxuryCard>

                                    <BaseButton variant="outline" className="w-full justify-center text-[10px] uppercase font-black tracking-[0.3em] border-white/5 hover:bg-white hover:text-black">
                                        <Download size={14} className="mr-2" /> Export Synapse Data
                                    </BaseButton>
                                </aside>

                                {/* Main Chat Area */}
                                <div className="lg:col-span-8 h-full min-h-[700px] flex flex-col">
                                    <LuxuryCard variant="glass" className="flex-1 flex flex-col border-white/5 bg-white/[0.01]">
                                        <IntelligenceStream
                                            messages={messages}
                                            onSend={sendMessage}
                                            isProcessing={isProcessing}
                                        />
                                    </LuxuryCard>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}
