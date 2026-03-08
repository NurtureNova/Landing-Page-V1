"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface EventData {
    _id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    status: string;
    imageUrl?: string;
    maxApplicants?: number;
    applicationCount: number;
    slug?: string;
}

export default function EventApplicationPage() {
    const { id } = useParams();

    const [eventData, setEventData] = useState<EventData | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [isClosed, setIsClosed] = useState(false);
    const [closeReason, setCloseReason] = useState('');

    const [formData, setFormData] = useState({
        studentFullName: '',
        parentFullName: '',
        parentEmail: '',
        parentPhone: '',
        schoolYear: '',
        programmeChoice: '',
        source: '',
        sourceOther: ''
    });

    useEffect(() => {
        if (id) {
            fetch(`/api/events/${id}`)
                .then(res => {
                    if (!res.ok) throw new Error('Failed to fetch event');
                    return res.json();
                })
                .then(data => {
                    if (data.success) {
                        const event = data.data;
                        setEventData(event);
                        
                        // Check if closed
                        if (event.status === 'Completed') {
                            setIsClosed(true);
                            setCloseReason('Event Completed');
                            return;
                        }

                        // Check 30-minute cutoff
                        const [hours, minutes] = event.time.split(':').map(Number);
                        const eventFullDate = new Date(event.date);
                        eventFullDate.setHours(hours, minutes, 0, 0);
                        const diffInMins = (eventFullDate.getTime() - new Date().getTime()) / (1000 * 60);
                        
                        if (diffInMins < 30) {
                            setIsClosed(true);
                            setCloseReason('Deadline Passed');
                            return;
                        }

                        // Check capacity
                        if (event.maxApplicants && event.applicationCount >= event.maxApplicants) {
                            setIsClosed(true);
                            setCloseReason('Capacity Reached');
                            return;
                        }
                    }
                })
                .catch(err => {
                    console.error('Error fetching event:', err);
                    toast.error('Could not load event details.');
                })
                .finally(() => setLoading(false));
        }
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const res = await fetch(`/api/events/${id}/applications`, {
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
                toast.success('Application submitted successfully!');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                toast.error(json.message || 'Something went wrong. Please try again.');
            }
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'A network error occurred. Please try again later.';
            toast.error(message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <main className="flex-1 pt-32 pb-12">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link href={`/events/${id}`} className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8 font-medium">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Event Details
                    </Link>

                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 p-8 sm:p-12">

                        {success ? (
                            <div className="text-center py-10">
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle className="w-10 h-10 text-green-600" />
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-4">Application Successful!</h2>
                                <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                                    Thank you for applying for your child, <strong className="text-blue-600">{formData.studentFullName}</strong>, to join the <strong>{eventData?.title}</strong>. 
                                    <br /><br />
                                    We have received your application and will keep you updated. Please check your email for a confirmation message.
                                </p>
                                <Link
                                    href="/"
                                    className="inline-flex justify-center py-4 px-10 border border-transparent shadow-lg text-lg font-bold rounded-full text-white bg-blue-600 hover:bg-blue-700 hover:-translate-y-1 transition-all duration-200"
                                >
                                    Return to Home
                                </Link>
                            </div>
                        ) : isClosed ? (
                            <div className="text-center py-10">
                                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 text-red-600 font-black text-2xl">
                                    !
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-4">Applications Closed</h2>
                                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                                    We are no longer accepting applications for <strong>{eventData?.title}</strong>. 
                                    <br /><br />
                                    Reason: <span className="font-bold text-red-600">{closeReason}</span>
                                </p>
                                <Link
                                    href="/events"
                                    className="inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                >
                                    View Other Events
                                </Link>
                            </div>
                        ) : (
                            <>
                                <div className="mb-10 text-center">
                                    <h1 className="text-3xl font-extrabold text-gray-900 mb-3">Event Application</h1>
                                    <p className="text-gray-600">Applying for <span className="font-semibold text-blue-600">{eventData?.title}</span></p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Student Information</h3>
                                        <div>
                                            <label htmlFor="studentFullName" className="block text-sm font-bold text-gray-700">1. Full Name (Students) *</label>
                                            <input
                                                type="text"
                                                name="studentFullName"
                                                id="studentFullName"
                                                required
                                                value={formData.studentFullName}
                                                onChange={handleChange}
                                                className="mt-1 block w-full border border-gray-300 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-500 bg-white"
                                                placeholder="e.g. John Doe"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-4">
                                        <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Parent/Guardian Information</h3>
                                        <div>
                                            <label htmlFor="parentFullName" className="block text-sm font-bold text-gray-700">2. Parent/ Guardian Full Name *</label>
                                            <input
                                                type="text"
                                                name="parentFullName"
                                                id="parentFullName"
                                                required
                                                value={formData.parentFullName}
                                                onChange={handleChange}
                                                className="mt-1 block w-full border border-gray-300 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-500 bg-white"
                                                placeholder="e.g. Jane Doe"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label htmlFor="parentEmail" className="block text-sm font-bold text-gray-700">3. Parent/Guardian Email Address *</label>
                                                <input
                                                    type="email"
                                                    name="parentEmail"
                                                    id="parentEmail"
                                                    required
                                                    value={formData.parentEmail}
                                                    onChange={handleChange}
                                                    className="mt-1 block w-full border border-gray-300 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-500 bg-white"
                                                    placeholder="e.g. jane.doe@example.com"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="parentPhone" className="block text-sm font-bold text-gray-700">Parent/Guardian Phone Number *</label>
                                                <input
                                                    type="tel"
                                                    name="parentPhone"
                                                    id="parentPhone"
                                                    required
                                                    value={formData.parentPhone}
                                                    onChange={handleChange}
                                                    className="mt-1 block w-full border border-gray-300 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-500 bg-white"
                                                    placeholder="e.g. +44 123 456 7890"
                                                />
                                            </div>
                                        </div>

                                        <div className="pt-2">
                                            <label htmlFor="schoolYear" className="block text-sm font-bold text-gray-700">4. School Year *</label>
                                            <input
                                                type="text"
                                                name="schoolYear"
                                                id="schoolYear"
                                                required
                                                value={formData.schoolYear}
                                                onChange={handleChange}
                                                className="mt-1 block w-full border border-gray-300 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-500 bg-white"
                                                placeholder="e.g. Year 5"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-4">
                                        <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Programme & Source</h3>
                                        
                                        <div>
                                            <label htmlFor="programmeChoice" className="block text-sm font-bold text-gray-700">5. Programme choice (Select One) *</label>
                                            <select
                                                name="programmeChoice"
                                                id="programmeChoice"
                                                required
                                                value={formData.programmeChoice}
                                                onChange={(e) => setFormData({ ...formData, programmeChoice: e.target.value })}
                                                className="mt-1 block w-full border border-gray-300 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                                            >
                                                <option value="" disabled>-- Choose a Programme --</option>
                                                <option value="11+ Bootcamp">11+ Bootcamp</option>
                                                <option value="SATs Bootcamp">SATs Bootcamp</option>
                                            </select>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="block text-sm font-bold text-gray-700">6. How did you hear about the Boot Camp? *</label>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {['Already an NNL student', 'Social media', 'From a friend', 'Others'].map((source) => (
                                                    <label key={source} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                                                        <input
                                                            type="radio"
                                                            name="source"
                                                            value={source}
                                                            required
                                                            checked={formData.source === source}
                                                            onChange={handleChange}
                                                            className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                                        />
                                                        <span className="text-sm font-medium text-gray-700">{source}</span>
                                                    </label>
                                                ))}
                                            </div>
                                            
                                            {formData.source === 'Others' && (
                                                <div className="mt-3 animate-in fade-in slide-in-from-top-2 duration-200">
                                                    <label htmlFor="sourceOther" className="block text-xs font-bold text-gray-500 mb-1">Please specify:</label>
                                                    <input
                                                        type="text"
                                                        name="sourceOther"
                                                        id="sourceOther"
                                                        required
                                                        value={formData.sourceOther}
                                                        onChange={handleChange}
                                                        className="block w-full border border-gray-300 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-400 bg-white"
                                                        placeholder="Where did you hear about us?"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="w-full flex justify-center py-4 px-4 border border-transparent rounded-full shadow-md text-lg font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all duration-200"
                                        >
                                            {submitting ? 'Submitting Application...' : 'Submit Application'}
                                        </button>
                                        <p className="text-xs text-center text-gray-500 mt-4">
                                            By submitting, you agree to our terms and conditions.
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
