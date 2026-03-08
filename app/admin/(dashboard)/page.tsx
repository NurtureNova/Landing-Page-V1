"use client";

import { useState, useEffect } from 'react';
import { Calendar, Users, FileText, TrendingUp, Clock, ShieldCheck, Loader2, Plus, Settings } from 'lucide-react';
import Link from 'next/link';

type StatData = {
    total: number;
    recent: number;
};

type Stats = {
    events: StatData;
    applications: StatData;
    registrations: StatData;
};

type Activity = {
    type: 'registration' | 'application' | string;
    title: string;
    description: string;
    timestamp: string;
};

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, activitiesRes] = await Promise.all([
                    fetch('/api/admin/stats').then(res => res.json()),
                    fetch('/api/admin/activities?limit=3&unreadOnly=false').then(res => res.json())
                ]);

                if (statsRes.success) setStats(statsRes.data);
                if (activitiesRes.success) setActivities(activitiesRes.data);
            } catch (err) {
                console.error('Failed to fetch dashboard data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (seconds < 60) return 'Just now';
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    };

    const statCards = stats ? [
        { 
            label: 'Active Events', 
            value: stats.events.total.toString(), 
            icon: Calendar, 
            color: 'bg-blue-500', 
            trend: stats.events.recent > 0 ? `+${stats.events.recent} this week` : 'Stable' 
        },
        { 
            label: 'Event Applications', 
            value: stats.applications.total.toString(), 
            icon: Users, 
            color: 'bg-indigo-500', 
            trend: stats.applications.recent > 0 ? `+${stats.applications.recent} this week` : 'Stable' 
        },
        { 
            label: 'Course Registrations', 
            value: stats.registrations.total.toString(), 
            icon: FileText, 
            color: 'bg-emerald-500', 
            trend: stats.registrations.recent > 0 ? `+${stats.registrations.recent} this week` : 'Stable' 
        },
    ] : [];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">System Overview</h1>
                    <p className="text-slate-500 font-bold mt-2 uppercase tracking-widest text-xs flex items-center">
                        <ShieldCheck className="w-4 h-4 mr-2 text-blue-600" /> Administrative Command Center
                    </p>
                </div>
                
                <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-100">
                    <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-black text-slate-700 uppercase tracking-widest">System Online</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {statCards.map((stat, i) => (
                    <div key={i} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all group">
                        <div className="flex justify-between items-start mb-6">
                            <div className={`${stat.color} p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform`}>
                                <stat.icon className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex items-center text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full uppercase tracking-widest">
                                <TrendingUp className="w-3 h-3 mr-1" /> {stat.trend}
                            </div>
                        </div>
                        <h3 className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px] mb-2">{stat.label}</h3>
                        <p className="text-4xl font-black text-slate-900 tracking-tight">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
                    <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center">
                        <Clock className="w-5 h-5 mr-3 text-blue-600" /> Recent Activities
                    </h3>
                    <div className="space-y-6">
                        {activities.length > 0 ? (
                            activities.map((activity, i) => (
                                <div key={i} className="flex gap-4 items-start pb-6 border-b border-slate-50 last:border-0 last:pb-0">
                                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 border ${
                                        activity.type === 'registration' ? 'bg-emerald-50 border-emerald-100' : 'bg-blue-50 border-blue-100'
                                    }`}>
                                        <div className={`h-2 w-2 rounded-full ${
                                            activity.type === 'registration' ? 'bg-emerald-500' : 'bg-blue-500'
                                        }`}></div>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-800">{activity.title}</p>
                                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">{activity.description}</p>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">{formatTimeAgo(activity.timestamp)}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-slate-400 font-medium italic text-center py-10">No recent activity detected.</p>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 flex flex-col">
                    <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center">
                        <Plus className="w-5 h-5 mr-3 text-blue-600" /> Quick Actions
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                        <Link 
                            href="/admin/events/create"
                            className="group p-5 bg-slate-50 rounded-3xl border border-slate-100 hover:bg-blue-600 hover:border-blue-600 transition-all duration-300"
                        >
                            <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                                <Calendar className="w-5 h-5 text-blue-600" />
                            </div>
                            <p className="text-sm font-black text-slate-900 group-hover:text-white transition-colors">Create Event</p>
                            <p className="text-[10px] font-bold text-slate-400 group-hover:text-blue-100 uppercase tracking-widest mt-1">Add new event</p>
                        </Link>

                        <Link 
                            href="/admin/registrations/settings"
                            className="group p-5 bg-slate-50 rounded-3xl border border-slate-100 hover:bg-indigo-600 hover:border-indigo-600 transition-all duration-300"
                        >
                            <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                                <Settings className="w-5 h-5 text-indigo-600" />
                            </div>
                            <p className="text-sm font-black text-slate-900 group-hover:text-white transition-colors">Form Config</p>
                            <p className="text-[10px] font-bold text-slate-400 group-hover:text-indigo-100 uppercase tracking-widest mt-1">Manage fields</p>
                        </Link>

                        <Link 
                            href="/admin/applications"
                            className="group p-5 bg-slate-50 rounded-3xl border border-slate-100 hover:bg-emerald-600 hover:border-emerald-600 transition-all duration-300"
                        >
                            <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                                <Users className="w-5 h-5 text-emerald-600" />
                            </div>
                            <p className="text-sm font-black text-slate-900 group-hover:text-white transition-colors">Review Apps</p>
                            <p className="text-[10px] font-bold text-slate-400 group-hover:text-emerald-100 uppercase tracking-widest mt-1">Check submissions</p>
                        </Link>

                        <Link 
                            href="/admin/profile"
                            className="group p-5 bg-slate-50 rounded-3xl border border-slate-100 hover:bg-slate-900 hover:border-slate-900 transition-all duration-300"
                        >
                            <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                                <ShieldCheck className="w-5 h-5 text-slate-900" />
                            </div>
                            <p className="text-sm font-black text-slate-900 group-hover:text-white transition-colors">Security</p>
                            <p className="text-[10px] font-bold text-slate-400 group-hover:text-slate-300 uppercase tracking-widest mt-1">Update profile</p>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
