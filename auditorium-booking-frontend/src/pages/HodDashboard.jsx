import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { bookingService } from '../services';
import LoadingSpinner from '../components/LoadingSpinner';

const RemarksModal = ({ onClose, onConfirm }) => {
    const [remarks, setRemarks] = useState('');
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6 animate-slide-up">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4">Rejection Remarks</h3>
                <textarea
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Provide a reason for rejection (optional)..."
                    className="input-field h-28 resize-none"
                />
                <div className="flex gap-3 mt-4">
                    <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
                    <button onClick={() => onConfirm(remarks)} className="btn-danger flex-1">Confirm Reject</button>
                </div>
            </div>
        </div>
    );
};

const PendingBookingRow = ({ booking, onApprove, onReject, actionLoading }) => {
    const studentName = booking.userId?.name || 'Unknown';
    const studentEmail = booking.userId?.email || '';
    const auditoriumName = booking.auditoriumId?.name || 'N/A';
    const date = booking.date ? new Date(booking.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A';

    return (
        <div className="card hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{booking.title}</h3>
                        <span className="badge-pending">{booking.category}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
                        <span>👤 {studentName}</span>
                        <span>🏛️ {auditoriumName}</span>
                        <span>📅 {date}</span>
                        <span>⏱️ {booking.timeSlot}</span>
                        <span className="col-span-2 truncate">✉️ {studentEmail}</span>
                    </div>
                </div>
                <div className="flex sm:flex-col gap-2 shrink-0">
                    <button
                        onClick={() => onApprove(booking._id)}
                        disabled={actionLoading === booking._id}
                        className="btn-success text-xs px-4 py-2"
                    >
                        {actionLoading === booking._id ? '...' : '✅ Approve'}
                    </button>
                    <button
                        onClick={() => onReject(booking._id)}
                        disabled={actionLoading === booking._id}
                        className="btn-danger text-xs px-4 py-2"
                    >
                        ❌ Reject
                    </button>
                </div>
            </div>
        </div>
    );
};

const HodDashboard = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [rejectTarget, setRejectTarget] = useState(null);

    useEffect(() => { fetchPending(); }, []);

    const fetchPending = async () => {
        try {
            const res = await bookingService.getPendingBookings();
            setBookings(res.data.bookings || []);
        } catch {
            toast.error('Failed to load pending bookings');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        setActionLoading(id);
        try {
            await bookingService.approve(id);
            toast.success('Booking approved!');
            setBookings((prev) => prev.filter((b) => b._id !== id));
        } catch (err) {
            toast.error(err.response?.data?.message || 'Approval failed');
        } finally {
            setActionLoading(null);
        }
    };

    const handleRejectConfirm = async (remarks) => {
        const id = rejectTarget;
        setRejectTarget(null);
        setActionLoading(id);
        try {
            await bookingService.reject(id, remarks);
            toast.success('Booking rejected');
            setBookings((prev) => prev.filter((b) => b._id !== id));
        } catch (err) {
            toast.error(err.response?.data?.message || 'Rejection failed');
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">HOD Dashboard 👨‍💼</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
                        Department: {user?.department} · Faculty ID: {user?.facultyId}
                    </p>
                </div>

                {/* Info banner */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6 flex items-start gap-3">
                    <svg className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                        <p className="text-sm font-semibold text-blue-800 dark:text-blue-300">First-level Approvals</p>
                        <p className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">
                            Approved bookings will move to <strong>APPROVED_HOD</strong> status and await Admin final approval.
                        </p>
                    </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold text-gray-800 dark:text-gray-200">
                        Pending Approvals
                        {bookings.length > 0 && (
                            <span className="ml-2 badge-pending">{bookings.length}</span>
                        )}
                    </h2>
                    <button onClick={fetchPending} className="text-xs text-brand-600 hover:underline">Refresh</button>
                </div>

                {loading ? (
                    <LoadingSpinner text="Loading pending bookings..." />
                ) : bookings.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="text-5xl mb-4">🎉</div>
                        <h3 className="text-gray-500 font-medium">All caught up!</h3>
                        <p className="text-gray-400 text-sm mt-1">No pending bookings to review.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {bookings.map((b) => (
                            <PendingBookingRow
                                key={b._id}
                                booking={b}
                                onApprove={handleApprove}
                                onReject={(id) => setRejectTarget(id)}
                                actionLoading={actionLoading}
                            />
                        ))}
                    </div>
                )}
            </div>

            {rejectTarget && (
                <RemarksModal
                    onClose={() => setRejectTarget(null)}
                    onConfirm={handleRejectConfirm}
                />
            )}
        </div>
    );
};

export default HodDashboard;
