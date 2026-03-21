"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, MapPin, Clock, ArrowRight, Loader2, Search, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { getEventStatus } from '@/lib/event-utils';

type Event = {
    _id: string;
    slug: string;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    status: string;
    imageUrl?: string;
};

const handleShare = async (e: React.MouseEvent, event: Event) => {
    e.preventDefault();
    e.stopPropagation();
    
    const shareData = {
        title: event.title,
        text: `Check out this event: ${event.title}`,
        url: `${window.location.origin}/events/${event.slug || event._id}`
    };

    try {
        if (navigator.share) {
            await navigator.share(shareData);
        } else {
            await navigator.clipboard.writeText(shareData.url);
            toast.success('Link copied to clipboard!');
        }
    } catch {
        toast.error('Failed to share event');
    }
};

const CountdownBadge = ({ targetDate }: { targetDate: string }) => {
    const [timeLeft, setTimeLeft] = useState<{ d: number, h: number, m: number, s: number } | null>(null);

    useEffect(() => {
        const calculate = () => {
            const now = new Date().getTime();
            const target = new Date(targetDate).getTime();
            const diff = target - now;

            if (diff <= 0) return null;

            return {
                d: Math.floor(diff / (1000 * 60 * 60 * 24)),
                h: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                m: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
                s: Math.floor((diff % (1000 * 60)) / 1000)
            };
        };

        const timer = setInterval(() => {
            setTimeLeft(calculate());
        }, 1000);

        setTimeLeft(calculate());
        return () => clearInterval(timer);
    }, [targetDate]);

    if (!timeLeft) return null;

    return (
        <div className="flex gap-1.5 text-[9px] font-black uppercase tracking-tighter">
            <div className="bg-blue-600 text-white px-1.5 py-0.5 rounded-md min-w-[20px] text-center">{timeLeft.d}d</div>
            <div className="bg-indigo-600 text-white px-1.5 py-0.5 rounded-md min-w-[20px] text-center">{timeLeft.h}h</div>
            <div className="bg-purple-600 text-white px-1.5 py-0.5 rounded-md min-w-[20px] text-center">{timeLeft.m}m</div>
        </div>
    );
};

