import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';

class CRDTService {
    constructor() {
        this.ydoc = new Y.Doc();
        this.provider = null;
        this.notesMap = this.ydoc.getMap('memory-bank-notes');
        this.cursorMap = this.ydoc.getMap('ghost-cursors');
        this.awareness = null;
        this.isConnected = false;

        // Local storage persistence
        this.loadFromLocal();

        this.notesMap.observe(() => {
            this.saveToLocal();
        });
    }

    connect(roomName = 'global-mind-hive', userId = 'anon') {
        if (this.provider) return;

        const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:3005';

        this.provider = new WebsocketProvider(wsUrl, roomName, this.ydoc);
        this.awareness = this.provider.awareness;

        this.awareness.setLocalStateField('user', {
            id: userId,
            color: '#' + Math.floor(Math.random() * 16777215).toString(16),
            name: userId
        });

        this.provider.on('status', event => {
            this.isConnected = event.status === 'connected';
            console.log(`[Neural Sync] Connection status: ${event.status}`);
        });
    }

    disconnect() {
        if (this.provider) {
            this.provider.destroy();
            this.provider = null;
            this.isConnected = false;
        }
    }

    // --- Notes Management ---

    setNote(nodeId, content) {
        // High-frequency updates should be debounced in UI, but CRDT handles merge
        this.notesMap.set(nodeId, {
            content,
            timestamp: Date.now()
        });
    }

    getNote(nodeId) {
        return this.notesMap.get(nodeId);
    }

    getAllNotes() {
        return this.notesMap.toJSON();
    }

    // --- Ghost Cursor Management ---

    updateCursor(x, y, nodeId) {
        if (!this.awareness) return;
        this.awareness.setLocalStateField('cursor', {
            x, y, nodeId, timestamp: Date.now()
        });
    }

    onCursorUpdate(callback) {
        if (!this.awareness) return;
        this.awareness.on('change', () => {
            const states = Array.from(this.awareness.getStates().values());
            // Filter out self
            const others = states.filter(s => s.user && s.user.id !== this.awareness.getLocalState()?.user?.id);
            callback(others);
        });
    }

    // --- Persistence ---

    saveToLocal() {
        const data = JSON.stringify(this.getAllNotes());
        localStorage.setItem('dyano_memory_bank_crdt', data);
    }

    loadFromLocal() {
        const stored = localStorage.getItem('dyano_memory_bank_crdt');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                this.ydoc.transact(() => {
                    Object.entries(parsed).forEach(([key, val]) => {
                        if (!this.notesMap.has(key)) {
                            this.notesMap.set(key, val);
                        }
                    });
                });
            } catch (e) {
                console.error("Failed to load local CRDT state", e);
            }
        }
    }
}

export const crdtService = new CRDTService();
