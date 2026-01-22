import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../common/LanguageSwitcher';
import toast from 'react-hot-toast';
import './Auth.css';

const Login = () => {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            toast.error(t('msg.fillFields'));
            return;
        }

        if (!email.includes('@')) {
            toast.error(t('msg.validEmail'));
            return;
        }

        setLoading(true);

        try {
            const result = await login(email, password);

            if (result.success) {
                toast.success(t('msg.loginSuccess') || 'Login successful! 🎉');
                navigate('/dashboard');
            } else {
                toast.error(result.message || t('msg.error'));
            }
        } catch (error) {
            toast.error(t('msg.error'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            {/* Background kinetic elements */}
            <div className="auth-bg-shapes">
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
                <div className="shape shape-3"></div>
            </div>

            <div className="lang-switcher-container">
                <LanguageSwitcher />
            </div>

            <div className="auth-container">
                <div className="auth-header">
                    <h1 className="auth-logo">Dyano</h1>
                    <p className="auth-subtitle">{t('dashboard.welcome')}!</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label className="form-label">{t('auth.email')}</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="form-input"
                            placeholder="name@company.com"
                            disabled={loading}
                            autoComplete="email"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">{t('auth.password')}</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="form-input"
                            placeholder="••••••••"
                            disabled={loading}
                            autoComplete="current-password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="auth-button"
                    >
                        {loading ? (
                            <>
                                <span className="spinner"></span>
                                {t('common.loading')}
                            </>
                        ) : (
                            t('auth.signIn')
                        )}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        {t('auth.noAccount')}{' '}
                        <Link to="/register" className="auth-link">
                            {t('auth.register')}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
