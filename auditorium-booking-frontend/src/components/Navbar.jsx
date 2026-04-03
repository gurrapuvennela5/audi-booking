import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ darkMode, toggleDark }) => {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const dashboardLink = {
        student: '/dashboard/student',
        hod: '/dashboard/hod',
        admin: '/dashboard/admin',
    }[user?.role] || '/';

    return (
        <nav className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-900 dark:text-white leading-tight">VNRVJIET Aura</p>
                            <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest leading-tight">Auditorium Management</p>
                        </div>
                    </Link>

                    {/* Desktop Right */}
                    <div className="hidden md:flex items-center gap-3">
                        {/* Dark mode toggle */}
                        <button
                            onClick={toggleDark}
                            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            title="Toggle dark mode"
                        >
                            {darkMode ? (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                </svg>
                            )}
                        </button>

                        {isAuthenticated ? (
                            <>
                                <Link to={dashboardLink} className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-brand-600 transition-colors">
                                    Dashboard
                                </Link>
                                {user?.role === 'student' && (
                                    <Link to="/book" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-brand-600 transition-colors">
                                        Book
                                    </Link>
                                )}
                                <div className="flex items-center gap-2 pl-3 border-l border-gray-200 dark:border-gray-700">
                                    <div className="w-8 h-8 bg-brand-100 dark:bg-brand-900 rounded-full flex items-center justify-center">
                                        <span className="text-brand-700 dark:text-brand-300 text-xs font-bold">
                                            {user?.name?.charAt(0)?.toUpperCase()}
                                        </span>
                                    </div>
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{user?.name?.split(' ')[0]}</span>
                                    <button onClick={handleLogout} className="text-sm text-red-500 hover:text-red-600 font-medium ml-1">
                                        Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-brand-600 transition-colors px-3 py-2">
                                    Login
                                </Link>
                                <Link to="/register" className="btn-primary text-sm">
                                    Register
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile hamburger */}
                    <button
                        className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100"
                        onClick={() => setMobileOpen(!mobileOpen)}
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            {mobileOpen
                                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            }
                        </svg>
                    </button>
                </div>

                {/* Mobile menu */}
                {mobileOpen && (
                    <div className="md:hidden py-3 border-t border-gray-100 dark:border-gray-800 space-y-1 animate-fade-in">
                        {isAuthenticated ? (
                            <>
                                <Link to={dashboardLink} className="block px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">Dashboard</Link>
                                {user?.role === 'student' && <Link to="/book" className="block px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">Book Auditorium</Link>}
                                <button onClick={handleLogout} className="block w-full text-left px-3 py-2 text-sm font-medium text-red-500 rounded-lg hover:bg-red-50">Logout</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="block px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50">Login</Link>
                                <Link to="/register" className="block px-3 py-2 text-sm font-medium text-brand-600 rounded-lg hover:bg-brand-50">Register</Link>
                            </>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
