import React, { useState } from 'react';
import { AiService } from '../../utils/AiService';
import { TestTube, Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';

const EdgeCaseTester = ({ code }) => {
    const [tests, setTests] = useState('');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const user = JSON.parse(localStorage.getItem('dyano_user') || '{}');

    const generate = async () => {
        if (!code) return;
        setLoading(true);
        const result = await AiService.generateTests(code, user.token);

        // Parse result if it's JSON wrapped
        let cleanText = result;
        try {
            const json = JSON.parse(result);
            cleanText = json.response || result;
        } catch (e) { }

        setTests(cleanText);
        setLoading(false);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(tests);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="mt-4 p-4 bg-black/40 border border-white/5 rounded-xl">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-gray-300 flex items-center gap-2">
                    <TestTube size={16} className="text-green-400" />
                    Unit Test Generator
                </h3>
                <button
                    onClick={generate}
                    disabled={loading || !code}
                    className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/50 rounded text-xs hover:bg-green-500/30 disabled:opacity-50"
                >
                    {loading ? 'Synthesizing...' : 'Stress Test'}
                </button>
            </div>

            {tests && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="relative"
                >
                    <div className="absolute top-2 right-2">
                        <button onClick={copyToClipboard} className="p-1 hover:bg-white/10 rounded text-gray-400">
                            {copied ? <Check size={14} /> : <Copy size={14} />}
                        </button>
                    </div>
                    <pre className="text-xs font-mono text-gray-400 bg-black/60 p-4 rounded-lg overflow-x-auto border border-white/5">
                        {tests}
                    </pre>
                </motion.div>
            )}
        </div>
    );
};

export default EdgeCaseTester;
