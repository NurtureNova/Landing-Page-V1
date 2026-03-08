"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, Loader2, Clock } from 'lucide-react';

type FormField = {
    id: string;
    label: string;
    type: string;
    required: boolean;
    options?: string[];
};

export default function RegistrationClient() {
    const [fields, setFields] = useState<FormField[]>([]);
    const [title, setTitle] = useState('Course Registration');
    const [description, setDescription] = useState('Please fill out the form below to register your child for our courses.');
    const [isOpen, setIsOpen] = useState(true);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState<Record<string, string | number | string[]>>({});

    useEffect(() => {
        fetch('/api/settings/course-registration')
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch settings');
                return res.json();
            })
            .then(data => {
                if (data.success && data.data) {
                    if (data.data.fields && data.data.fields.length > 0) {
                        setFields(data.data.fields);
                        // Initialize form data
                        const initialData: Record<string, string | number | string[]> = {};
                        data.data.fields.forEach((f: FormField) => {
                            initialData[f.label] = '';
                        });
                        setFormData(initialData);
                    }
                    if (data.data.title) setTitle(data.data.title);
                    if (data.data.description) setDescription(data.data.description);
                    if (typeof data.data.isOpen !== 'undefined') setIsOpen(data.data.isOpen);
                }
            })
            .catch(err => {
                console.error('Error fetching settings:', err);
                setError('Could not load the registration form. Please try again later.');
            })
            .finally(() => setLoading(false));
    }, []);

    const handleChange = (label: string, value: string | number | string[]) => {
        setFormData(prev => ({ ...prev, [label]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            const res = await fetch('/api/registrations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const errorText = await res.text();
                try {
                    const errorJson = JSON.parse(errorText);
                    throw new Error(errorJson.message || 'Submission failed');
                } catch {
                    throw new Error('Server returned an error');
                }
            }

            const json = await res.json();

            if (json.success) {
                setSuccess(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                setError(json.message || 'Something went wrong. Please try again.');
            }
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'A network error occurred. Please try again later.';
            setError(message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <main className="flex-1 pt-32 pb-20">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8 font-medium transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
                    </Link>

                    <div className="bg-white rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.04)] overflow-hidden border border-gray-100 p-8 sm:p-12">
                        {!isOpen ? (
                            <div className="text-center py-12">
                                <div className="w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
                                    <Clock className="w-12 h-12 text-amber-500" />
                                </div>
                                <h2 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Registrations Closed</h2>
                                <p className="text-lg text-slate-500 mb-10 max-w-md mx-auto font-medium">
                                    Course registration is currently closed. Please check back later or contact us for more information.
                                </p>
                                <Link
                                    href="/"
                                    className="inline-flex justify-center py-4 px-10 border border-transparent shadow-xl shadow-blue-100 text-lg font-bold rounded-full text-white bg-blue-600 hover:bg-blue-700 transition-all active:scale-95"
                                >
                                    Return to Home
                                </Link>
                            </div>
                        ) : success ? (
                            <div className="text-center py-12">
                                <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 animate-in zoom-in-50 duration-500">
                                    <CheckCircle className="w-12 h-12 text-green-500" />
                                </div>
                                <h2 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Registration Successful!</h2>
                                <p className="text-lg text-slate-500 mb-10 max-w-md mx-auto font-medium">
                                    Thank you for registering your interest. Our team will review your application and contact you shortly.
                                </p>
                                <Link
                                    href="/"
                                    className="inline-flex justify-center py-4 px-10 border border-transparent shadow-xl shadow-blue-100 text-lg font-bold rounded-full text-white bg-blue-600 hover:bg-blue-700 hover:shadow-2xl transition-all active:scale-95"
                                >
                                    Return to Home
                                </Link>
                            </div>
                        ) : (
                            <>
                                <div className="mb-12 text-center">
                                    <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">{title}</h1>
                                    <p className="text-lg text-slate-500 font-medium">{description}</p>
                                </div>

                                {error && (
                                    <div className="bg-red-50 border-l-4 border-red-500 p-6 mb-10 rounded-r-2xl animate-in slide-in-from-left-2 shadow-sm shadow-red-100">
                                        <p className="text-xs font-bold text-red-700 uppercase tracking-widest mb-1">Submission Error</p>
                                        <p className="text-slate-700 font-medium">{error}</p>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-8">
                                    {fields.map((field) => (
                                        <div key={field.id} className="space-y-2.5">
                                            <label className="block text-sm font-bold text-slate-700 ml-1">
                                                {field.label} {field.required && <span className="text-red-500">*</span>}
                                            </label>
                                            
                                            {field.type === 'textarea' ? (
                                                <textarea
                                                    required={field.required}
                                                    value={formData[field.label] || ''}
                                                    onChange={(e) => handleChange(field.label, e.target.value)}
                                                    rows={4}
                                                    className="block w-full border border-slate-200 rounded-2xl shadow-sm py-4 px-5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white text-slate-900 placeholder:text-slate-400"
                                                    placeholder={`Enter ${field.label.toLowerCase()}`}
                                                ></textarea>
                                            ) : field.type === 'select' ? (
                                                <select
                                                    required={field.required}
                                                    value={formData[field.label] || ''}
                                                    onChange={(e) => handleChange(field.label, e.target.value)}
                                                    className="block w-full border border-slate-200 rounded-2xl shadow-sm py-4 px-5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white text-slate-900"
                                                >
                                                    <option value="" className="text-slate-400">Select an option</option>
                                                    {field.options?.map((opt, i) => (
                                                        <option key={i} value={opt} className="text-slate-900">{opt}</option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <input
                                                    type={field.type}
                                                    required={field.required}
                                                    value={formData[field.label] || ''}
                                                    onChange={(e) => handleChange(field.label, e.target.value)}
                                                    className="block w-full border border-slate-200 rounded-2xl shadow-sm py-4 px-5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white text-slate-900 placeholder:text-slate-400"
                                                    placeholder={`Enter ${field.label.toLowerCase()}`}
                                                />
                                            )}
                                        </div>
                                    ))}

                                    <div className="pt-6">
                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="w-full flex justify-center py-4 px-6 border border-transparent rounded-full shadow-xl shadow-blue-100 text-xl font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
                                        >
                                            {submitting ? (
                                                <span className="flex items-center">
                                                    <Loader2 className="w-5 h-5 mr-3 animate-spin" /> Submitting...
                                                </span>
                                            ) : 'Submit Registration'}
                                        </button>
                                        <p className="text-sm text-center text-slate-500 mt-8 font-medium">
                                            Need help? <Link href="/contact" className="text-blue-600 font-bold hover:underline">Contact our support team</Link>
                                        </p>
                                    </div>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
