"use client";

import AdminSidebar from '@/components/admin/AdminSidebar';
import { User, Bell, Search, Loader2, Menu } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface AdminNotification {
    id: string;
    type: 'application' | 'registration';
    title: string;
    description: string;
    timestamp: string;
    read: boolean;
}

interface SearchResult {
    id: string;
    type: 'application' | 'event' | 'registration';
    title: string;
    subtitle: string;
    url: string;
}

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [notifications, setNotifications] = useState<AdminNotification[]>([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const router = useRouter();

    const fetchNotifications = () => {
        fetch('/api/admin/activities')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setNotifications(data.data);
                }
            })
            .catch(err => console.error('Failed to fetch notifications:', err))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchQuery.length >= 2) {
                setIsSearching(true);
                fetch(`/api/admin/search?q=${encodeURIComponent(searchQuery)}`)
                    .then(res => res.json())
                    .then(data => {
                        if (data.success) {
                            setSearchResults(data.data);
                            setShowSearchResults(true);
                        }
                    })
                    .catch(err => console.error('Search failed:', err))
                    .finally(() => setIsSearching(false));
            } else {
                setSearchResults([]);
                setShowSearchResults(false);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    const markAllRead = async () => {
        try {
            const res = await fetch('/api/admin/activities', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'mark_all_read' })
            });
            if (res.ok) {
                setNotifications([]);
                setShowNotifications(false);
            }
        } catch (err) {
            console.error('Failed to mark all read:', err);
        }
    };

    const handleNotificationClick = async (n: AdminNotification) => {
        try {
            await fetch('/api/admin/activities', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'mark_read', id: n.id, type: n.type })
            });
            
            // Update local state
            setNotifications(prev => prev.filter(notif => notif.id !== n.id));
            
            // Navigate based on type
            if (n.type === 'application') {
                router.push('/admin/applications');
            } else {
                router.push('/admin/registrations');
            }
            setShowNotifications(false);
        } catch (err) {
            console.error('Failed to mark notification as read:', err);
        }
    };

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
        if (seconds < 60) return 'Just now';
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        return `${Math.floor(hours / 24)}d ago`;
    };

    return (
        <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans">
            <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            
            <div className="flex-1 flex flex-col overflow-hidden relative">
                {/* Dashboard Header */}
                <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-8 shrink-0 relative z-30">
                    <div className="flex items-center gap-3 sm:gap-4 flex-1">
                        <button 
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl lg:hidden"
                        >
                            <Menu className="w-6 h-6" />
                        </button>

                        <div className="hidden sm:flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 w-full max-w-md relative">
                            <Search className="w-4 h-4 text-slate-400" />
                            <input 
                                type="text" 
                                placeholder="Search everything..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => searchQuery.length >= 2 && setShowSearchResults(true)}
                                className="bg-transparent border-none outline-none text-sm font-medium w-full text-slate-600 placeholder:text-slate-400"
                            />
                            {isSearching && (
                                <Loader2 className="w-4 h-4 text-blue-500 animate-spin absolute right-4" />
                            )}

                            <AnimatePresence>
                                {showSearchResults && (
                                    <>
                                        <div 
                                            className="fixed inset-0 z-10" 
                                            onClick={() => setShowSearchResults(false)}
                                        />
                                        <motion.div 
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-20 max-h-[400px] overflow-y-auto"
                                        >
                                            <div className="p-4 border-b border-slate-50">
                                                <h3 className="font-black text-slate-900 text-[10px] uppercase tracking-widest">Search Results</h3>
                                            </div>
                                            <div className="p-2">
                                                {searchResults.length > 0 ? (
                                                    searchResults.map((result) => (
                                                        <button
                                                            key={result.id}
                                                            onClick={() => {
                                                                router.push(result.url);
                                                                setShowSearchResults(false);
                                                                setSearchQuery('');
                                                            }}
                                                            className="w-full text-left p-3 hover:bg-slate-50 rounded-xl transition-colors group flex items-start gap-3"
                                                        >
                                                            <div className={`mt-0.5 p-2 rounded-lg ${
                                                                result.type === 'application' ? 'bg-blue-50 text-blue-500' :
                                                                result.type === 'event' ? 'bg-purple-50 text-purple-500' :
                                                                'bg-emerald-50 text-emerald-500'
                                                            }`}>
                                                                <Search className="w-3.5 h-3.5" />
                                                            </div>
                                                            <div>
                                                                <p className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                                                                    {result.title}
                                                                </p>
                                                                <p className="text-[10px] text-slate-500 mt-0.5 font-medium uppercase tracking-tight">
                                                                    {result.subtitle}
                                                                </p>
                                                            </div>
                                                        </button>
                                                    ))
                                                ) : (
                                                    <div className="p-6 text-center">
                                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">No results found</p>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <button 
                                onClick={() => setShowNotifications(!showNotifications)}
                                className={`relative p-2.5 rounded-xl transition-all ${
                                    showNotifications ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:text-blue-600 hover:bg-slate-50'
                                }`}
                            >
                                <Bell className="w-5 h-5" />
                                {notifications.length > 0 && (
                                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center px-1 border-2 border-white shadow-sm">
                                        {notifications.length > 9 ? '9+' : notifications.length}
                                    </span>
                                )}
                            </button>

                            <AnimatePresence>
                                {showNotifications && (
                                    <>
                                        <div 
                                            className="fixed inset-0 z-10" 
                                            onClick={() => setShowNotifications(false)}
                                        />
                                        <motion.div 
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute right-[-60px] sm:right-0 mt-3 w-[calc(100vw-32px)] sm:w-80 bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden z-20"
                                        >
                                            <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                                                <h3 className="font-black text-slate-900 text-sm uppercase tracking-widest">Notifications</h3>
                                                <span className="text-[10px] font-black bg-blue-50 text-blue-600 px-2 py-1 rounded-lg">
                                                    {notifications.length} NEW
                                                </span>
                                            </div>
                                            <div className="max-h-[400px] overflow-y-auto">
                                                {loading ? (
                                                    <div className="p-10 flex justify-center">
                                                        <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                                                    </div>
                                                ) : notifications.length > 0 ? (
                                                    notifications.map((n: AdminNotification, i: number) => (
                                                        <div 
                                                            key={i} 
                                                            onClick={() => handleNotificationClick(n)}
                                                            className="p-5 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer group"
                                                        >
                                                            <div className="flex gap-3">
                                                                <div className={`h-8 w-8 rounded-lg shrink-0 flex items-center justify-center ${
                                                                    n.type === 'registration' ? 'bg-emerald-50 text-emerald-500' : 'bg-blue-50 text-blue-500'
                                                                }`}>
                                                                    <div className="h-1.5 w-1.5 rounded-full bg-current" />
                                                                </div>
                                                                <div>
                                                                    <p className="text-xs font-bold text-slate-800 line-clamp-1">{n.title}</p>
                                                                    <p className="text-[10px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">{n.description}</p>
                                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2">{formatTimeAgo(n.timestamp)}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="p-10 text-center">
                                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">No new alerts</p>
                                                    </div>
                                                )}
                                            </div>
                                            {notifications.length > 0 && (
                                                <div className="p-4 bg-slate-50 text-center">
                                                    <button 
                                                        onClick={markAllRead}
                                                        className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:text-blue-800 transition-colors"
                                                    >
                                                        Mark all as read
                                                    </button>
                                                </div>
                                            )}
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>
                        
                        <div className="h-10 w-[1px] bg-slate-100 mx-2"></div>

                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-black text-slate-900 leading-none">Admin User</p>
                                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1">Super Admin</p>
                            </div>
                            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-100 border-2 border-white">
                                <User className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-8 lg:p-12">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
