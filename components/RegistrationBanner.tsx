"use client";

import { useEffect, useState } from 'react';
import { Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function RegistrationBanner() {
    const [isOpen, setIsOpen] = useState<boolean | null>(null);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        fetch('/api/settings/course-registration')
            .then(res => res.json())
            .then(data => {
                if (data.success && data.data) {
                    setIsOpen(data.data.isOpen !== false);
                }
            })
            .catch(() => setIsOpen(true));
    }, []);

    // Only show banner if registration is CLOSED and the banner hasn't been dismissed
    if (isOpen === true || isOpen === null || !isVisible) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="relative z-[60] bg-amber-500 text-white px-4 py-3 shadow-sm border-b border-amber-600/20"
            >
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center flex-1 justify-center">
                        <Info className="w-5 h-5 mr-3 flex-shrink-0" />
                        <p className="text-sm md:text-base font-bold tracking-wide text-center">
                            Notice: Course registrations are currently closed. <span className="hidden md:inline">Please contact us for inquiries.</span>
                        </p>
                    </div>
                    <button 
                        onClick={() => setIsVisible(false)}
                        className="ml-4 p-1 hover:bg-white/20 rounded-full transition-colors"
                        title="Dismiss"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
