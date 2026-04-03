import React, { useState } from 'react';

const resourceIcons = {
    projector: { icon: '📽️', label: 'Projector' },
    ac: { icon: '❄️', label: 'Air Conditioned' },
    mics: { icon: '🎤', label: 'Microphones' },
    sound: { icon: '🔊', label: 'Sound System' },
};

const AuditoriumCard = ({ auditorium, selected, onSelect }) => {
    const [hovered, setHovered] = useState(false);
    const { resources = {} } = auditorium;

    return (
        <div
            className={`relative card cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ${selected
                    ? 'ring-2 ring-brand-500 border-brand-200 shadow-brand-100/50 shadow-lg'
                    : 'hover:border-brand-200'
                }`}
            onClick={() => onSelect(auditorium)}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Selected indicator */}
            {selected && (
                <div className="absolute top-3 right-3 w-6 h-6 bg-brand-600 rounded-full flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
            )}

            {/* Auditorium icon */}
            <div className="w-12 h-12 bg-brand-50 dark:bg-brand-900/30 rounded-xl flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
            </div>

            <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">{auditorium.name}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mb-3">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Capacity: {auditorium.capacity?.toLocaleString()}
            </p>

            {/* Resource chips */}
            <div className="flex flex-wrap gap-1.5">
                {resources.projector && (
                    <span className="text-[10px] px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full font-medium">📽️ Projector</span>
                )}
                {resources.ac && (
                    <span className="text-[10px] px-2 py-0.5 bg-cyan-50 text-cyan-700 rounded-full font-medium">❄️ AC</span>
                )}
                {resources.mics > 0 && (
                    <span className="text-[10px] px-2 py-0.5 bg-purple-50 text-purple-700 rounded-full font-medium">🎤 {resources.mics} Mics</span>
                )}
                {resources.sound && resources.sound !== 'None' && (
                    <span className="text-[10px] px-2 py-0.5 bg-orange-50 text-orange-700 rounded-full font-medium">🔊 {resources.sound}</span>
                )}
            </div>

            {/* Hover tooltip overlay */}
            {hovered && (
                <div className="absolute inset-0 bg-brand-600/95 rounded-2xl p-4 flex flex-col justify-center animate-fade-in pointer-events-none z-10">
                    <h4 className="text-white font-bold text-sm mb-3">{auditorium.name}</h4>
                    <div className="space-y-2 text-white text-xs">
                        <div className="flex justify-between">
                            <span className="opacity-75">Capacity</span>
                            <span className="font-semibold">{auditorium.capacity?.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="opacity-75">📽️ Projector</span>
                            <span className="font-semibold">{resources.projector ? 'Yes' : 'No'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="opacity-75">🎤 Mics</span>
                            <span className="font-semibold">{resources.mics || 0}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="opacity-75">❄️ AC</span>
                            <span className="font-semibold">{resources.ac ? 'Yes' : 'No'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="opacity-75">🔊 Sound</span>
                            <span className="font-semibold">{resources.sound || 'None'}</span>
                        </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-white/20 text-center">
                        <span className="text-white/80 text-xs">{selected ? '✅ Selected' : 'Click to select'}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AuditoriumCard;
