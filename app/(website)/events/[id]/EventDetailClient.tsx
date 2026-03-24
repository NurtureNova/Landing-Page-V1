"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  MapPin,
  Clock,
  ArrowLeft,
  ArrowRight,
  Share2,
  ShieldCheck,
  Users,
  ChevronDown,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

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
  isVirtual?: boolean;
  requiresApplication?: boolean;
  maxApplicants?: number;
  applicationCount?: number;
  accordions?: { title: string; content: string }[];
  footerContent?: string;
  customEmailSubject?: string;
  customEmailHtml?: string;
};

const handleShare = async (event: Event) => {
  const shareData = {
    title: event.title,
    text: `Check out this event: ${event.title}`,
    url: window.location.href,
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      await navigator.clipboard.writeText(shareData.url);
      toast.success("Link copied to clipboard!");
    }
  } catch {
    toast.error("Failed to share event");
  }
};

const CountdownTimer = ({ targetDate }: { targetDate: string }) => {
  const [timeLeft, setTimeLeft] = useState<{
    d: number;
    h: number;
    m: number;
    s: number;
  } | null>(null);

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
        s: Math.floor((diff % (1000 * 60)) / 1000),
      };
    };
    const timer = setInterval(() => setTimeLeft(calculate()), 1000);
    setTimeLeft(calculate());
    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft) return null;

  return (
    <div className="grid grid-cols-4 gap-2 text-center">
      {[
        { label: "Days", val: timeLeft.d },
        { label: "Hours", val: timeLeft.h },
        { label: "Mins", val: timeLeft.m },
        { label: "Secs", val: timeLeft.s },
      ].map((unit) => (
        <div
          key={unit.label}
          className="bg-white rounded-xl p-2 border border-gray-100 shadow-sm"
        >
          <div className="text-xl font-black text-blue-600 leading-none mb-1">
            {unit.val}
          </div>
          <div className="text-[8px] uppercase font-bold text-gray-400 tracking-widest">
            {unit.label}
          </div>
        </div>
      ))}
    </div>
  );
};

