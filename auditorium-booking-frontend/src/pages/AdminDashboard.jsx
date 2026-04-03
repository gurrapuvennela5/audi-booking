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
                    placeholder="Reason for rejection (optional)..."
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

const AdminDashboard = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [rejectTarget, setRejectTarget] = useState(null);
    const [selectedBooking, setSelectedBooking] = useState(null);

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
            toast.success('Booking fully approved! Slot confirmed.');
            setBookings((prev) => prev.filter((b) => b._id !== id));
            setSelectedBooking(null);
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
            setSelectedBooking(null);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Rejection failed');
        } finally {
            setActionLoading(null);
        }
    };

    const formatDate = (date) =>
        date ? new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A';

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard 🛡️</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">Final approval authority for all bookings</p>
                </div>

                {/* Info banner */}
                <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4 mb-6 flex items-start gap-3">
                    <svg className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <div>
                        <p className="text-sm font-semibold text-purple-800 dark:text-purple-300">Final Approval Panel</p>
                        <p className="text-xs text-purple-600 dark:text-purple-400 mt-0.5">
                            These bookings have been approved by the HOD. Your approval will mark the slot as <strong>confirmed</strong> and lock the auditorium.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Bookings list */}
                    <div className="lg:col-span-1">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="font-semibold text-gray-800 dark:text-gray-200 text-sm">
                                HOD-Approved Bookings
                                {bookings.length > 0 && <span className="ml-2 badge-pending">{bookings.length}</span>}
                            </h2>
                            <button onClick={fetchPending} className="text-xs text-brand-600 hover:underline">Refresh</button>
                        </div>

                        {loading ? (
                            <LoadingSpinner />
                        ) : bookings.length === 0 ? (
                            <div className="text-center py-10 card">
                                <div className="text-3xl mb-2">✅</div>
                                <p className="text-gray-500 text-sm font-medium">All done!</p>
                                <p className="text-gray-400 text-xs mt-1">No pending final approvals.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {bookings.map((b) => (
                                    <div
                                        key={b._id}
                                        onClick={() => setSelectedBooking(b)}
                                        className={`card cursor-pointer hover:shadow-md transition-all duration-150 ${selectedBooking?._id === b._id ? 'ring-2 ring-brand-500' : ''
                                            }`}
                                    >
                                        <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{b.title}</p>
                                        <p className="text-xs text-gray-500 mt-0.5">{b.userId?.name} · {formatDate(b.date)}</p>
                                        <p className="text-xs text-gray-400">{b.auditoriumId?.name}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Detail panel */}
                    <div className="lg:col-span-2">
                        {selectedBooking ? (
                            <div className="card animate-fade-in">
                                <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-4">{selectedBooking.title}</h3>

                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    {[
                                        { label: 'Student', value: selectedBooking.userId?.name },
                                        { label: 'Email', value: selectedBooking.userId?.email },
                                        { label: 'Branch', value: selectedBooking.userId?.branch || 'N/A' },
                                        { label: 'Roll No', value: selectedBooking.userId?.rollNo || 'N/A' },
                                        { label: 'Auditorium', value: selectedBooking.auditoriumId?.name },
                                        { label: 'Capacity', value: selectedBooking.auditoriumId?.capacity },
                                        { label: 'Date', value: formatDate(selectedBooking.date) },
                                        { label: 'Time Slot', value: selectedBooking.timeSlot },
                                        { label: 'Category', value: selectedBooking.category },
                                    ].map((f) => (
                                        <div key={f.label}>
                                            <p className="text-xs text-gray-400">{f.label}</p>
                                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mt-0.5">{f.value || '—'}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Resource verification */}
                                {selectedBooking.auditoriumId?.resources && (
                                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 mb-6">
                                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Resource Verification</p>
                                        <div className="grid grid-cols-2 gap-3 text-xs">
                                            {Object.entries(selectedBooking.auditoriumId.resources).map(([k, v]) => (
                                                <div key={k} className="flex items-center gap-2">
                                                    <span className={`w-2 h-2 rounded-full ${v && v !== 'None' && v !== 0 && v !== false ? 'bg-green-400' : 'bg-gray-300'}`} />
                                                    <span className="capitalize text-gray-600 dark:text-gray-300">{k}:</span>
                                                    <span className="font-medium text-gray-800 dark:text-gray-200">
                                                        {typeof v === 'boolean' ? (v ? 'Yes' : 'No') : v || 'None'}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => handleApprove(selectedBooking._id)}
                                        disabled={actionLoading === selectedBooking._id}
                                        className="btn-success flex-1"
                                    >
                                        {actionLoading === selectedBooking._id ? '...' : '✅ Confirm Booking'}
                                    </button>
                                    <button
                                        onClick={() => setRejectTarget(selectedBooking._id)}
                                        disabled={actionLoading === selectedBooking._id}
                                        className="btn-danger flex-1"
                                    >
                                        ❌ Reject
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="card flex flex-col items-center justify-center py-20 text-center">
                                <div className="text-5xl mb-4">👈</div>
                                <p className="text-gray-500 font-medium">Select a booking to review</p>
                                <p className="text-gray-400 text-xs mt-1">Click any booking from the list to see full details</p>
                            </div>
                        )}
                    </div>
                </div>
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

export default AdminDashboard;
