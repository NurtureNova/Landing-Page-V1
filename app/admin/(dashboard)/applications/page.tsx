"use client";

import { useState, useEffect, Suspense } from 'react';
import { Eye, Trash2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useSearchParams } from 'next/navigation';
import DeleteConfirmationModal from '@/components/admin/DeleteConfirmationModal';

type Application = {
    _id: string;
    studentFullName: string;
    parentFullName: string;
    parentEmail: string;
    parentPhone: string;
    schoolYear: string;
    programmeChoice: string;
    source: string;
    sourceOther?: string;
    status: string;
    createdAt: string;
};

type EventModel = {
    _id: string;
    title: string;
    appCount?: number;
};

export default function AdminApplicationsPage() {
    return (
        <Suspense fallback={
            <div className="flex justify-center p-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        }>
            <ApplicationsContent />
        </Suspense>
    );
}

function ApplicationsContent() {
    const searchParams = useSearchParams();
    const eventIdParam = searchParams.get('eventId');

    const [events, setEvents] = useState<EventModel[]>([]);
    const [selectedEventId, setSelectedEventId] = useState<string>('');
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(false);

    // Modal state for viewing full message
    const [modalApp, setModalApp] = useState<Application | null>(null);

    // Delete modal state
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [appToDelete, setAppToDelete] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        fetchEvents();
    }, []);

    useEffect(() => {
        if (eventIdParam && events.length > 0) {
            setSelectedEventId(eventIdParam);
        }
    }, [eventIdParam, events]);

    useEffect(() => {
        if (selectedEventId) {
            fetchApplications(selectedEventId);
        } else {
            setApplications([]);
        }
    }, [selectedEventId]);

    const fetchEvents = async () => {
        try {
            const res = await fetch('/api/events');
            if (!res.ok) throw new Error('Failed to fetch events');
            const json = await res.json();
            if (json.success) {
                // Get application counts for each event to make it easier for admin
                const eventsWithCounts = await Promise.all(json.data.map(async (event: EventModel) => {
                    try {
                        const appRes = await fetch(`/api/events/${event._id}/applications`);
                        const appJson = await appRes.json();
                        return { ...event, appCount: appJson.data?.length || 0 };
                    } catch {
                        return { ...event, appCount: 0 };
                    }
                }));
                setEvents(eventsWithCounts);
            }
        } catch (err) {
            console.error('An error occurred:', err);
            toast.error('Failed to load events list');
        }
    };

    const fetchApplications = async (eventId: string) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/events/${eventId}/applications`);
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to fetch applications');
            }
            const json = await res.json();
            if (json.success) {
                setApplications(json.data);
            } else {
                toast.error(json.message || 'Failed to load applications');
            }
        } catch (err) {
            console.error('An error occurred:', err);
            toast.error(err instanceof Error ? err.message : 'Could not fetch applications');
            setApplications([]);
        } finally {
            setLoading(false);
        }
    };

    const deleteApplication = (appId: string) => {
        setAppToDelete(appId);
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!appToDelete) return;
        setDeleting(true);
        try {
            const res = await fetch(`/api/applications/${appToDelete}`, {
                method: 'DELETE'
            });
            const json = await res.json();
            if (json.success) {
                toast.success('Application record deleted');
                setApplications(applications.filter(app => app._id !== appToDelete));
                if (modalApp?._id === appToDelete) setModalApp(null);
                setDeleteModalOpen(false);
                setAppToDelete(null);
            } else {
                toast.error(json.message || 'Failed to delete application');
            }
        } catch {
            toast.error('Failed to delete application');
        } finally {
            setDeleting(false);
        }
    };

    const StatusBadge = () => {
        return (
            <span className="px-3 py-1 inline-flex items-center text-xs leading-5 font-bold rounded-full bg-green-100 text-green-800 border border-green-200 shadow-sm">
                <CheckCircle className="w-3.5 h-3.5 mr-1.5" /> 
                Received
            </span>
        );
    };

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Review Applications</h1>

            <div className="mb-6 bg-white p-5 rounded-xl shadow-sm border border-gray-300">
                <label className="block text-sm font-bold text-gray-800 mb-2 uppercase tracking-widest text-[10px]">Filter by Event</label>
                <select
                    value={selectedEventId}
                    onChange={(e) => setSelectedEventId(e.target.value)}
                    className="block w-full max-w-md pl-3 pr-10 py-2.5 text-base border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm rounded-lg shadow-sm border bg-white text-gray-900 font-medium transition"
                >
                    <option value="">-- Select an Event to View Applications --</option>
                    {events.map((event: EventModel) => (
                        <option key={event._id} value={event._id} className="text-gray-900">
                            {event.title} ({event.appCount} {event.appCount === 1 ? 'application' : 'applications'})
                        </option>
                    ))}
                </select>
            </div>

            {selectedEventId && (
                <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden relative">
                    {loading && (
                        <div className="absolute inset-0 bg-white bg-opacity-70 flex justify-center items-center z-10 transition">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    )}

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Applicant</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Applied On</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {!loading && applications.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        No applications found for this event.
                                    </td>
                                </tr>
                            ) : (
                                applications.map((app) => (
                                    <tr key={app._id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-medium text-gray-900">{app.studentFullName}</div>
                                            <div className="text-xs text-gray-500">Year: {app.schoolYear}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div className="text-gray-900 font-medium">{app.parentFullName}</div>
                                            <div>{app.parentEmail}</div>
                                            <div>{app.parentPhone}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(app.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <StatusBadge />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right flex justify-end items-center gap-3">
                                            <button
                                                onClick={() => setModalApp(app)}
                                                className="text-blue-600 hover:text-blue-900 transition p-1"
                                                title="View Details"
                                            >
                                                <Eye className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => deleteApplication(app._id)}
                                                className="text-red-500 hover:text-red-700 transition p-1"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

            {modalApp && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900">Application Details</h2>
                            <button onClick={() => setModalApp(null)} className="text-gray-400 hover:text-gray-600 transition bg-gray-100 hover:bg-gray-200 rounded-full p-2">
                                <span className="sr-only">Close</span>
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">{modalApp.studentFullName}</h3>
                                    <p className="text-sm font-medium text-blue-600">School Year: {modalApp.schoolYear}</p>
                                    <p className="text-xs text-gray-500">Applied on {new Date(modalApp.createdAt).toLocaleDateString()}</p>
                                </div>
                                <StatusBadge />
                            </div>

                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-3">
                                <h4 className="text-xs font-black uppercase tracking-widest text-gray-400">Parent/Guardian Info</h4>
                                <div className="grid grid-cols-1 gap-2">
                                    <div className="flex items-center text-sm text-gray-700">
                                        <span className="font-bold w-24">Name:</span>
                                        <span>{modalApp.parentFullName}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-700">
                                        <span className="font-bold w-24">Email:</span>
                                        <a href={`mailto:${modalApp.parentEmail}`} className="text-blue-600 hover:underline">{modalApp.parentEmail}</a>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-700">
                                        <span className="font-bold w-24">Phone:</span>
                                        <a href={`tel:${modalApp.parentPhone}`} className="text-blue-600 hover:underline">{modalApp.parentPhone}</a>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 space-y-3">
                                <h4 className="text-xs font-black uppercase tracking-widest text-blue-400">Application Details</h4>
                                <div className="grid grid-cols-1 gap-2">
                                    <div className="flex items-center text-sm text-gray-700">
                                        <span className="font-bold w-24">Programme:</span>
                                        <span className="bg-blue-600 text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">{modalApp.programmeChoice}</span>
                                    </div>
                                    <div className="flex flex-col text-sm text-gray-700">
                                        <span className="font-bold">How they heard:</span>
                                        <span className="mt-1 p-2 bg-white rounded-lg border border-blue-100 italic">
                                            {modalApp.source}{modalApp.source === 'Others' && modalApp.sourceOther ? `: ${modalApp.sourceOther}` : ''}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-100 mt-6 flex justify-end items-center">
                                <button
                                    onClick={() => deleteApplication(modalApp._id)}
                                    className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1"
                                >
                                    <Trash2 className="w-4 h-4" /> Delete Record
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <DeleteConfirmationModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                loading={deleting}
                title="Delete Application"
                message="Are you sure you want to permanently delete this application record? This action cannot be undone."
            />
        </div>
    );
}
