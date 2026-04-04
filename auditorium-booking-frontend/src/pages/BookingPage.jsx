import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { auditoriumService, availabilityService, bookingService } from '../services';
import AuditoriumCard from '../components/AuditoriumCard';
import TimeSlotPicker from '../components/TimeSlotPicker';
import LetterEditor from '../components/LetterEditor';
import LoadingSpinner from '../components/LoadingSpinner';

const CATEGORIES = ['Workshop', 'Cultural', 'Seminar', 'Sports', 'Technical', 'Other'];
const STEPS = ['Event Details', 'Select Auditorium', 'Choose Time Slot', 'Review & Submit'];

// Fallback static auditoriums for if API returns empty
const STATIC_AUDITORIUMS = [
    { _id: '507f1f77bcf86cd799439011', name: 'KS Auditorium', capacity: 1000, resources: { projector: true, mics: 6, ac: true, sound: 'Dolby 5.1' } },
    { _id: '507f1f77bcf86cd799439012', name: 'APJ Abdul Kalam Auditorium', capacity: 800, resources: { projector: true, mics: 4, ac: true, sound: 'Stereo' } },
    { _id: '507f1f77bcf86cd799439013', name: 'B Block Seminar Hall', capacity: 200, resources: { projector: true, mics: 2, ac: false, sound: 'Mono' } },
    { _id: '507f1f77bcf86cd799439014', name: 'VJIM Auditorium', capacity: 600, resources: { projector: true, mics: 3, ac: true, sound: 'Stereo' } },
    { _id: '507f1f77bcf86cd799439015', name: 'New Block Auditorium', capacity: 400, resources: { projector: true, mics: 4, ac: true, sound: 'Dolby' } },
];

const generateLetterTemplate = (user, auditorium, form) => {
    return `<p>To,</p>
<p>The HOD – ${user?.department || '[Department]'}</p>
<br/>
<p><strong>Subject:</strong> Request for booking ${auditorium?.name || '[Auditorium Name]'} for ${form.title || '[Event Title]'}</p>
<br/>
<p>Respected Sir/Madam,</p>
<br/>
<p>I, <strong>${user?.name || '[Name]'}</strong>, from ${user?.branch || '[Branch]'} (Year ${user?.year || '[Year]'}), Roll No: ${user?.rollNo || '[Roll No]'}, request your kind permission to use the <strong>${auditorium?.name || '[Auditorium]'}</strong> for the event titled <strong>"${form.title || '[Event Title]'}"</strong> under the category <strong>${form.category || '[Category]'}</strong>.</p>
<br/>
<p>The event is scheduled on <strong>${form.date || '[Date]'}</strong> during the <strong>${form.timeSlot || '[Time Slot]'}</strong> slot. The expected attendance is approximately <strong>${form.capacity || '[Number]'}</strong> participants.</p>
<br/>
<p>I assure you that the auditorium will be used responsibly and returned in the same condition. Kindly grant approval at your earliest convenience.</p>
<br/>
<p>Thanking you,</p>
<p>${user?.name || '[Name]'}</p>
<p>Roll No: ${user?.rollNo || 'N/A'} | Branch: ${user?.branch || 'N/A'} | Year: ${user?.year || 'N/A'}</p>
<p>Email: ${user?.email || 'N/A'}</p>`;
};

