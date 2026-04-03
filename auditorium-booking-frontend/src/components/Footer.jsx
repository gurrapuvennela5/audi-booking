import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-brand-600 rounded-xl flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                        <div>
                            <p className="font-bold text-white text-sm">VNRVJIET Aura</p>
                            <p className="text-[10px] text-gray-400 uppercase tracking-widest">Auditorium Management System</p>
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">
                        A unified platform for seamless event scheduling, departmental approvals, and resource management.
                    </p>
                </div>

                <div>
                    <h4 className="font-semibold text-white mb-3 text-sm">Emergency Contact</h4>
                    <ul className="space-y-1.5 text-xs text-gray-400">
                        <li className="flex items-center gap-2">
                            <svg className="w-3.5 h-3.5 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            Admin Office: +91-40-2304-1111
                        </li>
                        <li className="flex items-center gap-2">
                            <svg className="w-3.5 h-3.5 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            Security: +91-40-2304-1000
                        </li>
                        <li className="flex items-center gap-2">
                            <svg className="w-3.5 h-3.5 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            admin@vnrvjiet.in
                        </li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-semibold text-white mb-3 text-sm">System Manual</h4>
                    <ul className="space-y-1.5 text-xs text-gray-400">
                        <li>
                            <a href="#" className="hover:text-brand-400 transition-colors">How to book an auditorium</a>
                        </li>
                        <li>
                            <a href="#" className="hover:text-brand-400 transition-colors">HOD approval workflow</a>
                        </li>
                        <li>
                            <a href="#" className="hover:text-brand-400 transition-colors">Admin final approval guide</a>
                        </li>
                        <li>
                            <a href="#" className="hover:text-brand-400 transition-colors">FAQs</a>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-800 text-xs text-gray-500 text-center">
                © {new Date().getFullYear()} VNRVJIET Aura — Auditorium Management System. All rights reserved.
            </div>
        </div>
    </footer>
);

export default Footer;
