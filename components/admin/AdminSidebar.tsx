"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
    Calendar, 
    Users, 
    Settings, 
    LogOut, 
    LayoutDashboard, 
    FileText, 
    ClipboardList,
    ChevronDown,
    ChevronRight,
    X
} from 'lucide-react';
import { useState } from 'react';

const navigation = [
    { name: 'Dashboard', href: '/admin', exact: true, icon: LayoutDashboard },
    { 
        name: 'Events', 
        icon: Calendar,
        subItems: [
            { name: 'Event Management', href: '/admin/events', icon: ClipboardList },
            { name: 'Event Applications', href: '/admin/applications', icon: Users },
        ]
    },
    { 
        name: 'Course Registration', 
        icon: FileText,
        subItems: [
            { name: 'Form Settings', href: '/admin/registrations/settings', icon: Settings },
            { name: 'Student Registrations', href: '/admin/registrations', icon: ClipboardList },
        ]
    },
    { name: 'Profile Settings', href: '/admin/profile', icon: Users },
];

export default function AdminSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const pathname = usePathname();
    const router = useRouter();
    const [openMenus, setOpenMenus] = useState<string[]>(['Events', 'Course Registration']);

    const toggleMenu = (name: string) => {
        setOpenMenus(prev => 
            prev.includes(name) 
                ? prev.filter(i => i !== name) 
                : [...prev, name]
        );
    };

    const handleLogout = async () => {
        await fetch('/api/admin/logout', { method: 'POST' });
        router.push('/admin/login');
        router.refresh();
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            <div className={`fixed inset-y-0 left-0 w-64 bg-slate-900 text-white min-h-screen z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto ${
                isOpen ? 'translate-x-0' : '-translate-x-full'
            }`}>
                <div className="flex items-center justify-between p-6 border-b border-slate-800">
                    <h1 className="text-xl font-bold tracking-widest text-blue-400">ADMIN PANEL</h1>
                    <button onClick={onClose} className="lg:hidden p-2 text-slate-400 hover:text-white">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-1 px-3 py-6 space-y-2 overflow-y-auto max-h-[calc(100vh-140px)]">
                    {navigation.map((item) => {
                        if (item.subItems) {
                            const isSubMenuOpen = openMenus.includes(item.name);
                            const isAnySubActive = item.subItems.some(sub => pathname.startsWith(sub.href));

                            return (
                                <div key={item.name} className="space-y-1">
                                    <button
                                        onClick={() => toggleMenu(item.name)}
                                        className={`flex items-center justify-between w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                                            isAnySubActive ? 'text-blue-400' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                        }`}
                                    >
                                        <div className="flex items-center">
                                            <item.icon className="w-5 h-5 mr-3" />
                                            {item.name}
                                        </div>
                                        {isSubMenuOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                    </button>
                                    
                                    {isSubMenuOpen && (
                                        <div className="pl-9 space-y-1">
                                            {item.subItems.map((sub) => {
                                                const isActive = pathname === sub.href;
                                                return (
                                                    <Link
                                                        key={sub.name}
                                                        href={sub.href}
                                                        onClick={() => {
                                                            if (window.innerWidth < 1024) onClose();
                                                        }}
                                                        className={`flex items-center px-4 py-2 text-xs font-medium rounded-lg transition-colors ${
                                                            isActive
                                                                ? 'bg-blue-600/20 text-blue-400'
                                                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                                        }`}
                                                    >
                                                        <sub.icon className="w-4 h-4 mr-3" />
                                                        {sub.name}
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        }

                        const isActive = item.exact
                            ? pathname === item.href
                            : pathname.startsWith(item.href as string);

                        return (
                            <Link
                                key={item.name}
                                href={item.href as string}
                                onClick={() => {
                                    if (window.innerWidth < 1024) onClose();
                                }}
                                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                                    isActive
                                        ? 'bg-blue-600 text-white shadow-md'
                                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                }`}
                            >
                                <item.icon className="w-5 h-5 mr-3" />
                                {item.name}
                            </Link>
                        );
                    })}
                </div>

                <div className="p-4 border-t border-slate-800 pb-8 mt-auto">
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-3 text-sm font-medium text-slate-300 rounded-lg hover:bg-red-900/50 hover:text-red-300 transition-colors"
                    >
                        <LogOut className="w-5 h-5 mr-3" />
                        Sign out
                    </button>
                </div>
            </div>
        </>
    );
}
