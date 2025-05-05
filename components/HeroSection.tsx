"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { MdCalendarToday } from "react-icons/md";

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
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="bg-container bg-black/35 pt-28"
    >
      <div className="mx-6 lg:mx-28 py-40">
        <motion.div
          variants={itemVariants}
          className="text-[#FFFFFF] text-center md:py-10 space-y-3 items-center"
        >
          <motion.h1
            variants={itemVariants}
            className="text-2xl font-montserrat font-bold md:text-[40px]"
          >
            Personalised Online Tutoring in Tech and Academics for Ages 6–18
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="font-urbanist text-base md:text-xl"
          >
            Helping students excel in Maths, English, Science, Coding, AI, and
            more — wherever they are.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex justify-center mt-4"
          >
            <Link href="https://wa.me/2347079650962" target="_blank">
              <motion.button
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "#FFFFFF",
                  color: "#FF3366",
                }}
                transition={{ type: "spring", stiffness: 300 }}
                className="flex items-center gap-2 bg-[#FE2296] text-[#FFFFFF] hover:bg-white hover:text-[#FE2296] border border-[#FE2296] text-base font-bold px-5 py-2 rounded-full transition duration-300"
              >
                <MdCalendarToday className="text-lg font-urbanist" />
                Book a Session
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
