import type { Metadata } from "next";
import { Montserrat, Urbanist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["400", "500", "600", "700", "800"],
});

const urbanist = Urbanist({
  subsets: ["latin"],
  variable: "--font-urbanist",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "NurtureNova Learning | Personalized Online Tutoring",
  description:
    "Expert online tutoring for kids in Math, English, Science, Coding & Tech. Learn at your pace with experienced tutors from Nurture Nova Learning.",
  keywords: [
    "online tutoring",
    "math tutoring",
    "english tutoring",
    "science help",
    "coding classes",
    "scratch for kids",
    "python for kids",
    "11+ exam preparation",
    "personalized learning",
    "online learning platform",
    "Online tutoring for kids",
    "Online tutoring for students",
    "Personalised online tutoring",
    "Maths English Science online tutoring",
    "11+ exam preparation online",
    "Coding classes for kids online",
    "AI classes for students",
    "Tech courses for kids",
    "Private online tutoring",
    "Best online tutors for children",
    "UK online tutoring for students",
    "Nigeria online tutoring services",
    "Online academic and tech tutoring",
    "Affordable online tutoring",
    "One-on-one online tutoring",
    "Scratch programming for kids",
    "Web development courses for kids",
    "Python for kids",
    "AI and Machine Learning classes for teenagers",
    "Online GCSE preparation",
    "11 Plus Verbal Reasoning practice",
    "Home-based online tutoring",
    "Personalised tech education",
    "Online tutoring for UK students",
    "After-school online tutoring",
    "Global online tutoring for kids",
  ],
  authors: [
    { name: "NurtureNova Learning", url: "https://nurturenovalearning.com" },
  ],
  creator: "NurtureNova Learning",
  metadataBase: new URL("https://nurturenovalearning.com"),
  openGraph: {
    title: "NurtureNova Learning - Personalized Online Tutoring",
    description:
      "Join NurtureNova for tailored tutoring sessions in academics and tech. Engaging, effective, and built for young learners.",
    url: "https://nurturenovalearning.com",
    siteName: "NurtureNova Learning",
    images: [
      {
        url: "https://nurturenovalearning.com/nurture-nova.png",
        width: 1200,
        height: 630,
        alt: "NurtureNova Learning",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NurtureNova Learning - Personalized Online Tutoring",
    description:
      "Boost your child's learning in tech and academics with expert tutors.",
    images: ["https://nurturenovalearning.com/nurture-nova.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} ${urbanist.variable} antialiased bg-[#FFFFFF]`}
      >
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
