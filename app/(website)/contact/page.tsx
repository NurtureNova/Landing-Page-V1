import { Metadata } from 'next';
import ContactPageClient from './ContactPageClient';

export const metadata: Metadata = {
  title: "Contact Us | NurtureNova Learning",
  description: "Have questions? Get in touch with NurtureNova Learning. We're here to help you with any inquiries about our tutoring services, tech courses, or business plans.",
};

export default function ContactPage() {
    return <ContactPageClient />;
}
