import { motion } from 'framer-motion';
import { ChevronRight, Home } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

/**
 * Smart Breadcrumb component
 * Auto-generates based on current path
 */
export default function Breadcrumbs({ className = '', customLabels = {} }) {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x);

    if (pathnames.length === 0) return null;

    return (
        <nav aria-label="Breadcrumb" className={`flex mb-8 ${className}`}>
            <ol className="flex items-center space-x-2">
                {/* Home Link */}
                <li>
                    <Link
                        to="/"
                        className="breadcrumb-item"
                        aria-label="Home"
                    >
                        <Home size={16} />
                    </Link>
                </li>

                {pathnames.map((value, index) => {
                    const last = index === pathnames.length - 1;
                    const to = `/${pathnames.slice(0, index + 1).join('/')}`;

                    // Format label (hyphenated to capitalized)
                    const rawLabel = value.replace(/-/g, ' ');
                    const label = customLabels[value] || (rawLabel.charAt(0).toUpperCase() + rawLabel.slice(1));

                    return (
                        <li key={to} className="flex items-center">
                            <ChevronRight size={14} className="breadcrumb-separator" />
                            {last ? (
                                <motion.span
                                    initial={{ opacity: 0, x: -5 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="ml-2 text-sm font-bold text-white tracking-wide"
                                    aria-current="page"
                                >
                                    {label}
                                </motion.span>
                            ) : (
                                <Link
                                    to={to}
                                    className="breadcrumb-item ml-2"
                                >
                                    {label}
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
