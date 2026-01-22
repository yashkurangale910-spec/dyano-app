import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../common/LanguageSwitcher';
import toast from 'react-hot-toast';
import './Auth.css';

const Register = () => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
            toast.error(t('msg.fillFields'));
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error(t('msg.passwordMatch'));
            return;
        }

        setLoading(true);

        try {
            const result = await register(formData.email, formData.password, formData.name);

            if (result.success) {
                toast.success(t('msg.registerSuccess') || 'Registration successful! 🎉');
                navigate('/dashboard');
            } else {
                toast.error(result.message || 'Registration failed');
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
                    <p className="auth-subtitle">{t('auth.signUp')}!</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label className="form-label">{t('auth.name')}</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="John Doe"
                            disabled={loading}
                            autoComplete="name"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">{t('auth.email')}</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
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
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="••••••••"
                            disabled={loading}
                            autoComplete="new-password"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">{t('auth.confirmPassword')}</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="••••••••"
                            disabled={loading}
                            autoComplete="new-password"
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
                            t('auth.register')
                        )}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        {t('auth.haveAccount')}{' '}
                        <Link to="/login" className="auth-link">
                            {t('auth.login')}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
