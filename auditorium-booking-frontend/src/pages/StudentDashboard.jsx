import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { bookingService } from '../services';
import BookingCard from '../components/BookingCard';
import LoadingSpinner from '../components/LoadingSpinner';

const StudentDashboard = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const res = await bookingService.getMyBookings();
            setBookings(res.data.bookings || []);
        } catch {
            toast.error('Failed to load bookings');
        } finally {
            setLoading(false);
        }
    };

    const filtered = filter === 'ALL' ? bookings : bookings.filter((b) => b.status === filter);

    const statusCounts = {
        'PENDING_HOD': bookings.filter((b) => b.status === 'PENDING_HOD').length,
        'APPROVED_HOD': bookings.filter((b) => b.status === 'APPROVED_HOD').length,
        'APPROVED_ADMIN': bookings.filter((b) => b.status === 'APPROVED_ADMIN').length,
        'REJECTED': bookings.filter((b) => b.status === 'REJECTED').length,
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Welcome, {user?.name?.split(' ')[0]} 👋
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
                            {user?.branch} · {user?.rollNo} · Year {user?.year}
                        </p>
                    </div>
                    <Link to="/book" className="btn-primary flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Book Auditorium
                    </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: 'Pending HOD', count: statusCounts.PENDING_HOD, color: 'yellow', icon: '⏳' },
                        { label: 'HOD Approved', count: statusCounts.APPROVED_HOD, color: 'blue', icon: '✅' },
                        { label: 'Fully Approved', count: statusCounts.APPROVED_ADMIN, color: 'green', icon: '🎉' },
                        { label: 'Rejected', count: statusCounts.REJECTED, color: 'red', icon: '❌' },
                    ].map((s) => (
                        <div key={s.label} className="card text-center">
                            <div className="text-2xl mb-1">{s.icon}</div>
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">{s.count}</div>
                            <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
                        </div>
                    ))}
                </div>

                {/* Filter tabs */}
                <div className="flex gap-2 flex-wrap mb-5">
                    {['ALL', 'PENDING_HOD', 'APPROVED_HOD', 'APPROVED_ADMIN', 'REJECTED'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${filter === f
                                    ? 'bg-brand-600 text-white shadow-sm'
                                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-brand-300'
                                }`}
                        >
                            {f === 'ALL' ? 'All' : f.replace('_', ' ')}
                            {f !== 'ALL' && statusCounts[f] > 0 && (
                                <span className="ml-1.5 bg-white/20 text-current px-1.5 py-0.5 rounded-full text-[10px]">{statusCounts[f]}</span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Bookings list */}
                {loading ? (
                    <LoadingSpinner text="Loading your bookings..." />
                ) : filtered.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="text-5xl mb-4">📭</div>
                        <h3 className="text-gray-500 font-medium">No bookings found</h3>
                        <p className="text-gray-400 text-sm mt-1">
                            {filter === 'ALL' ? 'Start by booking an auditorium!' : `No ${filter.replace('_', ' ')} bookings.`}
                        </p>
                        <Link to="/book" className="btn-primary inline-flex mt-4 text-sm">Book Now</Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filtered.map((b) => <BookingCard key={b._id} booking={b} />)}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentDashboard;
