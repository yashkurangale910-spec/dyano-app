import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const Header = () => {
    const location = useLocation();
    const { t, i18n } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    return (
        <header className="fixed top-0 left-0 w-full z-[100] px-20 py-12">
            <div className="max-w-[1600px] mx-auto flex items-center justify-between">

                {/* Abstract Identity */}
                <Link to="/dashboard" className="flex items-center gap-6 group">
                    <div className="relative w-12 h-12 flex items-center justify-center">
                        <div className="absolute inset-0 border-2 border-white/20 rounded-full group-hover:scale-110 group-hover:border-white transition-all duration-700"></div>
                        <div className="w-4 h-4 bg-white rounded-full group-hover:scale-125 transition-transform"></div>
                    </div>
                    <div>
                        <span className="text-3xl font-black tracking-tighter text-white uppercase italic leading-none block">Dyano</span>
                        <span className="label-track !text-[8px] opacity-40">{t('common.system_interface')}</span>
                    </div>
                </Link>

                {/* Abstract Navigation */}
                <nav className="hidden lg:flex items-center gap-20">
                    {['Dashboard', 'Learn', 'PDF Lab'].map((name) => {
                        const translationKey = `nav.${name.toLowerCase().replace(' ', '')}`;
                        const path = `/${name.toLowerCase().replace(' ', '')}`;
                        const active = location.pathname.includes(path);
                        return (
                            <Link
                                key={name}
                                to={path}
                                className={`text-[11px] font-bold tracking-[0.5em] uppercase transition-all relative py-1 ${active ? 'text-white' : 'text-white/20 hover:text-white/70'
                                    }`}
                            >
                                {t(translationKey)}
                                {active && (
                                    <div className="absolute -bottom-2 left-0 w-full h-[1px] bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)]"></div>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Terminal Actions */}
                <div className="flex items-center gap-14">
                    <select
                        onChange={(e) => changeLanguage(e.target.value)}
                        value={i18n.language}
                        className="bg-transparent text-white/40 text-[10px] font-bold tracking-widest uppercase outline-none cursor-pointer hover:text-white transition-colors border border-white/10 rounded px-2 py-1"
                    >
                        <option value="en" className="bg-black text-white">EN</option>
                        <option value="hi" className="bg-black text-white">HI</option>
                        <option value="es" className="bg-black text-white">ES</option>
                    </select>
                    <Link to="/login" className="label-track !text-[10px] hover:text-white transition-colors">{t('nav.access_base')}</Link>
                    <Link to="/learn" className="btn-abstract !bg-white !text-black !border-none font-black hover:!bg-cyan-400 hover:!text-white">
                        {t('nav.enter_alpha')}
                    </Link>
                </div>

            </div>
        </header>
    );
};