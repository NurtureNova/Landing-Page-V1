"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
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

const textVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
    },
  },
};

const imageVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      delay: 0.2,
      type: "spring" as const,
      stiffness: 100,
    },
  },
};

const HeroSection2: React.FC = () => {
  return (
    <section className="bg-[#f7f7f7] py-16 md:py-24">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="mx-6 lg:mx-28"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content - Left Side */}
          <motion.div variants={textVariants} className="space-y-6">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-montserrat font-bold text-gray-900 leading-tight">
              Our Passionate{" "}
              <span className="text-[#FE2296]">Educators</span>
            </h2>

            <p className="text-base md:text-lg font-urbanist text-gray-700 leading-relaxed">
              Meet our exceptional team of dedicated tutors who bring expertise,
              passion, and personalized attention to every student. Our educators
              are carefully selected professionals committed to helping your child
              excel in their academic journey.
            </p>

            <p className="text-base md:text-lg font-urbanist text-gray-700 leading-relaxed">
              With backgrounds in tech, academics, and education, our tutors create
              engaging, interactive learning experiences tailored to each
              student&apos;s unique needs and learning style.
            </p>

            <motion.div className="flex gap-4 pt-4">
              <Link href="/our-tutors">
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    backgroundColor: "#FFFFFF",
                    color: "#FE2296",
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="bg-[#FE2296] text-white hover:bg-white hover:text-[#FE2296] border-2 border-[#FE2296] text-base font-bold px-6 py-3 rounded-full transition duration-300 font-urbanist"
                >
                  Meet Our Tutors
                </motion.button>
              </Link>

              <Link href="https://wa.me/2347079650962" target="_blank">
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    backgroundColor: "#FE2296",
                    color: "#FFFFFF",
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="flex items-center gap-2 bg-white text-[#FE2296] hover:bg-[#FE2296] hover:text-white border-2 border-[#FE2296] text-base font-bold px-6 py-3 rounded-full transition duration-300 font-urbanist"
                >
                  <MdCalendarToday className="text-lg" />
                  Book a Session
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Image - Right Side */}
          <motion.div
            variants={imageVariants}
            className="relative w-full h-[400px] md:h-[500px] lg:h-[600px]"
          >
            <Image
              src="https://res.cloudinary.com/ddxssowqb/image/upload/v1746605937/Our_Passionate_Educators_pfpq1m.png"
              alt="Our Passionate Educators"
              className="object-cover rounded-[30px] shadow-lg"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
              priority
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection2;
