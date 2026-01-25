import { useState, useCallback } from 'react';
import { INITIAL_CHAT } from '../constants/landingContent';

/**
 * usePDFLab - Manages the file processing and chat state for the PDF Lab.
 */
export default function usePDFLab() {
    const [status, setStatus] = useState('idle'); // idle | scanning | ready
    const [messages, setMessages] = useState(INITIAL_CHAT);
    const [isProcessing, setIsProcessing] = useState(false);

    const uploadFile = useCallback((file) => {
        setStatus('scanning');
        setIsProcessing(true);

        // Simulating neural mapping / indexing
        setTimeout(() => {
            setStatus('ready');
            setIsProcessing(false);
        }, 3000);
    }, []);

    const sendMessage = useCallback((text) => {
        if (!text.trim()) return;

        const newUserMessage = { role: 'user', content: text };
        setMessages(prev => [...prev, newUserMessage]);

        setIsProcessing(true);

        // Simulating AI thought process
        setTimeout(() => {
            const aiResponse = {
                role: 'ai',
                content: `Based on the latent spaces in the document, I can confirm that ${text.toLowerCase()} is addressed in Chapter 4. Would you like a deep-scan summary?`
            };
            setMessages(prev => [...prev, aiResponse]);
            setIsProcessing(false);
        }, 1500);
    }, []);

    return {
        status,
        messages,
        isProcessing,
        uploadFile,
        sendMessage,
        reset: () => {
            setStatus('idle');
            setMessages(INITIAL_CHAT);
        }
    };
}