const stripHtml = (html: string) => {
    if (!html) return '';
    const stripped = html.replace(/<[^>]*>/g, '');
    const entities: Record<string, string> = {
        '&nbsp;': ' ',
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        '&#39;': "'",
        '&rsquo;': "'",
        '&lsquo;': "'",
        '&rdquo;': '"',
        '&ldquo;': '"'
    };
    return stripped.replace(/&[a-z0-9#]+;/gi, (match) => entities[match] || match);
};

export default function EventsPageClient() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    useEffect(() => {
        fetch('/api/events')
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch events');
                return res.json();
            })
            .then(data => {
                if (data.success && data.data) {
                    const processedEvents = data.data.map((e: Event) => ({
                        ...e,
                        status: getEventStatus(e.date, e.time)
                    }));
                    setEvents(processedEvents);
                }
            })
            .catch(err => console.error('Error fetching events:', err))
            .finally(() => setLoading(false));
    }, []);

    const filteredEvents = events.filter(e => {
        const matchesSearch = e.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             e.location.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || e.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const statuses = ['All', ...Array.from(new Set(events.map(e => e.status)))];

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <main className="flex-1 pt-6 pb-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col items-center text-center mb-16">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-sm font-bold mb-6 border border-blue-100 uppercase tracking-widest"
                        >
                            Stay Connected
                        </motion.div>
                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight"
                        >
                            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Events</span>
                        </motion.h1>
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-lg text-gray-500 max-w-2xl mx-auto font-medium"
                        >
                            Explore workshops, webinars, and educational experiences designed to empower students and parents.
                        </motion.p>
                    </div>

                    <div className="mb-12 space-y-6">
                        <div className="max-w-2xl mx-auto relative">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input 
                                type="text" 
                                placeholder="Search by title or location..." 
                                className="w-full pl-14 pr-6 py-4 rounded-2xl border border-gray-100 shadow-sm focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all text-gray-900 font-medium"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        
                        <div className="flex flex-wrap justify-center gap-2">
                            {statuses.map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setStatusFilter(status)}
                                    className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
                                        statusFilter === status 
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' 
                                        : 'bg-gray-50 text-gray-500 hover:bg-gray-100 border border-gray-100'
                                    }`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex flex-col justify-center items-center py-32 space-y-4">
                            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                            <span className="text-gray-400 font-bold animate-pulse">Loading amazing events...</span>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <AnimatePresence mode="popLayout">
                                {filteredEvents.map((event) => (
                                    <motion.div
                                        key={event._id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.3 }}
                                        className="group"
                                    >
                                        <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden flex flex-col transition-all duration-300 hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-500/5">
                                            <div className="aspect-[3840/2559] relative overflow-hidden bg-gray-50">
                                                {event.imageUrl ? (
                                                    <Image src={event.imageUrl} alt={event.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                                                ) : (
                                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center">
                                                        <Calendar className="w-16 h-16 text-white/20" />
                                                    </div>
                                                )}
                                                <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={(e) => handleShare(e, event)}
                                                            className="bg-white/95 backdrop-blur-sm p-2 rounded-xl text-gray-500 hover:text-blue-600 shadow-sm border border-white/50 transition-colors"
                                                            title="Share Event"
                                                        >
                                                            <Share2 className="w-3.5 h-3.5" />
                                                        </button>
                                                        <div className="bg-white/95 backdrop-blur-sm px-3.5 py-1 rounded-xl text-[10px] font-black tracking-widest text-blue-700 shadow-sm uppercase border border-white/50">
                                                            {event.status}
                                                        </div>
                                                    </div>
                                                    {event.status !== 'Completed' && (
                                                        <CountdownBadge targetDate={event.date} />
                                                    )}
                                                </div>
                                            </div>

                                            <div className="p-6 flex flex-col gap-3">
                                                <h3 className="text-lg font-bold text-gray-900 line-clamp-1 leading-snug group-hover:text-blue-600 transition-colors">
                                                    {event.title}
                                                </h3>
                                                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed font-medium">
                                                    {stripHtml(event.description)}
                                                </p>
                                                <div className="space-y-2 text-xs font-semibold text-gray-500">
                                                    <div className="flex items-center">
                                                        <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center mr-3 border border-blue-100/50">
                                                            <Calendar className="w-3.5 h-3.5 text-blue-500" />
                                                        </div>
                                                        {new Date(event.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                                                    </div>
                                                    <div className="flex items-center">
                                                        <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center mr-3 border border-indigo-100/50">
                                                            <Clock className="w-3.5 h-3.5 text-indigo-500" />
                                                        </div>
                                                        {event.time}
                                                    </div>
                                                    <div className="flex items-center">
                                                        <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center mr-3 border border-red-100/50">
                                                            <MapPin className="w-3.5 h-3.5 text-red-500" />
                                                        </div>
                                                        <span className="truncate">{event.location}</span>
                                                    </div>
                                                </div>
                                                <div className="pt-4 border-t border-gray-100">
                                                    <Link
                                                        href={`/events/${event.slug || event._id}`}
                                                        className="flex justify-between items-center w-full font-bold text-blue-600 hover:text-blue-800 transition-colors group/link"
                                                    >
                                                        <span className="text-[10px] uppercase tracking-widest">View Details</span>
                                                        <div className="bg-blue-50 p-2.5 rounded-xl group-hover/link:bg-blue-600 group-hover/link:text-white transition-all">
                                                            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-1" />
                                                        </div>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                    
                    {!loading && filteredEvents.length === 0 && (
                        <div className="text-center py-32 flex flex-col items-center">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                                <Search className="w-8 h-8 text-gray-300" />
                            </div>
                            <div className="text-gray-900 mb-2 font-bold text-2xl tracking-tight">No events found</div>
                            <p className="text-gray-500 font-medium mb-8">We couldn&apos;t find any events matching your search criteria.</p>
                            <button 
                                onClick={() => { setSearchTerm(''); setStatusFilter('All'); }}
                                className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all"
                            >
                                Clear all filters
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
