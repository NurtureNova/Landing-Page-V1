import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Course Registration | NurtureNova",
    description: "Register your child for our expert-led courses in Math, English, Science, and Tech. Start their journey to academic excellence today.",
};

export default function RegistrationLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
