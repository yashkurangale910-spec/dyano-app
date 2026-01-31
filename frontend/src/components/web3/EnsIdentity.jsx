import React, { useState } from 'react';
import { Web3Simulator } from '../../utils/Web3Simulator';
import { Wallet, Search, CheckCircle, XCircle } from 'lucide-react';

const EnsIdentity = () => {
    const [domain, setDomain] = useState('');
    const [connected, setConnected] = useState(false);
    const [identity, setIdentity] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleConnect = async () => {
        if (!domain) return;
        setLoading(true);
        const result = await Web3Simulator.resolveEns(domain);
        setLoading(false);

        if (result.valid) {
            setIdentity({ name: domain, ...result });
            setConnected(true);
        } else {
            alert("Invalid ENS Domain (Must end in .eth)");
        }
    };

    if (connected && identity) {
        return (
            <div className="flex items-center gap-3 bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-blue-500/30 rounded-full pl-1 pr-4 py-1">
                <img src={identity.avatar} alt="ENS" className="w-8 h-8 rounded-full border border-white/20" />
                <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1">
                        {identity.name} <CheckCircle size={10} className="text-blue-400" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-lg p-1">
            <div className="p-2 bg-white/5 rounded">
                <Wallet size={16} className="text-gray-400" />
            </div>
            <input
                type="text"
                placeholder="identity.eth"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="bg-transparent border-none outline-none text-xs text-white w-24 placeholder-gray-600 font-mono"
            />
            <button
                onClick={handleConnect}
                disabled={loading}
                className="p-1 hover:text-white text-gray-500 transition-colors"
            >
                {loading ? <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" /> : <Search size={14} />}
            </button>
        </div>
    );
};

export default EnsIdentity;