const StepIndicator = ({ current, total, labels }) => (
    <div className="flex items-center justify-between mb-8">
        {labels.map((label, i) => (
            <React.Fragment key={i}>
                <div className="flex flex-col items-center gap-1.5">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${i < current ? 'bg-green-500 text-white' :
                            i === current ? 'bg-brand-600 text-white shadow-lg shadow-brand-200' :
                                'bg-gray-200 dark:bg-gray-700 text-gray-400'
                        }`}>
                        {i < current ? '✓' : i + 1}
                    </div>
                    <span className={`text-[10px] font-semibold hidden sm:block ${i === current ? 'text-brand-600' : 'text-gray-400'
                        }`}>{label}</span>
                </div>
                {i < total - 1 && (
                    <div className={`flex-1 h-0.5 mx-2 transition-all duration-300 ${i < current ? 'bg-green-400' : 'bg-gray-200 dark:bg-gray-700'}`} />
                )}
            </React.Fragment>
        ))}
    </div>
);

const BookingPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [step, setStep] = useState(0);
    const [form, setForm] = useState({ title: '', category: 'Seminar', capacity: '', date: '' });
    const [auditoriums, setAuditoriums] = useState([]);
    const [selectedAuditorium, setSelectedAuditorium] = useState(null);
    const [availability, setAvailability] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState('');
    const [letter, setLetter] = useState('');
    const [loading, setLoading] = useState({ auditoriums: false, availability: false, submit: false });

    // Load auditoriums on mount
    useEffect(() => {
        const fetchAuditoriums = async () => {
            setLoading((l) => ({ ...l, auditoriums: true }));
            try {
                const res = await auditoriumService.getAll();
                const data = res.data.auditoriums || [];
                setAuditoriums(data.length > 0 ? data : STATIC_AUDITORIUMS);
            } catch {
                setAuditoriums(STATIC_AUDITORIUMS);
                toast('Using offline auditorium data', { icon: '📋' });
            } finally {
                setLoading((l) => ({ ...l, auditoriums: false }));
            }
        };
        fetchAuditoriums();
    }, []);

    // Fetch availability when date + auditorium selected
    useEffect(() => {
        if (!form.date || !selectedAuditorium) return;
        const fetchAvailability = async () => {
            setLoading((l) => ({ ...l, availability: true }));
            try {
                const res = await availabilityService.getByDate(form.date);
                const all = res.data.slots || [];
                const filtered = all.filter((s) => s.auditoriumId?._id === selectedAuditorium._id || s.auditoriumId === selectedAuditorium._id);
                setAvailability(filtered);
            } catch {
                setAvailability([]);
            } finally {
                setLoading((l) => ({ ...l, availability: false }));
            }
        };
        fetchAvailability();
    }, [form.date, selectedAuditorium]);

    // Auto-generate letter when reaching step 3
    useEffect(() => {
        if (step === 3) {
            setLetter(generateLetterTemplate(user, selectedAuditorium, { ...form, timeSlot: selectedSlot }));
        }
    }, [step]);

    const handleNextStep = () => {
        if (step === 0) {
            if (!form.title || !form.category || !form.date) {
                return toast.error('Please fill in all event details');
            }
        }
        if (step === 1 && !selectedAuditorium) return toast.error('Please select an auditorium');
        if (step === 2 && !selectedSlot) return toast.error('Please select a time slot');
        setStep((s) => s + 1);
    };

    const handleSubmit = async () => {
        setLoading((l) => ({ ...l, submit: true }));
        try {
            const timeSlotToSubmit = typeof selectedSlot === 'string' 
                ? selectedSlot 
                : selectedSlot?.timeSlot || selectedSlot;
            
            await bookingService.create({
                auditoriumId: selectedAuditorium._id,
                title: form.title,
                category: form.category,
                date: form.date,
                timeSlot: timeSlotToSubmit,
            });
            toast.success('Booking submitted! Awaiting HOD approval 🎉');
            navigate('/dashboard/student');
        } catch (err) {
            console.error('BOOKING SUBMIT ERROR:', err);
            console.error('RESPONSE DATA:', err.response?.data);
            const errorMsg = err.response?.data?.message || err.message || 'Booking failed';
            toast.error(errorMsg);
        } finally {
            setLoading((l) => ({ ...l, submit: false }));
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Book an Auditorium</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">Complete all steps to submit your booking request</p>
                </div>

                <StepIndicator current={step} total={STEPS.length} labels={STEPS} />

                <div className="card animate-slide-up">
                    {/* STEP 0: Event Details */}
                    {step === 0 && (
                        <div className="space-y-4">
                            <h2 className="font-bold text-gray-900 dark:text-white text-lg">📋 Event Details</h2>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Event Title *</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Annual Tech Talk 2026"
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    className="input-field"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Category *</label>
                                    <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field">
                                        {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Expected Capacity</label>
                                    <input
                                        type="number"
                                        placeholder="e.g. 200"
                                        value={form.capacity}
                                        onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                                        className="input-field"
                                        min="1"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Event Date *</label>
                                <input
                                    type="date"
                                    value={form.date}
                                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                                    min={new Date().toISOString().split('T')[0]}
                                    className="input-field"
                                />
                            </div>
                        </div>
                    )}

                    {/* STEP 1: Auditorium Selection */}
                    {step === 1 && (
                        <div>
                            <h2 className="font-bold text-gray-900 dark:text-white text-lg mb-4">🏛️ Select Auditorium</h2>
                            <p className="text-xs text-gray-400 mb-4">Hover over a card to see available resources. Click to select.</p>
                            {loading.auditoriums ? (
                                <LoadingSpinner text="Loading auditoriums..." />
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {auditoriums.map((a) => (
                                        <AuditoriumCard
                                            key={a._id}
                                            auditorium={a}
                                            selected={selectedAuditorium?._id === a._id}
                                            onSelect={setSelectedAuditorium}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* STEP 2: Time Slot Picker */}
                    {step === 2 && (
                        <div>
                            <h2 className="font-bold text-gray-900 dark:text-white text-lg mb-1">⏰ Choose Time Slot</h2>
                            <p className="text-xs text-gray-400 mb-4">
                                Showing availability for <strong>{selectedAuditorium?.name}</strong> on <strong>{form.date}</strong>
                            </p>
                            {loading.availability ? (
                                <LoadingSpinner text="Checking availability..." />
                            ) : (
                                <TimeSlotPicker
                                    date={form.date}
                                    availabilityData={availability}
                                    selectedSlot={selectedSlot}
                                    onSelect={setSelectedSlot}
                                />
                            )}
                        </div>
                    )}

                    {/* STEP 3: Letter Editor & Review */}
                    {step === 3 && (
                        <div>
                            <h2 className="font-bold text-gray-900 dark:text-white text-lg mb-4">📄 Review & Edit Request Letter</h2>

                            {/* Summary */}
                            <div className="bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800 rounded-xl p-4 mb-5">
                                <p className="text-xs font-bold text-brand-700 dark:text-brand-400 uppercase tracking-wider mb-3">Booking Summary</p>
                                <div className="grid grid-cols-2 gap-2 text-xs text-gray-700 dark:text-gray-300">
                                    <span><strong>Event:</strong> {form.title}</span>
                                    <span><strong>Category:</strong> {form.category}</span>
                                    <span><strong>Auditorium:</strong> {selectedAuditorium?.name}</span>
                                    <span><strong>Capacity:</strong> {selectedAuditorium?.capacity?.toLocaleString()}</span>
                                    <span><strong>Date:</strong> {form.date}</span>
                                    <span><strong>Time:</strong> {typeof selectedSlot === 'string' ? selectedSlot : selectedSlot?.timeSlot || selectedSlot}</span>
                                    {typeof selectedSlot === 'object' && selectedSlot?.duration && (
                                        <span><strong>Duration:</strong> {selectedSlot.duration} hours</span>
                                    )}
                                </div>
                            </div>

                            <p className="text-xs text-gray-500 mb-3">You may edit the letter below before submitting:</p>
                            <LetterEditor value={letter} onChange={setLetter} />
                        </div>
                    )}

                    {/* Navigation */}
                    <div className="flex justify-between mt-8 pt-5 border-t border-gray-100 dark:border-gray-700">
                        {step > 0 ? (
                            <button onClick={() => setStep((s) => s - 1)} className="btn-secondary">← Back</button>
                        ) : <div />}

                        {step < STEPS.length - 1 ? (
                            <button onClick={handleNextStep} className="btn-primary">
                                Continue →
                            </button>
                        ) : (
                            <button onClick={handleSubmit} disabled={loading.submit} className="btn-primary px-8">
                                {loading.submit ? (
                                    <span className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                        Submitting...
                                    </span>
                                ) : '🚀 Submit Booking Request'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingPage;
