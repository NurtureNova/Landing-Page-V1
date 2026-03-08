"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface ServiceItem {
  id: number;
  title: string;
  link: string;
  icon: string;
  delay: number;
}

const ServicesData: ServiceItem[] = [
  {
    id: 1,
    title: "Mathematics",
    link: "#",
    icon: "/icons/mathematics.png",
    delay: 0.2,
  },
  {
    id: 2,
    title: "English",
    link: "#",
    icon: "/icons/english.png",
    delay: 0.3,
  },
  {
    id: 3,
    title: "Science",
    link: "#",
    icon: "/icons/sciences.png",
    delay: 0.4,
  },
  {
    id: 4,
    title: "Physics",
    link: "#",
    icon: "/icons/physics.png",
    delay: 0.5,
  },
  {
    id: 5,
    title: "Chemistry",
    link: "#",
    icon: "/icons/chemistry.png",
    delay: 0.6,
  },
  {
    id: 6,
    title: "11+ Preparation",
    link: "#",
    icon: "/icons/preparation.png",
    delay: 0.7,
  },
  {
    id: 7,
    title: "Coding (Python and Scratch)",
    link: "#",
    icon: "/icons/coding.png",
    delay: 0.8,
  },
  {
    id: 8,
    title: "Web Development",
    link: "#",
    icon: "/icons/web-development.png",
    delay: 0.9,
  },
  {
    id: 9,
    title: "Artificial Intelligence and Machine Learning",
    link: "#",
    icon: "/icons/ai-robotics.png",
    delay: 1.0,
  },
  {
    id: 10,
    title: "Product, Graphics Design",
    link: "#",
    icon: "/icons/product.png",
    delay: 1.1,
  },
];

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 100, damping: 12 },
  },
};

export default function CoursesSection() {
  return (
    <section id="courses" className="bg-[#477EFA] text-white py-10 px-6 md:px-28">
      <div className="text-center mb-8">
        <h3 className="text-[#111111] text-3xl font-montserrat font-semibold">
          Our Courses
        </h3>
        <p className="text-base md:text-lg text-[#FFFFFF] font-urbanist font-semibold mt-2">
          Our Tutors Provide Quality Teaching In The Following Subjects:
        </p>
      </div>

      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
      >
        {ServicesData.map((service) => (
          <motion.div
            key={service.id}
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            className="bg-[#f4f4f4] rounded-xl flex flex-col gap-2 items-center justify-center p-2 py-3 hover:bg-white hover:scale-105 duration-300 hover:shadow-lg w-full mx-auto"
          >
            <Image
              src={service.icon}
              alt={service.title}
              width={36}
              height={36}
              className="w-9 h-9 object-contain"
            />
            <h1 className="text-sm font-semibold font-montserrat text-center px-1 text-[#012958]">
              {service.title}
            </h1>
          </motion.div>
        ))}
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-16 text-center"
      >
        <p className="text-xl font-medium mb-6">Ready to give your child the best learning experience?</p>
        <Link 
          href="/registrations"
          className="inline-flex items-center justify-center px-10 py-4 bg-white text-blue-600 font-bold rounded-full shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 text-lg group"
        >
          Register Your Child Now
          <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </motion.div>
    </section>
  );
}

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
