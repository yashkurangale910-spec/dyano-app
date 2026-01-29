import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { INITIAL_CHAT } from '../constants/landingContent';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3005';

export default function usePDFLab() {
    const [status, setStatus] = useState('idle'); // idle | scanning | ready
    const [messages, setMessages] = useState(INITIAL_CHAT);
    const [isProcessing, setIsProcessing] = useState(false);
    const [currentDocId, setCurrentDocId] = useState(null);
    const [pdfList, setPdfList] = useState([]);

    const fetchPdfs = useCallback(async () => {
        try {
            const user = JSON.parse(localStorage.getItem('dyano_user') || '{}');
            const response = await axios.get(`${API_URL}/pdf/list`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            if (response.data.success) {
                setPdfList(response.data.documents);
            }
        } catch (error) {
            console.error("Failed to fetch PDFs:", error);
        }
    }, []);

    const uploadFile = useCallback(async (file) => {
        setStatus('scanning');
        setIsProcessing(true);

        const formData = new FormData();
        formData.append('pdfFile', file);

        try {
            const user = JSON.parse(localStorage.getItem('dyano_user') || '{}');
            const response = await axios.post(`${API_URL}/pdf/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${user.token}`
                }
            });
            if (response.data.success) {
                setCurrentDocId(response.data.documentId);
                setStatus('ready');
                fetchPdfs();
            }
        } catch (error) {
            console.error("Upload failed:", error);
            setStatus('idle');
        } finally {
            setIsProcessing(false);
        }
    }, [fetchPdfs]);

    const sendMessage = useCallback(async (text) => {
        if (!text.trim() || !currentDocId) return;

        const newUserMessage = { role: 'user', content: text };
        setMessages(prev => [...prev, newUserMessage]);
        setIsProcessing(true);

        try {
            const user = JSON.parse(localStorage.getItem('dyano_user') || '{}');
            const response = await axios.post(`${API_URL}/pdf/question`, {
                question: text,
                documentId: currentDocId
            }, {
                headers: { Authorization: `Bearer ${user.token}` }
            });

            if (response.data.success) {
                const aiResponse = {
                    role: 'ai',
                    content: response.data.data
                };
                setMessages(prev => [...prev, aiResponse]);
            }
        } catch (error) {
            console.error("QA failed:", error);
        } finally {
            setIsProcessing(false);
        }
    }, [currentDocId]);

    useEffect(() => {
        fetchPdfs();
    }, [fetchPdfs]);

    return {
        status,
        messages,
        isProcessing,
        pdfList,
        currentDocId,
        setCurrentDocId,
        uploadFile,
        sendMessage,
        reset: () => {
            setStatus('idle');
            setMessages(INITIAL_CHAT);
            setCurrentDocId(null);
        }
    };
}

