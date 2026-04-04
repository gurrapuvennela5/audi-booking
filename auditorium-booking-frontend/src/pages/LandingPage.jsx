import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const stats = [
    { value: '5+', label: 'Venues' },
    { value: '500+', label: 'Events/Year' },
    { value: '100%', label: 'Digital Approval' },
];

const features = [
    {
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        ),
        title: 'Smart Scheduling',
        desc: 'Real-time slot availability with color-coded calendar views.',
    },
    {
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
        ),
        title: 'Dual-Level Approval',
        desc: 'Streamlined HOD → Admin workflow for secure booking authorization.',
    },
    {
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
        ),
        title: 'Auto Letter Generation',
        desc: 'Automatically generate and edit formal booking request letters.',
    },
    {
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
        ),
        title: 'Resource Management',
        desc: 'Track projectors, mics, AC, and sound systems per auditorium.',
    },
];

const LandingPage = () => {
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();

    const handleGetStarted = () => {
        if (isAuthenticated) {
            const dashRoutes = { student: '/dashboard/student', hod: '/dashboard/hod', admin: '/dashboard/admin' };
            navigate(dashRoutes[user?.role] || '/dashboard/student');
        } else {
            navigate('/login');
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            {/* Hero Section */}
            <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden">
                {/* Background */}
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('/hero-bg.png')" }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-gray-900/60 to-gray-900/90" />

                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto animate-slide-up">
                    <div className="inline-flex items-center gap-2 bg-brand-600/20 border border-brand-400/30 text-white text-xs font-medium px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm">
                        <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-pulse" />
                        VNRVJIET Official Booking Platform
                    </div>

                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-4 leading-tight">
                        Seamless Event
                        <br />
                        <span className="bg-gradient-to-r from-brand-400 to-blue-300 bg-clip-text text-transparent">
                            Scheduling
                        </span>
                    </h1>

                    <p className="text-gray-300 text-base md:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
                        A unified platform for seamless event scheduling, departmental approvals, and resource management.
                    </p>

                    <div className="flex flex-wrap gap-3 justify-center mb-12">
                        <button onClick={handleGetStarted} className="btn-primary px-8 py-3 text-base flex items-center gap-2">
                            Get Started
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="flex justify-center gap-8 md:gap-16">
                        {stats.map((stat) => (
                            <div key={stat.label} className="text-center">
                                <p className="text-2xl md:text-3xl font-bold text-white">{stat.value}</p>
                                <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce">
                    <svg className="w-5 h-5 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-4 bg-white dark:bg-gray-900">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">Why VNRVJIET Aura?</h2>
                        <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto text-sm">
                            Designed specifically for the VNRVJIET campus community to simplify auditorium management.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((f, i) => (
                            <div
                                key={i}
                                className="p-6 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-brand-200 dark:hover:border-brand-700 hover:shadow-md transition-all duration-200 group"
                            >
                                <div className="w-12 h-12 bg-brand-50 dark:bg-brand-900/30 rounded-xl flex items-center justify-center text-brand-600 dark:text-brand-400 mb-4 group-hover:scale-110 transition-transform duration-200">
                                    {f.icon}
                                </div>
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">{f.title}</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Auditoriums Section */}
            <section className="py-16 px-4 bg-gray-50 dark:bg-gray-800/50">
                <div className="max-w-6xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Our Venues</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-10">Five world-class facilities for your events</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {['KS Auditorium', 'APJ Abdul Kalam Auditorium', 'B Block Seminar Hall', 'VJIM Auditorium', 'New Block Auditorium'].map((name, i) => (
                            <div key={i} className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                                <div className="w-10 h-10 bg-brand-50 dark:bg-brand-900/30 rounded-xl flex items-center justify-center text-brand-600 text-lg mx-auto mb-3">🎭</div>
                                <p className="text-xs font-semibold text-gray-800 dark:text-white leading-tight">{name}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 px-4 bg-brand-600">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-white mb-3">Ready to Book Your Event?</h2>
                    <p className="text-brand-200 mb-8 text-sm">Create your account and start booking auditoriums in minutes.</p>
                    <div className="flex gap-3 justify-center flex-wrap">
                        <Link to="/register" className="bg-white text-brand-600 font-semibold px-8 py-3 rounded-xl hover:bg-brand-50 transition-colors shadow-md">
                            Get Started
                        </Link>
                        <Link to="/login" className="border-2 border-white/30 text-white font-semibold px-8 py-3 rounded-xl hover:bg-white/10 transition-colors">
                            Sign In
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
