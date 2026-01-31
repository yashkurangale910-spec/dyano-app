import React, { useState } from 'react';
import { Web3Simulator } from '../../utils/Web3Simulator';
import { Box, Check, Globe, Loader } from 'lucide-react';

const IpfsRegistry = ({ data }) => {
    const [status, setStatus] = useState('IDLE'); // IDLE, UPLOADING, PINNED
    const [cid, setCid] = useState(null);

    const handlePublish = async () => {
        setStatus('UPLOADING');
        const hash = await Web3Simulator.pinToIpfs(data);
        setCid(hash);
        setStatus('PINNED');
    };

    return (
        <div className="p-4 bg-black/40 border border-white/5 rounded-xl">
            <div className="flex items-center gap-3 mb-4">
                <Box className="text-cosmic-cyan" size={20} />
                <div>
                    <h3 className="text-white font-bold text-sm">Permaweb Registry</h3>
                    <p className="text-xs text-gray-500">Decentralized Roadmap Storage (IPFS check)</p>
                </div>
            </div>

            {status === 'IDLE' && (
                <button
                    onClick={handlePublish}
                    className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-mono text-gray-300 transition-colors flex items-center justify-center gap-2"
                >
                    <Globe size={14} /> PUBLISH TO IPFS
                </button>
            )}

            {status === 'UPLOADING' && (
                <div className="flex items-center justify-center gap-2 py-2 text-xs text-cosmic-cyan font-mono animate-pulse">
                    <Loader size={14} className="animate-spin" />
                    HASHING CONTENT...
                </div>
            )}

            {status === 'PINNED' && (
                <div className="bg-green-500/10 border border-green-500/30 rounded p-3">
                    <div className="flex items-center gap-2 text-green-400 text-xs font-bold mb-1">
                        <Check size={14} /> PINNED TO NETWORK
                    </div>
                    <p className="font-mono text-[10px] text-gray-400 break-all select-all cursor-pointer hover:text-white">
                        ipfs://{cid}
                    </p>
                </div>
            )}
        </div>
    );
};

export default IpfsRegistry;
