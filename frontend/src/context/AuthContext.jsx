import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3005';

    // Auto-login for testing/development
    useEffect(() => {
        const autoLogin = async () => {
            const savedUser = localStorage.getItem('dyano_user');
            if (savedUser) {
                setUser(JSON.parse(savedUser));
                setLoading(false);
            } else {
                // Auto-login with admin credentials if no session exists
                console.log('--- Development Auto-Login Sequence ---');
                try {
                    const response = await fetch(`${API_URL}/auth/login`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            email: 'admin@dyano.com',
                            password: 'password123'
                        })
                    });

                    if (!response.ok) throw new Error('Network response was not ok');

                    const result = await response.json();
                    if (result.success) {
                        const userData = {
                            ...result.data.user,
                            token: result.data.accessToken
                        };
                        setUser(userData);
                        localStorage.setItem('dyano_user', JSON.stringify(userData));
                        console.log('✅ Auto-login successful');
                    }
                } catch (e) {
                    console.warn('⚠️ Auto-login bypassed:', e.message);
                } finally {
                    setLoading(false);
                }
            }
        };
        autoLogin();
    }, []);

    const login = async (credentials) => {
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials)
            });

            const result = await response.json();
            if (result.success) {
                const userData = {
                    ...result.data.user,
                    token: result.data.accessToken
                };
                setUser(userData);
                localStorage.setItem('dyano_user', JSON.stringify(userData));
                return { success: true };
            } else {
                return { success: false, message: result.message || 'Login failed' };
            }
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: 'Connection error' };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('dyano_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {loading ? (
                <div className="h-screen w-screen flex items-center justify-center bg-[#05010d] text-white">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                        <div className="text-cyan-400 font-mono tracking-widest text-sm">INITIALIZING SYSTEM...</div>
                    </div>
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
