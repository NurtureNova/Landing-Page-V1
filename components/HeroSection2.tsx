"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Text Content - Left Side */}
          <motion.div variants={textVariants} className="space-y-4">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-montserrat font-bold text-gray-900 leading-tight">
              A message from <span className="text-[#FE2296]">Our Founder</span>
            </h2>

            <p className="text-base md:text-lg font-urbanist text-gray-700 leading-relaxed">
              At NurtureNova Learning, we believe that every child has limitless
              potential. They simply need the right guidance, environment, and
              support to thrive.{" "}
            </p>

            <p className="text-base md:text-lg font-urbanist text-gray-700 leading-relaxed">
              When we started this journey, our mission was simple: to make
              quality learning accessible, personalised, and inspiring.
              Education isn’t just about passing exams; it’s about building
              confidence, nurturing curiosity, and equipping young minds with
              the skills to excel in life.
            </p>

            <p className="text-base md:text-lg font-urbanist text-gray-700 leading-relaxed">
              Every lesson we deliver is a step towards empowering students to
              dream bigger, achieve more, and believe in themselves. We’re not
              just teaching subjects; we’re shaping futures, one learner at a
              time.
            </p>

            <p className="text-base md:text-lg font-urbanist text-gray-700 leading-relaxed">
              Thank you for trusting us to be part of your child’s learning
              journey. Together, we can build a generation of confident
              thinkers, creators, and problem solvers.
            </p>

            <motion.div
              className="flex flex-col items-start gap-1 pt-6 font-urbanist text-[#FE2296]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-lg font-semibold">Rasheed Adeoti</p>
              <p className="text-base font-medium text-gray-700 italic">
                Founder, NurtureNova Learning
              </p>
            </motion.div>
          </motion.div>

          {/* Image - Right Side */}
          <motion.div
            variants={imageVariants}
            className="relative w-full h-[400px] md:h-[500px] lg:h-[600px]"
          >
            <Image
              src="images/founder.jpg"
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