export default function EventDetailClient({ id }: { id: string }) {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);

  useEffect(() => {
    if (id) {
      fetch(`/api/events/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch event");
          return res.json();
        })
        .then((data) => {
          if (data.success) setEvent(data.data);
        })
        .catch((err) => {
          console.error("Error fetching event:", err);
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  useEffect(() => {
    if (event && event.description) {
      // eslint-disable-next-line no-console
      // console.log("Event Description HTML:", event.description);
    }
  }, [event]);

  const toggleAccordion = (index: number) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  if (loading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-blue-50 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p className="mt-4 text-gray-400 font-bold animate-pulse uppercase tracking-widest text-xs">
          Loading Event...
        </p>
      </div>
    );

  if (!event)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
          <ShieldCheck className="w-10 h-10 text-red-500" />
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-2">
          Event Not Found
        </h2>
        <p className="text-gray-500 mb-8 text-center max-w-xs font-medium">
          The event you&apos;re looking for might have been removed or is
          currently unavailable.
        </p>
        <Link
          href="/events"
          className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all"
        >
          Back to All Events
        </Link>
      </div>
    );

  const eventDate = new Date(event.date);

  // Check if within 30 mins of event
  const checkIsTooClose = () => {
    const [hours, minutes] = event.time.split(":").map(Number);
    const eventFullDate = new Date(event.date);
    eventFullDate.setHours(hours, minutes, 0, 0);

    const now = new Date();
    const diffInMs = eventFullDate.getTime() - now.getTime();
    const diffInMins = diffInMs / (1000 * 60);

    return diffInMins < 30;
  };

  const isTooCloseToEvent = checkIsTooClose();
  const isCapacityReached =
    event.maxApplicants &&
    event.applicationCount !== undefined &&
    event.applicationCount >= event.maxApplicants;
  const isClosed = isTooCloseToEvent || isCapacityReached;

  return (
    <div className="min-h-screen bg-white">
      <main className="pt-6 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs / Back button */}
          <Link
            href="/events"
            className="inline-flex items-center text-gray-400 hover:text-blue-600 mb-10 font-bold transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm uppercase tracking-widest">
              Back to Events
            </span>
          </Link>

          {/* Debug Box: Shows raw HTML for troubleshooting */}
          {/* {event?.description && (
            <details className="mb-6 bg-yellow-50 border border-yellow-200 rounded p-4 text-xs text-yellow-900">
              <summary className="cursor-pointer font-bold">
                Show Raw Description HTML (Debug)
              </summary>
              <pre className="whitespace-pre-wrap break-all">
                {event.description}
              </pre>
            </details>
          )} */}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Main Content Area */}
            <div className="lg:col-span-8 overflow-hidden">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div className="space-y-4">
                  <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-xs font-bold border border-blue-100 uppercase tracking-widest">
                    {event.status}
                  </div>
                  <h1 className="text-3xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight tracking-tight break-words">
                    {event.title}
                  </h1>
                </div>

                <div className="relative aspect-[3840/2559] rounded-[2rem] overflow-hidden bg-gray-100 border border-gray-200 shadow-xl shadow-gray-200/50">
                  {event.imageUrl ? (
                    <Image
                      src={event.imageUrl}
                      alt={event.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center">
                      <Calendar className="w-24 h-24 text-white/10" />
                    </div>
                  )}
                </div>

                <div className="space-y-6 pt-4">
                  <h3 className="text-2xl font-black text-gray-900 flex items-center">
                    About This Event
                    <div className="ml-4 h-px flex-1 bg-gray-100"></div>
                  </h3>
                  <div
                    className="ql-content max-w-none text-gray-600 leading-relaxed font-normal break-words overflow-hidden"
                    dangerouslySetInnerHTML={{
                      __html: event.description.replace(/&nbsp;/g, " "),
                    }}
                  />

                  {event.accordions && event.accordions.length > 0 && (
                    <div className="space-y-4 mt-12">
                      {event.accordions.map((accordion, index) => (
                        <div 
                          key={index}
                          className="bg-gray-50/80 rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                        >
                          <button 
                            onClick={() => toggleAccordion(index)}
                            className="w-full flex items-center justify-between p-6 text-left"
                          >
                            <span className="text-lg font-bold text-gray-900 tracking-tight min-w-0 [overflow-wrap:anywhere] [word-break:normal] pr-4">{accordion.title}</span>
                            <span className={`w-8 h-8 rounded-full bg-white flex items-center justify-center text-blue-600 shadow-sm transition-transform duration-300 ${openAccordion === index ? 'rotate-180' : ''}`}>
                              <ChevronDown className="w-5 h-5" />
                            </span>
                          </button>
                          <AnimatePresence>
                            {openAccordion === index && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                              >
                                <div 
                                  className="px-6 pb-6 text-gray-600 ql-content prose prose-sm max-w-none w-full min-w-0 text-justify hyphens-none break-normal"
                                  dangerouslySetInnerHTML={{ 
                                    __html: accordion.content.replace(/&nbsp;/g, " ") 
                                  }}
                                />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                  )}

                  {event.footerContent && (
                    <div
                      className="mt-12 ql-content max-w-none text-gray-900 font-bold text-center bg-blue-50/20 p-8 rounded-[2rem] border border-blue-100/50 shadow-sm"
                      dangerouslySetInnerHTML={{
                        __html: event.footerContent.replace(/&nbsp;/g, " "),
                      }}
                    />
                  )}
                </div>
              </motion.div>
            </div>

            {/* Sticky Sidebar */}
            <div className="lg:col-span-4">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="sticky top-32 space-y-6"
              >
                <div className="bg-white rounded-[2rem] border border-gray-200 p-8 space-y-8 shadow-sm">
                  {event.status !== "Completed" && (
                    <div className="space-y-4 pb-8 border-b border-gray-100">
                      <p className="text-[10px] text-center text-gray-400 font-black uppercase tracking-widest">
                        Starts In
                      </p>
                      <CountdownTimer targetDate={event.date} />
                    </div>
                  )}

                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mr-4 shrink-0 shadow-sm border border-blue-100/50">
                        <Calendar className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-0.5">
                          Date
                        </p>
                        <p className="text-gray-900 font-bold text-sm break-words">
                          {eventDate.toLocaleDateString(undefined, {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center mr-4 shrink-0 shadow-sm border border-indigo-100/50">
                        <Clock className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-0.5">
                          Time
                        </p>
                        <p className="text-gray-900 font-bold text-sm break-words">
                          {event.time}AM GMT (UK Time)
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center mr-4 shrink-0 shadow-sm border border-red-100/50">
                        <MapPin className="w-5 h-5 text-red-600" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-0.5">
                          {event.isVirtual ? "Format" : "Location"}
                        </p>
                        <p className="text-gray-900 font-bold text-sm break-words">
                          {event.location}
                        </p>
                      </div>
                    </div>
                  </div>

                  {event.requiresApplication === false ? (
                    <div className="w-full py-5 px-8 rounded-2xl bg-emerald-50 text-emerald-600 font-black text-center border border-emerald-100 uppercase tracking-widest text-xs">
                      No Application Required
                    </div>
                  ) : event.status === "Completed" ? (
                    <div className="w-full py-5 px-8 rounded-2xl bg-gray-200 text-gray-500 font-black text-center cursor-not-allowed uppercase tracking-widest text-xs">
                      Event Completed
                    </div>
                  ) : isClosed ? (
                    <div className="w-full py-5 px-8 rounded-2xl bg-red-50 text-red-600 font-black text-center border border-red-100 flex flex-col gap-1">
                      <span className="uppercase tracking-widest text-xs">
                        Applications Closed
                      </span>
                      <span className="text-[10px] font-bold opacity-80">
                        {isCapacityReached
                          ? "Capacity Reached"
                          : "Deadline Passed"}
                      </span>
                    </div>
                  ) : (
                    <Link
                      href={`/events/${event.slug || event._id}/apply`}
                      className="flex items-center justify-center w-full py-5 px-8 rounded-2xl bg-blue-600 text-white font-black text-lg shadow-xl shadow-blue-600/20 hover:bg-blue-700 hover:-translate-y-1 transition-all duration-300 group"
                    >
                      Apply Now
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  )}

                  <div className="pt-8 border-t border-gray-200/50 flex flex-col gap-4">
                    <button
                      onClick={() => handleShare(event)}
                      className="flex items-center justify-center w-full py-3 px-6 rounded-xl border border-gray-200 text-gray-600 font-bold text-sm hover:bg-white hover:border-blue-200 hover:text-blue-600 transition-all"
                    >
                      <Share2 className="w-4 h-4 mr-2" /> Share Event
                    </button>

                    <div className="flex items-center justify-between px-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                      {/* <div className="flex items-center">
                        <ShieldCheck className="w-3 h-3 mr-1" /> Secure Apply
                      </div> */}
                      <div className="flex items-center">
                        <Users className="w-3 h-3 mr-1" /> Limited Seats
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
