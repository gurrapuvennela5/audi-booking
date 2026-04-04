import React, { useState } from 'react';

const TimeSlotPicker = ({ date, availabilityData, selectedSlot, onSelect }) => {
    const [startTime, setStartTime] = useState(selectedSlot?.startTime || '08:00');
    const [duration, setDuration] = useState(selectedSlot?.duration || 1);

    const bookedSlots = new Set(
        availabilityData
            .filter((slot) => slot.isBooked)
            .map((slot) => slot.timeSlot)
    );

    const pendingSlots = new Set(
        availabilityData
            .filter((slot) => !slot.isBooked)
            .map((slot) => slot.timeSlot)
    );

    const calculateEndTime = (start, durationHours) => {
        const [hours, minutes] = start.split(':').map(Number);
        const endHours = (hours + durationHours) % 24;
        return `${String(endHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    };

    const handleSubmit = () => {
        const endTime = calculateEndTime(startTime, duration);
        const timeSlotString = `${startTime}-${endTime}`;
        onSelect({
            timeSlot: timeSlotString,
            startTime,
            duration,
        });
    };

    if (!date) {
        return (
            <div className="text-center py-8 text-gray-400 text-sm">
                Select a date to enter your time slot
            </div>
        );
    }

    const endTime = calculateEndTime(startTime, duration);
    const timeSlotString = `${startTime}-${endTime}`;

    return (
        <div className="space-y-6">
            <div className="">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">📅 Select Your Time Slot</h3>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">Start Time *</label>
                        <input
                            type="time"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            className="input-field"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">Duration (hours) *</label>
                        <input
                            type="number"
                            min="0.5"
                            max="12"
                            step="0.5"
                            value={duration}
                            onChange={(e) => setDuration(parseFloat(e.target.value))}
                            className="input-field"
                            placeholder="e.g. 2"
                        />
                    </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                        <span className="font-semibold">Your selected slot:</span><br/>
                        <span className="text-lg font-bold text-brand-600 dark:text-blue-400">{timeSlotString}</span><br/>
                        <span className="text-xs text-gray-600 dark:text-gray-400">({duration} hours)</span>
                    </p>
                </div>

                <button
                    onClick={handleSubmit}
                    className="w-full btn-primary py-2"
                >
                    ✓ Confirm Time Slot
                </button>
            </div>

            <div className="border-t pt-4">
                <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-3 uppercase">Existing Bookings on This Date</h4>
                {availabilityData && availabilityData.length > 0 ? (
                    <div className="space-y-2">
                        {availabilityData.map((slot, idx) => (
                            <div key={idx} className={`text-xs p-2 rounded-lg ${
                                slot.isBooked 
                                    ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                                    : 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400'
                            }`}>
                                {slot.timeSlot} - {slot.isBooked ? '🔴 Booked' : '🟡 Pending'}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-xs text-green-600 dark:text-green-400">✅ All times are available on this date!</p>
                )}
            </div>
        </div>
    );
};

export default TimeSlotPicker;
