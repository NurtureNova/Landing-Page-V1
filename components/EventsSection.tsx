"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, MapPin, Clock, ArrowRight, Sparkles, ChevronRight, Share2 } from 'lucide-react';
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
    const [timeLeft, setTimeLeft] = useState<{ d: number, h: number, m: number } | null>(null);

    useEffect(() => {
        const calculate = () => {
            const diff = new Date(targetDate).getTime() - new Date().getTime();
            if (diff <= 0) return null;
            return {
                d: Math.floor(diff / (1000 * 60 * 60 * 24)),
                h: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                m: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
            };
        };
        const timer = setInterval(() => setTimeLeft(calculate()), 1000);
        setTimeLeft(calculate());
        return () => clearInterval(timer);
    }, [targetDate]);

    if (!timeLeft) return null;

    return (
        <div className="flex gap-1 text-[8px] font-black uppercase tracking-tighter">
            <div className="bg-blue-600 text-white px-1.5 py-0.5 rounded shadow-sm">{timeLeft.d}d</div>
            <div className="bg-indigo-600 text-white px-1.5 py-0.5 rounded shadow-sm">{timeLeft.h}h</div>
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

export default function EventsSection() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/events')
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch events');
                return res.json();
            })
            .then(data => {
                if (data.success && data.data) {
                    // Update: Calculate status on the fly based on timing
                    const activeEvents = data.data
                        .map((e: Event) => ({
                            ...e,
                            status: getEventStatus(e.date, e.time)
                        }))
                        .filter((e: Event) => e.status !== 'Completed')
                        .slice(0, 6);
                    setEvents(activeEvents);
                }
            })
            .catch(err => console.error('Error fetching events:', err))
            .finally(() => setLoading(false));
    }, []);

    if (loading || events.length === 0) return null;

    return (
        <section className="py-24 bg-white relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-blue-50/50 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-indigo-50/50 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div className="max-w-xl">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold mb-4 tracking-wider uppercase border border-blue-100"
                        >
                            <Sparkles className="w-3.5 h-3.5 mr-2" /> What&apos;s Happening
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight"
                        >
                            Upcoming <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Events</span>
                        </motion.h2>
                    </div>
                    
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                    >
                        <Link 
                            href="/events" 
                            className="group flex items-center font-bold text-gray-900 hover:text-blue-600 transition-all bg-gray-50 hover:bg-white px-6 py-3 rounded-xl border border-gray-100 hover:shadow-lg hover:shadow-blue-500/5"
                        >
                            Explore All
                            <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {events.map((event, index) => (
                            <motion.div
                                key={event._id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.4 }}
                                className="group"
                            >
                                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col transition-all duration-300 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/10">
                                    <div className="aspect-[3840/2559] relative overflow-hidden bg-gray-50">
                                        {event.imageUrl ? (
                                            <Image src={event.imageUrl} alt={event.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                        ) : (
                                            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center">
                                                <Calendar className="w-10 h-10 text-white/20" />
                                            </div>
                                        )}
                                        <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5">
                                            <div className="flex gap-1.5">
                                                <button
                                                    onClick={(e) => handleShare(e, event)}
                                                    className="bg-white/95 backdrop-blur-sm p-1.5 rounded-lg text-gray-500 hover:text-blue-600 shadow-sm border border-white/50 transition-colors"
                                                    title="Share Event"
                                                >
                                                    <Share2 className="w-3 h-3" />
                                                </button>
                                                <div className="bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wider text-blue-700 shadow-sm uppercase border border-white/50">
                                                    {event.status}
                                                </div>
                                            </div>
                                            {event.status !== 'Completed' && (
                                                <CountdownBadge targetDate={event.date} />
                                            )}
                                        </div>
                                    </div>

                                    <div className="p-5 flex flex-col gap-3">
                                        <h3 className="text-base font-bold text-gray-900 line-clamp-1 leading-snug group-hover:text-blue-600 transition-colors">
                                            {event.title}
                                        </h3>
                                        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed font-medium">
                                            {stripHtml(event.description)}
                                        </p>
                                        <div className="space-y-1.5 text-[11px] font-medium text-gray-500">
                                            <div className="flex items-center">
                                                <Calendar className="w-3 h-3 mr-2.5 text-blue-500" />
                                                <span>{new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <Clock className="w-3 h-3 mr-2.5 text-indigo-500" />
                                                <span>{event.time}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <MapPin className="w-3 h-3 mr-2.5 text-red-400" />
                                                <span className="truncate">{event.location}</span>
                                            </div>
                                        </div>
                                        <div className="pt-3 border-t border-gray-100">
                                            <Link
                                                href={`/events/${event.slug || event._id}`}
                                                className="flex justify-between items-center w-full font-bold text-blue-600 hover:text-blue-800 transition-colors group/link"
                                            >
                                                <span className="text-[10px] uppercase tracking-widest">View Details</span>
                                                <div className="bg-blue-50 p-2 rounded-xl group-hover/link:bg-blue-600 group-hover/link:text-white transition-all">
                                                    <ArrowRight className="w-3 h-3 transition-transform group-hover/link:translate-x-1" />
                                                </div>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}
