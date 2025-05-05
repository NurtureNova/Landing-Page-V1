"use client";
import Image from "next/image";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.2,
    },
  },
};

const textVariants = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const imageVariants = {
  hidden: { opacity: 0, x: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const HowWeOperate = () => {
  return (
    <motion.section
      className="bg-[#F3F7FB] py-16 rounded-3xl shadow-lg px-8 md:px-20 flex flex-col md:flex-row items-center justify-between space-y-10 md:space-y-0"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
    >
      <motion.div className="md:w-1/2" variants={textVariants}>
        <motion.h2
          className="text-[#FE2296] font-semibold text-3xl font-montserrat mb-4"
          variants={textVariants}
        >
          How We Operate
        </motion.h2>
        <motion.p
          className="text-gray-800 text-base font-medium font-mont mb-4"
          variants={textVariants}
        >
          At NurtureNova Learning, we proudly operate as a fully online tutoring
          company, connecting tutors based in Nigeria with students across the
          globe.
        </motion.p>
        <motion.p
          className="text-gray-800 text-base font-medium font-mont mb-4"
          variants={textVariants}
        >
          Our services are delivered remotely, making education accessible,
          flexible, and personalised for every student, regardless of location.
        </motion.p>
        <motion.p
          className="text-gray-800 text-base font-medium font-mont mb-4"
          variants={textVariants}
        >
          We use trusted online platforms such as Zoom for live lessons and
          Google Classroom for assignments and progress tracking.
        </motion.p>
        <motion.p
          className="text-gray-800 text-base font-medium font-mont mb-4"
          variants={textVariants}
        >
          For many of today&apos;s students, the ability to access classes
          anytime, anywhere, is a major advantage — offering convenience,
          flexibility, and a modern approach to education.
        </motion.p>
        <motion.p
          className="text-gray-800 text-base font-medium font-mont"
          variants={textVariants}
        >
          At NurtureNova Learning, we make learning fit into your world, not the
          other way around.
        </motion.p>
      </motion.div>

      <motion.div
        className="md:w-1/2 flex justify-center"
        variants={imageVariants}
      >
        <Image
          src="https://pbs.twimg.com/media/Gp0WNrNXQAAGo-c?format=jpg&name=4096x4096"
          alt="Online teaching illustration"
          className="w-full max-w-md rounded-md"
          loading="lazy"
          width={550}
          height={400}
        />
      </motion.div>
    </motion.section>
  );
};

export default HowWeOperate;
