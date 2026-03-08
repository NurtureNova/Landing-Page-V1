import { Metadata } from 'next';
import OurTutorsPageClient from './OurTutorsPageClient';

export const metadata: Metadata = {
  title: "Our Expert Tutors | NurtureNova Learning",
  description: "Meet our dedicated and passionate educators from Nigeria. Our tutors are experts in Math, English, Science, and Coding, committed to your child's success.",
};

export default function OurTutorsPage() {
    return <OurTutorsPageClient />;
}
