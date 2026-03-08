"use client";

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Calendar, MapPin, Clock, Search, ExternalLink, Loader2, Globe, Users } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';
import DeleteConfirmationModal from '@/components/admin/DeleteConfirmationModal';

type Event = {
    _id: string;
    slug: string;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    isVirtual: boolean;
    imageUrl: string;
    status: string;
};

export default function AdminEventsPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Delete modal state
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [eventToDelete, setEventToDelete] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const res = await fetch('/api/events');
            if (!res.ok) throw new Error('Failed to fetch events');
            const json = await res.json();
            if (json.success) setEvents(json.data);
        } catch (err) {
            console.error('An error occurred:', err);
            toast.error('Failed to load events');
        } finally {
            setLoading(false);
        }
    };

    const deleteEvent = (id: string) => {
        setEventToDelete(id);
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!eventToDelete) return;
        setDeleting(true);
        try {
            const res = await fetch(`/api/events/${eventToDelete}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete event');
            const json = await res.json();
            if (json.success) {
                toast.success('Event deleted successfully');
                setEvents(events.filter(e => e._id !== eventToDelete));
                setDeleteModalOpen(false);
                setEventToDelete(null);
            } else {
                toast.error(json.message || 'Failed to delete event');
            }
        } catch (err) {
            console.error('An error occurred:', err);
            toast.error('A network error occurred while deleting');
        } finally {
            setDeleting(false);
        }
    };

    const filteredEvents = events.filter(e => 
        e.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        e.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Event Management</h1>
                    <p className="text-slate-500 font-medium">Create, edit and manage all institutional events.</p>
                </div>
                
                <Link
                    href="/admin/events/create"
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all hover:-translate-y-0.5 active:translate-y-0"
                >
                    <Plus className="w-5 h-5 mr-2" /> Create New Event
                </Link>
            </div>

            <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-300 shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search events by title or location..."
                        className="w-full pl-12 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all outline-none text-slate-900 font-medium placeholder:text-slate-400 shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
                {loading ? (
                    <div className="p-20 flex flex-col items-center justify-center space-y-4">
                        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                        <span className="text-slate-500 font-bold uppercase tracking-widest text-xs animate-pulse">Loading Events Library...</span>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full divide-y divide-slate-100">
                            <thead className="bg-slate-50/50">
                                <tr>
                                    <th className="px-8 py-5 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Event Identity</th>
                                    <th className="px-8 py-5 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Schedule</th>
                                    <th className="px-8 py-5 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Location</th>
                                    <th className="px-8 py-5 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Status</th>
                                    <th className="px-8 py-5 text-right text-xs font-black text-slate-400 uppercase tracking-widest">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-50">
                                {filteredEvents.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-20 text-center text-slate-400 font-medium italic">
                                            No events found matching your current filters.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredEvents.map((event) => (
                                        <tr key={event._id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-12 w-12 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0 shadow-sm relative">
                                                        {event.imageUrl ? (
                                                            <Image className="object-cover" src={event.imageUrl} alt={event.title} fill />
                                                        ) : (
                                                            <div className="h-full w-full flex items-center justify-center text-slate-400">
                                                                <Calendar className="w-6 h-6" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{event.title}</div>
                                                        <Link href={`/events/${event.slug || event._id}`} target="_blank" className="text-[10px] font-black text-slate-400 hover:text-blue-500 uppercase tracking-widest flex items-center mt-1">
                                                            View Public Page <ExternalLink className="w-2.5 h-2.5 ml-1" />
                                                        </Link>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center text-sm font-bold text-slate-700">
                                                        <Calendar className="w-3.5 h-3.5 mr-2 text-slate-400" />
                                                        {new Date(event.date).toLocaleDateString()}
                                                    </div>
                                                    <div className="flex items-center text-xs font-medium text-slate-500">
                                                        <Clock className="w-3.5 h-3.5 mr-2 text-slate-400" />
                                                        {event.time}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex items-center text-sm font-semibold text-slate-600">
                                                    {event.isVirtual ? (
                                                        <span className="flex items-center text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
                                                            <Globe className="w-3.5 h-3.5 mr-2" /> Virtual
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center">
                                                            <MapPin className="w-3.5 h-3.5 mr-2 text-slate-400" />
                                                            {event.location}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className={`px-3 py-1.5 inline-flex text-[10px] font-black uppercase tracking-widest rounded-xl border ${
                                                    event.status === 'Upcoming' ? 'bg-green-50 text-green-700 border-green-100' :
                                                    event.status === 'Ongoing' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                    'bg-slate-50 text-slate-600 border-slate-100'
                                                }`}>
                                                    {event.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 text-right whitespace-nowrap">
                                                <div className="flex justify-end gap-2 transition-opacity">
                                                    <Link
                                                        href={`/admin/applications?eventId=${event._id}`}
                                                        className="p-2.5 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl transition-all shadow-sm"
                                                        title="View Applications"
                                                    >
                                                        <Users className="w-4.5 h-4.5" />
                                                    </Link>
                                                    <Link
                                                        href={`/admin/events/${event._id}/edit`}
                                                        className="p-2.5 bg-slate-50 text-slate-600 hover:bg-slate-900 hover:text-white rounded-xl transition-all shadow-sm"
                                                        title="Edit Event"
                                                    >
                                                        <Edit2 className="w-4.5 h-4.5" />
                                                    </Link>
                                                    <button
                                                        onClick={() => deleteEvent(event._id)}
                                                        className="p-2.5 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all shadow-sm"
                                                        title="Delete Event"
                                                    >
                                                        <Trash2 className="w-4.5 h-4.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <DeleteConfirmationModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                loading={deleting}
                title="Delete Event"
                message="Are you sure you want to delete this event? This action cannot be undone and will affect all related applications."
            />
        </div>
    );
}
