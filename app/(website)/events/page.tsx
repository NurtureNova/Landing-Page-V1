import { Metadata } from 'next';
import EventsPageClient from './EventsPageClient';

export const metadata: Metadata = {
    title: "Upcoming Events | NurtureNova Learning",
    description: "Stay updated with our latest workshops, webinars, and educational events. Join us for engaging sessions designed for students and parents.",
};

export default function AllEventsPage() {
    return <EventsPageClient />;
}
