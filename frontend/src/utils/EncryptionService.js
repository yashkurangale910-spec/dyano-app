// EncryptionService.js - "Iron Core" Phase 18
// Implementation of AES-GCM-256 Client-Side Encryption

export const EncryptionService = {
    // Generate a key from a password/seed (PBKDF2)
    deriveKey: async (password, salt) => {
        const enc = new TextEncoder();
        const keyMaterial = await window.crypto.subtle.importKey(
            "raw",
            enc.encode(password),
            { name: "PBKDF2" },
            false,
            ["deriveKey"]
        );

        return window.crypto.subtle.deriveKey(
            {
                name: "PBKDF2",
                salt: enc.encode(salt),
                iterations: 100000,
                hash: "SHA-256"
            },
            keyMaterial,
            { name: "AES-GCM", length: 256 },
            true,
            ["encrypt", "decrypt"]
        );
    },

    // Encrypt data
    encrypt: async (text, password) => {
        try {
            const salt = "dyano-neural-salt"; // In prod, this should be random and stored with data
            const key = await EncryptionService.deriveKey(password, salt);
            const iv = window.crypto.getRandomValues(new Uint8Array(12));
            const enc = new TextEncoder();

            const encryptedContent = await window.crypto.subtle.encrypt(
                {
                    name: "AES-GCM",
                    iv: iv
                },
                key,
                enc.encode(text)
            );

            // Export as simplified format: IV + Ciphertext (Base64)
            const ivArray = Array.from(iv);
            const cipherArray = Array.from(new Uint8Array(encryptedContent));

            // Combine IV and Ciphertext for storage
            const payload = {
                iv: ivArray,
                data: cipherArray,
                v: 1 // version 1
            };

            return btoa(JSON.stringify(payload));
        } catch (e) {
            console.error("Encryption Failed:", e);
            throw new Error("Neural Encryption Failed");
        }
    },

    // Decrypt data
    decrypt: async (encryptedPayload, password) => {
        try {
            const raw = JSON.parse(atob(encryptedPayload));
            const salt = "dyano-neural-salt";
            const key = await EncryptionService.deriveKey(password, salt);

            const iv = new Uint8Array(raw.iv);
            const data = new Uint8Array(raw.data);

            const decryptedContent = await window.crypto.subtle.decrypt(
                {
                    name: "AES-GCM",
                    iv: iv
                },
                key,
                data
            );

            const dec = new TextDecoder();
            return dec.decode(decryptedContent);
        } catch (e) {
            console.error("Decryption Failed:", e);
            throw new Error("Invalid Key or Corrupted Neural Data");
        }
    }
};
