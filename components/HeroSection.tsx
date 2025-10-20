"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { MdCalendarToday, MdArrowDownward } from "react-icons/md";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function HeroSection() {
  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="bg-container bg-black/35 pt-28"
    >
      <div className="mx-6 lg:mx-28 py-28 md:py-40">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <motion.div
            variants={itemVariants}
            className="text-white text-center lg:text-left space-y-4"
          >
            <h1 className="text-3xl md:text-[40px] font-montserrat font-bold">
              Personalised Online Tutoring in Tech and Academics for Ages 6–18
            </h1>
            <p className="font-urbanist text-base md:text-xl max-w-2xl mx-auto lg:mx-0">
              Helping students excel in Maths, English, Science, Coding, AI, and more — wherever they are.
            </p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row justify-center items-center lg:justify-start lg:items-center gap-3 pt-2"
            >
              <Link href="https://wa.me/2347079650962" target="_blank" className="w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: "#FFFFFF", color: "#FE2296" }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#FE2296] text-white border border-[#FE2296] text-base font-bold px-5 py-2 rounded-full transition duration-300"
                >
                  <MdCalendarToday className="text-lg" />
                  Book a Session
                </motion.button>
              </Link>

              <Link href="#courses" scroll className="w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: "#FFFFFF", color: "#FE2296" }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-transparent text-white border border-white text-base font-bold px-5 py-2 rounded-full transition duration-300"
                >
                  <MdArrowDownward className="text-lg" />
                  Explore Courses
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div variants={itemVariants} className="hidden md:block">
            <div className="relative overflow-hidden rounded-3xl p-4 shadow-xl h-[360px] md:h-[420px]">

              <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full" />
              <div className="absolute -right-10 -bottom-10 h-40 w-40 rounded-full" />

              <div className="relative h-full w-full">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="masked-graphic masked-graphic--globe h-[80%] w-[80%] bg-[#f13e9d] to-[#477EFA] opacity-100" />
                </div>

                <motion.div
                  initial={{ y: 0, opacity: 0 }}
                  animate={{ y: [0, -8, 0], opacity: 1 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-6 left-6 bg-white/90 text-[#012958] rounded-2xl shadow-md px-3 py-2 flex items-center gap-2"
                >
                  <Image src="/icons/physics.png" alt="STEM" width={24} height={24} />
                  <span className="text-sm font-montserrat font-semibold">1-on-1 Tutoring</span>
                </motion.div>

                <motion.div
                  initial={{ y: 0, opacity: 0 }}
                  animate={{ y: [0, 10, 0], opacity: 1 }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="absolute right-6 top-1/3 bg-white/90 text-[#012958] rounded-2xl shadow-md px-3 py-2 flex items-center gap-2"
                >
                  <Image src="/icons/coding.png" alt="Coding" width={24} height={24} />
                  <span className="text-sm font-montserrat font-semibold">Python & AI</span>
                </motion.div>

                <motion.div
                  initial={{ y: 0, opacity: 0 }}
                  animate={{ y: [0, -6, 0], opacity: 1 }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
                  className="absolute left-10 bottom-6 bg-white/90 text-[#012958] rounded-2xl shadow-md px-3 py-2 flex items-center gap-2"
                >
                  <Image src="/icons/preparation.png" alt="Exam Prep" width={24} height={24} />
                  <span className="text-sm font-montserrat font-semibold">11+ Prep</span>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
