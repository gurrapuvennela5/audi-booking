import React from 'react';

const TIME_SLOTS = [
    '08:00-10:00',
    '10:00-12:00',
    '12:00-14:00',
    '14:00-16:00',
    '16:00-18:00',
    '18:00-20:00',
];

const TimeSlotPicker = ({ date, availabilityData, selectedSlot, onSelect }) => {
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

    const getSlotStatus = (slot) => {
        if (bookedSlots.has(slot)) return 'booked';
        if (pendingSlots.has(slot)) return 'pending';
        return 'available';
    };

    if (!date) {
        return (
            <div className="text-center py-8 text-gray-400 text-sm">
                Select a date to view available time slots
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center gap-4 mb-4 text-xs text-gray-500 flex-wrap">
                <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-green-400 inline-block" /> Available
                </span>
                <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-yellow-400 inline-block" /> Pending (in progress)
                </span>
                <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-red-400 inline-block" /> Booked
                </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {TIME_SLOTS.map((slot) => {
                    const status = getSlotStatus(slot);
                    const isBooked = status === 'booked';
                    const isPending = status === 'pending';
                    const isSelected = selectedSlot === slot;

                    return (
                        <button
                            key={slot}
                            disabled={isBooked || isPending}
                            onClick={() => onSelect(slot)}
                            className={`
                relative px-4 py-3 rounded-xl text-sm font-medium border-2 transition-all duration-150
                ${isBooked ? 'bg-red-50 border-red-200 text-red-400 cursor-not-allowed dark:bg-red-900/20 dark:border-red-800' : ''}
                ${isPending ? 'bg-yellow-50 border-yellow-200 text-yellow-600 cursor-not-allowed dark:bg-yellow-900/20 dark:border-yellow-800' : ''}
                ${!isBooked && !isPending && !isSelected ? 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100 hover:border-green-400 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400' : ''}
                ${isSelected ? 'bg-brand-600 border-brand-600 text-white shadow-md scale-105' : ''}
              `}
                        >
                            {slot}
                            {isBooked && <span className="block text-[10px] mt-0.5 opacity-60">Booked</span>}
                            {isPending && <span className="block text-[10px] mt-0.5 opacity-60">In Progress</span>}
                            {isSelected && <span className="block text-[10px] mt-0.5 opacity-80">Selected ✓</span>}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default TimeSlotPicker;
