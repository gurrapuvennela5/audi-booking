import React from 'react';

const statusConfig = {
    PENDING_HOD: {
        label: 'Pending HOD',
        badge: 'badge-pending',
        icon: '⏳',
    },
    APPROVED_HOD: {
        label: 'HOD Approved',
        badge: 'badge-pending',
        icon: '✅',
    },
    APPROVED_ADMIN: {
        label: 'Fully Approved',
        badge: 'badge-approved',
        icon: '🎉',
    },
    REJECTED: {
        label: 'Rejected',
        badge: 'badge-rejected',
        icon: '❌',
    },
};

const BookingCard = ({ booking }) => {
    const config = statusConfig[booking.status] || statusConfig.PENDING_HOD;
    const auditoriumName = booking.auditoriumId?.name || 'N/A';
    const bookingDate = booking.date
        ? new Date(booking.date).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        })
        : 'N/A';

    return (
        <div className="card hover:shadow-md transition-shadow duration-200 animate-slide-up">
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate">{booking.title}</h3>
                    <p className="text-xs text-gray-400 mt-0.5 capitalize">{booking.category}</p>
                </div>
                <span className={config.badge}>
                    {config.icon} {config.label}
                </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" />
                    </svg>
                    <span className="truncate">{auditoriumName}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{bookingDate}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{booking.timeSlot}</span>
                </div>
            </div>

            {booking.remarks && (
                <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-lg">
                    <p className="text-xs text-red-700 dark:text-red-400">
                        <span className="font-semibold">Remarks:</span> {booking.remarks}
                    </p>
                </div>
            )}
        </div>
    );
};

export default BookingCard;
