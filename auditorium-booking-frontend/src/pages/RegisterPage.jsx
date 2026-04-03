import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services';

const ROLES = ['student', 'hod', 'admin'];
const ROLE_LABELS = { student: 'STUDENT', hod: 'HOD', admin: 'ADMIN' };
const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

const RegisterPage = () => {
    const [role, setRole] = useState('student');
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        name: '', email: '', password: '', phone: '',
        branch: '', rollNo: '', year: '',
        department: '', facultyId: '',
        employeeId: '', officeLocation: '',
    });

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const payload = {
            name: form.name,
            email: form.email,
            password: form.password,
            role,
            ...(role === 'student' && { branch: form.branch, rollNo: form.rollNo, year: parseInt(form.year) || undefined }),
            ...(role === 'hod' && { department: form.department, facultyId: form.facultyId }),
            ...(role === 'admin' && { employeeId: form.employeeId }),
        };
        try {
            const res = await authService.register(payload);
            const { user, token } = res.data;
            login(user, token);
            toast.success('Account created successfully!');
            const routes = { student: '/dashboard/student', hod: '/dashboard/hod', admin: '/dashboard/admin' };
            navigate(routes[user.role] || '/');
        } catch (err) {
            const msg = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Registration failed';
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md animate-slide-up">
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-brand-600 px-8 pt-8 pb-10 text-center">
                        <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-white">Create Account</h1>
                        <p className="text-brand-200 text-sm mt-1">Join the VNRVJIET Aura network</p>

                        {/* Role tabs */}
                        <div className="flex gap-1 bg-white/10 rounded-xl p-1 mt-5">
                            {ROLES.map((r) => (
                                <button
                                    key={r}
                                    type="button"
                                    onClick={() => setRole(r)}
                                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${role === r ? 'bg-white text-brand-600 shadow' : 'text-white/70 hover:text-white'
                                        }`}
                                >
                                    {ROLE_LABELS[r]}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Form */}
                    <div className="px-8 py-8">
                        <form onSubmit={handleSubmit} className="space-y-3">
                            {/* Common fields */}
                            <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                </span>
                                <input name="name" type="text" placeholder="Full Name" value={form.name} onChange={handleChange} required className="input-field pl-10" />
                            </div>

                            <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                </span>
                                <input name="email" type="email" placeholder="Email (@vnrvjiet.in)" value={form.email} onChange={handleChange} required className="input-field pl-10" />
                            </div>

                            <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                </span>
                                <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required minLength={6} className="input-field pl-10" />
                            </div>

                            {/* Student fields */}
                            {role === 'student' && (
                                <>
                                    <div className="relative">
                                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                        </span>
                                        <input name="phone" type="tel" placeholder="Phone Number" value={form.phone} onChange={handleChange} className="input-field pl-10" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <input name="branch" type="text" placeholder="Branch (e.g. CSE)" value={form.branch} onChange={handleChange} className="input-field" />
                                        <input name="rollNo" type="text" placeholder="Roll No" value={form.rollNo} onChange={handleChange} className="input-field" />
                                    </div>
                                    <select name="year" value={form.year} onChange={handleChange} className="input-field">
                                        <option value="">Select Year</option>
                                        {YEARS.map((y, i) => <option key={y} value={i + 1}>{y}</option>)}
                                    </select>
                                </>
                            )}

                            {/* HOD fields */}
                            {role === 'hod' && (
                                <>
                                    <input name="department" type="text" placeholder="Department (e.g. CSE)" value={form.department} onChange={handleChange} className="input-field" />
                                    <input name="facultyId" type="text" placeholder="Faculty ID" value={form.facultyId} onChange={handleChange} className="input-field" />
                                </>
                            )}

                            {/* Admin fields */}
                            {role === 'admin' && (
                                <>
                                    <input name="employeeId" type="text" placeholder="Employee ID" value={form.employeeId} onChange={handleChange} className="input-field" />
                                    <input name="officeLocation" type="text" placeholder="Office Location" value={form.officeLocation} onChange={handleChange} className="input-field" />
                                </>
                            )}

                            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base mt-2">
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                        Creating account...
                                    </span>
                                ) : 'Sign Up'}
                            </button>
                        </form>

                        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
                            Already have an account?{' '}
                            <Link to="/login" className="text-brand-600 font-semibold hover:underline">Login</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
